# Portfolio — Yaser Zarifi

Bilingual (English / فارسی) portfolio at the intersection of software and
urban planning. Next.js 15 · Tailwind v4 · Motion · next-intl. No database:
all content lives in this repo.

## Editing content (no code required)

| What | Where |
|---|---|
| Name, bio, tagline, email, CV links | `content/profile/en.json` + `fa.json` |
| Certificates | `content/certificates.json` (`{en, fa}` titles) |
| Work history | `content/experience.json` |
| Education | `content/education.json` |
| Skills | `content/skills.json` |
| Projects | `content/projects/<slug>/` — `meta.json` + `en.mdx` + `fa.mdx` |
| UI strings | `messages/en.json` + `fa.json` |

**Add a project:** copy an existing folder under `content/projects/`, rename
it (the folder name is the URL slug), edit the three files, push. Vercel
rebuilds automatically. Images/certificates are referenced by external URL;
`width`/`height` are required on covers (prevents layout shift). Add new
image hosts to `images.remotePatterns` in `next.config.ts`.

Every push is validated: `npm run validate` (also runs before every build)
fails loudly if any file is malformed or missing a locale.

MDX case studies can use `<Figure>`, `<Grid>`, `<Callout>`, `<Video>` —
see `src/components/mdx/mdx-content.tsx`.

## Contact form

Uses [Resend](https://resend.com) via `/api/contact` on the same Vercel
deployment (no separate backend to die). Set in `.env` / Vercel env:

```
RESEND_API_KEY=re_…
CONTACT_TO_EMAIL=you@example.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Until the key is set, the endpoint returns 503 and the form shows its error
state. **Fallback:** to switch to Web3Forms instead, change the `fetch` URL
in `src/components/sections/contact-section.tsx` to
`https://api.web3forms.com/submit` with their access key.

## Commands

```
npm run dev        # local dev
npm run validate   # check all content in both locales
npm run build      # validate + production build
```

## Conventions that keep RTL correct

- Tailwind **logical properties only** (`ms-/me-/ps-/pe-/start-/end-`) —
  never `ml-/mr-/pl-/pr-/left-/right-`.
- Any Framer Motion x-offset goes through `useDirectionalX()`
  (`src/components/motion/use-directional-x.ts`).
- Use `m.*` components (LazyMotion strict), not `motion.*`.
- Dates/numbers through `src/lib/format.ts` (Persian digits + Jalali
  calendar come free).
