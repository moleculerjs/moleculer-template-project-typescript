# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Moleculer CLI template for TypeScript projects that generates microservices-based applications. The main template files are located in the `template/` directory, which contains the actual project structure that gets generated when users run `moleculer init project-typescript my-project`.

Key directories:
- `template/` - Contains the actual template files that get generated for new projects
- `template/services/` - Moleculer services (API Gateway, business services)
- `template/mixins/` - Reusable service mixins (database mixin)
- `template/test/` - Test files organized by integration/unit tests
- `test/ci/` - CI test configurations and answer files for automated testing

## Common Commands

**Development of template:**
- `npm run dev` - Initialize template into `tmp/` directory for local testing
- `npm run dev:demo` - Initialize with demo answers for quick testing
- `npm test` - Run CI test with automated answers
- `cd tmp && node node_modules/moleculer/bin/moleculer-runner services` - Start generated services

**Generated project commands (in template/package.json):**
- `npm run dev` - Start development mode with hot-reload and REPL
- `npm run start` - Start production mode 
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run tests with coverage using Vitest
- `npm run ci` - Run tests in watch mode
- `npm run lint` - Run ESLint (when enabled)
- `npm run lint:fix` - Auto-fix ESLint issues

## Template Architecture

The template uses Handlebars templating (`{{#condition}}`, `{{variable}}`) to conditionally generate code based on user selections during `moleculer init`:

**Key template variables:**
- `{{projectName}}` - User's project name
- `{{#apiGW}}` - Include API Gateway service
- `{{#dbService}}` - Include database services and mixins
- `{{#lint}}` - Include ESLint configuration
- `{{transporter}}` - Selected message transporter (NATS, Redis, etc.)
- `{{#needChannels}}` - Include Moleculer Channels middleware
- `{{#needWorkflows}}` - Include Moleculer Workflows middleware

**Core services generated:**
- `api.service.ts` - API Gateway with HTTP/GraphQL/Socket.IO support
- `greeter.service.ts` - Sample service with basic actions
- `products.service.ts` - Database service example
- `inventory.service.ts` - Channels middleware example
- `orders.service.ts` - Workflows middleware example

## Database Configuration

The `db.mixin.ts` provides database abstraction:
- **Development:** Uses NeDB file storage (`./data/${collection}.db`)
- **Testing:** Uses in-memory NeDB 
- **Production:** Uses MongoDB when `DB_URI` environment variable starts with `mongodb://`

## Testing Framework

- Uses **Vitest** instead of Jest for modern testing
- Test structure: `test/unit/` and `test/integration/`
- Coverage configuration in `vitest.config.ts`
- Supports both unit tests for individual services and integration tests for API endpoints

## TypeScript Configuration

- **Target:** ESNext with NodeNext module resolution
- **Build output:** `dist/` directory with CommonJS modules for production
- **Type checking:** Strict mode enabled
- **Development:** Uses `tsx` for running TypeScript directly

## Development Notes

When modifying templates:
1. Test changes using `npm run dev` to generate in `tmp/`
2. Verify CI tests still pass with `npm test`  
3. Template uses Handlebars syntax - be careful with conditional blocks
4. The `meta.js` file contains template metadata and prompts configuration
5. Answer files in `test/ci/` define automated test scenarios