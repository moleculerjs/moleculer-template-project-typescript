# Moleculer template: `project`
:mortar_board: Moleculer based microservices project template

## Features
- Moleculer v0.12.x with `moleculer.config.js`
- Common project with a demo `greeter` service
- Optional API Gateway service
- Optional Transporter & Cacher
- Docker & Docker Compose files
- Unit tests with [Jest](http://facebook.github.io/jest/)
- Lint with [ESLint](http://eslint.org/)
- Launch file for debugging in [VSCode](https://code.visualstudio.com/)


## Install
To install use the [moleculer-cli](https://github.com/moleculerjs/moleculer-cli) tool.

```bash
$ moleculer init project my-project
```

## Prompts
```
$ moleculer init project moleculer-demo

Template repo: moleculerjs/moleculer-template-project
? Add API Gateway (moleculer-web) service Yes
? Would you like to communicate with other nodes? Yes
? Select a transporter TCP
? Would you like to use cache? No
? Add Docker files? Yes
? Use ESLint to lint your code? Yes
? Setup unit tests with Jest? Yes
Create 'moleculer-demo' folder...
? Would you like to run 'npm install'? Yes
```

## NPM scripts
- `npm run dev` - Start service.js with hot-reload and start REPL
- `npm run lint` - Run ESLint
- `npm run ci` - Start testing in watch mode
- `npm start` - Start services in production mode
- `npm test` - Run tests & coverage

## License
Moleculer-template-project is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact
Copyright (c) 2018 MoleculerJS

[![@moleculerjs](https://img.shields.io/badge/github-moleculerjs-green.svg)](https://github.com/moleculerjs) [![@MoleculerJS](https://img.shields.io/badge/twitter-MoleculerJS-blue.svg)](https://twitter.com/MoleculerJS)
