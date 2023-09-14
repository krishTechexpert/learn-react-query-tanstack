import { useRef,useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../utils/http';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';


export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm,setSearchTerm] = useState('')


  const {data,isFetching,isInitialLoading,isError,error} = useQuery({
    // to make sure that both fetchEvents as well as this queryKey are updated dynamically whenevere input state update such as searchTerm
    queryKey:['events', {search:searchTerm}], // heree we need some extra configuration
    queryFn:({signal}) => fetchEvents({signal,searchTerm}), // pass as in object
    //enabled:false as long as the  user not search anything
    enabled:!!searchTerm  // make false, the Query is disabled  and will not be sent, so the request will not be sent.
  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value)
  }
  let content= <p>Please enter a search term and to find events.</p>

  //If you are using disabled or lazy queries, you can use the isInitialLoading 
  if (isInitialLoading) {
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
