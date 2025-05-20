import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  labels?: string[];
}

const CalendarPage = () => {
  const { workspaceId } = useParams();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/workspace/${workspaceId}/get-calendar-data`,{withCredentials:true});
        const { calendarData } = response.data;
        
        const formattedEvents = calendarData.map((card: any) => ({
          id: card._id,
          title: card.name,
          start: new Date(card.endDate),
          end: new Date(card.endDate),
          labels: card.labels || [],
          allDay: true
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [workspaceId]);

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="p-4 h-[calc(100vh-100px)]">
      <div className="text-2xl font-bold mb-4">Calendar View</div>
      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.labels?.length ? '#4CAF50' : '#3174ad',
              borderRadius: '4px',
              border: 'none',
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarPage;