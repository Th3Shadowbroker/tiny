import path from "path";
import dotenv from "dotenv";
import {envOrDefault} from "./util/Configuration";
import TinyServer from "./TinyServer";

const environment = process.env.NODE_ENV;
const environmentFile = path.resolve(`./../${environment}.env.local`);

dotenv.config({
    encoding: "utf-8",
    path: environmentFile
});
new TinyServer({
    service: {
        port: envOrDefault("SERVICE_PORT", 8080)
    },
    database: {
        type: "mysql",
        host: envOrDefault("DB_HOST", "localhost"),
        port: envOrDefault("DB_PORT", 3306),
        username: envOrDefault("DB_USER", "root"),
        password: envOrDefault("DB_PASS", ""),
        database: envOrDefault("DB_NAME", process.env.npm_package_name),
        synchronize: true,
        entities: [
            "./dist/entities/**/*.js"
        ],
        migrations: [
            "./dist/migrations/**/*.js"
        ]
    }
}).start()