const appCont = document.querySelector(".app-content");
const form = document.querySelector("#form");
const submit = document.querySelector("#sub");
const welcomeMessage = document.querySelector(".welcome");
const timerName = document.querySelector("#timerName");
const timerDate = document.querySelector("#timerDate");
const body = document.body;
const userName = document.querySelector("#userName");
userName.addEventListener("change", (e) => {
    localStorage.setItem("user", e.target.value);
})

let userId = localStorage.getItem("user") || "";
userName.value = userId;

if(userId){
    welcomeMessage.innerText = `Welcome Back`
}else{
    welcomeMessage.innerText = `Welcome`;
}


form.addEventListener("submit", (e) => {
    e.preventDefault();

    
    let userDate = timerDate.value;
    let userTimerName = timerName.value;

    if(userDate === '' || userTimerName === "")return;

    const datas = {
        date: userDate,
        content: userTimerName,
    }

    addDateToLS(datas);
    e.target.reset();
    form.style.transform = `translateY(-100vh)`;
    body.style.overflow = `auto`;
})

// check if there is anything in the local and start the timer or not
window.addEventListener("load", () => {
    checkLs();
})

async function timerApp (){
    appCont.innerHTML = ``;
    const datas = getDateFromLs();

    for(let i=0; i<datas.length; i++){
        const timerCont = document.createElement("div");
        timerCont.classList.add("time-cont");

        const backUrl = await getBackground(datas[i].content);
        timerCont.style.background = `url(${backUrl})`;
        timerCont.style.backgroundPosition = 'center';
        timerCont.style.backgroundSize = "cover";
        timerCont.style.backgroundRepeat = "no-repeat";

        timerCont.innerHTML = `
            <span class="remove"><i class="fa fa-times"></i></span>
            <div class="time-name">${datas[i].content}</div>
            
            <div class="timer">

                <span class="days">
                    <span class="dayNum" id="dayNum"></span>
                    <span class="dayEl">Days</span>
                </span>

                <span class="hours">
                    <span class="hourNum"></span>
                    <span class="hourEl">Hours</span>
                </span>

                <span class="mins">
                    <span class="minNum"></span>
                    <span class="minEl">Mins</span>
                </span>

                <span class="secs">
                    <span class="secNum"></span>
                    <span class="secEl">Secs</span>
                </span>
            </div>
        `
        appCont.appendChild(timerCont);

        const secNumEl = timerCont.querySelector(".secNum");

        const hourNumEl = timerCont.querySelector(".hourNum");

        const dayNumEl = timerCont.querySelector("#dayNum");

        const minNumEl = timerCont.querySelector(".minNum");

        let index = i;
        const timeDate = datas[index].date;
        const erasedData = datas[i];
        
        const removeBtn = timerCont.querySelector(".remove");
        removeBtn.addEventListener("click", () => {
            removeDateFromLs(erasedData);
        })
        // initial call to avoid delay
        getTimer(timeDate, secNumEl, hourNumEl, dayNumEl, minNumEl)

       setInterval(getTimer, 1000, timeDate, secNumEl, hourNumEl, dayNumEl, minNumEl);

       getTimeUp();
    }
    
}

function getDateFromLs(){
    const data = JSON.parse(localStorage.getItem("data")) || [];
    return data === null ? [] : data;
}

function addDateToLS(date){
    const data = getDateFromLs();
    localStorage.setItem("data", JSON.stringify([date, ...data]));
    timerApp();
}

function removeDateFromLs(date){
    let data = getDateFromLs();
    let index;
    for(let i=0; i<data.length; i++){
        if(data[i].date === date.date && data[i].content === date.content){
            index = i;
        }
    }

    data.splice(index,1);
    localStorage.setItem("data", JSON.stringify(data));
    timerApp();
}

function getTimer(timeDate, secNumEl, hourNumEl, dayNumEl, minNumEl) {
    const date = timeDate;
    const currentDate = new Date().getTime();
    const userDate = new Date(date).getTime();
    const totalSecs = (userDate - currentDate) / 1000;
    let remainDays = Math.floor(totalSecs / 3600 / 24);
    let hours = Math.floor(totalSecs / 3600) % 24;
    let mins = Math.floor(totalSecs / 60) % 60;
    let secs = Math.floor(totalSecs % 60);

    dayNumEl.textContent = formatNum(remainDays);
    hourNumEl.textContent = formatNum(hours);
    minNumEl.textContent = formatNum(mins)
    secNumEl.innerText = formatNum(secs);

    // console.log(timerCont)

    if(hours <= 0 && remainDays <= 0 && mins <= 0 && secs <= 0){
        dayNumEl.textContent = "00";
        hourNumEl.textContent = "00";
        minNumEl.textContent = "00";
        secNumEl.textContent= "00";
        
    }
}

// function to format numbers
function formatNum(num){
    return num > 9 ? num : `0${num}`;
}

// function to create falling cards
function sprayColoredCards(cont){
    const triangle = document.createElement("div");
    triangle.classList.add("triangle");
    const star = document.createElement("div");
    star.classList.add("star")
    const parallel = document.createElement("div");
    parallel.classList.add("parallel");

    triangle.style.left = `${Math.floor(Math.random() * 100)}%`;
    triangle.style.animationDuration = Math.random() * 2.9 + 10 + "s";

    star.style.left = `${Math.floor(Math.random() * 100)}%`;
    star.style.animationDuration = Math.random() * 2.9 + 10 + "s";

    parallel.style.left = `${Math.floor(Math.random() * 100)}%`;
    parallel.style.animationDuration = Math.random() * 2.9 + 10 + "s";

    cont.append(triangle, star, parallel);

    setTimeout( () => {
        cont.removeChild(triangle);
        cont.removeChild(star);
        cont.removeChild(parallel);
    }, 17000)
}

// function get timeup cont
function getTimeUp(){

    const containers = document.querySelectorAll(".time-cont .timer .secs .secNum");

    
    let contArray = [];
    
    containers.forEach( cont => {
        if(cont.innerText <= 0){
            contArray.push(cont.parentElement.parentElement.parentElement)
        }
    })

    contArray.forEach( cont => {
        var stopper = setInterval(sprayColoredCards, 2000, cont);
        setTimeout( () => {
            clearInterval(stopper);
        }, 10000)
    })
}


// add new timer logic
const addTimer = document.querySelector("#addTimer");
addTimer.addEventListener("click", (e) => {
    form.style.transform = `translateY(0vh)`;
    form.style.transition = `transform 1s ease-in-out`
    body.style.overflow = `hidden`;
})

const removeOverFlow = document.querySelector(".removeOverFlow");
removeOverFlow.addEventListener("click", () => {
    form.style.transform = `translateY(-100vh)`;
    body.style.overflow = `auto`;
})


// check if there is anything in the todos first and run it else wait till you add one
function checkLs() {
    const data = getDateFromLs();
    data ? timerApp() : "";
}



// call api to get random image
async function getBackground(text){
    const myKey = `D5Uuj8BTp5wUzFEBuZ2hBxrN9M6op4MyZHS3puOwCO0`;
    const serverResponse = await fetch(`https://api.unsplash.com/search/photos?query=${text}&client_id=`+myKey);
    const resp = await serverResponse.json();
    const data = resp.results[0].urls.small;
    return(data);
}