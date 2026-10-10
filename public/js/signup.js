// import axios from 'axios';
// import { showAlert } from './alerts';

// export const signup = async (name, email, password, passwordConfirm) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/v1/users/signup',
//       data: {
//         name,
//         email,
//         password,
//         passwordConfirm
//       }
//     });

//     if (res.data.status === 'success') {
//         console.log('Signup response:', res.data);
//         alert('Signup success reached!');
//       showAlert('success', 'Account created successfully 🎉');

//       // window.setTimeout(() => {
//       //   location.assign('/');
//       // }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response?.data?.message || 'Something went wrong');
//   }
// };


import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    // if (res.data.status === 'success') {
    //   console.log('SIGNUP SUCCESS ✅');
    //   console.log(res.data);

    //   showAlert('success', 'Account created successfully 🎉');

    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    // }
    if (res.data.status === 'success') {
      console.log('SIGNUP SUCCESS ✅');

      showAlert('success', 'Account created successfully 🎉');

      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Something went wrong'
    );
  }
};