import React, { useMemo } from "react";
import moment from "moment";
import "./Calendar.css";
import Event from "./Event";

const HOUR_HEIGHT = 48;

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}

function assignColumns(events) {
  const items = events
    .map((ev) => ({ ...ev }))
    .sort((a, b) => a.start - b.start || a.end - a.start - (b.end - b.start));
  const columns = [];
  items.forEach((item) => {
    let placed = false;
    for (let c = 0; c < columns.length; c++) {
      if (!columns[c].some((e) => overlaps(e, item))) {
        columns[c].push(item);
        item._col = c;
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([item]);
      item._col = columns.length - 1;
    }
  });
  const colCount = columns.length || 1;
  return { items, colCount };
}

const Calendar = ({
  currentWeekStart,
  events = [],
  onTimeSlotClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const startOfWeek = useMemo(
    () => moment(currentWeekStart).startOf("day"),
    [currentWeekStart]
  );
  const days = Array.from({ length: 7 }, (_, i) =>
    moment(startOfWeek).add(i, "days")
  );
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAllDayEventsForDay = (day) => {
    return events.filter((e) => {
      const s = moment(e.start);
      const diffHours = moment(e.end).diff(s, "hours");
      return s.isSame(day, "day") && (e.type === "HOLIDAY" || diffHours >= 24);
    });
  };

  const formatHour = (h) => {
    if (h === 0) return "12 AM";
    if (h < 12) return `${h} AM`;
    if (h === 12) return "12 PM";
    return `${h - 12} PM`;
  };

  const getTimedEventsForDay = (day) =>
    events.filter((e) => {
      const s = moment(e.start);
      return s.isSame(day, "day") && !(e.type === "HOLIDAY");
    });

  return (
    <div className="calendar">
      {/* Header */}
      <div className="calendar-header">
        <div className="time-col-header">All-day & Hours</div>
        {days.map((d) => (
          <div
            key={d.format("YYYY-MM-DD")}
            className={`day-col-header ${
              d.isSame(moment(), "day") ? "today" : ""
            }`}
          >
            <div className="day-name">{d.format("ddd")}</div>
            <div className="day-date">{d.format("MMM D")}</div>
          </div>
        ))}
      </div>

      <div className="all-day-row">
        <div className="time-col-allDay">All-day</div>
        {days.map((d) => {
          const allDayEvents = getAllDayEventsForDay(d);
          return (
            <div key={d.format("YYYY-MM-DD")} className="all-day-cell">
              {allDayEvents.map((ev) => (
                <Event
                  key={ev.id}
                  event={ev}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  style={{ position: "relative", height: 28, margin: "2px 0" }}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className="calendar-body">
        <div className="time-col">
          {hours.map((h) => (
            <div key={h} className="time-slot-label">
              {formatHour(h)}
            </div>
          ))}
        </div>

        {days.map((d) => {
          const dayTimedEvents = getTimedEventsForDay(d).map((ev) => ({
            ...ev,
            start: +moment(ev.start),
            end: +moment(ev.end),
          }));
          const { items: orderedEvents, colCount } =
            assignColumns(dayTimedEvents);

          return (
            <div
              key={d.format("YYYY-MM-DD")}
              className={`day-col ${d.day() === 0 ? "sunday-col" : ""}`}
            >
              {hours.map((h) => (
                <div
                  key={h}
                  className={`time-slot ${
                    d.day() === 0 ? "disabled-slot" : ""
                  }`}
                  onClick={() => {
                    if (d.day() === 0) return;
                    onTimeSlotClick && onTimeSlotClick(d, h);
                  }}
                />
              ))}
              {orderedEvents.map((ev) => {
                const startMoment = moment(ev.start);
                const endMoment = moment(ev.end);
                const startHourDecimal =
                  startMoment.hours() + startMoment.minutes() / 60;
                const durationHours = Math.max(
                  0.25,
                  endMoment.diff(startMoment, "minutes") / 60
                );
                const top = startHourDecimal * HOUR_HEIGHT;
                const height = durationHours * HOUR_HEIGHT;

                const widthPct = 100 / colCount;
                const leftPct = (ev._col || 0) * widthPct;

                return (
                  <Event
                    key={ev.id}
                    event={ev}
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                    style={{
                      top: `${top}px`,
                      height: `${height - 4}px`,
                      width: `calc(${widthPct}% - 6px)`,
                      left: `calc(${leftPct}% + 3px)`,
                      position: "absolute",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
