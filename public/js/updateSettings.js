import axios from 'axios';
import { showAlert } from './alerts';

// export const updateData = async (name , email)  => {
   
//     try {
//       const res = await axios({
//         method: 'PATCH',
//         url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
//         data: {
//           name,
//           email
//         }
//       });

//       if (res.data.status === 'success') {
//         showAlert('success', 'Logged in successfully');
//       }
//     } catch (err) {
//       showAlert('error', err.response.data.message);
//     }

// }



// update type is either password or data 
export const updateSettings = async (data , type) => {

    console.log('DATA:', data);
    console.log('password:', data.password);
    console.log('passwordConfirm:', data.passwordConfirm);
  

  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword' 
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url ,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully ^_^`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};





