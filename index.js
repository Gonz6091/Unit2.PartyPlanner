// A user enters the website and finds a list of the names, dates, times, locations, and descriptions of all the parties that are happening.

// Next to each party in the list is a delete button. The user clicks the delete button for one of the parties. That party is then removed from the list.

// There is also a form that allows the user to enter information about a new party that they want to schedule. 

// After filling out the form and submitting it, the user observes their party added to the list of parties.

//Rubric:
// 1. Fetch is used correctly to GET party data from the API.
// 2. Fetch is used correctly to POST a new party to the API.
// 3. Fetch is used correctly to DELETE a party from the API.
// 4. The app contains a list of the names, dates, times, locations, and descriptions of all parties.
// 5. Each party in the list has a delete button which removes the party when clicked.
// 6. The app contains a     form that allows a user to enter information about a party and add it to the list.
// 7. The DOM is dynamically rendered according to data stored in state.
// 8. The data stored in state is updated to stay in sync with the API.

const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2503-FTB-ET-WEB-AM/events';

const state = {
    parties: [],
}

console.log(state.parties);

const fetchAllParties = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log(data);

        state.parties = Array.isArray(data.data.events) ? data.data.events : [];
        renderParties();
    } catch (error) {
        console.error('Error fetching parties:', error);
        state.parties = [];
    }
}


const createNewParty = async (name, date, time, location, description) => {
    try {
        const formattedDateTime = new Date(`${date}T${time}`).toISOString();

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                date: formattedDateTime,
                location,
                description,
            }),
        });
        const data = await response.json();
        console.log(data);

        if (data?.data) {
            state.parties.push(data.data);
            renderParties();
        } else {
            console.error(`Unexpected API response structure:`, data);
        }

    } catch (error) {
        console.error('Error creating party:', error);
    }
}



const deleteParty = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        state.parties = state.parties.filter(party => party.id !== id);
        renderParties();
    } catch (error) {
        console.error('Error deleting party:', error);
    }
}

const renderParties = () => {
    const partyList = document.getElementById('parties');
    partyList.innerHTML = '';

    if (!state.parties || !Array.isArray(state.parties)) {
        console.error("state.parties is undefined or not an array");
        return;
    }

    state.parties.forEach(party => {
        const formattedDate = new Date(party.date).toLocaleString();
        const partyItem = document.createElement('li');
        partyItem.innerHTML = `
            <strong>${party.name}</strong> - ${new Date(party.date).toLocaleString()} at ${party.location}<br>
            <p>${party.description}</p>
            <button class="delete-button" data-id="${party.id}">Delete</button>
        `;
        partyList.appendChild(partyItem);
        const deleteButton = partyItem.querySelector('.delete-button');
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteParty(party.id);
        });
    });
}

const addlistenerToForm = () => {
    const form = document.getElementById('party-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = form.elements['name'].value;
        const date = form.elements['date'].value;
        const time = form.elements['time'].value;
        const location = form.elements['location'].value;
        const description = form.elements['description'].value;

        createNewParty(name, date, time, location, description);
        form.reset();
    });
}

const init = async () => {
    await fetchAllParties();
    addlistenerToForm();
}

init();

