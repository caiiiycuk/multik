import { useEffect } from "preact/hooks";
import { Game } from "./game-store";
import { lang, t } from "./i18n";
import { AppProps, SelectGameRequest, GameTemplate } from "./props";
import { humanizeTime, newDate } from "./time";

export function SelectEvent(props: AppProps & {
    request: SelectGameRequest,
    class?: string,
}) {
    const game = props.store.get(props.request.id) as Game;

    useEffect(() => {
        if (game === null) {
            props.cancleRequest();
        }
    }, [game]);

    if (game === null) {
        return null;
    }

    const start = newDate(game.start);
    const end = newDate(game.end);
    const template = props.config.games.find((el) => el.id === game.templateId) as GameTemplate;

    function onClose() {
        props.cancleRequest();
    }

    function onCreate() {
        props.cancleRequest();
        props.createGame({
            start,
            end,
            calendar: props.request.calendar,
        });
    }

    function leave() {
        if (game.attendees) {
            props.setLoading(true);
            game.attendees = game.attendees.filter((el) => el !== props.login);
            if (game.attendees.length === 0) {
                props.store
                    .remove(game)
                    .catch((e) => {
                        console.error(e);
                        props.setError(e.message);
                    })
                    .finally(() => props.setLoading(false));
                props.request.calendar.deleteEvent(game.id, game.templateId);
            } else {
                props.store
                    .add(game)
                    .catch((e) => {
                        console.error(e);
                        props.setError(e.message);
                    })
                    .finally(() => props.setLoading(false));
                props.request.calendar.updateEvent(game.id, game.templateId, {
                    attendees: game.attendees,
                });
            }
        }

        props.cancleRequest();
    }

    function join() {
        if (game.attendees && game.attendees.findIndex((el) => el === props.login) === -1) {
            game.attendees.push(props.login);
            props.setLoading(true);
            props.store
                .add(game)
                .catch((e) => {
                    console.error(e);
                    props.setError(e.message);
                })
                .finally(() => props.setLoading(false));
            props.request.calendar.updateEvent(game.id, game.templateId, {
                attendees: game.attendees,
            });
        }

        props.cancleRequest();
    }

    const subscribed = (game.attendees || []).findIndex((el) => el === props.login) >= 0;

    return <div class={props.class + " bg-white opacity-95"}>
        <div class="flex flex-col mx-10 my-8">
            <div class="text-2xl mb-4">{t("game_info")}</div>
            <div class="mb-2">{t("attendees")}: {(game.attendees || []).join(", ")}</div>

            <div class="flex flex-row">
                <div class="w-16">{t("from")}</div>
                <div class="ml-6 text-green-800 font-bold">{start.toLocaleString()}</div>
            </div>
            <div class="flex flex-ro mt-2">
                <div class="w-16">{t("duration")}</div>
                <div class="ml-6 font-bold">{humanizeTime(end.getTime() - start.getTime())}</div>
            </div>

            <div class="text-xl my-4">{t("game")}</div>
            <div class="my-2 flex flex-row items-center">
                <div class="mr-4 w-20">{t("game_type")}</div>
                <div>{template.name[lang] ?? template.name["en"]}</div>
                {template.color && <div class="ml-2 w-4 h-4" style={{ backgroundColor: template.color }}></div>}
            </div>

            {template.description && <div class="text-sm text-gray-600 ml-4 -mt-1 mb-2 flex flex-row">
                <span class="mr-2">*</span>
                <span>{template.description[lang] ?? template.description["en"]}</span>
            </div>}

            <TextInput label={t("server")} value={game.server ?? ""} />
            <TextInput label={t("name")} value={game.name ?? ""} />
            <TextInput label={t("link")} value={game.link ?? ""} />
            <TextInput label={t("comment")} value={game.comment ?? ""} />
            <TextInput label={t("owner")} value={game.owner ?? ""} />

            <div class="flex flex-row my-4">
                {subscribed && <div class="bg-blue-400 px-4 py-2 mr-8 rounded cursor-pointer"
                    onClick={leave}>{t("leave")}</div>}
                {!subscribed && <div class="bg-blue-400 px-4 py-2 mr-8 rounded cursor-pointer"
                    onClick={join}>{t("join")}</div>}
                <div class="flex-grow" />
                <div class="bg-gray-400 px-4 py-2 mr-8 rounded cursor-pointer"
                    onClick={onCreate}>{t("create_another_one")}</div>
                <div class="bg-green-400 px-16 py-2 rounded cursor-pointer"
                    onClick={onClose}>{t("close")}</div>
            </div>
        </div>
    </div>;
}

function TextInput(props: {
    label: string,
    value: string,
}) {
    return <div class="flex flex-row my-2 items-center">
        <div class="mr-4 w-20">{props.label}</div>
        <input disabled class="border border-blue-300 rounded px-1 py-1 w-full" value={props.value}></input>
    </div>;
}
