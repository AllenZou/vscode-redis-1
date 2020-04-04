import path from "path";
import AbstractNode from "./abstraction";
import { TreeItemContextValue, RedisCommand } from "../abstraction/constant";
import { RedisInfo } from "../abstraction/redisinfo";
// import { RedisItemConfig } from "../abstraction/interface";
import { TreeItemCollapsibleState } from "vscode";
import command from '../redis/command';
// import utils from "./utils";
import DBItem from "./db";
import { Socket } from "net";

class RedisItem extends AbstractNode {
    contextValue = TreeItemContextValue.REDIS;
    iconPath = path.join(__dirname, '..', '..', 'resources', `${this.contextValue}.png`);
    info!: RedisInfo
    constructor(
        readonly id: string,
        readonly name: string,
        info: RedisInfo,
        readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
        this.info = info;
    }


    async getChildren(socket: Socket) {
        const dbInfo = await command.run(socket, RedisCommand.CONFIG_GET_DATABASES);
        let count = parseInt(dbInfo[1]);
        const result: DBItem[] = [];
        for (let i = 0; i < count; i++) {
            const dbName = `db${i}`;
            const db = new DBItem(
                i.toString(),
                this,
                `${dbName}(${this.info.Keyspace[dbName]?.keys || 0})`,
                TreeItemCollapsibleState.Collapsed
            )
            result.push(db);
        }
        return result
    }
}

export default RedisItem