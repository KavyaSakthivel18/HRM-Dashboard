// EmailJS Configuration - Replace with your actual credentials
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

let allData = {};
let savedUsers = [];
let leaveRequests = [];
let meetings = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    fetchingAdata();
});

// Load data from data.json
async function loadData() {
    try {
        const response = await fetch('./data.json');
        allData = await response.json();
        leaveRequests = [...allData.leaveRequests];
        meetings = [...allData.meetings];
        savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || [];
        renderLeaveTable();
        renderMeetingTable();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Employee Management Functions
function saveEData() {
    const eid = document.getElementById("eid").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const manager = document.getElementById("manager").value;

    if (!eid || !name || !age || !manager) {
        alert("Please fill all fields");
        return;
    }

    const newUser = { id: eid, name, age, manager };
    
    if (savedUsers.find(u => u.id === eid)) {
        alert("Employee ID already exists!");
        return;
    }

    savedUsers.push(newUser);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
    alert("Employee added successfully!");
    clearForm();
    fetchingAdata();
}

function clearForm() {
    document.getElementById("eid").value = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("manager").value = "";
}

// Leave Request Functions
function submitLeaveRequest() {
    const empName = document.getElementById("empName").value;
    const empId = document.getElementById("empId").value;
    const leaveType = document.getElementById("leaveType").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const reason = document.getElementById("reason").value;

    if (!empName || !empId || !leaveType || !fromDate || !toDate || !reason) {
        alert("Please fill all fields");
        return;
    }

    const newRequest = {
        id: leaveRequests.length ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 101,
        employeeName: empName,
        employeeId: empId,
        leaveType,
        fromDate,
        toDate,
        reason,
        status: "Pending"
    };

    leaveRequests.push(newRequest);
    localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
    alert("Leave request submitted successfully!");
    clearLeaveForm();
    renderLeaveTable();
    sendLeaveNotification(newRequest);
}

function approveLeave(requestId) {
    const request = leaveRequests.find(r => r.id === requestId);
    if (request) {
        request.status = "Approved";
        localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
        renderLeaveTable();
        sendLeaveResponse(request, "Approved");
    }
}

function denyLeave(requestId) {
    const request = leaveRequests.find(r => r.id === requestId);
    if (request) {
        request.status = "Denied";
        localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
        renderLeaveTable();
        sendLeaveResponse(request, "Denied");
    }
}

function clearLeaveForm() {
    document.getElementById("empName").value = "";
    document.getElementById("empId").value = "";
    document.getElementById("leaveType").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("reason").value = "";
}

function renderLeaveTable() {
    const tbody = document.querySelector("#leaveTable tbody");
    tbody.innerHTML = "";
    
    leaveRequests.forEach(request => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.employeeName} (${request.employeeId})</td>
            <td>${request.leaveType}</td>
            <td>${request.fromDate} to ${request.toDate}</td>
            <td>${request.reason}</td>
            <td class="status-${request.status.toLowerCase()}">${request.status}</td>
            <td>
                ${request.status === "Pending" ? `
                    <button class="action-btn btn-approve" onclick="approveLeave(${request.id})">Approve</button>
                    <button class="action-btn btn-deny" onclick="denyLeave(${request.id})">Deny</button>
                ` : ''}
                <button class="action-btn btn-delete" onclick="deleteLeave(${request.id})">Delete</button>
            </td>
        `;
    });
}

// Meeting Functions
function scheduleMeeting() {
    const title = document.getElementById("meetingTitle").value;
    const date = document.getElementById("meetingDate").value;
    const time = document.getElementById("meetingTime").value;
    const organizer = document.getElementById("organizer").value;
    const platform = document.getElementById("platform").value;

    if (!title || !date || !time || !organizer || !platform) {
        alert("Please fill all fields");
        return;
    }

    const newMeeting = {
        id: meetings.length ? Math.max(...meetings.map(m => m.id)) + 1 : 201,
        title,
        date,
        time,
        organizer,
        platform
    };

    meetings.push(newMeeting);
    localStorage.setItem("meetings", JSON.stringify(meetings));
    alert("Meeting scheduled successfully!");
    clearMeetingForm();
    renderMeetingTable();
    sendMeetingEmail(newMeeting);
}

function deleteMeeting(meetingId) {
    if (confirm("Are you sure you want to delete this meeting?")) {
        meetings = meetings.filter(m => m.id !== meetingId);
        localStorage.setItem("meetings", JSON.stringify(meetings));
        renderMeetingTable();
    }
}

function clearMeetingForm() {
    document.getElementById("meetingTitle").value = "";
    document.getElementById("meetingDate").value = "";
    document.getElementById("meetingTime").value = "";
    document.getElementById("organizer").value = "";
    document.getElementById("platform").value = "";
}

function renderMeetingTable() {
    const tbody = document.querySelector("#meetingTable tbody");
    tbody.innerHTML = "";
    
    meetings.forEach(meeting => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${meeting.id}</td>
            <td>${meeting.title}</td>
            <td>${meeting.date}</td>
            <td>${meeting.time}</td>
            <td>${meeting.organizer}</td>
            <td>${meeting.platform}</td>
            <td><button class="action-btn btn-delete" onclick="deleteMeeting(${meeting.id})">Delete</button></td>
        `;
    });
}

