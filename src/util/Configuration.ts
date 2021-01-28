import {MysqlConnectionOptions} from "typeorm/driver/mysql/MysqlConnectionOptions";

export default interface Configuration {
    service: ServiceConfiguration
    database: MysqlConnectionOptions
}

export interface ServiceConfiguration {
    port: number
}

export function initialDatabaseConfiguration(options: MysqlConnectionOptions): MysqlConnectionOptions {
    return {
        ...options,
        database: undefined,
        synchronize: false,
        entities: [],
        migrations: []
    }
}

export function envOrDefault(varName: string, varDefault: any): any {
    return process.env[varName] ?? varDefault;
}