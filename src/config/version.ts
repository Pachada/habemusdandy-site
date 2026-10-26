/**
 * Build identity, injected by deploy.yml at build time. Exposed as
 * `<meta name="app-version">` in every layout and as `/version.json`,
 * which the post-deploy smoke check reads. Local builds report `dev`.
 */
export const appVersion = import.meta.env.PUBLIC_APP_VERSION || 'dev'
export const appCommit = import.meta.env.PUBLIC_APP_COMMIT || 'unknown'
