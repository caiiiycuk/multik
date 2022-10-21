import { Handler } from "@yandex-cloud/function-types";
import { Ok, ServerError, wrapException } from "./http";

import base64 from "base64-js";
import { driver } from "./db";
import { TABLE } from "./config";
import { TypedValues } from "ydb-sdk";

const decoder = new TextDecoder();

export const handler: Handler.Http = (ev) => wrapException(async () => {
    const body = ev.body;
    if (!body) {
        return ServerError("body is empty");
    }

    const json = ev.isBase64Encoded ? decoder.decode(base64.toByteArray(body)) : body;
    const document = JSON.parse(json);

    if (document === null) {
        return ServerError("body does not contain document");
    }

    if (document.id === undefined || document.id.indexOf("@") === -1) {
        return ServerError("document does not contain id");
    }

    if (document.start === undefined || typeof document.start !== "number") {
        return ServerError("document does not contain start");
    }

    await putDocment(document.id, document.start, json);

    return Ok({});
});

async function putDocment(id: string, start: number, document: string) {
    const db = await driver();
    await db.tableClient.withSession(async (session) => {
        const query = await session.prepareQuery(yql);
        await session.executeQuery(query, {
            $id: TypedValues.utf8(id),
            $start: TypedValues.uint64(start),
            $document: TypedValues.utf8(document),
        });
    });
    await db.destroy();
}

const yql =
`
DECLARE $id AS Utf8;
DECLARE $start AS UINT64;
DECLARE $document AS Utf8;
UPSERT INTO ${TABLE} (id, start, document) VALUES ($id, $start, $document);
`;
