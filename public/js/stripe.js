// import axios from 'axios';
// import {showAlert} from './alerts';

// const stripe = Stripe(
//   'pk_test_51TmC4d6hhWlOMdzdbchsZoCk4jIByNb4NKygXarxXbH0TqJKwHRMym44cgTlFLHMFyi1n08bFtBytqUCxWQ9dfiP00pdfyxhMa'
// ); //we use the public key in front end

// export const bookTour = async tourId => {
//     try{
//         // id coming from the tour.pug file
//         // 1) get checkout session from API
//         const session = await axios(
//           `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourId}`
//         );
      
//         console.log(session);

//         // 2) Create checkout from + charge credit card
//         await stripe.redirectToCheckout({
//             sessionId: session.data.session.id
//         });
//     } catch {
//         console.log(err);
//         showAlert('error',err);
//     }
// };
