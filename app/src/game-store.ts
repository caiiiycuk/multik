import Calendar from "@toast-ui/calendar/*";
import { Config, GameTemplate } from "./props";
import { newDate } from "./time";

export interface Game {
    id: string,
    templateId: string,
    start: number,
    end: number,
    server?: string,
    name?: string,
    link?: string,
    comment?: string,
    owner?: string,
    attendees?: string[],
}

export class GameStore {
    config: Config;
    templates: { [id: string]: GameTemplate } = {};
    store: { [id: string]: Game };

    constructor(config: Config, store: { [id: string]: Game }) {
        this.config = config;
        this.store = store;

        for (const next of config.games) {
            this.templates[next.id] = next;
        }
    }

    async add(game: Game) {
        this.store[game.id] = game;
        const response = await fetch(this.config.endpoint + "/put", {
            method: "PUT",
            body: JSON.stringify(game),
        });
        const payload = await response.json();
        if (payload.success === false) {
            throw new Error(payload.error);
        }
    }

    async remove(game: Game) {
        delete this.store[game.id];

        const response = await fetch(this.config.endpoint + "/del?id=" + game.id, {
            method: "PUT",
        });
        const payload = await response.json();
        if (payload.success === false) {
            throw new Error(payload.error);
        }
    }

    get(id: string): Game | null {
        return this.store[id] ?? null;
    }

    addGameTo(id: string, calendar: Calendar) {
        const game = this.get(id);
        if (game === null) {
            return;
        }

        const template = this.templates[game.templateId];
        calendar.createEvents([{
            id: game.id,
            calendarId: game.templateId,
            start: newDate(game.start),
            end: newDate(game.end),
            backgroundColor: template.color,
            color: template.textColor,
            attendees: game.attendees ?? [],
        }]);
    }

    addAllTo(calendar: Calendar) {
        Object.values(this.store).forEach((game) => {
            this.addGameTo(game.id, calendar);
        });
    }
}

export async function initStore(config: Config) {
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);

    const response = await fetch(config.endpoint + "/get?start=" + start.getTime());
    const json = await response.json();
    if (json.success === false) {
        throw new Error(json.error);
    }

    const store: { [id: string]: Game } = {};
    for (const next of json.documents) {
        const doc = JSON.parse(next);
        store[doc.id] = doc;
    }
    return new GameStore(config, store);
}
