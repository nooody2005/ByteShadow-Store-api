
export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if(el)  el.parentElement.removeChild(el);

};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
    hideAlert();    //to hide all alerts before show new alert
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000); //hide the new alert after 5 sec
};