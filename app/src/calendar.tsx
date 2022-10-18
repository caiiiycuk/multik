
import TuiCalendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";

import { useEffect, useRef, useState } from "preact/hooks";

export function Calendar(props: {
    class?: string,
}) {
    const [instance, setInstance] = useState<TuiCalendar | null>(null);
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (root === null || root.current === null) {
            return;
        }

        const instance = new TuiCalendar(root.current, {
            calendars: [{
                id: "van-var",
                name: "Van-Var",
            }, {
                id: "pasemblos",
                name: "Pasemblos",
            }],
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
            isReadOnly: true,
            template: {
                time: (e) => {
                    return <div>{e.calendarId}</div>;
                },
            },
        });
        setInstance(instance);

        instance.createEvents([
            {
                id: "1",
                calendarId: "van-var",
                backgroundColor: "#FF0000",
                start: Date.now() + 1 * 60 * 60 * 1000,
                end: Date.now() + 2 * 60 * 60 * 1000,
            },
            {
                id: "2",
                calendarId: "van-var",
                backgroundColor: "#FF00FF",
                start: Date.now() + 1 * 60 * 60 * 1000,
                end: Date.now() + 2 * 60 * 60 * 1000,
            },
            {
                id: "3",
                calendarId: "van-var",
                backgroundColor: "#FF00FF",
                start: Date.now() + 1 * 60 * 60 * 1000,
                end: Date.now() + 2 * 60 * 60 * 1000,
            },
            {
                id: "4",
                calendarId: "van-var",
                backgroundColor: "#FF00FF",
                start: Date.now() + 1 * 60 * 60 * 1000,
                end: Date.now() + 2 * 60 * 60 * 1000,
            },
        ]);

        return () => {
            try {
                instance.destroy();
            } catch (e) {
                // ignore
            }
        };
    }, [root, root.current]);

    return <div ref={root} class={props.class}></div>;
}
