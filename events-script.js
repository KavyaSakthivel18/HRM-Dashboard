let events = [];

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
  const res = await fetch("data.json");
  const data = await res.json();
  events = data.events;
  renderEvents();
}

function addEvent() {
  events.push({
    id: Date.now(),
    title: eventTitle.value,
    status: "Pending"
  });
  renderEvents();
}

function renderEvents() {
  const tbody = document.querySelector("#eventTable tbody");
  tbody.innerHTML = "";
  events.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.title}</td>
        <td>${e.status}</td>
        <td>
          <button onclick="approveEvent(${e.id})">Approve</button>
          <button onclick="denyEvent(${e.id})">Deny</button>
        </td>
      </tr>`;
  });
}

function approveEvent(id) {
  events.find(e => e.id === id).status = "Approved";
  renderEvents();
}

function denyEvent(id) {
  events.find(e => e.id === id).status = "Denied";
  renderEvents();
}