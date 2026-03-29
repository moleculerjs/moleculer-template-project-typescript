# Moleculer template: `project-typescript`
:mortar_board: Moleculer-based microservices project template for TypeScript projects.

## Features
- Moleculer v0.15 with full-detailed `moleculer.config.ts` file.
- Common mono-repo project with a `greeter` demo service.
- Sample database `products` service (with file-based NeDB in development & MongoDB in production).
- Sample service with Moleculer Channels middleware.
- Sample service with Moleculer Workflows middleware.
- Optional API Gateway service with HTTP, GraphQL & Socket.IO support.
- Beautiful static welcome page to test generated services & watch nodes and services.
- Optional Transporter & Cacher.
- Metrics & Tracing.
- Docker & Docker Compose & Kubernetes files.
- Unit & integration tests with [Vitest](https://vitest.dev/).
- Lint with [ESLint](http://eslint.org/) & [Prettier](https://prettier.io/).
- Launch file for debugging in [VSCode](https://code.visualstudio.com/).


## Install
To install use the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool.

```bash
$ moleculer init project-typescript my-project
```

## Prompts
```
$ moleculer init project-typescript moleculer-demo

Template repo: moleculerjs/moleculer-template-project-typescript
? Add HTTP API Gateway (moleculer-web) service? Yes
? Add GraphQL Gateway? Yes
? Add Socket.Io Gateway? Yes
? Would you like to communicate with other nodes? Yes
? Select a transporter NATS (recommended)
? Would you like to use cache? No
? Add DB sample service? Yes
? Add Moleculer Channels middleware? Yes
? Select a Channels Redis
? Add Moleculer Workflows middleware? Yes
? Would you like to enable metrics? Yes
? Would you like to enable tracing? Yes
? Add Docker & Kubernetes sample files? Yes
? Use ESLint to lint your code? Yes
Create 'moleculer-demo' folder...
? Would you like to run 'npm install'? Yes
```

## NPM scripts
- `npm run dev`: Start development mode (load all services locally without transporter with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run build`: Compile TypeScript to JavaScript (output to `dist/`)
- `npm run typecheck`: Run TypeScript type checking without emitting
- `npm run cli`: Start a CLI and connect to production. _Don't forget to set production namespace with `--ns` argument in script_
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Auto-fix ESLint issues
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:logs`: Watch & follow the container logs
- `npm run dc:down`: Stop the stack with Docker Compose

## License
moleculer-template-project-typescript is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2016-2026 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![Discord](https://img.shields.io/badge/discord-moleculer-blue.svg)](https://discord.gg/TSEcDRP)
