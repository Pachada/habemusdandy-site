#!/usr/bin/env bash
# Computes the next release version for release.yml from the repo's v* tags.
#
# Inputs (env): BRANCH (main or release/vX.Y), BUMP (patch|minor|major),
# INPUT_VERSION (optional vX.Y.Z; overrides BUMP), COMMIT_SHA (the commit to tag).
# Outputs (appended to $GITHUB_OUTPUT, or printed when it is unset):
#   version, previous (notes start tag, may be empty), latest (true|false),
#   tag_exists (true when resuming with an explicit version already on COMMIT_SHA).
# Run from inside a clone with all tags fetched. Tested by compute-version.test.sh.
set -euo pipefail

: "${BRANCH:?}" "${COMMIT_SHA:?}"
BUMP="${BUMP:-patch}"
INPUT_VERSION="${INPUT_VERSION:-}"
OUTPUT="${GITHUB_OUTPUT:-/dev/stdout}"

fail() {
  echo "::error::$*" >&2
  exit 1
}

semver='^v([0-9]+)\.([0-9]+)\.([0-9]+)$'
line_pattern="$semver"
case "$BRANCH" in
  main) ;;
  release/*)
    [[ "$BRANCH" =~ ^release/(v[0-9]+\.[0-9]+)$ ]] ||
      fail "release branches must be named release/vX.Y (got $BRANCH)"
    line="${BASH_REMATCH[1]}"
    line_pattern="^${line//./\\.}\.[0-9]+$"
    ;;
  *) fail "Release must run on main or release/vX.Y (got $BRANCH)" ;;
esac

all_tags="$(git tag --list 'v*' | grep -E "$semver" | sort -V || true)"
line_tags="$(grep -E "$line_pattern" <<<"$all_tags" || true)"
newest="$(tail -n1 <<<"$line_tags")"

released="$(git tag --points-at "$COMMIT_SHA" --list 'v*' | grep -E "$line_pattern" | sort -V | tail -n1 || true)"

if [ -n "$INPUT_VERSION" ]; then
  version="$INPUT_VERSION"
  [[ "$version" =~ $semver ]] || fail "version must look like vX.Y.Z (got $version)"
  [[ "$version" =~ $line_pattern ]] || fail "$version is outside the $BRANCH release line"
  # One commit, one version: an explicit version may only resume the tag already on HEAD.
  if [ -n "$released" ] && [ "$released" != "$version" ]; then
    fail "HEAD is already released as $released; push a new commit, or pass version=$released to resume"
  fi
else
  # Never resume implicitly: a release/vX.Y branch freshly cut from its tag has
  # that tag on HEAD, and redeploying it would roll prod back.
  if [ -n "$released" ]; then
    fail "HEAD is already released as $released; push a new commit, or pass version=$released to resume"
  fi
  [ -n "$newest" ] || fail "No previous v* tag for $BRANCH; pass an explicit version (e.g. v1.0.0)"
  if [ "$line_pattern" != "$semver" ] && [ "$BUMP" != "patch" ]; then
    fail "$BRANCH only ships patch releases; run minor/major from main"
  fi
  [[ "$newest" =~ $semver ]]
  major="${BASH_REMATCH[1]}" minor="${BASH_REMATCH[2]}" patch="${BASH_REMATCH[3]}"
  case "$BUMP" in
    major) version="v$((major + 1)).0.0" ;;
    minor) version="v${major}.$((minor + 1)).0" ;;
    patch) version="v${major}.${minor}.$((patch + 1))" ;;
    *) fail "bump must be patch, minor or major (got $BUMP)" ;;
  esac
fi

# An existing tag is fine only on this exact commit, and only with an explicit
# version (resuming a run that failed after pushing the tag).
tag_exists=false
if git rev-parse -q --verify "refs/tags/$version" >/dev/null; then
  tagged="$(git rev-parse "$version^{commit}")"
  [ "$tagged" = "$COMMIT_SHA" ] || fail "Tag $version already exists on $tagged, not $COMMIT_SHA"
  tag_exists=true
fi

# Notes start at the release before this one on the same line.
previous="$(printf '%s\n%s\n' "$line_tags" "$version" | grep -E "$semver" | sort -Vu | grep -B1 -x "$version" | head -n1)"
if [ "$previous" = "$version" ]; then
  previous=""
fi
highest="$(printf '%s\n%s\n' "$all_tags" "$version" | grep -E "$semver" | sort -V | tail -n1)"
latest=false
if [ "$highest" = "$version" ]; then
  latest=true
fi

{
  echo "version=$version"
  echo "previous=$previous"
  echo "latest=$latest"
  echo "tag_exists=$tag_exists"
} >>"$OUTPUT"
echo "Releasing $version (previous: ${previous:-none}, latest: $latest, tag already exists: $tag_exists)" >&2
