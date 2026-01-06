// import { stringInputExport } from "./dictionaryrandomrussian.js";
// import { stringExportEng } from "./dictionaryrandomenglish.js";
const cyrillicRegex = /^(?!.*-;)[\p{Script=Cyrillic}\p{P}\p{S}\s\d]+$/u;
const latinRegex = /^(?!.*-;)[A-Za-z\d\s\p{P}\p{S}]+$/u;
// const vnRegex = /^(?!.*-;)[\s\da-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\p{P}\p{S}]+$/u;
const vnRegex = /^[^\-\;]+$/;
let clearBtn = document.querySelector("#clear-list-button");
let randomBtn = document.querySelector("#start-random-button");
let displayBtn = document.querySelector("#visible-list-button");
let inputElm = document.querySelector("#input-word");
let addBtn = document.querySelector("#add-button");
let listAreaElm = document.querySelector(".list-area");
let tags = listAreaElm.querySelectorAll(".tags")
let listAreaLength = tags.length
let tag
let editTabBtns = document.querySelectorAll("#edit-button");
let deleteTabBtns = document.querySelectorAll("#delete-button");
let currentLanguage
let setWord
let vncheck
let rucheck
let encheck
let isValid
let language
let id = 0;
let isEdit = false;
let idEdit;
let currentTab;
let currentId;
let index;
let randomIndex;
let newRandomIndex;
let isDisplay = false;
let isOrigin = true;
let alertElm = document.querySelector(".alert");
let closeElm = document.querySelector(".close");
let previosElm = document.querySelector(".previous");
let nextElm = document.querySelector(".next");
let contentAlertElm = document.querySelector(".content-alert");
let contentFrontElm = document.querySelector(".front");
let contentBackElm = document.querySelector(".back");
let wordAlert = "";
let scriptAlert = "";
let tabList = []; // mang goc, dung de lay thong tin, du lieu cho code;

// async function getData() {
//   try {
//     const response = await fetch('/');
//     if (!response.ok) throw new Error('Network response was not ok'); // 1.2.10
    
//     const data = await response.json(); // Parses JSON response
//     tabList=data
//     console.log(data);
//   } catch (error) {
//     console.error('Fetch error:', error); // Handles network errors
//   }
// }

async function postData(userData) {
    const response = await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Essential for sending JSON
    },
    body: JSON.stringify(`${userData}`) // Converts JS object to JSON string
  });
  window.location.reload()
  return response;
}

async function updatetData(userData) {
    postData(userData)
}

async function deleteData(userData) {
    const response = await fetch('/delete', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // Essential for sending JSON
    },
    body: JSON.stringify(`${userData}`) // Converts JS object to JSON string
    });
    window.location.reload()
    return response;
}

// let updateLocalStorage = function () {
//     localStorage.setItem(TABS_LIST,JSON.stringify(tabList)); 
// }
// let getLocalStorage = function () {
//     tab_List = JSON.parse(localStorage.getItem(TABS_LIST));
//     tabList = tab_List;
// }

let clearList = function () {
    isEdit = false;
    listAreaElm.innerHTML = ""
    tags=[]
    id = 0;
    inputElm.value = "";
}

let addTab = function (data) {
    postData(data)
}

let setContent = function (data) {
    updatetData(data)
    isEdit = !isEdit;
}

let alertContent = (word, mean) => {
    if(isOrigin) {
        contentAlertElm.style.transform = "rotateY(0deg)";
        contentFrontElm.style.transform = "rotateY(0deg)";
        contentBackElm.innerHTML = "";
        contentFrontElm.innerHTML = word;
    }
    else {
        contentAlertElm.style.transform = "rotateY(180deg)";
        contentBackElm.style.transform = "rotateY(180deg)";
        contentFrontElm.innerHTML = "";
        contentBackElm.innerHTML = mean;
    }
}

let active = function (act) {
    act.classList.add("active");
}

let deActive = function () {
    let activeElm = listAreaElm.querySelector(".active");
    if(activeElm) activeElm.classList.remove("active");
}

function checkInputString(stringInput) {
    currentLanguage = document.querySelector('#change-language-button').getAttribute('src')
    if(stringInput.includes(";")) {
        let arrInput = inputElm.value.split(";");
        let isInvalid = arrInput.some((elm) => {
            if(elm.trim() != "") { 
                if(elm.includes("-")) {
                    elm = elm.split("-");
                    if((elm[0].trim() == '') || (elm[1].trim() == '')) {
                        language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
                        // this return does not interrupt the function and does not return anything if using forEach()
                        // return {isValid: false, language: language}; 
                        // this is return in callback scope
                        return true
                    }
                    
                    vncheck = vnRegex.test(elm[0].trim())
                    rucheck = cyrillicRegex.test(elm[1].trim())
                    encheck = latinRegex.test(elm[1].trim())
                    
                    if((currentLanguage == '/static/Icons/russia.png') && ((vncheck && rucheck) == false)) {
                        // return {isValid: false, language: "russian"};
                        return true
                    }
                    else if ((currentLanguage == '/static/Icons/united-states.png') && ((vncheck && encheck) == false)) {
                        // return {isValid: false, language: "english"};
                        return true
                    }
                } else {
                    // language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
                    // return {isValid: false, language: language};
                    return true
                }
            }
        })

        if((currentLanguage == '/static/Icons/russia.png' && !isInvalid)) {
            return {isValid: true, language: "russian"};
        }
        else if ((currentLanguage == '/static/Icons/united-states.png' && !isInvalid)) {
            return {isValid: true, language: "english"};
        }
        else {
            language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
            return {isValid: false, language: language};
        }
    }

    else {
        if(stringInput.includes("-")) {
            stringInput = stringInput.split("-");
            vncheck = vnRegex.test(inputElm.value.split("-")[0].trim())
            rucheck = cyrillicRegex.test(inputElm.value.split("-")[1].trim())
            encheck = latinRegex.test(inputElm.value.split("-")[1].trim())
            if(currentLanguage === '/static/Icons/russia.png') {
                return {isValid: (vncheck && rucheck), language: "russian"};
            }
            else {
                return {isValid: (vncheck && encheck), language: "english"};
            }
        }
        else {
            language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
            return {isValid: false, language: language};
        }
    }
};

