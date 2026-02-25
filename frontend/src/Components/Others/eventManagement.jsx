import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "./EventModal";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  //  Fetch all events on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: `${event.date}T${event.time}`,
          color: event.color,
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        alert("Failed to load events.");
      });
  }, []);

  // On calendar date click
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  //  On calendar event click
  const handleEventClick = (info) => {
    const eventId = parseInt(info.event.id, 10);
    const clickedEvent = events.find((e) => e.id === eventId);
    if (clickedEvent) {
      const [date, time] = clickedEvent.start.split("T");
      setSelectedEvent({
        id: clickedEvent.id,
        title: clickedEvent.title,
        time,
        color: clickedEvent.color,
      });
      setSelectedDate(date);
      setModalOpen(true);
    }
  };

  //  Add or Update event
  const handleSaveEvent = ({ id, title, time, color }) => {
    if (!title || !time || !color || !selectedDate) {
      alert("All fields are required.");
      return;
    }

    const payload = { title, time, color, date: selectedDate };

    if (id) {
      //  Update existing event
      fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          const updated = events.map((evt) =>
            evt.id === id
              ? { id, title, start: `${selectedDate}T${time}`, color }
              : evt
          );
          setEvents(updated);
          setModalOpen(false);
        })
        .catch((err) => {
          console.error("Update error:", err);
          alert("Failed to update event.");
        });
    } else {
      //  Add new event
      fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          const newEvt = {
            id: data.id,
            title,
            start: `${selectedDate}T${time}`,
            color,
          };
          setEvents((prev) => [...prev, newEvt]);
          setModalOpen(false);
        })
        .catch((err) => {
          console.error("Add error:", err);
          alert("Failed to add event.");
        });
    }
  };

  //  Delete event
  const handleDeleteEvent = (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updated = events.filter((e) => e.id !== id);
        setEvents(updated);
        setModalOpen(false);
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Failed to delete event.");
      });
  };

  return (
    <div className=" min-h-screen bg-gray-100">
        <main className="p-4 sm:p-6 md:p-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
              Event Management
            </h2>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              events={events}
              editable={true}
              selectable={true}
              height="70vh"
              aspectRatio={1.7}
              eventDisplay="block"
              dayMaxEventRows={3}
            />

            {modalOpen && (
              <EventModal
                selectedDate={selectedDate}
                eventData={selectedEvent}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
              />
            )}
          </div>
        </main>
      </div>
  );
};

export default EventManagement;
