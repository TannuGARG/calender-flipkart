import React, { useEffect, useState } from "react";
import moment from "moment";
import "./EventModal.css";

export default function EventModal({ isOpen, initialData, onSave, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("TASK");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    if (!initialData) {
      setName("");
      setType("TASK");
      setStart("");
      setEnd("");
      return;
    }
    setName(initialData.name || "");
    setType(initialData.type || "TASK");
    setStart(
      initialData.start
        ? moment(initialData.start).format("YYYY-MM-DDTHH:mm")
        : ""
    );
    setEnd(
      initialData.end ? moment(initialData.end).format("YYYY-MM-DDTHH:mm") : ""
    );
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !start || !end) {
      alert("Please fill all fields.");
      return;
    }
    const s = moment(start);
    const e = moment(end);
    if (!s.isValid() || !e.isValid() || e.isBefore(s)) {
      alert("Please provide a valid time range (end must be after start).");
      return;
    }
    // disallow Sunday
    if (s.day() === 0) {
      alert("Events on Sunday are disabled.");
      return;
    }
    const payload = {
      id: initialData?.id || null,
      name: name.trim(),
      type,
      start: +s,
      end: +e,
    };
    onSave && onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData?.id ? "Edit Event" : "Create Event"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <label>Event Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="TASK">TASK</option>
          <option value="HOLIDAY">HOLIDAY</option>
        </select>

        <label>Start</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>End</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
