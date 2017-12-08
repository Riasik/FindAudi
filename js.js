//vars for time
var appendTens = document.getElementById("tens"),
    appendSeconds = document.getElementById("seconds"),
    seconds = 0,tens = 0, flag = false, IntervalTime;
//vars for game logic
var userMass = [], resultsArray = [],wrongChoice = 0,level = 0,
    userNum, count = 0, sizeDesk = 12,
    car_logo = ["alfa", "audi", "bmw", "chevrolet", "citroen", "fiat", "ford", "honda",
    "hyundai", "infiniti", "jaguar", "jeep","kia", "lancia", "land", "lexus", "mazda",
    "mercedes", "mg", "mini", "mitsubishi", "nissan", "opel", "peugeot",
    "renault", "seat", "skoda", "subaru", "toyota", "volkswagen", "volvo"];
//vars for style
var wrongChoiceH = document.getElementById('wrong_choice'),
    levelH = document.getElementById('level'),
    levelPointsH = document.getElementById('level_points'),
    totalPointsH = document.getElementById('total_points'),
    allResultsH = document.getElementById('desk_all_results'),
    userH = document.getElementById('user'),
    wrapH = document.querySelector('.wrap_styles'),
    wrapSecondH = document.querySelector('.wrap_styles_table'),
    resultsTexH = document.getElementById('results--text'),
    container, body = document.body, tbody;
//var for localStorage
var localValue = JSON.parse(localStorage.getItem('BD'));


if(localValue){
    userMass=localValue;
} else localStorage.setItem('BD',JSON.stringify(userMass));

// User constructor
function User(l,p,m12,m16,m20,m24) {
    return{
        login:l,
        pass:p,
        desk12:m12,
        desk16:m16,
        desk20:m20,
        desk24:m24
    }
}
// This function start every Level in Game
function startLevel() {
    if(userNum===undefined){
        alert('Invalid input!');
        document.getElementById('fixed_div_id').style.display = "block";
    } else {
    level = identefySizeDesk().length+1;
    textHtml();
    fillTheBoard(massRandom(car_logo, sizeDesk));
    }
}
// Fills up all html vars
function textHtml() {
    var lastLevelPoints;
    if(identefySizeDesk().length===0){lastLevelPoints=0;}
    else {lastLevelPoints = identefySizeDesk()[(identefySizeDesk()).length-1]}
    wrongChoice = 0;
    seconds = 0; tens = 0;
    userH.innerHTML = userMass[userNum].login;
    levelH.innerHTML = 'Level : ' + level;
    appendTens.innerHTML = tens;
    appendSeconds.innerHTML = seconds;
    wrongChoiceH.innerHTML = 'Wrong Choice : '+ (wrongChoice);
    levelPointsH.innerHTML = 'Last Level points : '+ lastLevelPoints;
    totalPointsH.innerHTML = 'Total points : '+ sumPoints(identefySizeDesk());
    clearInterval(IntervalTime);
}
//  Change sizeDesk and startLevel()
    document.getElementById("spinnerDesk").onchange = function () {
        sizeDesk = this.value;
        startLevel();
    };

// Input mass of cards and size desk((5 * 5, 8 * 8, 10 * 10, 12 * 12)
// return mass with size elements in random order
function massRandom(massIn,size) {
    var mass = [],r,v;
    while(mass.length <size){
        r = Math.floor(Math.random()*massIn.length);
        if (mass.indexOf(massIn[r])===-1){
            mass.push(massIn[r]);
            mass.push(massIn[r]);
        }
    }
    for (var i = 0; i < mass.length-1; i++) {
        r = Math.floor(Math.random()*(mass.length-1));
        v = mass[r];
        mass[r] = mass[mass.length-1];
        mass[mass.length-1] = v;
    }return mass;
}
// Add container in html
function addContainer() {
    if (container) {
        container.parentNode.removeChild(container);}
        var c = document.getElementById('con');
        container = document.createElement('div');
        c.appendChild(container);
}

// Fill the board with elements
function fillTheBoard(mass) {
    addContainer();
    for (var i = 0; i < mass.length; i++) {
        var div = document.createElement('div');
        var el = document.createElement('IMG');
        el.src = 'car_logo/' + mass[i] + '.png';
        div.className = 'open_preview';
        el.id = 'img' + i;
        div.appendChild(el);
        container.appendChild(div);
        div.setAttribute('onClick','openAndFind(this)')
    }
    check('close',3000,'open_preview');
}

//  Logic open cards and find pairs
function openAndFind(i) {
    if (i.className === 'close') {
        i.className = 'open';
        var value = i.firstChild.valueOf().src;
        resultsArray.push(value);
        clearInterval(IntervalTime);
        IntervalTime = setInterval(startTimer, 10);
    if (resultsArray.length > 1) {
        if (resultsArray[0] === resultsArray[1]) {
            check("true",500,'open');
            count++;
            win();
            resultsArray = [];
        } else {
            check("close",500,'open');
            resultsArray = [];
            wrongChoiceH.innerHTML = 'Wrong choice: '+ (++wrongChoice);
        }
    }}
}

// Change className from classFind after timeout
function check(className,time,classFind) {
    var x = document.getElementsByClassName(classFind);
    setTimeout(function() {
        for(var i = (x.length - 1); i >= 0; i--) {
            x[i].className = className;
        }
    },time);
}
// If you won all logic vars reset and start next Level
function  win() {
    if(count === sizeDesk/2) {
        clearInterval(IntervalTime);
        pointsAdd();
        resultsArray = [];
        resultsTexH.innerHTML = "Your time was " + seconds + ":" + tens;
        count=0;
        wrongChoice=0;
        localStorage.setItem('BD',JSON.stringify(userMass));
        startLevel();
    }
}

