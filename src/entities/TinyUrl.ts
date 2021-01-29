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

    @Column({
        type: "varchar",
        length: 25
    })
    public name!: string;

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

    public async addInteraction(): Promise<TinyUrl> {
        this.interactions++;
        return await TinyUrl.repository().save(this);
    }

    public static repository(): Repository<TinyUrl> {
        return TinyServer.instance.connection.getRepository(TinyUrl);
    }

    public static async generate(url: string): Promise<TinyUrl> {
        const turl = new TinyUrl();
        turl.short = nanoid(6);
        turl.target = url;
        return await TinyUrl.repository().save(turl);
    }

    public static async resolve(shortId: string, ignore?: boolean): Promise<TinyUrl | undefined> {
        const turl = await TinyUrl.repository().findOne({short: shortId});
        return turl ? (!ignore ? turl.addInteraction() : turl) : undefined;
    }

}