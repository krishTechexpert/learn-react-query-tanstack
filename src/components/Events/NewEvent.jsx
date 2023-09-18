import { Link, useNavigate } from 'react-router-dom';
import { InfiniteQueryObserver, useMutation} from '@tanstack/react-query';
import {createNewEvent} from "../../utils/http";
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock';
import { queryClient } from '../../utils/http';

export default function NewEvent() {
  const navigate = useNavigate();

  const {mutate,isLoading,isError,error}  =useMutation({
    mutationFn:createNewEvent,
    onSuccess:() => {
      queryClient.invalidateQueries({queryKey:['events']});
      navigate('/events')
    }
  })


  function handleSubmit(formData) {
    mutate({event:formData})
   // navigate('/events') // no matter if the mutation succeeds or fails.it will go to events page and error mssage we can show that's why we should used onSuccess , onError
  }

  return (
    <Modal onClose={() => navigate('../')}>
      

      <EventForm onSubmit={handleSubmit}>
      {isLoading && 'submitting...'}
      {!isLoading && 
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>

      {isError && <ErrorBlock title='Failed to create Event' message={error.info?.message || 'failed to create events please check your inputs and try again!'}/>}
    </Modal>
  );
}
