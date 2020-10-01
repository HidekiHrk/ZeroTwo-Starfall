const maxHCap = 10;
const maxVCap = 100;

var secondsEnabled = true;

var chibiZtwoReady = true;

function getRandom(end) {
    return Math.floor(Math.random() * end);
}

function setCharacters(container, characters){
    container.innerHTML = ""; // Clear all html
    for(let i = 0; i < characters.length; i++) {
        const characterElement = document.createElement('p');
        characterElement.innerText = characters[i];
        container.appendChild(characterElement);
    }
}

function changeCharacter(container, index, character) {
    const oldChild = container.children[index];
    if(oldChild){
        const newChild = document.createElement('p');
        newChild.innerText = character;
        container.replaceChild(newChild, oldChild);
    }
}

function getChanges(newString, oldString) {
    if(newString.length !== oldString.length){
        throw Error("Not allowed: Inconsistent length between string.");
    }
    const changes = [];
    for(let char = 0; char < newString.length; char++){
        if(newString[char] !== oldString[char]){
            changes.push([char, newString[char]]);
        }
    }
    return changes;
}

function getTimeString() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const pm = hours > 12;
    if(pm) hours -= 12;
    let timeString = [hours, minutes, ...(secondsEnabled ? [seconds] : [])]
        .map((v) => `0${v}`.substr(-2))
        .join(':');
    timeString += pm ? "PM" : "AM";
    return timeString;
}

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if(properties.seconds){
            secondsEnabled = properties.seconds.value;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const timeContainer = document.querySelector("#timeIndicator");
    let currentTime = getTimeString();
    setCharacters(timeContainer, currentTime);
    setInterval(() => {
        const newCurrentTime = getTimeString();
        let stringChanges;
        try{
            stringChanges = getChanges(newCurrentTime, currentTime);
        }catch(e) {
            currentTime = newCurrentTime;
            return setCharacters(timeContainer, newCurrentTime);
        }
        currentTime = newCurrentTime;
        for(let i = 0; i < stringChanges.length; i++){
            changeCharacter(timeContainer, ...stringChanges[i]);
        }
    }, 1000);
});

document.addEventListener('mousemove', (event) => {
    const middle = window.innerHeight/2;

    if(chibiZtwoReady && 
    event.screenX >= window.innerWidth - maxHCap &&
    event.screenY <= middle+maxVCap && event.screenY >= middle-maxVCap){
        chibiZtwoReady = false;
        const mainContainer = document.querySelector("#mainContainer");
        const newChibi = document.createElement('img');
        const id = getRandom(4);
        newChibi.className = "chibi";
        newChibi.src = `./chibi/${id}.png`;
        mainContainer.appendChild(newChibi);
        setTimeout(() => {
            mainContainer.removeChild(newChibi);
            chibiZtwoReady = true;
        }, 10000);
    }
})