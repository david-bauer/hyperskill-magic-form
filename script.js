function saveDataOnKeyPress(evt) {
    const data = JSON.parse(localStorage.getItem('form-data') ?? '{}');
    data[evt.currentTarget.getAttribute('name')] = evt.currentTarget.value;
    localStorage.setItem('form-data', JSON.stringify(data));
}

function updateForm() {
    // read data from the DOM
    const data = {};
    document.querySelectorAll('input').forEach(element => {
        data[element.getAttribute('name')] = element.value;
    });
    // compare data on the DOM to data saved to localStorage
    const savedDataStr = localStorage.getItem('form-data') ?? '{}';
    if (JSON.stringify(data) === savedDataStr) {
        return
    }
    // update DOM if the data differs
    const savedData = JSON.parse(savedDataStr);
    const formElem = document.querySelector('form');
    Object.entries(savedData).forEach(([key, value]) => {
        // don't change input form elements the user is actively editing
        const target = formElem.querySelector(`input[name=${key}]:not(:focus)`);
        if (target) {
            target.value = value;
        }
    });
}

// create the localStorage item if it doesn't already exist (for safety)
if (!localStorage.getItem('form-data')) {
    localStorage.setItem('form-data', '{}');
}
// update the form for the first time and every time localStorage changes
updateForm()
window.addEventListener('storage', updateForm)


// add event listeners to input elements
document.querySelectorAll('input').forEach(element => {
    element.addEventListener('keyup', saveDataOnKeyPress);
});

// add form submit functionality
document.querySelector('form').addEventListener('submit', evt => {
    evt.preventDefault();

    // save all form values to a variable
    const data = {};
    document.querySelectorAll('input').forEach(element => {
        data[element.getAttribute('name')] = element.value;
    });

    // concatenate the current history
    const history = JSON.parse(localStorage.getItem('form-history')) ?? [];
    history.push(data);

    // convert the variable to JSON and save to localStorage
    localStorage.setItem('form-history', JSON.stringify(history));

    // reset the form
    evt.currentTarget.reset();
    localStorage.setItem('form-data', '{}');
});