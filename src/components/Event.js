import React from "react";
import "./Event.css";

const Event = ({ event, onEdit, onDelete, style = {} }) => {
  return (
    <div
      className={`event-block ${event.type ? event.type.toLowerCase() : ""}`}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onEdit && onEdit(event);
      }}
      title={`${event.name} — ${new Date(
        event.start
      ).toLocaleString()} to ${new Date(event.end).toLocaleTimeString()}`}
    >
      <div className="event-title">{event.name}</div>
      <div className="event-time">
        {new Date(event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        –{" "}
        {new Date(event.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <button
        className="event-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete(event.id);
        }}
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
};

export default Event;
