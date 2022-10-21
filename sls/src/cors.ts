import { Handler } from "@yandex-cloud/function-types";

export const handler: Handler.Http = async () => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "plain/text",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET",
        },
    };
};
