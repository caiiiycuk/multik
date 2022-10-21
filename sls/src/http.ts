import { Http } from "@yandex-cloud/function-types/dist/src/http";

export function Ok(body?: object): Http.Result {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET",
        },
        body: JSON.stringify({
            success: true,
            ...(body ?? {}),
        }),
    };
}

export function ServerError(error: string): Http.Result {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET",
        },
        body: JSON.stringify({
            success: false,
            error,
        }),
    };
}

export async function wrapException(handler: () => Promise<Http.Result>): Promise<Http.Result> {
    try {
        return await handler();
    } catch (e: any) {
        console.error(e);
        return ServerError(e.message ?? "unknown error");
    }
}
