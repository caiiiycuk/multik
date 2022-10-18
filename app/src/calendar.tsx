
import TuiCalendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import { RefObject } from "preact";

import { useEffect, useRef, useState } from "preact/hooks";
import { AppProps } from "./props";

export function Calendar(props: AppProps & {
    class?: string,
}) {
    const { config } = props;
    const [calendarRef] = useState<RefObject<TuiCalendar>>({ current: null });
    const root = useRef<HTMLDivElement>(null);

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
            template: {
                time: (e) => {
                    return <div>{e.calendarId}</div>;
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
        if (calendar === null) {
            return;
        }

        calendar.on("selectDateTime", (ev) => {
            props.createEvent({
                start: ev.start,
                end: ev.end,
                calendar,
            });
        });
        calendar.on("clickEvent", (ev) => {
            props.selectEvent({
                event: ev.event,
            });
        });
    }, [calendarRef.current, props.createEvent, props.selectEvent]);

    return <div ref={root} class={props.class}></div>;
}
