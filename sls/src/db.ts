import { Driver, MetadataAuthService } from "ydb-sdk";
import { DATABASE, YDB_ENDPOINT } from "./config";

const timeout = 5 * 1000;


export async function driver() {
    const driver = new Driver({
        endpoint: YDB_ENDPOINT,
        database: DATABASE,
        authService: new MetadataAuthService(),
    });

    const ready = await driver.ready(timeout);
    if (!ready) {
        throw new Error("YDB driver is no ready");
    }

    return driver;
}
