import { Handler } from "@yandex-cloud/function-types";
import { Column, TableDescription, TableIndex, Types } from "ydb-sdk";
import { TABLE } from "./config";
import { driver } from "./db";
import { wrapException, Ok } from "./http";

export const handler: Handler.Http = () => wrapException(async () => {
    const db = await driver();
    const state = await db.tableClient.withSession(async (session) => {
        try {
            await session.describeTable(TABLE);
            return "exists";
        } catch (e: any) {
            if (!(e.message !== "path not found")) {
                throw e;
            }
        }

        await session.createTable(TABLE,
            new TableDescription(
                [
                    new Column("id", Types.UTF8),
                    new Column("start", Types.optional(Types.UINT64)),
                    new Column("document", Types.optional(Types.UTF8)),
                ], ["id"],
            ).withIndex(new TableIndex("start_index").withIndexColumns("start")),
        );

        return "created";
    });
    await db.destroy();

    return Ok({ state });
});
