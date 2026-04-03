# mfecane.github.io

Portfolio site (Next.js, TypeScript, Tailwind). **Live:** [mfecane.github.io](https://mfecane.github.io)

## Docker

`docker compose up` — dev server at [localhost:3000](http://127.0.0.1:3000). See [`docker-compose.yml`](docker-compose.yml).

## Husky

[`.husky/pre-push`](.husky/pre-push) runs `npm run typecheck` before `git push`.

## GitHub Actions

Push to `master` → [deploy workflow](.github/workflows/deploy.yml) runs lint, typecheck, build, deploys `out/` to GitHub Pages.

## License

MIT — [LICENSE](LICENSE).