// Add points in userMass[user].sizeDesk and
// show in html points level and totalPoints
function pointsAdd() {
    var points = Math.floor(100/seconds/wrongChoice*sizeDesk),
        totalPoints;
    identefySizeDesk().push(points);
    totalPoints = identefySizeDesk();
    levelPointsH.innerHTML = 'Level points : '+ points;
    totalPointsH.innerHTML = 'Total points : '+ totalPoints;
    localStorage.setItem('BD',JSON.stringify(userMass));
}
// Sum points in mass
function sumPoints(massPoints){
    var sum=0;
    for (var i=0;i<massPoints.length;i++){
        sum += massPoints[i];
    } return sum;
}

// onClick button Stop
function stopTimer() {
    if(flag){
        flag=false;
        clearInterval(IntervalTime);
    }else {
        flag=true;
        clearInterval(IntervalTime);
        IntervalTime = setInterval(startTimer, 10);
    }
}
// Timer in Game
function startTimer () {
    tens++;
    flag=true;
    if(tens < 9)appendTens.innerHTML = "0" + tens;
    if (tens > 9)appendTens.innerHTML = tens;
    if (tens > 99) {
        seconds++;
        appendSeconds.innerHTML = "0" + seconds;
        tens = 0;
        appendTens.innerHTML = "0" + 0;
    }if (seconds > 9)appendSeconds.innerHTML = seconds;
}

//Change style of check in window
document.querySelector('.img__btn').addEventListener('click', function() {
    document.querySelector('.cont').classList.toggle('s--signup');
});

// Sing up in Game, create new User and set in localStorage
function onClickSingUp() {
    var l = document.getElementById('login').value,
        p = document.getElementById('password').value;
            userMass.push(new User(l,p, [],[],[],[]));
            document.querySelector('.cont').classList.toggle('s--signup');
            localStorage.setItem('BD',JSON.stringify(userMass));
    }
// Sing in Game and startLevel()
function onClickSingIn() {
    var l = document.getElementById('login_in').value.toString(),
        p = document.getElementById('password_in').value.toString();

    for(var i=0;i<userMass.length;i++){
        if(userMass[i].login == l && userMass[i].pass==p){
            document.getElementById('fixed_div_id').style.display = "none";
            userNum=i;
        }
    }
    startLevel();
}

// This function give a chance to play without registration
// But whatever registers you in BD and give you last 'number' in BD
// login: User(number) and login: number
function onClickWithout() {
    userMass.push(new User('user'+(userMass.length+1), userMass.length+1,
        [],[],[],[]));
    document.getElementById('fixed_div_id').style.display = "none";
    userNum = userMass.length-1;
    startLevel();
    localStorage.setItem('BD',JSON.stringify(userMass));
}

// Return mass of right sizeDesk from user
function identefySizeDesk() {
    if(sizeDesk==12){return userMass[userNum].desk12}
    if(sizeDesk==16){return userMass[userNum].desk16}
    if(sizeDesk==20){return userMass[userNum].desk20}
    if(sizeDesk==24){return userMass[userNum].desk24}
}

// Function change styles Game
function changeClassStyles() {
    body.classList.toggle('new--body');
    wrapH.classList.toggle('wrapH--new--style_property'); //меняем стили главной обертки
}

// Redirects in desk of Results
function showResultsDesk(){
    wrapH.style.display="none";
    wrapSecondH.style.display="block";
    showAllResults();
    clearInterval(IntervalTime);
}
// Change screen
function showMainsDesk(){
    wrapH.style.display="block";
    wrapSecondH.style.display="none";
}

// Show all Users and their results in table
function showAllResults() {
    if(tbody){
        tbody.parentNode.removeChild(tbody);
    }
    tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="td_top"> USER </td><td class="td_top"> 6 x 6 </td>' +
        '<td class="td_top"> SUM </td><td class="td_top"> 8 x 8 </td>' +
        '<td class="td_top"> SUM </td><td class="td_top"> 10 x 10 </td>' +
        '<td class="td_top"> SUM </td><td class="td_top"> 12 x 12 </td>' +
        '<td class="td_top"> SUM </td>';
    tbody.appendChild(tr);

    var items = ['login', 'desk12','total12', 'desk16','total16', 'desk20','total20', 'desk24','total24'];
    for (var i = 0; i < userMass.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < items.length; j++) {
            var td = document.createElement('td');
            switch (j) {
                case 0: {td.className ='td_table login';
                    td.innerHTML = userMass[i][items[j]];}
                    break;
                case 1: {td.className = 'td_table';
                    td.innerHTML = userMass[i].desk12;}
                    break;
                case 2: {td.className ='td_table sum';
                    td.innerHTML = sumPoints(userMass[i].desk12);}
                    break;
                case 3: {td.className = 'td_table';
                    td.innerHTML = userMass[i].desk16;}
                    break;
                case 4: {td.className ='td_table sum';
                    td.innerHTML = sumPoints(userMass[i].desk16);}
                    break;
                case 5: {td.className = 'td_table';
                    td.innerHTML = userMass[i].desk20;}
                    break;
                case 6: {td.className ='td_table sum';
                    td.innerHTML = sumPoints(userMass[i].desk20);}
                    break;
                case 7: {td.className = 'td_table';
                    td.innerHTML = userMass[i].desk24;}
                    break;
                case 8: {td.className ='td_table sum';
                    td.innerHTML = sumPoints(userMass[i].desk24);}
                    break
            }tr.appendChild(td);
        }tbody.appendChild(tr);
    }allResultsH.appendChild(tbody);
}