let addOrEditTabs = function () {
    let contentTab = inputElm.value;
    if (contentTab.trim() == "") { alert("You must enter a word!"); return }
    let {isValid, language} = checkInputString(contentTab.trim())

    if (isEdit && isValid) {
        setContent(contentTab);
        inputElm.value = '';
        return
    } else if (isValid) {
        addTab(contentTab);
        inputElm.value = '';
        return
    }
    alert(`Incorect input value! Have to enter [vietnamese - ${language}] word\n[KEY - VALUE] or sequence [KEY - VALUE; KEY - VALUE; KEY - VALUE]`)
}

clearBtn.onclick = () => {
    clearList();
}

displayBtn.onclick = () => {
    isDisplay = !isDisplay;
    if(isDisplay) {
        listAreaElm.style.display = "none";
        displayBtn.src = "static/Icons/invisible.png";
    } 
    else {
        listAreaElm.style.display = "block";
        displayBtn.src = "static/Icons/visible.png";
    }
}

randomBtn.onclick = () => {
    if(tags.length == 0) { 
        alert("Do not have any words in the list!");
        return
    }

    randomIndex = newRandomIndex;

    do {
        newRandomIndex = Math.floor((Math.random()/(1/listAreaLength)));
    } while (newRandomIndex == listAreaLength || (randomIndex == newRandomIndex && listAreaLength > 1));
    tag=tags[newRandomIndex];
    let mean = tag.querySelector('p').innerText.trim();
    let word = tag.getAttribute("name");
    alertElm.style.display = "block";
    isOrigin = true;
    alertContent(mean,word);
    wordAlert = mean;
    scriptAlert = word;
}

previosElm.onclick = () => {
    newRandomIndex == 0? newRandomIndex = tags.length - 1 : newRandomIndex -= 1;
    tag=tags[newRandomIndex]
    isOrigin = true;
    alertContent(tag.querySelector('p').innerText.trim(), tag.getAttribute("name"));
    wordAlert = tag.querySelector('p').innerText.trim();
    scriptAlert = tag.getAttribute("name");
}

nextElm.onclick = () => {
    newRandomIndex == (tags.length - 1)? newRandomIndex = 0 : newRandomIndex += 1;
    tag=tags[newRandomIndex];
    isOrigin = true;
    alertContent(tag.querySelector('p').innerText.trim(), tag.getAttribute("name"));
    wordAlert = tag.querySelector('p').innerText.trim();
    scriptAlert = tag.getAttribute("name");
}

tags.forEach((tg) => {
    tg.addEventListener('click', () => {
        let word = tg.querySelector('p').innerText.trim();
        let mean = tg.getAttribute("name").trim();
        newRandomIndex = Number(tg.getAttribute('id'))
        isOrigin = true
        alertElm.style.display = "block";
        alertContent(word,mean);
        wordAlert = word;
        scriptAlert = mean;
    })
})

editTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentId = Number(btn.parentElement.parentElement.id);
        deActive();
        if(currentId == idEdit) {
            isEdit = !isEdit;
            if(isEdit) {
                currentTab = btn.parentElement.parentElement;
                active(btn.parentElement.parentElement);
                inputElm.focus();
                inputElm.value = currentTab.querySelector('p').innerText.trim() + " - " + currentTab.getAttribute("name").trim();
            } else {
                inputElm.value = "";
            }
        } else {
            isEdit = true;
            active(btn.parentElement.parentElement);
            currentTab = btn.parentElement.parentElement;
            inputElm.focus();
            inputElm.value = currentTab.querySelector('p').innerText.trim() + " - " + currentTab.getAttribute("name").trim();
        }
        idEdit = currentId;
    })
});

deleteTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTab = btn.parentElement.parentElement
        let deletedData = currentTab.querySelector('p').innerText.trim() + " - " + currentTab.getAttribute("name").trim();
        deleteData(deletedData)
        if(isEdit) { inputElm.value = "" };
        isEdit = false;
        deActive();
        btn.parentElement.parentElement.remove();
    })
});

addBtn.onclick = () => {
    addOrEditTabs();
}

inputElm.onkeydown = (e) => {
    if(e.key == "Enter") addOrEditTabs();
}

contentAlertElm.onclick = (e) => {
    isOrigin = !isOrigin;
    alertContent(wordAlert,scriptAlert);
}

closeElm.onclick = () => {
    alertElm.style.display = "none";  
}
