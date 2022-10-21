import { Handler } from "@yandex-cloud/function-types";
import { Ok, wrapException } from "./http";

import { driver } from "./db";
import { TABLE } from "./config";
import { TypedValues } from "ydb-sdk";

export const handler: Handler.Http = (ev) => wrapException(async () => {
    const prop = ev.queryStringParameters["start"];
    const start = Number.parseInt(prop);

    const documents = await getDocuments(start);
    return Ok({ documents });
});

async function getDocuments(start: number): Promise<string[]> {
    const end = start + 7 * 24 * 60 * 60 * 1000;
    const db = await driver();
    const result = await db.tableClient.withSession(async (session) => {
        const query = await session.prepareQuery(yql);
        return await session.executeQuery(query, {
            $start: TypedValues.uint64(start),
            $end: TypedValues.uint64(end),
        });
    });
    await db.destroy();
    if (result.resultSets.length === 0) {
        return [];
    }

    const docs: string[] = [];
    for (const next of (result.resultSets[0].rows ?? [])) {
        if (next.items) {
            for (const item of next.items) {
                if (item.textValue) {
                    docs.push(item.textValue);
                }
            }
        }
    }

    return docs;
}

const yql =
    `
DECLARE $start AS UINT64;
DECLARE $end AS UINT64;
SELECT document FROM ${TABLE} where start >= $start and start <= $end; 
`;
