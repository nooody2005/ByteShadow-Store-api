import '@babel/polyfill';
import { login , logout} from './login';
import { updateSettings} from './updateSettings';
// import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { signup } from './signup';
import './painting';
import './account';

console.log('INDEX JS LOADED ✅');

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
        form.append('phone', document.getElementById('phone').value);
        form.append('country', document.getElementById('country').value);
        form.append('address', document.getElementById('address').value);
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

        // const passwordCurrent = document.getElementById('password-current').value;
        // const password = document.getElementById('password').value;
        // const passwordConfirm = document.getElementById('password-confirm').value;

        const passwordCurrent = document.querySelector(
          '.form-user-password #password-current'
        ).value;

        const password = document.querySelector('.form-user-password #password')
          .value;

        const passwordConfirm = document.querySelector(
          '.form-user-password #password-confirm'
        ).value;

        console.log('PASSWORD DATA:', {
          passwordCurrent,
          password,
          passwordConfirm
        });


        // console.log('CURRENT:', passwordCurrent);
        // console.log('NEW:', password);
        // console.log('CONFIRM:', passwordConfirm);
        // console.log('OBJECT:', {
        //   passwordCurrent: passwordCurrent,
        //   password: password,
        //   passwordConfirm: passwordConfirm
        // });

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
    console.log('SIGNUP FORM FOUND ✅');
    signupForm.addEventListener('submit', e => {
    e.preventDefault();

    console.log('SIGNUP SUBMITTED ✅');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, password, passwordConfirm);
  });
}


window.addEventListener(
  'load',
  () => {
    const textPanel = document.querySelector('.landing .overlay .text');
    const secondLogo = document.querySelector(
      '.header .container .logo img.logo-secondary'
    );

    // Text panel enters from the left
    if (textPanel) {
      setTimeout(() => {
        textPanel.classList.add('entrance-show');
      }, 300);
    }

    // Second logo enters from the right
    if (secondLogo) {
      setTimeout(() => {
        secondLogo.classList.add('entrance-show');
      }, 500);
    }
  },
  { once: true }
);



// type of ovreview
const shuffle = document.querySelector('.gallery .shuffle');
const paintingBoxes = document.querySelectorAll('.gallery-content .box');

if (shuffle && paintingBoxes.length) {
  const filters = shuffle.querySelectorAll('li');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const selectedType = filter.textContent.trim();

      // Update active filter
      filters.forEach(item => item.classList.remove('active'));
      filter.classList.add('active');

      // Filter paintings
      paintingBoxes.forEach(box => {
        const paintingType = box.dataset.type;

        const shouldShow =
          selectedType === 'All' || paintingType === selectedType;

        box.style.display = shouldShow ? '' : 'none';
      });
    });
  });
}

// more button

const galleryContent = document.querySelector('.gallery-content');
const moreBtn = document.querySelector('.gallery .more');

if (galleryContent && moreBtn) {
  const paintings = [...galleryContent.querySelectorAll('.box')];
  const initialCount = 8;
  const step = 4;

  let visibleCount = initialCount;

  function updateGallery() {
    const activeFilter = document.querySelector('.gallery .shuffle li.active');
    const selectedType = activeFilter?.textContent.trim() || 'All';

    const filteredPaintings = paintings.filter(box => {
      return selectedType === 'All' || box.dataset.type === selectedType;
    });

    paintings.forEach(box => {
      box.style.display = 'none';
    });

    filteredPaintings.forEach((box, index) => {
      if (index < visibleCount) {
        box.style.display = '';
      }
    });

    moreBtn.style.display =
      filteredPaintings.length > visibleCount ? '' : 'none';
  }

  moreBtn.addEventListener('click', () => {
    visibleCount += step;
    updateGallery();
  });

  document.querySelectorAll('.gallery .shuffle li').forEach(filter => {
    filter.addEventListener('click', () => {
      visibleCount = initialCount;
      updateGallery();
    });
  });

  updateGallery();
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

