import { useEffect, useState } from "preact/hooks";
import "./app.css";
import { Calendar } from "./calendar";
import { AppProps, Config, CreateGameRequest, SelectGameRequest } from "./props";
import { CreateEvent } from "./create-event";
import { SelectEvent } from "./select-event";
import { GameStore, initStore } from "./game-store";

export function App() {
    const [config, setConfig] = useState<Config | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [createRequest, setCreateRequest] = useState<CreateGameRequest | null>(null);
    const [selectRequest, setSelectRequest] = useState<SelectGameRequest | null>(null);
    const [store, setStore] = useState<GameStore | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect((async () => {
        try {
            const response = await fetch("config.js");
            const text = await response.text();
            eval(text);

            const config = (window as any).multik as Config;
            if (config === undefined) {
                throw new Error("./config.js is not accesible or in wrong format");
            }

            setConfig(config);
        } catch (e: any) {
            console.error(e);
            setError(e.message ?? "Unknown error");
        }
    }) as any, []);

    useEffect((async () => {
        if (config === null) {
            return;
        }

        try {
            setStore(await initStore(config));
        } catch (e: any) {
            console.error(e);
            setError(e.message ?? "Unknown error");
        }
    }) as any, [config]);

    if (error !== null) {
        return <Broken error={error} />;
    }

    if (config === null || store === null) {
        return <Spinner />;
    }

    const appProps: AppProps = {
        login: new URLSearchParams(location.search).get("login") ?? "guest",
        config,
        createGame: setCreateRequest,
        selectGame: setSelectRequest,
        cancleRequest: () => {
            setCreateRequest(null);
            setSelectRequest(null);
        },
        store,
        setError,
        setLoading,
    };

    return <>
        <Calendar {...appProps} class="h-full" />
        {createRequest !== null && <CreateEvent {...appProps} request={createRequest}
            class="absolute left-0 top-0 h-full w-full z-30" />}
        {selectRequest !== null && <SelectEvent {...appProps} request={selectRequest}
            class="absolute left-0 top-0 h-full w-full z-40" />}
        {loading && <Spinner
            class="absolute left-0 top-0 h-full w-full z-50 bg-white opacity-50" />}
    </>;
}

function Spinner(props: { class?: string }) {
    return <div class={"h-full w-full flex justify-center items-center " + props.class}>
        <svg xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 animate-spin"
            fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>;
}

function Broken(props: { error: string }) {
    return <div class="h-full w-full flex justify-center items-center">
        <div class="text-red-800">{props.error}</div>
    </div>;
}
