[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# {{projectName}}
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.15/moleculer-cli.html).

## Template architecture
Moleculer supports different [deployment modes](https://moleculer.services/docs/0.15/clustering.html). The figures below represent the deployment and production architectures.
Switching between the architectures is [automatically](https://moleculer.services/docs/0.15/clustering.html) handled by moleculer. To run in dev mode use `npm run dev`, for production mode run `npm run dc:up`.

### Development architecture view

```mermaid
flowchart LR
    classDef svc fill:lightblue
    classDef brk fill:#fff2cc
    classDef ext fill:violet

    {{#apiGW}}
    U(User browser)
    U --> A
    
    subgraph node1 [Monolith Node]
    style node1 fill:#dae8fc,stroke:#c9d7eb
    A("**API Gateway**
    -HTTP Server
    {{#apiGQL}}-GraphQL Server{{/apiGQL}}
    {{#apiIO}}-Socket.IO Server{{/apiIO}}
    ")
    A --> B
    {{/apiGW}}

    B((Service Broker))

    G(Greeter Service):::svc
    B <--> G
    
    {{#dbService}}
    P(Products Service):::svc
    DA(Database Adapter)
    B <--> P
    P <--> DA
    DB[(MongoDB server)]:::ext
    DA <--> DB
    {{/dbService}}
    
    {{#needChannels}}
    I(Inventory Service):::svc
    CH(Channel Adapter)
    B <--> I
    I <--> CH
    CH <--> {{channels}}:::ext
    {{/needChannels}}
    
    {{#needWorkflows}}
    O(Orders Service):::svc
    WF(Workflow Adapter)
    B <--> O
    O <--> WF
    WF <--> Redis:::ext
    {{/needWorkflows}}
    
    end

    style B fill:orange
    style A fill:lightgreen
    style U fill:lightcyan
    style node1 fill:#dae8fc,stroke:#c9d7eb
```

### Production architecture view

```mermaid
flowchart LR
    classDef svc fill:lightblue
    classDef brk fill:#fff2cc
    classDef ext fill:violet

    TX{ {{transporter}} Transporter}:::ext

{{#apiGW}}
    subgraph node1 [Node 1]
    style node1 fill:#dae8fc,stroke:#c9d7eb
    A("**API Gateway**
    -HTTP Server
    {{#apiGQL}}-GraphQL Server{{/apiGQL}}
    {{#apiIO}}-Socket.IO Server{{/apiIO}}
    ")
    style A fill:lightgreen
    B1((Service Broker)):::brk
    A --> B1
    end
    B1 --> TX
    U(User browser)
    style U fill:lightcyan
    U --> A
{{/apiGW}}

    subgraph node2 [Node 2]
    style node2 fill:#dae8fc,stroke:#c9d7eb
    B2((Service Broker)):::brk
    G(Greeter Service):::svc
    B2 <--> G
    end
    TX --> B2

{{#dbService}}
    subgraph node3 [Node 3]
    style node3 fill:#dae8fc,stroke:#c9d7eb
    B3((Service Broker)):::brk
    P(Products Service):::svc
    DA(Database Adapter)
    B3 <--> P
    P <--> DA
    end
    TX --> B3
    DB[(MongoDB server)]:::ext
    DA <--> DB
{{/dbService}}

{{#needChannels}}
    subgraph node4 [Node 4]
    style node4 fill:#dae8fc,stroke:#c9d7eb
    B4((Service Broker)):::brk
    I(Inventory Service):::svc
    CH(Channel Adapter)
    B4 <--> I
    I <--> CH
    end
    TX --> B4
    CH <--> {{channels}}:::ext
{{/needChannels}}

{{#needWorkflows}}
    subgraph node5 [Node 5]
    style node5 fill:#dae8fc,stroke:#c9d7eb
    B5((Service Broker)):::brk
    O(Orders Service):::svc
    WF(Workflow Adapter)
    B5 <--> O
    O <--> WF
    end
    TX --> B5
    WF <--> Redis:::ext
{{/needWorkflows}}
```

## Usage
Start the project with `npm run dev` command. 
{{#apiGW}}
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

{{#apiGQL}}Open the http://localhost:3000/graphql URL in your browser to access the GraphQL Playground.{{/apiGQL}}

{{/apiGW}}
In the terminal, try using [Moleculer REPL](https://moleculer.services/docs/0.15/moleculer-repl.html) by running the following commands:
- `nodes` - List all connected nodes.
- `services` - List all the available services.
- `actions` - List all registered service actions.
- `info` - List node info (e.g., IP, memory usage).
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
{{#dbService}}- `call products.list` - List the products (call the `products.list` action).{{/dbService}}


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
{{#dbService}}- **products**: Sample DB service. To use with MongoDB, set `DB_URI` environment variables and install MongoDB adapter with `npm install mongodb`.
{{#needChannels}}- **inventory**: Sample service with a single [`channel` handler](https://github.com/moleculerjs/moleculer-channels) that uses persistent queues to reliably process the messages.{{/needChannels}}
{{#needWorkflows}}- **workflows**: Workflow sample service.{{/needWorkflows}}

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer/database](https://github.com/moleculerjs/database)
{{/dbService}}


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.15/
{{#dbService}}* Moleculer Database service: https://github.com/moleculerjs/database{{/dbService}}
{{#apiGW}}* Moleculer API Gateway: https://moleculer.services/docs/0.15/moleculer-web.html{{/apiGW}}
{{#apiGQL}}* Moleculer GraphQL Gateway: https://github.com/moleculerjs/moleculer-apollo-server{{/apiGQL}}
{{#apiIO}}* Moleculer Socket.IO Gateway: https://github.com/moleculerjs/moleculer-io{{/apiIO}}
{{#needChannels}}* Moleculer Channels: https://github.com/moleculerjs/moleculer-channels{{/needChannels}}
{{#needWorkflows}}* Moleculer Workflows: https://github.com/moleculerjs/workflows{{/needWorkflows}}

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script{{#lint}}
- `npm run lint`: Run ESLint{{/lint}}
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report{{#docker}}
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose{{/docker}}
