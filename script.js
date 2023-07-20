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
    </div>
  `;

  // Add event listeners to the start and stop buttons
  const startButton = alarmItem.querySelector(".start-button");
  const stopButton = alarmItem.querySelector(".stop-button");
  startButton.addEventListener("click", () => startAlarm(alarmTime));
  stopButton.addEventListener("click", () => stopAlarm(alarmTime));

  // Append the alarm item to the alarm list
  alarmListElement.appendChild(alarmItem);

  // Add the alarm to the alarms array
  alarms.push({ time: alarmTime, item: alarmItem, intervalId: null });
}

// Function to start an alarm
function startAlarm(alarmTime) {
  const alarm = alarms.find((alarm) => alarm.time === alarmTime);
  alarm.item.classList.add("active");
  window.alert(`Alarm set ${alarmTime}`)
  const startButton = alarm.item.querySelector(".start-button");
  startButton.classList.add("alarm-button-active");
  console.log("hello")
  // Check if the alarm is not already running
  if (alarm.intervalId === null) {
    console.log("at here")
    const checkAlarm = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentAlarmTime = `${formatTime(currentHour)}:${formatTime(currentMinute)}`;
      if (currentAlarmTime === alarmTime) {
        // Trigger the alarm sound
        const alarmSound = document.getElementById("alarm-sound");
        alarmSound.play();
      }
    }, 1000);
  
    // Save the interval ID to stop the alarm later
    alarm.intervalId = checkAlarm;
  }
}

// Function to stop an alarm
function stopAlarm(alarmTime) {
  const alarm = alarms.find((alarm) => alarm.time === alarmTime);
  alarm.item.classList.remove("active");
  const startButton = alarm.item.querySelector(".start-button");
  startButton.classList.remove("alarm-button-active");
  // Pause the alarm sound
  const alarmSound = document.getElementById("alarm-sound");
  alarmSound.pause();
  alarmSound.currentTime = 0;

  // Clear the interval to stop checking the alarm time
  clearInterval(alarm.intervalId);
  alarm.intervalId = null;
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
