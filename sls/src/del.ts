import { Handler } from "@yandex-cloud/function-types";
import { Ok, ServerError, wrapException } from "./http";

import { driver } from "./db";
import { TABLE } from "./config";
import { TypedValues } from "ydb-sdk";


export const handler: Handler.Http = (ev) => wrapException(async () => {
    const id = ev.queryStringParameters["id"];
    if (!id) {
        return ServerError("id is not specified");
    }

    await deleteDocument(id);

    return Ok({});
});

async function deleteDocument(id: string) {
    const db = await driver();
    await db.tableClient.withSession(async (session) => {
        const query = await session.prepareQuery(yql);
        return await session.executeQuery(query, {
            $id: TypedValues.utf8(id),
        });
    });
    await db.destroy();
}

const yql =
`
DECLARE $id AS Utf8;
DELETE FROM ${TABLE} where id = $id;
`;
