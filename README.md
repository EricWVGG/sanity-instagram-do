# Notes to self

First, yes, we’re stuck with npm.

I’m not sure if `.env` has be in both root and `packages/[project-name]/[action]/`

## To run locally…

- `npm run build` from `post` folder
- `node -e 'import("./lib/index.js").then( loadedModule => loadedModule.main() )'`

## To deploy…

- `doctl sls deploy . --verbose-build --env ./.env` from root

Deployments are slow.

It doesn’t build on remote-builds for unknown reasons.

## NOTE

This is using my personal Digital Ocean API key. Unsure how to set up a different key.
# sanity-instagram-do
