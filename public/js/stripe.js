import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alert';

/* eslint-disable */
// const stripe = loadStripe(
//   'pk_test_51Q2Q0NP2EPPEkDDRQsNZFiaLkGBbfCrbZGjnct0Zz5abrtv6PAkerlNXWwuFwCp25sEWTbrFaGqvTgZhIdNp7Drk008cWcXmdv',
// );
const stripe = Stripe(
  'pk_test_51Q2Q0NP2EPPEkDDRQsNZFiaLkGBbfCrbZGjnct0Zz5abrtv6PAkerlNXWwuFwCp25sEWTbrFaGqvTgZhIdNp7Drk008cWcXmdv',
);

//prettier-ignore
export const bookTour = async tourId => {
 try { // 1) Get checkout session from API
  const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)
  // console.log(session);
  

  // 2) Create checkout form + charge credit card
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id
  })
  } catch (err){
    // console.log(err);
    showAlert('error', err)
    
  }
};
