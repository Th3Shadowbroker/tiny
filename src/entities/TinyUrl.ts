import {Column, Entity, PrimaryColumn, Repository} from "typeorm";
import TinyServer from "../TinyServer";
import {nanoid} from "nanoid";

@Entity({
    name: "url",
})
export default class TinyUrl {

    @PrimaryColumn({
        type: "varchar",
        length: 6
    })
    public short!: string;

    @Column("varchar")
    public target!: string;

    @Column({
        type: "timestamp"
    })
    public created!: Date;

    @Column({
        type: "bigint",
        unsigned: true,
        default: 0
    })
    public interactions!: number;

    public static repository(): Repository<TinyUrl> {
        return TinyServer.instance.connection.getRepository(TinyUrl);
    }

    public static async generate(url: string): Promise<TinyUrl> {
        const turl = new TinyUrl();
        turl.short = nanoid(6);
        turl.target = url;
        return await TinyUrl.repository().save(turl);
    }

}