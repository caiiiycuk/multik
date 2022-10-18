
export function newDate(ms: number) {
    return new Date(ms);
}

export function humanizeTime(ms: number) {
    const timeSec = Math.round(ms / 1000);
    if (timeSec > 24 * 60 * 60) {
        const days = Math.round(timeSec / 24 / 60 / 60 * 10) / 10;
        return days + (days === 1 ? " Day" : " Days");
    }

    if (timeSec > 60 * 60) {
        const hours = Math.round(timeSec / 60 / 60 * 10) / 10;
        return hours + (hours === 1 ? " Hour" : " Hrs");
    }

    const minutes = Math.round(timeSec / 60 * 10) / 10;
    return minutes + " Min";
}
