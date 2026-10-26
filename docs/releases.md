# Releases

The marketing site uses the same release model as the API and the UI.

- Versions are semver tags, `vX.Y.Z`. The first production release is `v1.0.0`.
- `main` is the trunk. A push to `main` or `release/vX.Y` runs CI and deploys that commit to **staging**.
- **Production** deploys only from a `vX.Y.Z` tag. No branch push deploys production.
- Every page carries `<meta name="app-version" content="vX.Y.Z">`, and `/version.json` returns `{"version","commit"}`. Staging builds report `sha-<short sha>`. Local builds report `dev`.

## Where builds live

Each stack has one private S3 bucket. CloudFront serves only the `live/` prefix.

| Prefix | What | Changes |
| --- | --- | --- |
| `live/` | What the site serves | Replaced by every deploy |
| `releases/vX.Y.Z/` | The production build of that tag | Written once. The deploy role cannot delete it, and current objects never expire |

A production deploy builds the tagged commit once into `releases/vX.Y.Z/` (`version.json` is uploaded last and marks it complete), then copies that prefix to `live/` and invalidates CloudFront. Hashed `_astro/` files are never deleted from `live/`, so a page that is already open keeps its assets.

After every deploy, a smoke check confirms that `/version.json` and the home page `<meta>` show the new version, and that `/privacidad` and `/terminos` return 200. Stripe and Google OAuth verification point at those two pages.

## Cut a release

The Release workflow tags the HEAD of the branch it runs on, publishes a GitHub Release with generated notes, and dispatches the production deploy.

```bash
gh workflow run release.yml --ref main -f version=v1.0.0   # first release
gh workflow run release.yml --ref main -f bump=minor       # later: patch | minor | major
```

It refuses to run when:

- the branch is not `main` or `release/vX.Y`
- the CI push run for HEAD on that branch is missing or did not succeed (that run includes the staging deploy)
- HEAD is already tagged on that line, unless you pass that same `version` to resume
- the tag already exists on another commit
- a `release/vX.Y` run asks for anything but a patch

**Resume a release.** If a run fails after it pushed the tag, run it again with `-f version=vX.Y.Z`. The tag is reused, a missing GitHub Release is created, and the deploy is dispatched again.

`release.yml` and `deploy.yml` can only be dispatched once they are on the default branch (`main`).

## Roll back

Dispatch the deploy on an older tag:

```bash
gh workflow run deploy.yml --ref v1.2.3 -f environment=production
```

The deploy finds the complete `releases/v1.2.3/` and copies it to `live/` without rebuilding. That needs only the bucket, the tag and AWS. It does not depend on CI runs, npm or workflow artifacts, which can expire.

## Hotfix

- **`main` has nothing else since the last release:** merge the fix to `main`, wait for CI and staging, then run Release with `bump=patch` on `main`.
- **`main` already has unreleased changes:**
  1. Cut a line from the tag: `git switch -c release/v1.4 v1.4.2 && git push -u origin release/v1.4`.
  2. Cherry-pick the fix onto `release/v1.4` and push. CI runs and deploys it to staging.
  3. Run `gh workflow run release.yml --ref release/v1.4` (patch only). That ships `v1.4.3`.
  4. Land the same fix on `main` too.

## Release notes

`.github/release.yml` groups the generated notes by PR label:

| Section | Labels |
| --- | --- |
| Breaking changes | `breaking` |
| Features | `feature`, `enhancement` |
| Fixes | `fix`, `bug` |
| Infrastructure | `infra` |
| Other | anything else |

PRs labelled `chore` or `skip-changelog` are left out.

## Infrastructure

The stacks are deployed by hand (see `infra/README.md`) or with `deploy-infra.yml`: staging from `main`, production from a `vX.Y.Z` tag.
