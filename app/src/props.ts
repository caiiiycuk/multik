import Calendar, { EventObject } from "@toast-ui/calendar/*";

export type LocalizedString = { [lang: string]: string };

export interface MultiplayerGame {
    id: string,
    name: LocalizedString,
    durationMs: number,
    description?: LocalizedString,
    color?: string,
    textColor?: string,
}

export type MultiplayerGames = MultiplayerGame[];

export interface Config {
    games: MultiplayerGames;
};

export interface CreateEventRequest {
    start: Date,
    end: Date,
    calendar: Calendar,
}

export interface SelectEventRequest {
    event: EventObject,
    calendar: Calendar,
}

export interface AppProps {
    login: string | null,
    config: Config,
    createEvent: (request: CreateEventRequest) => void,
    selectEvent: (request: SelectEventRequest) => void,
    cancleRequest: () => void,
};
