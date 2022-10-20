import { useState } from "preact/hooks";
import { lang, t } from "./i18n";
import { AppProps, CreateGameRequest, GameTemplate } from "./props";
import { nanoid } from "nanoid";
import { humanizeTime, newDate } from "./time";

const minDuration = 30 * 60 * 1000;
const durationStep = minDuration;
const maxDuration = 2 * 60 * 60 * 1000;

export function CreateEvent(props: AppProps & {
    request: CreateGameRequest,
    class?: string,
}) {
    const config = props.config;
    const { calendar } = props.request;
    const [gameId, setGameType] = useState<string>(config.games[0].id);
    const game = config.games.find((g) => g.id === gameId) as GameTemplate;
    const [start, setStart] = useState<number>(props.request.start.getTime());
    const [duration, setDuration] = useState<number>(game.durationMs);

    const [server, setServer] = useState<string>(game.defaultServer ?? "");
    const [name, setName] = useState<string>(game.name["en"] ?? "");
    const [link, setLink] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [owner, setOwner] = useState<string>(props.login ?? "guest");

    function onCancle() {
        calendar.clearGridSelections();
        props.cancleRequest();
    }

    function onCreate() {
        const id = game.id + "@" + nanoid();
        props.store.add({
            id,
            templateId: game.id,
            start: start,
            end: start + duration,
            name,
            link,
            comment,
            server,
            owner: owner ?? "guest",
            attendees: [owner ?? "guest"],
        });

        props.store.addGameTo(id, calendar);

        calendar.clearGridSelections();
        props.cancleRequest();
    }

    function incDuration() {
        setDuration(Math.min(duration + durationStep, maxDuration));
    }

    function decDuration() {
        setDuration(Math.max(duration - durationStep, minDuration));
    }

    function incTime() {
        setStart(start + durationStep);
    }

    function decTime() {
        setStart(start - durationStep);
    }

    return <div class={props.class + " bg-white opacity-95"}>
        <div class="flex flex-col mx-10 my-8">
            <div class="text-2xl mb-4">{t("create_event")}</div>

            <div class="flex flex-row">
                <div class="w-16">{t("from")}</div>
                <div class="ml-6 text-green-800 font-bold">{newDate(start).toLocaleString()}</div>
                <IncDec onInc={incTime} onDec={decTime} />
            </div>
            <div class="flex flex-ro mt-2">
                <div class="w-16">{t("duration")}</div>
                <div class="ml-6 font-bold">{humanizeTime(duration)}</div>
                <IncDec onInc={incDuration} onDec={decDuration} />
            </div>

            <div class="text-xl my-4">{t("game")}</div>
            <div class="my-2 flex flex-row items-center">
                <div class="mr-4 w-20">{t("game_type")}</div>
                <select value={gameId} onChange={(e) => setGameType((e.target as any).value)}
                    class="border border-blue-300 rounded py-1 px-1">
                    {config.games.map((game) => {
                        return <option key={game.id} value={game.id}>{game.name[lang] ?? game.name["en"]}</option>;
                    })};
                </select>
                {game.color && <div class="ml-2 w-4 h-4" style={{ backgroundColor: game.color }}></div>}
            </div>

            {game.description && <div class="text-sm text-gray-600 ml-4 -mt-1 mb-2 flex flex-row">
                <span class="mr-2">*</span>
                <span>{game.description[lang] ?? game.description["en"]}</span>
            </div>}

            <TextInput label={t("server")} value={server} onChange={setServer} />
            <TextInput label={t("name")} value={name} onChange={setName} />
            <TextInput label={t("link")} value={link} onChange={setLink} />
            <TextInput label={t("comment")} value={comment} onChange={setComment} />
            <TextInput label={t("owner")} value={owner} onChange={setOwner} />

            <div class="flex flex-row my-4">
                <div class="flex-grow" />
                <div class="bg-gray-400 px-4 py-2 mr-8 rounded cursor-pointer" onClick={onCancle}>{t("cancle")}</div>
                <div class="bg-green-400 px-16 py-2 rounded cursor-pointer" onClick={onCreate}>{t("create")}</div>
            </div>
        </div>
    </div>;
}

function TextInput(props: {
    label: string,
    value: string,
    onChange: (value: string) => void,
}) {
    return <div class="flex flex-row my-2 items-center">
        <div class="mr-4 w-20">{props.label}</div>
        <input class="border border-blue-300 rounded px-1 py-1 w-full" value={props.value}
            onChange={(e) => props.onChange(e.currentTarget.value) }></input>
    </div>;
}

function IncDec(props: {
    onInc: () => void,
    onDec: () => void,
}) {
    return <>
        <div class="ml-2 cursor-pointer" onClick={props.onInc}>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </div>
        <div class="ml-2 cursor-pointer" onClick={props.onDec}>
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

        </div>
    </>;
}
