import React, { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";
import { PREFILLED_EVENTS } from "./data";
import "./styles.css";

function App() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week")
  );
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  // Load events from localStorage or prefills
  useEffect(() => {
    const saved = localStorage.getItem("calendar-events");
    setEvents(saved ? JSON.parse(saved) : PREFILLED_EVENTS);
  }, []);

  // Persist to localStorage when events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => prev.clone().subtract(1, "week"));
  const goToNextWeek = () =>
    setCurrentWeekStart((prev) => prev.clone().add(1, "week"));
  const goToToday = () => setCurrentWeekStart(moment().startOf("week"));

  const handleTimeSlotClick = (dayMoment, hourIdx) => {
    if (!dayMoment || typeof dayMoment.day !== "function") return;
    if (dayMoment.day() === 0) {
      alert("Events on Sunday are disabled.");
      return;
    }
    const start = dayMoment
      .clone()
      .hour(hourIdx)
      .minute(0)
      .second(0)
      .millisecond(0);
    const end = start.clone().add(1, "hour");
    setModalEvent({
      id: null,
      name: "",
      type: "TASK",
      start: +start,
      end: +end,
    });
    setModalOpen(true);
  };

  const handleEditEvent = (ev) => {
    setModalEvent(ev);
    setModalOpen(true);
  };

  const handleSaveEvent = (ev) => {
    if (moment(ev.start).day() === 0) {
      alert("Cannot create/edit events on Sunday.");
      return;
    }

    if (ev.id) {
      setEvents((prev) => prev.map((x) => (x.id === ev.id ? ev : x)));
    } else {
      setEvents((prev) => [...prev, { ...ev, id: Date.now() }]);
    }
    setModalOpen(false);
    setModalEvent(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="app">
      <h1 className="app-title">Weekly Calendar</h1>

      <div className="calendar-nav">
        <button onClick={goToPreviousWeek}>Previous</button>
        <button onClick={goToToday}>Today</button>
        <button onClick={goToNextWeek}>Next</button>
      </div>

      <Calendar
        currentWeekStart={currentWeekStart}
        events={events}
        onTimeSlotClick={handleTimeSlotClick}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <EventModal
        isOpen={modalOpen}
        initialData={modalEvent}
        onSave={handleSaveEvent}
        onClose={() => {
          setModalOpen(false);
          setModalEvent(null);
        }}
      />
    </div>
  );
}

export default App;
