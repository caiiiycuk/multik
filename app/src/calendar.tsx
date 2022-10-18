
import TuiCalendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { RefObject } from "preact";

import { useEffect, useRef, useState } from "preact/hooks";
import { lang } from "./i18n";
import { AppProps } from "./props";

export function Calendar(props: AppProps & {
    class?: string,
}) {
    const { config } = props;
    const [calendarRef] = useState<RefObject<TuiCalendar>>({ current: null });
    const root = useRef<HTMLDivElement>(null);
    const names = Object.fromEntries(config.games.map((v) => {
        return [v.id, v.name[lang] ?? v.name["en"]];
    }));

    useEffect(() => {
        if (root === null || root.current === null) {
            return;
        }

        const instance = new TuiCalendar(root.current, {
            calendars: config.games as any,
            defaultView: "week",
            week: {
                startDayOfWeek: new Date().getDay(),
                eventView: ["time"],
                taskView: [],
                showNowIndicator: true,
            },
            usageStatistics: false,
            useFormPopup: false,
            useDetailPopup: false,
            isReadOnly: false,
            gridSelection: {
                enableClick: true,
                enableDblClick: true,
            },
            template: {
                time: (e) => {
                    return <div>{names[e.calendarId]}</div>;
                },
            },
        });

        calendarRef.current = instance;

        return () => {
            try {
                instance.destroy();
            } catch (e) {
                // ignore
            }
        };
    }, [root]);

    useEffect(() => {
        const calendar = calendarRef.current;
        if (calendar === null || root === null || root.current === null) {
            return;
        }

        calendar.on("selectDateTime", (ev) => {
            props.createEvent({
                start: ev.start,
                end: ev.end,
                calendar,
            });
        });

        const pointerUp = (ev: PointerEvent) => {
            let target = ev.target as HTMLElement | null;
            let id = null;
            while (target !== null) {
                id = target.getAttribute("data-event-id");
                if (id !== null) {
                    break;
                }
                target = target.parentElement;
            }

            if (id !== null) {
                const event = calendar.getEvent(id, id.split("@")[0]);
                props.selectEvent({
                    event,
                    calendar,
                });
                ev.stopImmediatePropagation();
                ev.stopPropagation();
            }
        };

        root.current.addEventListener("pointerup", pointerUp, { capture: true });

        return () => {
            root.current?.removeEventListener("pointerup", pointerUp, { capture: true });
        };
    }, [root, calendarRef.current, props.createEvent, props.selectEvent]);

    return <div ref={root} class={props.class}></div>;
}
