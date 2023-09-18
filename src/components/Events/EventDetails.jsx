import React,{useState} from 'react';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from '../Header.jsx';
import { useQuery,useMutation } from '@tanstack/react-query';
import {fetchEvent,deleteEvent,queryClient} from "../../utils/http";
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Model from "../UI/Modal";


export default function EventDetails() {
  const [isDeleting,setIsDeleteing]=useState(false)
  const params= useParams();
  const navigate = useNavigate();
  const {data,isError,isLoading} =useQuery({
    queryKey:['events',params.id],
    queryFn:({signal}) => fetchEvent({signal,id:params.id}),
    retry:1 // first time request failed then ek request send to fetch and after that cancel request
  })

const {mutate,isLoading:isLoadingDeleting,isError:isDeletingError,error:deleteEventError} = useMutation({
  mutationFn:deleteEvent,
  onSuccess:() =>{
    queryClient.invalidateQueries({
      queryKey:['events'],
      //By default, all matching queries are immediately marked as invalid and active queries are refetched in the background.
    refetchType:'none' //If you do not want active queries to refetch, and simply be marked as invalid
  // after delete events then automaticallly delete events api reftech again,  which events does not exits. so in case we have to used refetchType:'none'
 //to stop it.
  })
    navigate('/events')
  }
})

function handleStartDelete(){
  setIsDeleteing(true)
}
function handleStopDelete(){
  setIsDeleteing(false)
}

function handleDeleteEvent(){
  mutate({id:params.id})
}


  return (
    <>
    {isDeleting && (
      <Model onClose={handleStopDelete}>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this event? This action can not be undone.</p>
        <div className='form-actions'>
          {isLoadingDeleting && <p>Delete Event, please wait...</p>}
          {!isLoadingDeleting && <>
          <button onClick={handleStopDelete} className="button-text">Cancel</button>
          <button onClick={handleDeleteEvent} className="button">Delete</button></>}
        </div>
        {isDeletingError && <ErrorBlock title='failed to delete event' message={deleteEventError.info?.message || 'failed to delete this event please try again'} />}
      </Model>
    )

    }
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      {isLoading && <div className='center'><LoadingIndicator/></div>}
      {isError && <ErrorBlock title='failed to fetch event details' message='events details failed' />}
      {data && <article id="event-details">
        <header>
          <h1> {data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}> {new Date(data.date).toLocaleDateString('en-US',{
                day:'numeric',
                month:'short',
                year:'numeric'
              })}:{data.time}</time>
            </div>
            <p id="event-details-description"> {data.description}</p>
          </div>
        </div>
      </article>}
    </>
  );
}