// Email Functions
async function sendLeaveNotification(request) {
    try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_LEAVE_TEMPLATE", {
            to_email: "hr@company.com",
            employee_name: request.employeeName,
            leave_type: request.leaveType,
            from_date: request.fromDate,
            to_date: request.toDate,
            reason: request.reason
        });
        console.log("Leave notification sent!");
    } catch (error) {
        console.error("Email send failed:", error);
    }
}

async function sendLeaveResponse(request, status) {
    try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_RESPONSE_TEMPLATE", {
            to_email: "employee@company.com",
            employee_name: request.employeeName,
            status: status,
            leave_type: request.leaveType,
            from_date: request.fromDate,
            to_date: request.toDate
        });
        console.log("Leave response sent!");
    } catch (error) {
        console.error("Email send failed:", error);
    }
}

async function sendMeetingEmail(meeting) {
    try {
        await emailjs.send("YOUR_SERVICE_ID", "YOUR_MEETING_TEMPLATE", {
            title: meeting.title,
            date: meeting.date,
            time: meeting.time,
            organizer: meeting.organizer,
            platform: meeting.platform
        });
        console.log("Meeting email sent!");
    } catch (error) {
        console.error("Email send failed:", error);
    }
}

function deleteLeave(requestId) {
    if (confirm("Are you sure you want to delete this leave request?")) {
        leaveRequests = leaveRequests.filter(r => r.id !== requestId);
        localStorage.setItem("leaveRequests", JSON.stringify(leaveRequests));
        renderLeaveTable();
    }
}

// Existing employee table function (unchanged)
function CrTable(data) {
    let users = data.users;
    let count = 1;
    let table = document.getElementById("employeeTable");
    let tbody = table.querySelector("tbody");
    
    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }
    
    if (users && users.length > 0) {
        users.forEach(user => {
            let row = tbody.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
            let cell6 = row.insertCell(5);
            
            cell1.textContent = count++;
            cell2.textContent = user.id;
            cell3.textContent = user.name;
            cell4.textContent = user.age;
            cell5.textContent = user.manager;
            cell6.innerHTML = `<button class="action-btn btn-delete" onclick="deleteEmployee('${user.id}')">Delete</button>`;
        });
    }
}

function deleteEmployee(empId) {
    if (confirm("Are you sure you want to delete this employee?")) {
        savedUsers = savedUsers.filter(u => u.id !== empId);
        localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
        fetchingAdata();
    }
}

function fetchingAdata() {
    try {
        fetch("./data.json")
        .then(res => res.json())
        .then(data => {
            let savedUsersLocal = JSON.parse(localStorage.getItem("savedUsers")) || [];
            let allUsers = [...data.users, ...savedUsersLocal];
            CrTable({users: allUsers});
        })
        .catch(err => console.error(err));
    } catch (err) {
        console.error(err);
    }
}
