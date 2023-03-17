const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const container = document.querySelector(".container");
const currentMonthElement = document.querySelector(".current-month");
const daysElement = document.querySelector(".days");
const prayerTimeElements = document.querySelectorAll(".prayer-time-value");

let currentDate = new Date();

function renderCalendar() {
  // Update month and year in the header
  currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  // Clear previous days
  daysElement.innerHTML = "";

  // Calculate the number of days in the current month
  const numDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Calculate the day of the week on which the first day of the month falls
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Add blank spaces for the days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    daysElement.appendChild(dayElement);
  }

  // Add the days of the month
  for (let i = 1; i <= numDays; i++) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.textContent = i;
    daysElement.appendChild(dayElement);
  }

  // Highlight the current day
  const today = new Date();
  if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
    const currentDayElement = daysElement.querySelector(`.day:nth-child(${today.getDate() + firstDayOfMonth})`);
    currentDayElement.classList.add("current-day");
  }
}

function renderPrayerTimes(prayerTimes) {
  prayerTimeElements.forEach(element => {
    console.log(element)
    const prayerName = element.dataset.prayerName;
    const prayerTime = prayerTimes[prayerName];
    console.log(prayerTime)
    if (prayerTime) {
      element.textContent = prayerTime;
    } else {
      element.textContent = "-";
    }
  });
}

function updatePrayerTimes() {
  // Build the API URL for Dhaka
  const apiUrl = "https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1&school=0";

  // Fetch the prayer times from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const prayerTimes = data.data.timings;
      console.log(prayerTimes)
      renderPrayerTimes(prayerTimes);
    })
    .catch(error => {
      console.log("Error fetching prayer times:", error);
    });
}

// Render the calendar on page load
renderCalendar();

// Update the prayer times and current date every minute
updatePrayerTimes();
setInterval(() => {
  currentDate = new Date();
  renderCalendar();
  updatePrayerTimes();
}, 60000);
