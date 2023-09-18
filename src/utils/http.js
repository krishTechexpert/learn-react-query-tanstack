import {QueryClient} from '@tanstack/react-query';

//export async function fetchEvents(searchTerm) {

  // when fetch all events on page refresh then searchTerm parameters take defaults object invalid object jisky karan without find any search item then search api call with some defaults and invalida objects
  // esko rokny k liye humko signal object used kerna hoga inside findEventsSection.jsx queryFn:() => fetchEvents(searchTerm)

 // console.log(searchTerm)

  //Well, because React Query and the useQuery hook actually passes some default data
  //to this Query function [findEventsSection.jsx queryFn:() => fetchEvents(searchTerm)] you're defining here and we can see that data
  //if we simply above console log search term here.

  //solutions here

  export const queryClient = new QueryClient();


  export async function fetchEvents({signal,searchTerm,max}) {
  console.log("search",searchTerm)


  let url = 'http://localhost:3000/events';

  if(searchTerm && max){
    url += '?search=' + searchTerm + '&limit=' + max;
  }else if(searchTerm){
    url += '?search=' + searchTerm;
  } else if(max){
    url += '?limit=' + max;

  }
  
    const response = await fetch(url,{signal:signal});

    if (!response.ok) {
      const error = new Error('An error occurred while fetching the events');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const { events } = await response.json();

    return events;
  }


  export async function createNewEvent(eventData) {
    const response = await fetch(`http://localhost:3000/events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = new Error('An error occurred while creating the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const { event } = await response.json();
  
    return event;
  }

  export async function fetchSelectableImages({ signal }) {
    // benefits of signal property
    
    //1.)
    // we can used signal to cancel our api request like we we unmount/delete our component that are fetching some api
    // then our api request automatically cancelled if component unmounted
    //2.)
    // if we api request is taking too long time, it may be cancel and may be try again 


    const response = await fetch(`http://localhost:3000/events/images`, { signal });
  
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the images');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const { images } = await response.json();
  
    return images;
  }


  export async function fetchEvent({ id, signal }) {
    const response = await fetch(`http://localhost:3000/events/${id}`, { signal });
  
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const { event } = await response.json();
  
    return event;
  }
  
  
  export async function deleteEvent({ id }) {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      const error = new Error('An error occurred while deleting the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    return response.json();
  }

  export async function updateEvent({ id, event }) {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ event }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = new Error('An error occurred while updating the event');
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    return response.json();
  }