const upcomingDiv = document.getElementById("upcoming");
const pastDiv = document.getElementById("past");
const statusPrefix = "status-";

const form = document.getElementById("form");
const baseURL = "https://fullstack-community-events-hub.onrender.com";

let editingID = null;

// Load events when page opens

async function loadEvents() {
  const response = await fetch(`${baseURL}/events`);
  const events = await response.json();

  const today = new Date().toISOString().split("T")[0];

  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today);

  renderEvents(upcoming, upcomingDiv, "upcoming");
  renderEvents(past, pastDiv, "past");
}

function renderEvents(events, container, type) {
  container.innerHTML = "";

  events.forEach((event) => {
    const div = document.createElement("div");
    div.classList.add("event-card");

    const title = document.createElement("h3");
    title.textContent = event.event_name;

    const attendees = document.createElement("span");
    attendees.classList.add("attendee-badge");

    const attendingList = event.attending_users || "";
    const count = attendingList
      ? attendingList
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean).length
      : 0;

    attendees.textContent =
      type === "past" ? `👥 ${count} attended` : `👥 ${count} attending`;

    const location = document.createElement("p");
    location.textContent = event.location;

    const date = document.createElement("p");
    const formattedDate = new Date(event.event_date).toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
    date.textContent = formattedDate;

    const time = document.createElement("p");
    const formatTime = (t) => {
      return t.slice(0, 5); // keeps only HH:MM and removes :SS
    };

    time.textContent = `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`;

    const description = document.createElement("p");
    description.textContent = event.description || "";

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
    status.id = `${statusPrefix}${event.id}`;

    div.append(title, attendees, location, date, time, description);

    // Only show Edit + Attend for upcoming events
    if (type === "upcoming") {
      div.append(editBtn, attendBtn);
    }

    // Always allow delete (even for past)
    div.append(deleteBtn, status);

    container.appendChild(div);
  });

  attachEventListeners();
}

function attachEventListeners() {
  // Attend button
  document.querySelectorAll(".attend-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;

      const res = await fetch(`${baseURL}/events/${eventId}/attend`, {
        method: "POST",
      });
      const data = await res.json();
      document.getElementById(`${statusPrefix}${eventId}`).textContent =
        data.message;

      loadEvents();
    });
  });

  // Edit button
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;
      editingID = eventId;

      const response = await fetch(`${baseURL}/events`);
      const events = await response.json();
      const event = events.find((ev) => ev.id == eventId);

      document.getElementById("event_name").value = event.event_name;
      document.getElementById("location").value = event.location;
      document.getElementById("event_date").value = new Date(event.event_date)
        .toISOString()
        .split("T")[0];
      document.getElementById("start_time").value = event.start_time;
      document.getElementById("end_time").value = event.end_time;
      document.getElementById("description").value = event.description;

      form.querySelector("button").textContent = "Update Event";
    });
  });

  // Delete button
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;

      if (!confirm("Are you sure you want to delete this event?")) return;

      await fetch(`${baseURL}/events/${eventId}`, {
        method: "DELETE",
      });

      loadEvents();
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

  if (editingID) {
    // Update existing event
    await fetch(`${baseURL}/events/${editingID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    editingID = null;
  } else {
    // Creating new event
    await fetch(`${baseURL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
  }
  form.reset();
  form.querySelector("button").textContent = "Enter the Event";
  loadEvents();
});

// Calling this each time when page loads
loadEvents();
