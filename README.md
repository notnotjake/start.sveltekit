# SvelteKit Skeleton Project

An opinionated starting point for SvelteKit projects

**Getting Going:**
- Duplicate `degit notnotjake/start.sveltekit` into directory
- Initialize project: `git init` then `gh repo create` then `npm install`
- Open `src/lib/_global/site.json` and populate data
- Start building and run `npm run dev` (or `npm run dev-host` to expose to the local network)

**Decisions:**
- Uses SCSS with global mixins and variables setup. Edit in lib/_global
- Uses +page.js `load` function for meta (SEO) tags: title, description, image (opengraph/sharing image)