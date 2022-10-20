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
    templates: {[id: string]: GameTemplate} = {};
    store: { [id: string]: Game };

    constructor(config: Config, store: { [id: string]: Game}) {
        this.store = store;

        for (const next of config.games) {
            this.templates[next.id] = next;
        }
    }

    add(game: Game): void {
        this.store[game.id] = game;
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
    return new GameStore(config, {});
}
