# Moleculer template: `project`
:mortar_board: Moleculer-based microservices project template. [Live demo on now.sh](https://moleculer-demo-project.now.sh/)

## Features
- Moleculer v0.14 with full-detailed `moleculer.config.ts` file.
- Common mono-repo project with a demo `greeter` service.
- Sample database `products` service (with file-based NeDB in development & MongoDB in production).
- Optional API Gateway service with detailed service settings.
- Beautiful static welcome page to test generated services & watch nodes and services.
- Optional Transporter & Cacher.
- Metrics & Tracing.
- Docker & Docker Compose & Kubernetes files.
- Unit tests with [Jest](http://facebook.github.io/jest/).
- Lint with [ESLint](http://eslint.org/).
- Launch file for debugging in [VSCode](https://code.visualstudio.com/).


## Install
To install use the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool.

```bash
$ moleculer init project my-project
```

## Prompts
```
$ moleculer init project-typescript moleculer-demo

Template repo: moleculerjs/moleculer-template-project-typescript
? Add API Gateway (moleculer-web) service? Yes
? Would you like to communicate with other nodes? Yes
? Select a transporter NATS (recommended)
? Would you like to use cache? No
? Add DB sample service? Yes
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
- `npm run cli`: Start a CLI and connect to production. _Don't forget to set production namespace with `--ns` argument in script_
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:logs`: Watch & follow the container logs
- `npm run dc:down`: Stop the stack with Docker Compose

## License
moleculer-template-project-typescript is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2020 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
