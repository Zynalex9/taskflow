import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CalendarStyles.css";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  labels?: string[];
  allDay?: boolean;
  boardId: string;
  listId: string;
}

const CustomToolbar = (toolbar: any) => {
  const navigate = (action: string) => {
    toolbar.onNavigate(action);
  };

  const view = (viewName: View) => {
    toolbar.onView(viewName);
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => navigate("PREV")}>
          Back
        </button>
        <button type="button" onClick={() => navigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => navigate("NEXT")}>
          Next
        </button>
      </span>

      <span className="rbc-toolbar-label">{toolbar.label}</span>

      <span className="rbc-btn-group">
        <button
          type="button"
          className={toolbar.view === "month" ? "rbc-active" : ""}
          onClick={() => view("month")}
        >
          Month
        </button>
        <button
          type="button"
          className={toolbar.view === "week" ? "rbc-active" : ""}
          onClick={() => view("week")}
        >
          Week
        </button>
        <button
          type="button"
          className={toolbar.view === "day" ? "rbc-active" : ""}
          onClick={() => view("day")}
        >
          Day
        </button>
        <button
          type="button"
          className={toolbar.view === "agenda" ? "rbc-active" : ""}
          onClick={() => view("agenda")}
        >
          Agenda
        </button>
      </span>
    </div>
  );
};

const CalendarPage = () => {
  const { workspaceId } = useParams();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const navigator = useNavigate();
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(
          `http://${
            import.meta.env.VITE_BASE_URL
          }/api/workspace/${workspaceId}/get-calendar-data`,
          { withCredentials: true }
        );

        const formattedEvents = response.data.calenderData.map((card: any) => ({
          id: card._id,
          title: card.name,
          start: new Date(card.endDate),
          end: new Date(card.endDate),
          labels: card.labels || [],
          boardId: card.boardId,
          listId: card.listId,
          allDay: true,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [workspaceId]);
  const handleEventClick = (event: CalendarEvent) => {
    navigator(`/user/w/workspace/${workspaceId}/board/${event.boardId}`);
  };
  if (loading)
    return (
      <div className="lg:p-4 h-[calc(100vh-100px)] pb-10 flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-700 rounded mb-4" />
        <div className="h-6 w-1/4 bg-gray-700 rounded mb-2" />
        <div className="h-96 w-full bg-gray-700 rounded" />
      </div>
    );

  return (
    <div className="lg:p-4 h-[calc(100vh-100px)] pb-10 ">
      <div className="text-2xl text-white font-bold mb-4">Calendar View</div>
      <div style={{ height: "500px" }} className="pb-10">
        <Calendar
          onSelectEvent={handleEventClick}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          views={["month", "week", "day", "agenda"]}
          components={{
            toolbar: CustomToolbar,
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.labels?.length ? "#4CAF50" : "#3174ad",
              borderRadius: "4px",
              border: "none",
              color: "white",
              padding: "2px 5px",
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
