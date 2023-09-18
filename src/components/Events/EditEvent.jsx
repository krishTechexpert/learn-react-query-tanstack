import { Link, useNavigate,useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import {fetchEvent,queryClient,updateEvent} from "../../utils/http";
import { useQuery,useMutation } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';


export default function EditEvent() {
  const navigate = useNavigate();
  const params= useParams();

  const {data,isLoading,isError,error} = useQuery({
    queryKey:['events',params.id],
    queryFn:({signal}) =>fetchEvent({signal,id:params.id})
  })

  const {mutate} = useMutation({
    mutationFn:updateEvent,
    // onSuccess:() =>{
    //   queryClient.invalidateQueries()
    // }
    //hum yha per other way learn kergy how we can update state instantly in UI sync without onSuccess
    // Optimistic Updating concept 3 step need it
    /* 1. Stop the queries that may affect this operation */
    /* 2. Modify cache to reflect this optimistic update */
    /* 3. Return a snapshot so we can rollback in case of failure */

    omMutate: async (data) => {
      const newEvent=data.event;
      // 1.) Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
     // Stop the queries that may affect this operation
    await queryClient.cancelQueries({ queryKey: ['events',params.id] })


      //2.) Snapshot the previous value
    const previousEvent = queryClient.getQueryData(['events',params.id])

      //3.)  Modify cache to reflect this optimistic update to the new value
      queryClient.setQueryData(['events',params.id],newEvent)
      //So this will manipulate the data behind the scenes without waiting for a response(like no need for loader/spinner). But that's not all I want to do here in on mutate.
      
       // Return a context object with the snapshotted value or 
       // Return a snapshot so we can rollback in case of failure

    return { previousEvent }
   
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    //  here context refers to previousEvent
  onError: (err, data, context) => {
    queryClient.setQueryData(['events',params.id], context.previousEvent)
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['events',params.id] })
  },

  })

  // Optimistic Updating concept

  // 1.) particular event ko update ker rehy hai and hunmy event title ko empty ker diya then update button clicked
  // 2.) and backend side per humny event title[in case of edit] k liye validation lga rekha hai
  // 3.) when we click on update that in case interesting thing hony wali hai
  // 4.) it means our update fails and it will show old event title in UI  [ rollback ker dekga yhi kaam kerta hai optimistic update concept]
  // 5.) https://ilxanlar.medium.com/better-ux-with-optimistic-ui-b72665e1afdf
  function handleSubmit(formData) {
    mutate({id:params.id,event:formData})
    navigate('../')
  }

  function handleClose() {
    navigate('../'); // upcoming page/level such as details page
  }
  let content;
  if(isLoading){
    content=<div className='center'>
      <LoadingIndicator/>
    </div>
  }
  if(isError){
    content=<>
      <ErrorBlock title="failed to edit events" message={error.info?.message || 'failed to load event please try again'}/>
      <div className='form-actions'><Link to="../" className='button'>Okay</Link></div>
      </>
  }
  if(data){
    content= <EventForm inputData={data} onSubmit={handleSubmit}>
                <Link to="../" className="button-text">
                  Cancel
                </Link>
                <button type="submit" className="button">
                  Update
                </button>
            </EventForm>
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
