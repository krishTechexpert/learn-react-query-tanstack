import {useQuery} from "@tanstack/react-query";
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

import {fetchEvents} from "../../utils/http";

export default function NewEventsSection() {
  
  const {data,isLoading,isError,error} = useQuery({
    queryKey:['events'], // yha perr key ka name kuch bi ly sekty ho ineffects 
    queryFn:fetchEvents, // return promise
    //staleTime:0 // And the default is zero, which means  it will use data from the cache, but it will then always also send such  a Behind the Scenes request to get updated data.

     staleTime:5000,

    // If you set this to 5,000, for example,
    // it will wait for 5,000 milliseconds before sending another request.
    // So if this component was rendered and therefore this request was sent,
    // and within five seconds this component is rendered again,and the same request would need to be sent,
    // React Query would not send it if the staleTime is set to 5,000.
    //So that's the staleTime with which you can make sure that no unnecessary requests are sent.
  
    // ************************ CACHE TIME**************************************//
    //cacheTime:  1000 // 1 secs or you can defined any time default is 5 min time
               //This controls how long the data and the cache will be kept around.
               //And the default here are five minutes.
    // 1 seconds k bad cache s data remove ho jye ga..make new request if data not found in cacahe
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
