import './style.css';
import './main.scss';

class Robot {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    appendRobot(selector) {
        const robotContainer = document.createElement("div");
        robotContainer.classList.add("robot");
    
        robotContainer.onclick = e => console.log(e);
        const robotAvatar = document.createElement("img");
        robotAvatar.classList.add("robot__avatar");
        robotAvatar.src = `https://robohash.org/${this.id}?size=200x200`;
        robotContainer.append(robotAvatar);
    
        const robotName = document.createElement("h3");
        robotName.innerHTML = this.name;
        robotContainer.append(robotName);
    
        const robotEmail = document.createElement("p");
        robotEmail.innerHTML = this.email;
        robotContainer.append(robotEmail);
    
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove";
        removeButton.onclick = () => {
            robotContainer.remove(); // Удаляет элемент из DOM
    
            // Удаляет робота из массива
            robots.splice(
                robots.findIndex(r => r.id === this.id), 1
            );
        }
        robotContainer.append(removeButton);
        document.querySelector(selector).append(robotContainer);
    }
}

let robots = [];

async function getRobots(url) {
    const response = await fetch(url);
    const robotsArray = await response.json();
    robots = robotsArray.map(({id, name, email}) => new Robot(id, name, email));
}

const url = "https://jsonplaceholder.typicode.com/users";

await getRobots(url);

let filteredRobots = robots;

let filterInput = document.querySelector(".robots-filter");
filterInput.oninput = (e) => {
    filteredRobots = robots.filter(
        item => item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );

    let robotsDiv = document.querySelector(".robots");
    [...robotsDiv.children].forEach(item => {
        if (item.classList.contains("robot") && !item.classList.contains("create-robot")) {
            item.remove();
        }
    })

    filteredRobots.forEach(robot => robot.appendRobot(".robots"))
}

robots.forEach(robot => robot.appendRobot(".robots"));

function createRobot(name, email) {
    let robotID = robots.length ? robots[robots.length - 1].id + 1 : 1;
    let newRobot = new Robot(robotID, name, email);
    robots.push(newRobot);
    newRobot.appendRobot(".robots");
}

// Вызов контекстного меню
let showRobotCard = false;
let robotCard = document.querySelector(".robot-card");
robotCard.style.display = showRobotCard ? "flex" : "none";

document.body.addEventListener("click", () => {
    let showRobotCard = false;
    robotCard.style.display = showRobotCard ? "flex" : "none";
})

document.forms[0].onsubmit = function(e) {
    e.preventDefault();
    createRobot(capitalize(e.target.elements[0].value), e.target.elements[1].value);
    e.target.elements[0].value = "";
    e.target.elements[1].value = "";
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

let [nameInput, emailInput] = document.forms[0].elements;
nameInput.oninput = handleInput;
emailInput.oninput = handleInput;

function handleInput(e) {
    window.localStorage.createRobot = JSON.stringify({
        name: nameInput.value,
        email: emailInput.value
    })

    console.log(JSON.parse(window.localStorage.createRobot))
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.localStorage.createRobot) {
        let data = JSON.parse(window.localStorage.createRobot)
        nameInput.value = data.name;
        emailInput.value = data.email;
    }
})
