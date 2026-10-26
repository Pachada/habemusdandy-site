#!/usr/bin/env bash
# Exercises compute-version.sh against a throwaway repo with mocked tags.
# Run: bash scripts/release/compute-version.test.sh
set -euo pipefail

script="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/compute-version.sh"
repo="$(mktemp -d)"
trap 'rm -rf "$repo"' EXIT
cd "$repo"
git init -q -b main
git config user.name test
git config user.email test@example.com
git config tag.gpgSign false

commit() {
  git commit -q --allow-empty -m "$1"
  git rev-parse HEAD
}

failures=0

# expect_ok NAME BRANCH SHA BUMP VERSION EXPECTED_OUTPUT_LINES...
expect_ok() {
  local name="$1" branch="$2" sha="$3" bump="$4" version="$5"
  shift 5
  local out
  if ! out="$(BRANCH="$branch" COMMIT_SHA="$sha" BUMP="$bump" INPUT_VERSION="$version" GITHUB_OUTPUT=/dev/stdout bash "$script" 2>/dev/null)"; then
    echo "FAIL $name: exited non-zero"
    failures=$((failures + 1))
    return
  fi
  local want
  for want in "$@"; do
    if ! grep -qx "$want" <<<"$out"; then
      echo "FAIL $name: missing '$want' in:"
      awk '{ print "    " $0 }' <<<"$out"
      failures=$((failures + 1))
      return
    fi
  done
  echo "ok   $name"
}

# expect_fail NAME BRANCH SHA BUMP VERSION ERROR_SUBSTRING
expect_fail() {
  local name="$1" branch="$2" sha="$3" bump="$4" version="$5" want="$6" err
  if err="$(BRANCH="$branch" COMMIT_SHA="$sha" BUMP="$bump" INPUT_VERSION="$version" GITHUB_OUTPUT=/dev/null bash "$script" 2>&1)"; then
    echo "FAIL $name: expected failure"
    failures=$((failures + 1))
    return
  fi
  if ! grep -qF "$want" <<<"$err"; then
    echo "FAIL $name: expected '$want', got: $err"
    failures=$((failures + 1))
    return
  fi
  echo "ok   $name"
}

c1="$(commit one)"

# First release, no tags yet.
expect_fail "first release needs an explicit version" main "$c1" patch "" "No previous v* tag"
expect_ok "first release v1.0.0" main "$c1" patch v1.0.0 \
  version=v1.0.0 previous= latest=true tag_exists=false
expect_fail "rejects a malformed version" main "$c1" patch 1.0.0 "version must look like vX.Y.Z"
expect_fail "rejects other branches" feature/x "$c1" patch v1.0.0 "Release must run on main or release/vX.Y"

git tag -a v1.0.0 -m v1.0.0 "$c1"

# Already-released HEAD, and resuming it with an explicit version.
expect_fail "bump on an already-released HEAD" main "$c1" patch "" "HEAD is already released as v1.0.0"
expect_ok "explicit-version resume" main "$c1" patch v1.0.0 \
  version=v1.0.0 previous= latest=true tag_exists=true
expect_fail "explicit new version on an already-released HEAD" main "$c1" patch v1.0.1 "HEAD is already released as v1.0.0"

c2="$(commit two)"
expect_ok "patch bump" main "$c2" patch "" version=v1.0.1 previous=v1.0.0 latest=true tag_exists=false
expect_ok "minor bump" main "$c2" minor "" version=v1.1.0 previous=v1.0.0 latest=true
expect_ok "major bump" main "$c2" major "" version=v2.0.0 previous=v1.0.0 latest=true
expect_fail "tag on another commit" main "$c2" patch v1.0.0 "Tag v1.0.0 already exists on $c1, not $c2"

git tag -a v1.1.0 -m v1.1.0 "$c2"
c3="$(commit three)"
git tag -a v1.2.0 -m v1.2.0 "$c3"
c4="$(commit four)"
expect_ok "patch after v1.2.0 (sort -V, not lexical)" main "$c4" patch "" version=v1.2.1 previous=v1.2.0
git tag -a v1.10.0 -m v1.10.0 "$c4"
c5="$(commit five)"
expect_ok "minor after v1.10.0" main "$c5" minor "" version=v1.11.0 previous=v1.10.0 latest=true

# Release line release/v1.1, cut from v1.1.0 while main is on v1.10.0.
git switch -q -c release/v1.1 v1.1.0
expect_fail "fresh release line HEAD is already released" release/v1.1 "$c2" patch "" "HEAD is already released as v1.1.0"
h1="$(commit hotfix)"
expect_ok "release line patch" release/v1.1 "$h1" patch "" \
  version=v1.1.1 previous=v1.1.0 latest=false tag_exists=false
expect_fail "release line rejects minor" release/v1.1 "$h1" minor "" "only ships patch releases"
expect_fail "release line rejects a version outside the line" release/v1.1 "$h1" patch v1.2.5 "outside the release/v1.1 release line"
expect_fail "release line name must be vX.Y" release/v1 "$h1" patch "" "release branches must be named release/vX.Y"
git tag -a v1.1.1 -m v1.1.1 "$h1"
h2="$(commit hotfix2)"
expect_ok "second release line patch" release/v1.1 "$h2" patch "" version=v1.1.2 previous=v1.1.1 latest=false

# A release line whose patch becomes the highest version is latest.
git switch -q -c release/v1.11 "$c5"
expect_fail "release line with no tags on it" release/v1.11 "$c5" patch "" "No previous v* tag for release/v1.11"

# Non-semver tags are ignored.
git switch -q main
git tag not-a-version "$c5"
git tag v2-beta "$c5"
expect_ok "ignores non-semver tags" main "$c5" patch "" version=v1.10.1 previous=v1.10.0

if [ "$failures" -gt 0 ]; then
  echo "$failures case(s) failed"
  exit 1
fi
echo "all cases passed"
