let employees = [];
let leaves = [];
let meetings = [];

document.addEventListener("DOMContentLoaded", loadData);

async function loadData() {
  const res = await fetch("data.json");
  const data = await res.json();

  employees = data.users;
  leaves = data.leaveRequests;
  meetings = data.meetings;

  renderEmployees();
  renderLeaves();
  renderMeetings();
}

function addEmployee() {
  const id = eid.value;
  const nameVal = name.value;
  const ageVal = age.value;
  const managerVal = manager.value;

  employees.push({ id, name: nameVal, age: ageVal, manager: managerVal });
  renderEmployees();
}

function renderEmployees() {
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";
  employees.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.name}</td>
        <td>${e.age}</td>
        <td>${e.manager}</td>
        <td><button onclick="deleteEmployee('${e.id}')">Delete</button></td>
      </tr>`;
  });
}

function deleteEmployee(id) {
  employees = employees.filter(e => e.id !== id);
  renderEmployees();
}

function addLeave() {
  const newLeave = {
    id: Date.now(),
    employeeName: empName.value,
    status: "Pending"
  };
  leaves.push(newLeave);
  renderLeaves();
}

function renderLeaves() {
  const tbody = document.querySelector("#leaveTable tbody");
  tbody.innerHTML = "";
  leaves.forEach(l => {
    tbody.innerHTML += `
      <tr>
        <td>${l.id}</td>
        <td>${l.employeeName}</td>
        <td>${l.status}</td>
        <td>
          <button onclick="approveLeave(${l.id})">Approve</button>
          <button onclick="denyLeave(${l.id})">Deny</button>
        </td>
      </tr>`;
  });
}

function approveLeave(id) {
  leaves.find(l => l.id === id).status = "Approved";
  renderLeaves();
}

function denyLeave(id) {
  leaves.find(l => l.id === id).status = "Denied";
  renderLeaves();
}

function addMeeting() {
  meetings.push({
    id: Date.now(),
    title: meetingTitle.value
  });
  renderMeetings();
}

function renderMeetings() {
  const tbody = document.querySelector("#meetingTable tbody");
  tbody.innerHTML = "";
  meetings.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.id}</td>
        <td>${m.title}</td>
        <td><button onclick="deleteMeeting(${m.id})">Delete</button></td>
      </tr>`;
  });
}

function deleteMeeting(id) {
  meetings = meetings.filter(m => m.id !== id);
  renderMeetings();
}