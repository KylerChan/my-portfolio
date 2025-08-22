# Kyler Chan — Portfolio

Lightweight static portfolio built with HTML, Tailwind CSS and vanilla JavaScript. Contains featured projects, skills and a contact form (Formspree backend) with an email copy fallback.

## Features
- Clean, responsive layout with Tailwind utilities
- Contact form posting to Formspree
- Copy-to-clipboard email button with graceful fallback
- Project cards linking to live demos and source
- Minimal JS for form validation and UX

## Quick start (local)
1. Clone or copy the repo to your machine.
2. Open `index.html` in a browser for a quick preview.
3. For development using Tailwind CDN no build step is required.

## Recommended production setup
- Use a static host (Vercel, Netlify, GitHub Pages).
- Prefer a built Tailwind workflow for smaller CSS:
  - Install Tailwind and run a production build (PostCSS).
  - Ensure `tailwind.config.js` content paths include your HTML.

## Vercel / Deployment notes
- Avoid absolute paths like `/my-portfolio/...` for static assets. Use relative paths:
  - Use `./assets/kc_image_pfp.png` or move assets into the platform's public root and reference `/kc_image_pfp.png`.
- Check DevTools Network tab for 404s (missing CSS/JS/images) — broken asset paths are usually why the UI looks wrong.
- If using a framework (Next.js), place static files in the `public/` folder and reference them from root.

Example fixes:
- Replace `<img src="/my-portfolio/assets/kc_image_pfp.png">` with `<img src="./assets/kc_image_pfp.png">`
- Replace `<link rel="stylesheet" href="/my-portfolio/style.css">` with `<link rel="stylesheet" href="./style.css">`

## Form (contact)
- Form posts JSON to Formspree endpoint. Update `FORMSPREE_ENDPOINT` in the JS if you change the Formspree form ID.
- Fallback: mailto link is included if submission fails.

## Troubleshooting
- UI broken after deploy → open DevTools Network tab and fix the first 404 asset.
- Contact form not sending → check Formspree endpoint and browser console for network errors.
- Copy button not working on older browsers → uses clipboard API with textarea fallback.

## Contact
Email: kyler.chanpinhan@gmail.com

## License
