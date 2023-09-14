//export async function fetchEvents(searchTerm) {

  // when fetch all events on page refresh then searchTerm parameters take defaults object invalid object jisky karan without find any search item then search api call with some defaults and invalida objects
  // esko rokny k liye humko signal object used kerna hoga inside findEventsSection.jsx queryFn:() => fetchEvents(searchTerm)

 // console.log(searchTerm)

  //Well, because React Query and the useQuery hook actually passes some default data
  //to this Query function [findEventsSection.jsx queryFn:() => fetchEvents(searchTerm)] you're defining here and we can see that data
  //if we simply above console log search term here.

  //solutions here

  export async function fetchEvents({signal,searchTerm}) {
  console.log("search",searchTerm)


  let url = 'http://localhost:3000/events';

  if(searchTerm){
    url += '?search=' + searchTerm
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