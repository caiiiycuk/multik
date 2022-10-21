import Calendar from "@toast-ui/calendar/*";
import { GameStore } from "./game-store";

export type LocalizedString = { [lang: string]: string };

export interface GameTemplate {
    id: string,
    name: LocalizedString,
    durationMs: number,
    description?: LocalizedString,
    color?: string,
    textColor?: string,
    defaultServer?: string,
}

export type Templates = GameTemplate[];

export interface Config {
    game: LocalizedString,
    endpoint: string,
    games: Templates;
};

export interface CreateGameRequest {
    start: Date,
    end: Date,
    calendar: Calendar,
}

export interface SelectGameRequest {
    id: string,
    calendar: Calendar,
}

export interface AppProps {
    login: string,
    config: Config,
    createGame: (request: CreateGameRequest) => void,
    selectGame: (request: SelectGameRequest) => void,
    cancleRequest: () => void,
    store: GameStore,
    setError: (error: string) => void,
    setLoading: (loading: boolean) => void,
};
