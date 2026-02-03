const app = document.getElementById('app')
const form = document.getElementById('form')
const baseURL = "https://fullstack-community-events-hub-server-iqu8.onrender.com";


// Load events when page opens
async function loadEvents() {
  const response = await fetch(`${baseURL}/events`);
  const events = await response.json();

  app.innerHTML = "";

  events.forEach(event => {
    const div = document.createElement("div");
    div.classList.add("event-card");

    div.innerHTML = `
      <h3>${event.event_name}</h3>
      <p><strong>📍</strong> ${event.location}</p>
      <p><strong>📅</strong> ${event.event_date}</p>
      <p><strong>⏰</strong> ${event.start_time} - ${event.end_time}</p>
      <p>${event.description || ""}</p>
      <button class="edit-btn" data-id="${event.id}">Edit</button>
      <button class="attend-btn" data-id="${event.id}">
        I'm Attending
      </button>
      <p id="status-${event.id}" style="color: green;"></p>
      <hr>
    `;

    app.appendChild(div);
  });

  // Attach click events AFTER rendering
  // Attend button
  document.querySelectorAll(".attend-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const eventId = e.target.dataset.id;

     const res = await fetch(`${baseURL}/events/${eventId}/attend`, {
        method: "POST"
      });

      const data = await res.json();
      document.getElementById(`status-${eventId}`).textContent = data.message;
    });
  });
}

// Edit button
document.querySelectorAll(".edit-btn").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    const eventId = e.target.dataset.id;

    const response = await fetch(`${baseURL}/events`);
    const events = await response.json();

    const event = events.find(ev => ev.id == eventId);

    document.getElementById("event_name").value = event.event_name;
    document.getElementById("location").value = event.location;
    document.getElementById("event_date").value = event.event_date;
    document.getElementById("start_time").value = event.start_time;
    document.getElementById("end_time").value = event.end_time;
    document.getElementById("description").value = event.description;

    // storing the id 
    form.dataset.editId = eventId;
  });
});



// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newEvent = {
    event_name: document.getElementById("event_name").value,
    location: document.getElementById("location").value,
    event_date: document.getElementById("event_date").value,
    start_time: document.getElementById("start_time").value,
    end_time: document.getElementById("end_time").value,
    description: document.getElementById("description").value
  };

    const editId = form.dataset.editId;

  if (editId) {
    // Update existing event
    await fetch(`${baseURL}/events/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    });

    delete form.dataset.editId; // clearing edit mode
  } else {
    // Creating new event
    await fetch(`${baseURL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    });
  }
  form.reset();
  loadEvents();
});

// Calling this each time when page loads
loadEvents();