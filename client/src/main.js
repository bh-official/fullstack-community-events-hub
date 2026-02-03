const app = document.getElementById("app");
const form = document.getElementById("form");
const baseURL = "https://fullstack-community-events-hub-server-iqu8.onrender.com";

let editingID = null;
// Load events when page opens
async function loadEvents() {
  const response = await fetch(`${baseURL}/events`);
  const events = await response.json();

  app.innerHTML = "";

  events.forEach((event) => {
    const div = document.createElement("div");
    div.classList.add("event-card");

    const title = document.createElement("h3");
    title.textContent = event.event_name;

    const location = document.createElement("p");
    location.textContent = event.location;

    const date = document.createElement("p");
    date.textContent = event.event_date;

    const time = document.createElement("p");
    time.textContent = `${event.start_time} - ${event.end_time}`;

    const description = document.createElement("p");
    description.textContent = event.description || "";

    const attendees = document.createElement("span");
    attendees.classList.add("attendee-badge");

    const attendingList = event.attending_users || "";
    const count = attendingList ? attendingList.split(",").length : 0;
    attendees.textContent = `👥 ${count} attending`;


    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.dataset.id = event.id;

    const attendBtn = document.createElement("button");
    attendBtn.textContent = "I'm Attending";
    attendBtn.classList.add("attend-btn");
    attendBtn.dataset.id = event.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.id = event.id;


    const status = document.createElement("p");
    status.id = `status-${event.id}`;

    div.append(
      title,
      attendees,
      location,
      date,
      time,
      description,
      editBtn,
      attendBtn,
      deleteBtn,
      status,
    );

    app.appendChild(div);
  });

  // Attach click events AFTER rendering
  // Attend button
  document.querySelectorAll(".attend-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;

      const res = await fetch(`${baseURL}/events/${eventId}/attend`, {
        method: "POST",
      });

      const data = await res.json();
      document.getElementById(`status-${eventId}`).textContent = data.message;
      loadEvents(); 
    });
  });

  // Edit button
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;
      console.log("EDIT CLICKED FOR:", eventId); 
      editingID = eventId;

      const response = await fetch(`${baseURL}/events`);
      const events = await response.json();

      const event = events.find((ev) => ev.id == eventId);

      document.getElementById("event_name").value = event.event_name;
      document.getElementById("location").value = event.location;
      // document.getElementById("event_date").value = event.event_date;
      document.getElementById("event_date").value = new Date(event.event_date).toISOString().split("T")[0];
      document.getElementById("start_time").value = event.start_time;
      document.getElementById("end_time").value = event.end_time;
      document.getElementById("description").value = event.description;

      // storing the id
      // form.dataset.editId = eventId;
    });
  });
  
  // Delete button
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;

      const confirmDelete = confirm("Are you sure you want to delete this event?");
      if (!confirmDelete) return;

      await fetch(`${baseURL}/events/${eventId}`, {
        method: "DELETE",
      });

      loadEvents(); // refresh list after delete
    });
  });

}

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEvent = {
    event_name: document.getElementById("event_name").value,
    location: document.getElementById("location").value,
    event_date: document.getElementById("event_date").value,
    start_time: document.getElementById("start_time").value,
    end_time: document.getElementById("end_time").value,
    description: document.getElementById("description").value,
  };

  // const editId = form.dataset.editId;

  if (editingID) {
    // Update existing event
    await fetch(`${baseURL}/events/${editingID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    editingID = null;
    // delete form.dataset.editId; // clearing edit mode
  } else {
    // Creating new event
    await fetch(`${baseURL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
  }
  form.reset();
  loadEvents();
});

// Calling this each time when page loads
loadEvents();
