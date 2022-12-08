function removeHistoryElem(evt) {
    const index = evt.currentTarget.dataset.index;
    // update the DOM
    evt.currentTarget.parentElement.remove();
    // update the localStorage
    const history = JSON.parse(localStorage.getItem('form-history'));
    history.splice(index, 1);
    localStorage.setItem('form-history', JSON.stringify(history));
}

function renderItem(name, value) {
    const item = document.createElement('p');
    item.classList.add(`card-${name}`);
    item.innerText = value;

    return item;
}

function renderHistoryElem(data, index) {
    const elem = document.createElement('div');
    elem.classList.add('submit-history-card');

    Object.entries(data).forEach(([key, value]) => {
        elem.append(renderItem(key, value));
    });

    const button = document.createElement('button');
    button.innerText = 'Delete';
    button.classList.add('delete-button', 'button');
    button.dataset.index = index;
    button.addEventListener('click', removeHistoryElem);
    elem.append(button);

    return elem;
}

const historyContainer = document.querySelector('#history');

function updateHistory() {
    let oldHistoryStr = '[]';

    // only update the DOM when localStorage attribute 'form-history' changes
    return function() {
        const updatedHistoryStr = localStorage.getItem('form-history');
        if (oldHistoryStr === updatedHistoryStr) {
            return;
        }

        // update the DOM
        const history = JSON.parse(updatedHistoryStr);
        const frag = new DocumentFragment;
        history.forEach((data, index) => {
            frag.prepend(renderHistoryElem(data, index))
        });
        historyContainer.replaceChildren(frag);
    }
}

// create the localStorage item if it doesn't already exist (for safety)
if (!localStorage.getItem('form-history')) {
    localStorage.setItem('form-history', '[]');
}
// render the history for the first time
const update = updateHistory();
update();
// re-render the history every time localStorage changes
window.addEventListener('storage', update);
