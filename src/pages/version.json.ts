import type { APIRoute } from 'astro'
import { appCommit, appVersion } from '../config/version'

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ version: appVersion, commit: appCommit }), {
    headers: { 'Content-Type': 'application/json' },
  })
