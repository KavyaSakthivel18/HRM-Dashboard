let events = [];

document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

async function loadEvents() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        events = [...data.events];
        localStorageEvents = JSON.parse(localStorage.getItem("eventRequests")) || [];
        allEvents = [...events, ...localStorageEvents];
        renderEventTable();
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function submitEventRequest() {
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const location = document.getElementById("eventLocation").value;
    const description = document.getElementById("eventDescription").value;

    if (!title || !date || !location || !description) {
        alert("Please fill all fields");
        return;
    }

    const newEvent = {
        id: Date.now(),
        title,
        date,
        location,
        description,
        status: "Pending"
    };

    events.push(newEvent);
    localStorage.setItem("eventRequests", JSON.stringify(events));
    alert("Event request submitted successfully!");
    clearEventForm();
    renderEventTable();
}

function renderEventTable() {
    const tbody = document.querySelector("#eventTable tbody");
    tbody.innerHTML = "";
    
    events.forEach(event => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${event.id}</td>
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td class="status-${event.status.toLowerCase()}">${event.status}</td>
            <td>
                ${event.status === "Pending" ? `
                    <button class="action-btn btn-approve" onclick="approveEvent(${event.id})">Approve</button>
                    <button class="action-btn btn-deny" onclick="denyEvent(${event.id})">Deny</button>
                ` : ''}
            </td>
        `;
    });
}

function clearEventForm() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventDescription").value = "";
}
