// DOM elements
const timeElement = document.getElementById("time");
const alarmListElement = document.getElementById("alarm-list");
const setAlarmContainer = document.getElementById("set-alarm-container");
const hourInput = document.getElementById("hour");
const minuteInput = document.getElementById("minute");
const setAlarmButton = document.getElementById("set-alarm");

// Store alarms in an array
let alarms = [];

// Function to display current time
function displayTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  timeElement.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

  // Check for triggered alarms
  checkAlarms(hours, minutes, seconds);
}

// Format time to add leading zero
function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// Update clock every second
setInterval(displayTime, 1000);

// Function to add an alarm
function addAlarm(hour, minute) {
  const alarmTime = `${formatTime(hour)}:${formatTime(minute)}`;

  // Create alarm item
  const alarmItem = document.createElement("li");
  alarmItem.classList.add("alarm-item");
  alarmItem.innerHTML = `
    <span class="alarm-time">${alarmTime}</span>
    <div class="alarm-actions">
      <button class="alarm-button start-button">Start</button>
      <button class="alarm-button stop-button">Stop</button>
      <button class="alarm-button-edit">Edit</button>
    </div>
  `;

  // Add event listeners to the start, stop, and edit buttons
  const startButton = alarmItem.querySelector(".start-button");
  const stopButton = alarmItem.querySelector(".stop-button");
  const editButton = alarmItem.querySelector(".alarm-button-edit");
  startButton.addEventListener("click", () => startAlarm(alarmTime));
  stopButton.addEventListener("click", () => stopAlarm(alarmTime));
  editButton.addEventListener("click", () => editAlarm(alarmTime));

  // Append the alarm item to the alarm list
  alarmListElement.appendChild(alarmItem);

  // Add the alarm to the alarms array
  alarms.push({ time: alarmTime, item: alarmItem, intervalId: null });
}

// Function to start an alarm
function startAlarm(alarmTime) {
  const alarm = alarms.find((alarm) => alarm.time === alarmTime);
  alarm.intervalId = setInterval(() => checkAlarmStart(alarmTime), 1000);

  // Change the color of the start button to green
  const startButton = alarm.item.querySelector(".start-button");
  startButton.classList.add("btn-success");
  startButton.classList.remove("btn-primary");

  // Disable the start button
  startButton.disabled = true;

  // Enable the stop button
  const stopButton = alarm.item.querySelector(".stop-button");
  stopButton.disabled = false;
}

// Function to stop an alarm
function stopAlarm(alarmTime) {
  const alarm = alarms.find((alarm) => alarm.time === alarmTime);
  alarm.item.classList.remove("active");

  // Pause the alarm sound
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause();
  alarmSound.currentTime = 0;

  // Change the color of the start button back to blue
  const startButton = alarm.item.querySelector(".start-button");
  startButton.classList.remove("btn-success");
  startButton.classList.add("btn-primary");

  // Enable the start button
  startButton.disabled = false;

  // Disable the stop button
  const stopButton = alarm.item.querySelector(".stop-button");
  stopButton.disabled = true;
}

// Function to edit an alarm
function editAlarm(alarmTime) {
  const alarm = alarms.find((alarm) => alarm.time === alarmTime);
  const hourInput = document.getElementById("hour");
  const minuteInput = document.getElementById("minute");

  // Extract hour and minute from alarm time
  const [hour, minute] = alarmTime.split(":").map((timePart) => parseInt(timePart));

  // Set the input fields with the alarm time for editing
  hourInput.value = hour;
  minuteInput.value = minute;

  // Remove the alarm from the list
  alarmListElement.removeChild(alarm.item);

  // Filter out the alarm from the alarms array
  alarms = alarms.filter((a) => a.time !== alarmTime);
}

// Function to check if it's time to start the alarm
function checkAlarmStart(alarmTime) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const [alarmHour, alarmMinute] = alarmTime.split(":").map(Number);

  if (currentHour === alarmHour && currentMinute === alarmMinute) {
    // Trigger the alarm sound
    const alarmSound = document.getElementById("alarm-sound");
    alarmSound.play();

    // Clear the interval to stop checking for alarm start
    const alarm = alarms.find((alarm) => alarm.time === alarmTime);
    clearInterval(alarm.intervalId);
  }
}

// Function to check for triggered alarms
function checkAlarms(currentHour, currentMinute, currentSecond) {
  const currentTime = `${formatTime(currentHour)}:${formatTime(currentMinute)}:${formatTime(currentSecond)}`;
  alarms.forEach((alarm) => {
    if (alarm.time === currentTime) {
      startAlarm(alarm.time);
    }
  });
}

// Event listener for set alarm button
setAlarmButton.addEventListener("click", () => {
  const hour = parseInt(hourInput.value);
  const minute = parseInt(minuteInput.value);
  if (!isNaN(hour) && !isNaN(minute)) {
    addAlarm(hour, minute);
    hourInput.value = "";
    minuteInput.value = "";
  }
});
