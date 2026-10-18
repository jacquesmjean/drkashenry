# drkashenry.com

Personal brand site for Dr. Kasthuri Henry, PhD, CTP, CSSBB. Built and maintained by TechFides.

Static single-page site served by Vercel, no build step. The contact form posts to `api/contact.js`, a Vercel serverless function that emails Kas@drkashenry.com through Resend.

## Deploy
1. Import this repo in Vercel (Framework preset: Other).
2. Add env var `RESEND_API_KEY`. Optionally `FROM_EMAIL` once drkashenry.com is verified in Resend.
3. Add the domain `drkashenry.com` (and `www`) under Project Settings → Domains and point DNS as Vercel shows.

## Edit
Everything lives in `index.html`. The brand palette and type tokens are at the top of its `<style>` block.
