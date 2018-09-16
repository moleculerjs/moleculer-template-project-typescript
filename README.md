# Moleculer template: `project-ts`

:mortar_board: Moleculer based microservices project template for Typescript project.

## Features

- Moleculer v0.13.x with `moleculer.config.js`
- Common project with a demo `greeter` service
- Optional API Gateway service
- Optional Transporter & Cacher
- Docker & Docker Compose files
- Unit tests with [Jest](http://facebook.github.io/jest/)
- Lint with [TSLint](https://palantir.github.io/tslint/)
- Launch file for debugging in [VSCode](https://code.visualstudio.com/)

## Install

To install use the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool.

```bash
$ moleculer init faeron/moleculer-template-project-typescript my-project
```

## Prompts

```
$ moleculer init faeron/moleculer-template-project-typescript moleculer-demo

Template repo: moleculerjs/moleculer-template-project-ts
? Add API Gateway (moleculer-web) service Yes
? Would you like to communicate with other nodes? Yes
? Select a transporter TCP
? Would you like to use cache? No
? Add Docker files? Yes
? Use TSLint to lint your code? Yes
? Setup unit tests with Jest? Yes
Create 'moleculer-demo' folder...
? Would you like to run 'npm install'? Yes
```

## NPM scripts

- `npm run build`- Uses typescript to transpile service to javascript
- `npm run dev` - Start service.js with hot-reload and start REPL
- `npm run lint` - Run TSLint
- `npm run ci` - Start testing in watch mode
- `npm start` - Start services in production mode (previous build needed)
- `npm test` - Run tests & coverage

## License

Moleculer-template-project-ts is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact

Copyright (c) 2018 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
