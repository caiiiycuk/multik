// @ts-check

/**
 * @type {import("../app/src/props").Templates}
 */
const games = [
    {
        id: "van-var",
        durationMs: 30 * 60 * 1000,
        name: {
            ru: "Ван-Вар",
            en: "Van-var",
        },
        description: {
            ru: "Cоревнование по количеству фрагов/убийств друг друга. Может быть командным.",
            en: "Competition in the number of frags / kills each other. May be command.",
        },
        color: "#D93F0B",
        textColor: "#FFFFFF",
        defaultServer: "vangers.net",
    },
    {
        id: "mechosoma",
        durationMs: 30 * 60 * 1000,
        name: {
            ru: "Мехосома",
            en: "Mechosoma",
        },
        description: {
            ru: "Соревнование по тому, кто быстрее и больше развезёт нужных товаров по эскейвам. Есть режиме \"каждый сам за себя\", и командный.",
            en: "Competition for who will deliver the necessary goods faster and more to the escapists. There is a mode\"every man for himself\", and command.",
        },
        color: "#0E8A16",
        textColor: "#FFFFFF",
        defaultServer: "vangers.net",
    },
    {
        id: "passemblos",
        durationMs: 30 * 60 * 1000,
        name: {
            ru: "Пассемблос",
            en: "Passemblos",
        },
        description: {
            ru: "Гонка по чек-поинтам, случайным образом разбрасываемым по Цепи Миров.",
            en: "Race through checkpoints randomly scattered across the Chain of Worlds.",
        },
        color: "#1AA4CF",
        textColor: "#FFFFFF",
        defaultServer: "vangers.net",
    }
];

window.multik = {
    games,
};
