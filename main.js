const state = {
    hour12: true,
    mode: 'clock',
    differentTime: 0,
    stopTime: 0,
    // startTime: new Date()
}

// changeClock(makeTime());

function changeTimeFormat() {
    state.hour12 = !state.hour12;
    changeClock(makeTime());
}

let interval = setInterval(() => changeClock(makeTime()), 1000)



function makeTime() {
    let d;
    switch(state.mode) {
        case 'clock':
            return new Date().toLocaleTimeString('en-us', { hour12:state.hour12 })

        case 'startStopWatch':
            d = new Date(new Date() - state.startTime);
            return `${d.getUTCHours() < 10 ? "0" + d.getUTCHours().toString() : d.getUTCHours()}:${d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes().toString() : d.getUTCMinutes()}:${d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds().toString() : d.getUTCSeconds()}`
       
        case 'resumeTimer':
            d = new Date(state.timer - new Date().getTime() + state.startTime.getTime() + state.differentTime);
            return `${d.getUTCHours() < 10 ? "0" + d.getUTCHours().toString() : d.getUTCHours()}:${d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes().toString() : d.getUTCMinutes()}:${d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds().toString() : d.getUTCSeconds()}`
        
        default: //startTimer
            d = new Date(state.timer - new Date().getTime() + state.startTime.getTime());
            return `${d.getUTCHours() < 10 ? "0" + d.getUTCHours().toString() : d.getUTCHours()}:${d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes().toString() : d.getUTCMinutes()}:${d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds().toString() : d.getUTCSeconds()}`
    }
}

function changeClock(input) {
    document.getElementById('clock').innerText = input;
}

function changeButtons() {
    switch (state.mode) {
        case 'stopWatch':
            return document.getElementById('buttons-container').innerHTML =
                `<button onclick='setClock()'>back</button>
                <button onclick='startStopWatch()' >start</button>
                `
        case 'clock':
            return document.getElementById('buttons-container').innerHTML =
                `
                <button onclick="changeTimeFormat()">24/12</button>
                <button onclick="setStopwatch()">Stopwatch</button>
                <button onclick="setTimer()">Timer</button>
                `
        case 'startStopWatch':
            return document.getElementById('buttons-container').innerHTML =
                `
                <button onclick="stopStopWatch()">Stop</button>
                <button onclick="restartStopWatch()">Restart</button>
                <button onclick='lap()'>lap</button>
                `
        case 'startTimer':
            return document.getElementById('buttons-container').innerHTML =
            `<button onclick='stopTimer()'>Stop</button>
            <button onclick='resetTimer()' >Reset</button>
            `
        case 'stopTimer':
            return document.getElementById('buttons-container').innerHTML =
            `<button onclick='resumeTimer()'>Resume</button>
            <button onclick='resetTimer()' >Reset</button>
            `
        case 'resumeTimer':
            return document.getElementById('buttons-container').innerHTML =
            `<button onclick='stopTimer()'>Stop</button>
            <button onclick='resetTimer()' >Reset</button>
            `
        default: //timer
            return document.getElementById('buttons-container').innerHTML =
                `<button onclick='setClock()'>back</button>
                <button onclick='startTimer()' >start</button>
                `
    }

}
function stopStopWatch() {
    clearInterval(interval);
    changeClock('00:00:00');
    state.mode = 'stopWatch'
    changeButtons();
    document.getElementById("laps").innerHTML =""
    document.getElementById("lap").innerHTML ="";
}
function restartStopWatch() {
    state.startTime = new Date();
    changeClock('00:00:00');
    document.getElementById("laps").innerHTML =""
    document.getElementById("lap").innerHTML ="";
}
function lap() {
    document.getElementById("lap").innerText="Laps:";
    document.getElementById("laps").innerHTML += `<li>${document.getElementById('clock').innerText}</li>`;
}
function startStopWatch() {
    clearInterval(interval);
    state.mode = 'startStopWatch';
    changeButtons();
    state.startTime = new Date();
    interval = setInterval(() => changeClock(makeTime()), 1000);
}

function setStopwatch() {
    clearInterval(interval);
    changeClock('00:00:00');
    state.mode = 'stopWatch'
    changeButtons();
}
function setClock() {
    clearInterval(interval);
    state.mode = 'clock'
    changeClock(makeTime());
    interval = setInterval(() => changeClock(makeTime()), 1000);
    changeButtons();
}

function setTimer() {
    clearInterval(interval);
    state.mode = "timer"
    document.getElementById('clock').innerHTML = `
        <input id="hours" value="00" type="number" />
        :
        <input id="minutes" value="00" type="number" />
        :
        <input id="seconds" value="00" type="number" />
    `
    changeButtons();
}

function startTimer() {
    state.mode = 'startTimer';
    changeButtons();
    state.startTime = new Date();
    state.timer = document.getElementById("hours").value * 3600000 + document.getElementById("minutes").value * 60000 + document.getElementById("seconds").value * 1000;
    changeClock(makeTime());
    interval = setInterval(() => changeClock(makeTime()), 1000);
    // let zeroTimer = document.getElementById('clock').innerText;
    // if (zeroTimer == '00:00:00'){
    //     clearInterval(interval);
    // };
}

function stopTimer () {
    clearInterval(interval);
    state.mode = 'stopTimer';
    state.stopTime = new Date().getTime();
    changeButtons();
}
function resumeTimer () {
    state.mode = 'resumeTimer';
    state.differentTime += new Date().getTime() - state.stopTime;
    changeButtons();
    interval = setInterval(() => changeClock(makeTime()), 1000);
    changeClock(makeTime());
}
function resetTimer() {
    setTimer()
    state.differentTime = 0;
}