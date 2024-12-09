const calcForm = document.querySelector("#login-form");

const startInp = document.querySelector("#login-form #start");
const endInp = document.querySelector("#login-form #end");
const exceptTInp = document.querySelector("#login-form #exceptT");
const exceptLTInp = document.querySelector("#login-form #exceptLT");

const exceptResult = document.querySelector("#exceptResult");
const restTime = document.querySelector("#restTime");
const result = document.querySelector("#result");



// const HIDDEN_CLASSNAME = "hidden"; // string만 담기면 대문자로만 변수명 작성하는 관습
const USERNAME_KEY = "savedData";


const savedUsername = localStorage.getItem(USERNAME_KEY);


if (savedUsername === null) {
    // show the form
    // calcForm.classList.remove(HIDDEN_CLASSNAME);
    calcForm.addEventListener("submit", onLoginSubmit);
    console.log("started")
} else {
    // show the greetings
    // paintGreetings(savedUsername);
}

function onLoginSubmit(event) {
    event.preventDefault(); // 함수의 기본 동작 막음
    // calcForm.classList.add(HIDDEN_CLASSNAME);
    const start = parseInt(Number(startInp.value))
    const end = parseInt(Number(endInp.value))
    const exceptT = parseInt(Number(exceptTInp.value))
    const exceptLT = parseInt(Number(exceptLTInp.value))

    const startHour = parseInt(start / 100)
    const startMinute = start % 100
    const endHour = parseInt(end / 100)
    const endMinute = end % 100

    workTime = makeTime(endHour, endMinute) - makeTime(startHour, startMinute)

    exceptTMinute = exceptT * 60000
    exceptLTMinute = exceptLT * 60000

    workTimeHour = timeFormatDate(workTime).split(":")
    workTimeMinute = parseInt(Number(workTimeHour[1]))
    workTimeHour = parseInt(Number(workTimeHour[0]))
    result.innerText = `${timeFormat(workTimeHour, workTimeMinute)}`

    ///

    isOver9 = workTimeHour >= 9
    isOver45 = (workTimeHour * 60 + workTimeMinute) < 270

    var calculatedRest = 0
    calculatedRest += isOver9 ? 60 * 60000 : 30 * 60000
    calculatedRest += isOver45 ? -30 * 60000 : 0

    restTime.innerText = `${timeFormatDate(new Date(calculatedRest))}`

    ///

    totalTime = makeTime(workTimeHour, workTimeMinute) - exceptTMinute - exceptLTMinute - calculatedRest
    exceptResult.innerText = `${timeFormatDate(new Date(totalTime))}`
    // localStorage.setItem(USERNAME_KEY, username);
}

// function paintGreetings(username) {
//     greeting.innerText = `Hello ${username}`;
//     // greeting.classList.remove(HIDDEN_CLASSNAME);
// }



function makeTime(hour, minute) {
    return new Date(`1970-01-01 ${hour}:${minute}:00 GMT+0`)
}


function timeFormat(hour, minute) {
    var aa = new Date(`1970-01-01 ${hour}:${minute}:00 GMT+0`).toUTCString().split(' ')[4];
    aa = aa.split(':')[0] + ":" + aa.split(':')[1]
    return aa
}

function timeFormatDate(date) {
    var aa = new Date(date).toUTCString().split(' ')[4];
    aa = aa.split(':')[0] + ":" + aa.split(':')[1]
    return aa
}