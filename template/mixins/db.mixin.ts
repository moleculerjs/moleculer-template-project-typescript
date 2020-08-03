"use strict";

import { existsSync } from "fs";
import { sync } from "mkdirp";
import { Context, Service, ServiceSchema } from "moleculer";
import DbService from "moleculer-db";

class Conection implements Partial<ServiceSchema>, ThisType<Service>{
    private cacheCleanEventName: string;
    private collection:string;

    constructor(collection: string) {
        this.collection = collection;
        this.cacheCleanEventName = `cache.clean.${collection}`;
    }
    start(){
        if (process.env.MONGO_URI) {
            // Mongo adapter
            const MongoAdapter = require("moleculer-db-adapter-mongo");

            this.schema.adapter = new MongoAdapter(process.env.MONGO_URI);
            this.schema.collection = this.collection;
        } else if (process.env.TEST) {
            // NeDB memory adapter for testing
            // @ts-ignore
            this.schema.adapter = new DbService.MemoryAdapter();
        } else {
            // NeDB file DB adapter

            // Create data folder
            if (!existsSync("./data")) {
                sync("./data");
            }
            // @ts-ignore
            this.schema.adapter = new DbService.MemoryAdapter({ filename: `./data/${this.collection}.db` });
        }

        return this.schema;
    }
    schema: Partial<ServiceSchema> & ThisType<Service> = {
        mixins: [DbService],
        events: {
            /**
             * Subscribe to the cache clean event. If it's triggered
             * clean the cache entries for this service.
             *
             * @param {Context} ctx
             */
            async [this.cacheCleanEventName]() {
                if (this.broker.cacher) {
                    await this.broker.cacher.clean(`${this.fullName}.*`);
                }
            },
        },
        methods: {
            /**
             * Send a cache clearing event when an entity changed.
             *
             * @param {String} type
             * @param {any} json
             * @param {Context} ctx
             */
            async entityChanged(type: string, json: any, ctx: Context) {
                ctx.broadcast(this.cacheCleanEventName);
            },
        },
        async started() {
            // Check the count of items in the DB. If it's empty,
            // call the `seedDB` method of the service.
            if (this.seedDB) {
                const count = await this.adapter.count();
                if (count === 0) {
                    this.logger.info(`The '${this.collection}' collection is empty. Seeding the collection...`);
                    await this.seedDB();
                    this.logger.info("Seeding is done. Number of records:", await this.adapter.count());
                }
            }
        },
    }

}
export default Conection
