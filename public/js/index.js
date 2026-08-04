import '@babel/polyfill';
import { login , logout} from './login';
import { updateSettings} from './updateSettings';
// import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { signup } from './signup';


const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
// const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');
// const editTourForm = document.getElementById('editTourForm');




if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        //VAlues
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
    login(email, password);     // call login function from login.js
    });
}

if(logOutBtn)   logOutBtn.addEventListener('click',logout); // call logout function from login.js

if(userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form);


        updateSettings(form, 'data');
    });

if(userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        // to change the innerhtml in button
        document.querySelector('.btn--save-password').textContent =
          'Updating..';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings(
            {
                passwordCurrent, password , passwordConfirm        // pass data in function 
            },
            'password'                // type of data 
        );

        // to reset innerhtml text in button
        document.querySelector('.btn--save-password').textContent = 'Save password';
        // to reset values and remove it from input labels 
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

    // if (bookBtn)
    //     bookBtn.addEventListener('click', e => {
    //         e.target.textContent = 'Processing...';
    //         const {tourId} = e.target.dataset;
    //         bookTour(tourId);
    // });


    
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);


if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}




// document.getElementById('editTourForm').addEventListener('submit', async e => {
//   e.preventDefault();

//   const id = e.target.dataset.id;

//   const formData = new FormData(e.target);

//   const res = await fetch(`/api/v1/tours/${id}`, {
//     method: 'PATCH',
//     body: formData
//   });

//   const data = await res.json();
//   console.log(data);
// });