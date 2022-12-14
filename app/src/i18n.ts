export const lang = navigator.language.toLowerCase().split("-")[0];

export function t(key: string) {
    return (data[lang] ?? data["en"])[key] ?? data["en"][key] ?? key;
}

const data: { [lang: string]: { [key: string]: string } } = {
    en: {
        create_event: "Schedule a game",
        from: "Start at",
        duration: "Duration",
        game: "Game",
        game_type: "Type",
        name: "Name",
        link: "Link",
        comment: "Comment",
        create: "Create",
        cancle: "Close",
        close: "Close",
        create_another_one: "Create another one",
        game_info: "Game Info",
        server: "Server",
        owner: "Owner",
        attendees: "Attendees",
        join: "Join",
        leave: "Leave",
        landing_title: "Multiplayer calendar",
        enter: "Enter",
        your_name: "Your name",
    },
    ru: {
        create_event: "Запланировать игру",
        from: "Начало",
        duration: "Время",
        game: "Игра",
        game_type: "Тип",
        name: "Имя",
        link: "Ссылка",
        comment: "Коммент.",
        create: "Создать",
        cancle: "Закрыть",
        close: "Закрыть",
        create_another_one: "Создать ещё одну",
        game_info: "Информация о игре",
        server: "Сервер",
        owner: "Владелец",
        attendees: "Участники",
        join: "Присоединиться",
        leave: "Покинуть",
        landing_title: "Календарь сетевых игр",
        enter: "Войти",
        your_name: "Ваше имя",
    },
};
