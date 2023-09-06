import {useQuery} from "@tanstack/react-query";
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

import {fetchEvents} from "../../utils/http";

export default function NewEventsSection() {
  
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['events'], // yha perr key ka name kuch bi ly sekty ho ineffects 
    queryFn:fetchEvents // return promise
  })

let content;
  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'failed to fetch Events' } />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
