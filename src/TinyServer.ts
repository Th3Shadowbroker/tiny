import log4js, {Logger} from "log4js";
import express, {Application} from "express";
import Configuration, {initialDatabaseConfiguration} from "./util/Configuration";
import helmet from "helmet";
import {Connection, createConnection} from "typeorm";
import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";
import {json} from "body-parser";
import logRequests from "./middleware/ExpressLog";

export default class TinyServer {

    private readonly _app: Application;

    private readonly _log: Logger;

    private readonly _config: Configuration;

    private _connection: Connection | undefined;

    private static _instance: TinyServer;

    constructor(config: Configuration) {
        TinyServer._instance = this;

        // Setup express
        this._app = express();
        this._app.use(helmet());
        this._app.use(json());

        // Setup logging
        this._log = log4js.getLogger(process.env.npm_package_name);
        this._log.level = process.env.NODE_ENV === "development" ? "debug" : "info";
        this._app.use(logRequests(this._log));

        // Save config
        this._config = config;
    }

    async start(): Promise<void> {
        this._log.info("Initializing database...");
        const initialConnection = await createConnection(initialDatabaseConfiguration(this._config.database));
        await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${this._config.database.database}\``);
        await initialConnection.close();

        this._log.info("Creating main connection...")
        this._connection = await createConnection(this._config.database);
        const {username, host, port} = <MysqlConnectionOptions>this._connection.options;
        this._log.info(`Connection established: ${username}@${host}:${port}`);

        this._log.info(`Starting service on port ${this._config.service.port}`);
        this._app.listen(this._config.service.port);
        this._log.info("The service is up and running!");
    }

    get app(): Application {
        return this._app;
    }

    get log(): Logger {
        return this._log;
    }

    get config(): Configuration {
        return this._config;
    }

    get connection(): Connection {
        if (!this._connection) throw "The database connection has been accessed before it had been initialized!";
        return this._connection;
    }

    static get instance(): TinyServer {
        return this._instance;
    }

}