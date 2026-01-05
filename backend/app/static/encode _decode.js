const originalCode = `
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
    body: JSON.stringify("\'" + userData + "\'") // Converts JS object to JSON string
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
    body: JSON.stringify("\'" + userData + "\'") // Converts JS object to JSON string
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
        arrInput.forEach((elm) => {
            if(elm.trim() != "") { 
                setWord = elm.trim();
                if(setWord.includes("-")) {
                    setWord = setWord.split("-");
                    vncheck = vnRegex.test(setWord[0].trim())
                    rucheck = cyrillicRegex.test(setWord[1].trim())
                    encheck = latinRegex.test(setWord[1].trim())
                    if(currentLanguage === '/static/Icons/russia.png') {
                        return {isValid: (vncheck && rucheck), language: "russian"};
                    }
                    else {
                        return {isValid: (vncheck && encheck), language: "english"};
                    }
                } else {
                    language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
                    return {isValid: false, language: language};
                }
            }
        })
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
    alert("Incorect input value! Have to enter [vietnamese - " + language + " ] word [KEY - VALUE] or sequence [KEY - VALUE; KEY - VALUE; KEY - VALUE]")
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
    btn.addEventListener('click', () => {
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
    btn.addEventListener('click', () => {
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

`


// Encode
function utf8ToBase64(str) {
    // Bước 1: encodeURIComponent để xử lý Unicode
    // Bước 2: chuyển %xx thành ký tự
    const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
    });

    // Bước 3: dùng btoa
    return btoa(utf8Bytes);
}

const base64Code = utf8ToBase64(originalCode)
console.log("Base64 Encoded:", base64Code);


// Decode
function loadBase64Script(base64Code, options = {}) {
    const {
        id = null,
        async = false,
        defer = false,
        onLoad = null,
        onError = null
    } = options;

    try {
        // Làm sạch base64: xóa khoảng trắng, ký tự không hợp lệ
        const cleanBase64 = base64Code.replace(/\s/g, '').replace(/[^A-Za-z0-9+/=]/g, '');

        // Giải mã base64
        const code = base64ToUtf8(cleanBase64);

        // console.log(code)
        // Kiểm tra code có rỗng không
        if (!code || code.trim().length === 0) {
            throw new Error('Decoded code is empty');
        }

        // Thử kiểm tra cú pháp JavaScript (không thực thi)
        try {
            new Function(code);
        } catch (jsError) {
            throw new Error('Invalid JavaScript code: ' + jsError.message);
        }

        // Tạo script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = code;
        
        if (id) script.id = id;
        if (async) script.async = true;
        if (defer) script.defer = true;

        if (onLoad) {
            script.onload = () => onLoad(script);
        }

        if (onError) {
            script.onerror = (error) => onError(error, script);
        }

        document.head.appendChild(script);
        console.log('Script loaded successfully');
        return script;
    } catch (error) {
        console.error('Failed to load base64 script:', error);
        if (onError) onError(error);
        throw error;
    }
}

function base64ToUtf8(base64) {
    // Bước 1: Giải mã base64 thành chuỗi byte
    const utf8Bytes = atob(base64);
    
    // Bước 2: Chuyển byte thành percent-encoding (%xx)
    let percentEncoded = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        const byte = utf8Bytes.charCodeAt(i);
        percentEncoded += '%' + byte.toString(16).padStart(2, '0').toUpperCase();
    }
    
    // Bước 3: Giải mã percent-encoding thành chuỗi Unicode
    return decodeURIComponent(percentEncoded);
}

loadBase64Script("CgovLyBpbXBvcnQgeyBzdHJpbmdJbnB1dEV4cG9ydCB9IGZyb20gIi4vZGljdGlvbmFyeXJhbmRvbXJ1c3NpYW4uanMiOwovLyBpbXBvcnQgeyBzdHJpbmdFeHBvcnRFbmcgfSBmcm9tICIuL2RpY3Rpb25hcnlyYW5kb21lbmdsaXNoLmpzIjsKY29uc3QgY3lyaWxsaWNSZWdleCA9IC9eKD8hLiotOylbcHtTY3JpcHQ9Q3lyaWxsaWN9cHtQfXB7U31zZF0rJC91Owpjb25zdCBsYXRpblJlZ2V4ID0gL14oPyEuKi07KVtBLVphLXpkc3B7UH1we1N9XSskL3U7Ci8vIGNvbnN0IHZuUmVnZXggPSAvXig/IS4qLTspW3NkYS16QS1aw4DDgcOCw4PDiMOJw4rDjMONw5LDk8OUw5XDmcOaxILEkMSoxajGoMOgw6HDosOjw6jDqcOqw6zDrcOyw7PDtMO1w7nDusSDxJHEqcWpxqHGr8SC4bqg4bqi4bqk4bqm4bqo4bqq4bqs4bqu4bqw4bqy4bq04bq24bq44bq64bq84buA4buA4buCxrDEg+G6oeG6o+G6peG6p+G6qeG6q+G6reG6r+G6seG6s+G6teG6t+G6ueG6u+G6veG7geG7geG7g+G7hOG7huG7iOG7iuG7jOG7juG7kOG7kuG7lOG7luG7mOG7muG7nOG7nuG7oOG7ouG7pOG7puG7qOG7quG7heG7h+G7ieG7i+G7jeG7j+G7keG7k+G7leG7l+G7meG7m+G7neG7n+G7oeG7o+G7peG7p+G7qeG7q+G7rOG7ruG7sOG7suG7tMOd4bu24bu44but4buv4bux4buzw73hu7Xhu7fhu7lwe1B9cHtTfV0rJC91Owpjb25zdCB2blJlZ2V4ID0gL15bXi07XSskLzsKbGV0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2NsZWFyLWxpc3QtYnV0dG9uIik7CmxldCByYW5kb21CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjc3RhcnQtcmFuZG9tLWJ1dHRvbiIpOwpsZXQgZGlzcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN2aXNpYmxlLWxpc3QtYnV0dG9uIik7CmxldCBpbnB1dEVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNpbnB1dC13b3JkIik7CmxldCBhZGRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjYWRkLWJ1dHRvbiIpOwpsZXQgbGlzdEFyZWFFbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIubGlzdC1hcmVhIik7CmxldCB0YWdzID0gbGlzdEFyZWFFbG0ucXVlcnlTZWxlY3RvckFsbCgiLnRhZ3MiKQpsZXQgbGlzdEFyZWFMZW5ndGggPSB0YWdzLmxlbmd0aApsZXQgdGFnCmxldCBlZGl0VGFiQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNlZGl0LWJ1dHRvbiIpOwpsZXQgZGVsZXRlVGFiQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNkZWxldGUtYnV0dG9uIik7CmxldCBjdXJyZW50TGFuZ3VhZ2UKbGV0IHNldFdvcmQKbGV0IHZuY2hlY2sKbGV0IHJ1Y2hlY2sKbGV0IGVuY2hlY2sKbGV0IGlzVmFsaWQKbGV0IGxhbmd1YWdlCmxldCBpZCA9IDA7CmxldCBpc0VkaXQgPSBmYWxzZTsKbGV0IGlkRWRpdDsKbGV0IGN1cnJlbnRUYWI7CmxldCBjdXJyZW50SWQ7CmxldCBpbmRleDsKbGV0IHJhbmRvbUluZGV4OwpsZXQgbmV3UmFuZG9tSW5kZXg7CmxldCBpc0Rpc3BsYXkgPSBmYWxzZTsKbGV0IGlzT3JpZ2luID0gdHJ1ZTsKbGV0IGFsZXJ0RWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLmFsZXJ0Iik7CmxldCBjbG9zZUVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5jbG9zZSIpOwpsZXQgcHJldmlvc0VsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5wcmV2aW91cyIpOwpsZXQgbmV4dEVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5uZXh0Iik7CmxldCBjb250ZW50QWxlcnRFbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIuY29udGVudC1hbGVydCIpOwpsZXQgY29udGVudEZyb250RWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLmZyb250Iik7CmxldCBjb250ZW50QmFja0VsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5iYWNrIik7CmxldCB3b3JkQWxlcnQgPSAiIjsKbGV0IHNjcmlwdEFsZXJ0ID0gIiI7CmxldCB0YWJMaXN0ID0gW107IC8vIG1hbmcgZ29jLCBkdW5nIGRlIGxheSB0aG9uZyB0aW4sIGR1IGxpZXUgY2hvIGNvZGU7CgovLyBhc3luYyBmdW5jdGlvbiBnZXREYXRhKCkgewovLyAgIHRyeSB7Ci8vICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvJyk7Ci8vICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpOyAvLyAxLjIuMTAKICAgIAovLyAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8gUGFyc2VzIEpTT04gcmVzcG9uc2UKLy8gICAgIHRhYkxpc3Q9ZGF0YQovLyAgICAgY29uc29sZS5sb2coZGF0YSk7Ci8vICAgfSBjYXRjaCAoZXJyb3IpIHsKLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0ZldGNoIGVycm9yOicsIGVycm9yKTsgLy8gSGFuZGxlcyBuZXR3b3JrIGVycm9ycwovLyAgIH0KLy8gfQoKYXN5bmMgZnVuY3Rpb24gcG9zdERhdGEodXNlckRhdGEpIHsKICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hZGQnLCB7CiAgICBtZXRob2Q6ICdQT1NUJywKICAgIGhlYWRlcnM6IHsKICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyAvLyBFc3NlbnRpYWwgZm9yIHNlbmRpbmcgSlNPTgogICAgfSwKICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KCInIiArIHVzZXJEYXRhICsgIiciKSAvLyBDb252ZXJ0cyBKUyBvYmplY3QgdG8gSlNPTiBzdHJpbmcKICB9KTsKICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkKICByZXR1cm4gcmVzcG9uc2U7Cn0KCmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZXREYXRhKHVzZXJEYXRhKSB7CiAgICBwb3N0RGF0YSh1c2VyRGF0YSkKfQoKYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YSh1c2VyRGF0YSkgewogICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2RlbGV0ZScsIHsKICAgIG1ldGhvZDogJ1BPU1QnLAogICAgaGVhZGVyczogewogICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgLy8gRXNzZW50aWFsIGZvciBzZW5kaW5nIEpTT04KICAgIH0sCiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSgiJyIgKyB1c2VyRGF0YSArICInIikgLy8gQ29udmVydHMgSlMgb2JqZWN0IHRvIEpTT04gc3RyaW5nCiAgICB9KTsKICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKQogICAgcmV0dXJuIHJlc3BvbnNlOwp9CgovLyBsZXQgdXBkYXRlTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24gKCkgewovLyAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oVEFCU19MSVNULEpTT04uc3RyaW5naWZ5KHRhYkxpc3QpKTsgCi8vIH0KLy8gbGV0IGdldExvY2FsU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHsKLy8gICAgIHRhYl9MaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShUQUJTX0xJU1QpKTsKLy8gICAgIHRhYkxpc3QgPSB0YWJfTGlzdDsKLy8gfQoKbGV0IGNsZWFyTGlzdCA9IGZ1bmN0aW9uICgpIHsKICAgIGlzRWRpdCA9IGZhbHNlOwogICAgbGlzdEFyZWFFbG0uaW5uZXJIVE1MID0gIiIKICAgIHRhZ3M9W10KICAgIGlkID0gMDsKICAgIGlucHV0RWxtLnZhbHVlID0gIiI7Cn0KCmxldCBhZGRUYWIgPSBmdW5jdGlvbiAoZGF0YSkgewogICAgcG9zdERhdGEoZGF0YSkKfQoKbGV0IHNldENvbnRlbnQgPSBmdW5jdGlvbiAoZGF0YSkgewogICAgdXBkYXRldERhdGEoZGF0YSkKICAgIGlzRWRpdCA9ICFpc0VkaXQ7Cn0KCmxldCBhbGVydENvbnRlbnQgPSAod29yZCwgbWVhbikgPT4gewogICAgaWYoaXNPcmlnaW4pIHsKICAgICAgICBjb250ZW50QWxlcnRFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMGRlZykiOwogICAgICAgIGNvbnRlbnRGcm9udEVsbS5zdHlsZS50cmFuc2Zvcm0gPSAicm90YXRlWSgwZGVnKSI7CiAgICAgICAgY29udGVudEJhY2tFbG0uaW5uZXJIVE1MID0gIiI7CiAgICAgICAgY29udGVudEZyb250RWxtLmlubmVySFRNTCA9IHdvcmQ7CiAgICB9CiAgICBlbHNlIHsKICAgICAgICBjb250ZW50QWxlcnRFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMTgwZGVnKSI7CiAgICAgICAgY29udGVudEJhY2tFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMTgwZGVnKSI7CiAgICAgICAgY29udGVudEZyb250RWxtLmlubmVySFRNTCA9ICIiOwogICAgICAgIGNvbnRlbnRCYWNrRWxtLmlubmVySFRNTCA9IG1lYW47CiAgICB9Cn0KCmxldCBhY3RpdmUgPSBmdW5jdGlvbiAoYWN0KSB7CiAgICBhY3QuY2xhc3NMaXN0LmFkZCgiYWN0aXZlIik7Cn0KCmxldCBkZUFjdGl2ZSA9IGZ1bmN0aW9uICgpIHsKICAgIGxldCBhY3RpdmVFbG0gPSBsaXN0QXJlYUVsbS5xdWVyeVNlbGVjdG9yKCIuYWN0aXZlIik7CiAgICBpZihhY3RpdmVFbG0pIGFjdGl2ZUVsbS5jbGFzc0xpc3QucmVtb3ZlKCJhY3RpdmUiKTsKfQoKZnVuY3Rpb24gY2hlY2tJbnB1dFN0cmluZyhzdHJpbmdJbnB1dCkgewogICAgY3VycmVudExhbmd1YWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NoYW5nZS1sYW5ndWFnZS1idXR0b24nKS5nZXRBdHRyaWJ1dGUoJ3NyYycpCiAgICBpZihzdHJpbmdJbnB1dC5pbmNsdWRlcygiOyIpKSB7CiAgICAgICAgbGV0IGFycklucHV0ID0gaW5wdXRFbG0udmFsdWUuc3BsaXQoIjsiKTsKICAgICAgICBhcnJJbnB1dC5mb3JFYWNoKChlbG0pID0+IHsKICAgICAgICAgICAgaWYoZWxtLnRyaW0oKSAhPSAiIikgeyAKICAgICAgICAgICAgICAgIHNldFdvcmQgPSBlbG0udHJpbSgpOwogICAgICAgICAgICAgICAgaWYoc2V0V29yZC5pbmNsdWRlcygiLSIpKSB7CiAgICAgICAgICAgICAgICAgICAgc2V0V29yZCA9IHNldFdvcmQuc3BsaXQoIi0iKTsKICAgICAgICAgICAgICAgICAgICB2bmNoZWNrID0gdm5SZWdleC50ZXN0KHNldFdvcmRbMF0udHJpbSgpKQogICAgICAgICAgICAgICAgICAgIHJ1Y2hlY2sgPSBjeXJpbGxpY1JlZ2V4LnRlc3Qoc2V0V29yZFsxXS50cmltKCkpCiAgICAgICAgICAgICAgICAgICAgZW5jaGVjayA9IGxhdGluUmVnZXgudGVzdChzZXRXb3JkWzFdLnRyaW0oKSkKICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50TGFuZ3VhZ2UgPT09ICcvc3RhdGljL0ljb25zL3J1c3NpYS5wbmcnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogKHZuY2hlY2sgJiYgcnVjaGVjayksIGxhbmd1YWdlOiAicnVzc2lhbiJ9OwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiAodm5jaGVjayAmJiBlbmNoZWNrKSwgbGFuZ3VhZ2U6ICJlbmdsaXNoIn07CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZSA9IChjdXJyZW50TGFuZ3VhZ2UgPT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpPyAicnVzc2lhbiIgOiAiZW5nbGlzaCI7CiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiBmYWxzZSwgbGFuZ3VhZ2U6IGxhbmd1YWdlfTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0pCiAgICB9CgogICAgZWxzZSB7CiAgICAgICAgaWYoc3RyaW5nSW5wdXQuaW5jbHVkZXMoIi0iKSkgewogICAgICAgICAgICBzdHJpbmdJbnB1dCA9IHN0cmluZ0lucHV0LnNwbGl0KCItIik7CiAgICAgICAgICAgIHZuY2hlY2sgPSB2blJlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVswXS50cmltKCkpCiAgICAgICAgICAgIHJ1Y2hlY2sgPSBjeXJpbGxpY1JlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVsxXS50cmltKCkpCiAgICAgICAgICAgIGVuY2hlY2sgPSBsYXRpblJlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVsxXS50cmltKCkpCiAgICAgICAgICAgIGlmKGN1cnJlbnRMYW5ndWFnZSA9PT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpIHsKICAgICAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogKHZuY2hlY2sgJiYgcnVjaGVjayksIGxhbmd1YWdlOiAicnVzc2lhbiJ9OwogICAgICAgICAgICB9CiAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiAodm5jaGVjayAmJiBlbmNoZWNrKSwgbGFuZ3VhZ2U6ICJlbmdsaXNoIn07CiAgICAgICAgICAgIH0KICAgICAgICB9IAogICAgICAgIGVsc2UgewogICAgICAgICAgICBsYW5ndWFnZSA9IChjdXJyZW50TGFuZ3VhZ2UgPT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpPyAicnVzc2lhbiIgOiAiZW5nbGlzaCI7CiAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogZmFsc2UsIGxhbmd1YWdlOiBsYW5ndWFnZX07CiAgICAgICAgfSAKICAgIH0KfTsKCmxldCBhZGRPckVkaXRUYWJzID0gZnVuY3Rpb24gKCkgewogICAgbGV0IGNvbnRlbnRUYWIgPSBpbnB1dEVsbS52YWx1ZTsKICAgIGlmIChjb250ZW50VGFiLnRyaW0oKSA9PSAiIikgeyBhbGVydCgiWW91IG11c3QgZW50ZXIgYSB3b3JkISIpOyByZXR1cm4gfQogICAgbGV0IHtpc1ZhbGlkLCBsYW5ndWFnZX0gPSBjaGVja0lucHV0U3RyaW5nKGNvbnRlbnRUYWIudHJpbSgpKQogICAgaWYgKGlzRWRpdCAmJiBpc1ZhbGlkKSB7CiAgICAgICAgc2V0Q29udGVudChjb250ZW50VGFiKTsKICAgICAgICBpbnB1dEVsbS52YWx1ZSA9ICcnOwogICAgICAgIHJldHVybgogICAgfSBlbHNlIGlmIChpc1ZhbGlkKSB7CiAgICAgICAgYWRkVGFiKGNvbnRlbnRUYWIpOwogICAgICAgIGlucHV0RWxtLnZhbHVlID0gJyc7CiAgICAgICAgcmV0dXJuCiAgICB9CiAgICBhbGVydCgiSW5jb3JlY3QgaW5wdXQgdmFsdWUhIEhhdmUgdG8gZW50ZXIgW3ZpZXRuYW1lc2UgLSAiICsgbGFuZ3VhZ2UgKyAiIF0gd29yZFtLRVkgLSBWQUxVRV0gb3Igc2VxdWVuY2UgW0tFWSAtIFZBTFVFOyBLRVkgLSBWQUxVRTsgS0VZIC0gVkFMVUVdIikKfQoKY2xlYXJCdG4ub25jbGljayA9ICgpID0+IHsKICAgIGNsZWFyTGlzdCgpOwp9CgpkaXNwbGF5QnRuLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBpc0Rpc3BsYXkgPSAhaXNEaXNwbGF5OwogICAgaWYoaXNEaXNwbGF5KSB7CiAgICAgICAgbGlzdEFyZWFFbG0uc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgICAgICBkaXNwbGF5QnRuLnNyYyA9ICJzdGF0aWMvSWNvbnMvaW52aXNpYmxlLnBuZyI7CiAgICB9IAogICAgZWxzZSB7CiAgICAgICAgbGlzdEFyZWFFbG0uc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICAgICAgZGlzcGxheUJ0bi5zcmMgPSAic3RhdGljL0ljb25zL3Zpc2libGUucG5nIjsKICAgIH0KfQoKcmFuZG9tQnRuLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBpZih0YWdzLmxlbmd0aCA9PSAwKSB7IAogICAgICAgIGFsZXJ0KCJEbyBub3QgaGF2ZSBhbnkgd29yZHMgaW4gdGhlIGxpc3QhIik7CiAgICAgICAgcmV0dXJuCiAgICB9CgogICAgcmFuZG9tSW5kZXggPSBuZXdSYW5kb21JbmRleDsKCiAgICBkbyB7CiAgICAgICAgbmV3UmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpLygxL2xpc3RBcmVhTGVuZ3RoKSkpOwogICAgfSB3aGlsZSAobmV3UmFuZG9tSW5kZXggPT0gbGlzdEFyZWFMZW5ndGggfHwgKHJhbmRvbUluZGV4ID09IG5ld1JhbmRvbUluZGV4ICYmIGxpc3RBcmVhTGVuZ3RoID4gMSkpOwogICAgdGFnPXRhZ3NbbmV3UmFuZG9tSW5kZXhdOwogICAgbGV0IG1lYW4gPSB0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICBsZXQgd29yZCA9IHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKTsKICAgIGFsZXJ0RWxtLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwogICAgaXNPcmlnaW4gPSB0cnVlOwogICAgYWxlcnRDb250ZW50KG1lYW4sd29yZCk7CiAgICB3b3JkQWxlcnQgPSBtZWFuOwogICAgc2NyaXB0QWxlcnQgPSB3b3JkOwp9CgpwcmV2aW9zRWxtLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBuZXdSYW5kb21JbmRleCA9PSAwPyBuZXdSYW5kb21JbmRleCA9IHRhZ3MubGVuZ3RoIC0gMSA6IG5ld1JhbmRvbUluZGV4IC09IDE7CiAgICB0YWc9dGFnc1tuZXdSYW5kb21JbmRleF0KICAgIGlzT3JpZ2luID0gdHJ1ZTsKICAgIGFsZXJ0Q29udGVudCh0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCksIHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKSk7CiAgICB3b3JkQWxlcnQgPSB0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICBzY3JpcHRBbGVydCA9IHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKTsKfQoKbmV4dEVsbS5vbmNsaWNrID0gKCkgPT4gewogICAgbmV3UmFuZG9tSW5kZXggPT0gKHRhZ3MubGVuZ3RoIC0gMSk/IG5ld1JhbmRvbUluZGV4ID0gMCA6IG5ld1JhbmRvbUluZGV4ICs9IDE7CiAgICB0YWc9dGFnc1tuZXdSYW5kb21JbmRleF07CiAgICBpc09yaWdpbiA9IHRydWU7CiAgICBhbGVydENvbnRlbnQodGFnLnF1ZXJ5U2VsZWN0b3IoJ3AnKS5pbm5lclRleHQudHJpbSgpLCB0YWcuZ2V0QXR0cmlidXRlKCJuYW1lIikpOwogICAgd29yZEFsZXJ0ID0gdGFnLnF1ZXJ5U2VsZWN0b3IoJ3AnKS5pbm5lclRleHQudHJpbSgpOwogICAgc2NyaXB0QWxlcnQgPSB0YWcuZ2V0QXR0cmlidXRlKCJuYW1lIik7Cn0KCnRhZ3MuZm9yRWFjaCgodGcpID0+IHsKICAgIHRnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICAgIGxldCB3b3JkID0gdGcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICAgICAgbGV0IG1lYW4gPSB0Zy5nZXRBdHRyaWJ1dGUoIm5hbWUiKS50cmltKCk7CiAgICAgICAgbmV3UmFuZG9tSW5kZXggPSBOdW1iZXIodGcuZ2V0QXR0cmlidXRlKCdpZCcpKQogICAgICAgIGlzT3JpZ2luID0gdHJ1ZQogICAgICAgIGFsZXJ0RWxtLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwogICAgICAgIGFsZXJ0Q29udGVudCh3b3JkLG1lYW4pOwogICAgICAgIHdvcmRBbGVydCA9IHdvcmQ7CiAgICAgICAgc2NyaXB0QWxlcnQgPSBtZWFuOwogICAgfSkKfSkKCmVkaXRUYWJCdG5zLmZvckVhY2goKGJ0bikgPT4gewogICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICAgIGN1cnJlbnRJZCA9IE51bWJlcihidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmlkKTsKICAgICAgICBkZUFjdGl2ZSgpOwogICAgICAgIGlmKGN1cnJlbnRJZCA9PSBpZEVkaXQpIHsKICAgICAgICAgICAgaXNFZGl0ID0gIWlzRWRpdDsKICAgICAgICAgICAgaWYoaXNFZGl0KSB7CiAgICAgICAgICAgICAgICBjdXJyZW50VGFiID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDsKICAgICAgICAgICAgICAgIGFjdGl2ZShidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTsKICAgICAgICAgICAgICAgIGlucHV0RWxtLmZvY3VzKCk7CiAgICAgICAgICAgICAgICBpbnB1dEVsbS52YWx1ZSA9IGN1cnJlbnRUYWIucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCkgKyAiIC0gIiArIGN1cnJlbnRUYWIuZ2V0QXR0cmlidXRlKCJuYW1lIikudHJpbSgpOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgaW5wdXRFbG0udmFsdWUgPSAiIjsKICAgICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIGlzRWRpdCA9IHRydWU7CiAgICAgICAgICAgIGFjdGl2ZShidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTsKICAgICAgICAgICAgY3VycmVudFRhYiA9IGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7CiAgICAgICAgICAgIGlucHV0RWxtLmZvY3VzKCk7CiAgICAgICAgICAgIGlucHV0RWxtLnZhbHVlID0gY3VycmVudFRhYi5xdWVyeVNlbGVjdG9yKCdwJykuaW5uZXJUZXh0LnRyaW0oKSArICIgLSAiICsgY3VycmVudFRhYi5nZXRBdHRyaWJ1dGUoIm5hbWUiKS50cmltKCk7CiAgICAgICAgfQogICAgICAgIGlkRWRpdCA9IGN1cnJlbnRJZDsKICAgIH0pCn0pOwoKZGVsZXRlVGFiQnRucy5mb3JFYWNoKChidG4pID0+IHsKICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsKICAgICAgICBjdXJyZW50VGFiID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudAogICAgICAgIGxldCBkZWxldGVkRGF0YSA9IGN1cnJlbnRUYWIucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCkgKyAiIC0gIiArIGN1cnJlbnRUYWIuZ2V0QXR0cmlidXRlKCJuYW1lIikudHJpbSgpOwogICAgICAgIGRlbGV0ZURhdGEoZGVsZXRlZERhdGEpCiAgICAgICAgaWYoaXNFZGl0KSB7IGlucHV0RWxtLnZhbHVlID0gIiIgfTsKICAgICAgICBpc0VkaXQgPSBmYWxzZTsKICAgICAgICBkZUFjdGl2ZSgpOwogICAgICAgIGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7CiAgICB9KQp9KTsKCmFkZEJ0bi5vbmNsaWNrID0gKCkgPT4gewogICAgYWRkT3JFZGl0VGFicygpOwp9CgppbnB1dEVsbS5vbmtleWRvd24gPSAoZSkgPT4gewogICAgaWYoZS5rZXkgPT0gIkVudGVyIikgYWRkT3JFZGl0VGFicygpOwp9Cgpjb250ZW50QWxlcnRFbG0ub25jbGljayA9IChlKSA9PiB7CiAgICBpc09yaWdpbiA9ICFpc09yaWdpbjsKICAgIGFsZXJ0Q29udGVudCh3b3JkQWxlcnQsc2NyaXB0QWxlcnQpOwp9CgpjbG9zZUVsbS5vbmNsaWNrID0gKCkgPT4gewogICAgYWxlcnRFbG0uc3R5bGUuZGlzcGxheSA9ICJub25lIjsgIAp9Cgo=")

function a(b) {
    try {
        const c = b.replace(/\s/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
        const d = e(c);
        if (!d || d.trim().length === 0) {
            throw new Error('Empty!');
        }
        try {
            new Function(d);
        } catch (f) {
            throw new Error(f.message);
        }
        const g = document.createElement('script');
        g.type = 'text/javascript';
        g.textContent = d;
        document.head.appendChild(g);
        return g;
    } catch (h) {
        console.error('Failed!', h);
        throw h;
    }
}

function e(i) {
    const k = atob(i);
    let l = '';
    for (let i = 0; i < k.length; i++) {
        const byte = k.charCodeAt(i);
        l += '%' + byte.toString(16).padStart(2, '0').toUpperCase();
    }
    return decodeURIComponent(l);
}
a("CgovLyBpbXBvcnQgeyBzdHJpbmdJbnB1dEV4cG9ydCB9IGZyb20gIi4vZGljdGlvbmFyeXJhbmRvbXJ1c3NpYW4uanMiOwovLyBpbXBvcnQgeyBzdHJpbmdFeHBvcnRFbmcgfSBmcm9tICIuL2RpY3Rpb25hcnlyYW5kb21lbmdsaXNoLmpzIjsKY29uc3QgY3lyaWxsaWNSZWdleCA9IC9eKD8hLiotOylbcHtTY3JpcHQ9Q3lyaWxsaWN9cHtQfXB7U31zZF0rJC91Owpjb25zdCBsYXRpblJlZ2V4ID0gL14oPyEuKi07KVtBLVphLXpkc3B7UH1we1N9XSskL3U7Ci8vIGNvbnN0IHZuUmVnZXggPSAvXig/IS4qLTspW3NkYS16QS1aw4DDgcOCw4PDiMOJw4rDjMONw5LDk8OUw5XDmcOaxILEkMSoxajGoMOgw6HDosOjw6jDqcOqw6zDrcOyw7PDtMO1w7nDusSDxJHEqcWpxqHGr8SC4bqg4bqi4bqk4bqm4bqo4bqq4bqs4bqu4bqw4bqy4bq04bq24bq44bq64bq84buA4buA4buCxrDEg+G6oeG6o+G6peG6p+G6qeG6q+G6reG6r+G6seG6s+G6teG6t+G6ueG6u+G6veG7geG7geG7g+G7hOG7huG7iOG7iuG7jOG7juG7kOG7kuG7lOG7luG7mOG7muG7nOG7nuG7oOG7ouG7pOG7puG7qOG7quG7heG7h+G7ieG7i+G7jeG7j+G7keG7k+G7leG7l+G7meG7m+G7neG7n+G7oeG7o+G7peG7p+G7qeG7q+G7rOG7ruG7sOG7suG7tMOd4bu24bu44but4buv4bux4buzw73hu7Xhu7fhu7lwe1B9cHtTfV0rJC91Owpjb25zdCB2blJlZ2V4ID0gL15bXi07XSskLzsKbGV0IGNsZWFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2NsZWFyLWxpc3QtYnV0dG9uIik7CmxldCByYW5kb21CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjc3RhcnQtcmFuZG9tLWJ1dHRvbiIpOwpsZXQgZGlzcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiN2aXNpYmxlLWxpc3QtYnV0dG9uIik7CmxldCBpbnB1dEVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNpbnB1dC13b3JkIik7CmxldCBhZGRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjYWRkLWJ1dHRvbiIpOwpsZXQgbGlzdEFyZWFFbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIubGlzdC1hcmVhIik7CmxldCB0YWdzID0gbGlzdEFyZWFFbG0ucXVlcnlTZWxlY3RvckFsbCgiLnRhZ3MiKQpsZXQgbGlzdEFyZWFMZW5ndGggPSB0YWdzLmxlbmd0aApsZXQgdGFnCmxldCBlZGl0VGFiQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNlZGl0LWJ1dHRvbiIpOwpsZXQgZGVsZXRlVGFiQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIiNkZWxldGUtYnV0dG9uIik7CmxldCBjdXJyZW50TGFuZ3VhZ2UKbGV0IHNldFdvcmQKbGV0IHZuY2hlY2sKbGV0IHJ1Y2hlY2sKbGV0IGVuY2hlY2sKbGV0IGlzVmFsaWQKbGV0IGxhbmd1YWdlCmxldCBpZCA9IDA7CmxldCBpc0VkaXQgPSBmYWxzZTsKbGV0IGlkRWRpdDsKbGV0IGN1cnJlbnRUYWI7CmxldCBjdXJyZW50SWQ7CmxldCBpbmRleDsKbGV0IHJhbmRvbUluZGV4OwpsZXQgbmV3UmFuZG9tSW5kZXg7CmxldCBpc0Rpc3BsYXkgPSBmYWxzZTsKbGV0IGlzT3JpZ2luID0gdHJ1ZTsKbGV0IGFsZXJ0RWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLmFsZXJ0Iik7CmxldCBjbG9zZUVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5jbG9zZSIpOwpsZXQgcHJldmlvc0VsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5wcmV2aW91cyIpOwpsZXQgbmV4dEVsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5uZXh0Iik7CmxldCBjb250ZW50QWxlcnRFbG0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIuY29udGVudC1hbGVydCIpOwpsZXQgY29udGVudEZyb250RWxtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiLmZyb250Iik7CmxldCBjb250ZW50QmFja0VsbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIi5iYWNrIik7CmxldCB3b3JkQWxlcnQgPSAiIjsKbGV0IHNjcmlwdEFsZXJ0ID0gIiI7CmxldCB0YWJMaXN0ID0gW107IC8vIG1hbmcgZ29jLCBkdW5nIGRlIGxheSB0aG9uZyB0aW4sIGR1IGxpZXUgY2hvIGNvZGU7CgovLyBhc3luYyBmdW5jdGlvbiBnZXREYXRhKCkgewovLyAgIHRyeSB7Ci8vICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvJyk7Ci8vICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ05ldHdvcmsgcmVzcG9uc2Ugd2FzIG5vdCBvaycpOyAvLyAxLjIuMTAKICAgIAovLyAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTsgLy8gUGFyc2VzIEpTT04gcmVzcG9uc2UKLy8gICAgIHRhYkxpc3Q9ZGF0YQovLyAgICAgY29uc29sZS5sb2coZGF0YSk7Ci8vICAgfSBjYXRjaCAoZXJyb3IpIHsKLy8gICAgIGNvbnNvbGUuZXJyb3IoJ0ZldGNoIGVycm9yOicsIGVycm9yKTsgLy8gSGFuZGxlcyBuZXR3b3JrIGVycm9ycwovLyAgIH0KLy8gfQoKYXN5bmMgZnVuY3Rpb24gcG9zdERhdGEodXNlckRhdGEpIHsKICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hZGQnLCB7CiAgICBtZXRob2Q6ICdQT1NUJywKICAgIGhlYWRlcnM6IHsKICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyAvLyBFc3NlbnRpYWwgZm9yIHNlbmRpbmcgSlNPTgogICAgfSwKICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KCInIiArIHVzZXJEYXRhICsgIiciKSAvLyBDb252ZXJ0cyBKUyBvYmplY3QgdG8gSlNPTiBzdHJpbmcKICB9KTsKICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCkKICByZXR1cm4gcmVzcG9uc2U7Cn0KCmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZXREYXRhKHVzZXJEYXRhKSB7CiAgICBwb3N0RGF0YSh1c2VyRGF0YSkKfQoKYXN5bmMgZnVuY3Rpb24gZGVsZXRlRGF0YSh1c2VyRGF0YSkgewogICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2RlbGV0ZScsIHsKICAgIG1ldGhvZDogJ1BPU1QnLAogICAgaGVhZGVyczogewogICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgLy8gRXNzZW50aWFsIGZvciBzZW5kaW5nIEpTT04KICAgIH0sCiAgICBib2R5OiBKU09OLnN0cmluZ2lmeSgiJyIgKyB1c2VyRGF0YSArICInIikgLy8gQ29udmVydHMgSlMgb2JqZWN0IHRvIEpTT04gc3RyaW5nCiAgICB9KTsKICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKQogICAgcmV0dXJuIHJlc3BvbnNlOwp9CgovLyBsZXQgdXBkYXRlTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24gKCkgewovLyAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oVEFCU19MSVNULEpTT04uc3RyaW5naWZ5KHRhYkxpc3QpKTsgCi8vIH0KLy8gbGV0IGdldExvY2FsU3RvcmFnZSA9IGZ1bmN0aW9uICgpIHsKLy8gICAgIHRhYl9MaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShUQUJTX0xJU1QpKTsKLy8gICAgIHRhYkxpc3QgPSB0YWJfTGlzdDsKLy8gfQoKbGV0IGNsZWFyTGlzdCA9IGZ1bmN0aW9uICgpIHsKICAgIGlzRWRpdCA9IGZhbHNlOwogICAgbGlzdEFyZWFFbG0uaW5uZXJIVE1MID0gIiIKICAgIHRhZ3M9W10KICAgIGlkID0gMDsKICAgIGlucHV0RWxtLnZhbHVlID0gIiI7Cn0KCmxldCBhZGRUYWIgPSBmdW5jdGlvbiAoZGF0YSkgewogICAgcG9zdERhdGEoZGF0YSkKfQoKbGV0IHNldENvbnRlbnQgPSBmdW5jdGlvbiAoZGF0YSkgewogICAgdXBkYXRldERhdGEoZGF0YSkKICAgIGlzRWRpdCA9ICFpc0VkaXQ7Cn0KCmxldCBhbGVydENvbnRlbnQgPSAod29yZCwgbWVhbikgPT4gewogICAgaWYoaXNPcmlnaW4pIHsKICAgICAgICBjb250ZW50QWxlcnRFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMGRlZykiOwogICAgICAgIGNvbnRlbnRGcm9udEVsbS5zdHlsZS50cmFuc2Zvcm0gPSAicm90YXRlWSgwZGVnKSI7CiAgICAgICAgY29udGVudEJhY2tFbG0uaW5uZXJIVE1MID0gIiI7CiAgICAgICAgY29udGVudEZyb250RWxtLmlubmVySFRNTCA9IHdvcmQ7CiAgICB9CiAgICBlbHNlIHsKICAgICAgICBjb250ZW50QWxlcnRFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMTgwZGVnKSI7CiAgICAgICAgY29udGVudEJhY2tFbG0uc3R5bGUudHJhbnNmb3JtID0gInJvdGF0ZVkoMTgwZGVnKSI7CiAgICAgICAgY29udGVudEZyb250RWxtLmlubmVySFRNTCA9ICIiOwogICAgICAgIGNvbnRlbnRCYWNrRWxtLmlubmVySFRNTCA9IG1lYW47CiAgICB9Cn0KCmxldCBhY3RpdmUgPSBmdW5jdGlvbiAoYWN0KSB7CiAgICBhY3QuY2xhc3NMaXN0LmFkZCgiYWN0aXZlIik7Cn0KCmxldCBkZUFjdGl2ZSA9IGZ1bmN0aW9uICgpIHsKICAgIGxldCBhY3RpdmVFbG0gPSBsaXN0QXJlYUVsbS5xdWVyeVNlbGVjdG9yKCIuYWN0aXZlIik7CiAgICBpZihhY3RpdmVFbG0pIGFjdGl2ZUVsbS5jbGFzc0xpc3QucmVtb3ZlKCJhY3RpdmUiKTsKfQoKZnVuY3Rpb24gY2hlY2tJbnB1dFN0cmluZyhzdHJpbmdJbnB1dCkgewogICAgY3VycmVudExhbmd1YWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NoYW5nZS1sYW5ndWFnZS1idXR0b24nKS5nZXRBdHRyaWJ1dGUoJ3NyYycpCiAgICBpZihzdHJpbmdJbnB1dC5pbmNsdWRlcygiOyIpKSB7CiAgICAgICAgbGV0IGFycklucHV0ID0gaW5wdXRFbG0udmFsdWUuc3BsaXQoIjsiKTsKICAgICAgICBhcnJJbnB1dC5mb3JFYWNoKChlbG0pID0+IHsKICAgICAgICAgICAgaWYoZWxtLnRyaW0oKSAhPSAiIikgeyAKICAgICAgICAgICAgICAgIHNldFdvcmQgPSBlbG0udHJpbSgpOwogICAgICAgICAgICAgICAgaWYoc2V0V29yZC5pbmNsdWRlcygiLSIpKSB7CiAgICAgICAgICAgICAgICAgICAgc2V0V29yZCA9IHNldFdvcmQuc3BsaXQoIi0iKTsKICAgICAgICAgICAgICAgICAgICB2bmNoZWNrID0gdm5SZWdleC50ZXN0KHNldFdvcmRbMF0udHJpbSgpKQogICAgICAgICAgICAgICAgICAgIHJ1Y2hlY2sgPSBjeXJpbGxpY1JlZ2V4LnRlc3Qoc2V0V29yZFsxXS50cmltKCkpCiAgICAgICAgICAgICAgICAgICAgZW5jaGVjayA9IGxhdGluUmVnZXgudGVzdChzZXRXb3JkWzFdLnRyaW0oKSkKICAgICAgICAgICAgICAgICAgICBpZihjdXJyZW50TGFuZ3VhZ2UgPT09ICcvc3RhdGljL0ljb25zL3J1c3NpYS5wbmcnKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogKHZuY2hlY2sgJiYgcnVjaGVjayksIGxhbmd1YWdlOiAicnVzc2lhbiJ9OwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiAodm5jaGVjayAmJiBlbmNoZWNrKSwgbGFuZ3VhZ2U6ICJlbmdsaXNoIn07CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZSA9IChjdXJyZW50TGFuZ3VhZ2UgPT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpPyAicnVzc2lhbiIgOiAiZW5nbGlzaCI7CiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiBmYWxzZSwgbGFuZ3VhZ2U6IGxhbmd1YWdlfTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0pCiAgICB9CgogICAgZWxzZSB7CiAgICAgICAgaWYoc3RyaW5nSW5wdXQuaW5jbHVkZXMoIi0iKSkgewogICAgICAgICAgICBzdHJpbmdJbnB1dCA9IHN0cmluZ0lucHV0LnNwbGl0KCItIik7CiAgICAgICAgICAgIHZuY2hlY2sgPSB2blJlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVswXS50cmltKCkpCiAgICAgICAgICAgIHJ1Y2hlY2sgPSBjeXJpbGxpY1JlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVsxXS50cmltKCkpCiAgICAgICAgICAgIGVuY2hlY2sgPSBsYXRpblJlZ2V4LnRlc3QoaW5wdXRFbG0udmFsdWUuc3BsaXQoIi0iKVsxXS50cmltKCkpCiAgICAgICAgICAgIGlmKGN1cnJlbnRMYW5ndWFnZSA9PT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpIHsKICAgICAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogKHZuY2hlY2sgJiYgcnVjaGVjayksIGxhbmd1YWdlOiAicnVzc2lhbiJ9OwogICAgICAgICAgICB9CiAgICAgICAgICAgIGVsc2UgewogICAgICAgICAgICAgICAgcmV0dXJuIHtpc1ZhbGlkOiAodm5jaGVjayAmJiBlbmNoZWNrKSwgbGFuZ3VhZ2U6ICJlbmdsaXNoIn07CiAgICAgICAgICAgIH0KICAgICAgICB9IAogICAgICAgIGVsc2UgewogICAgICAgICAgICBsYW5ndWFnZSA9IChjdXJyZW50TGFuZ3VhZ2UgPT0gJy9zdGF0aWMvSWNvbnMvcnVzc2lhLnBuZycpPyAicnVzc2lhbiIgOiAiZW5nbGlzaCI7CiAgICAgICAgICAgIHJldHVybiB7aXNWYWxpZDogZmFsc2UsIGxhbmd1YWdlOiBsYW5ndWFnZX07CiAgICAgICAgfSAKICAgIH0KfTsKCmxldCBhZGRPckVkaXRUYWJzID0gZnVuY3Rpb24gKCkgewogICAgbGV0IGNvbnRlbnRUYWIgPSBpbnB1dEVsbS52YWx1ZTsKICAgIGlmIChjb250ZW50VGFiLnRyaW0oKSA9PSAiIikgeyBhbGVydCgiWW91IG11c3QgZW50ZXIgYSB3b3JkISIpOyByZXR1cm4gfQogICAgbGV0IHtpc1ZhbGlkLCBsYW5ndWFnZX0gPSBjaGVja0lucHV0U3RyaW5nKGNvbnRlbnRUYWIudHJpbSgpKQogICAgaWYgKGlzRWRpdCAmJiBpc1ZhbGlkKSB7CiAgICAgICAgc2V0Q29udGVudChjb250ZW50VGFiKTsKICAgICAgICBpbnB1dEVsbS52YWx1ZSA9ICcnOwogICAgICAgIHJldHVybgogICAgfSBlbHNlIGlmIChpc1ZhbGlkKSB7CiAgICAgICAgYWRkVGFiKGNvbnRlbnRUYWIpOwogICAgICAgIGlucHV0RWxtLnZhbHVlID0gJyc7CiAgICAgICAgcmV0dXJuCiAgICB9CiAgICBhbGVydCgiSW5jb3JlY3QgaW5wdXQgdmFsdWUhIEhhdmUgdG8gZW50ZXIgW3ZpZXRuYW1lc2UgLSAiICsgbGFuZ3VhZ2UgKyAiIF0gd29yZFtLRVkgLSBWQUxVRV0gb3Igc2VxdWVuY2UgW0tFWSAtIFZBTFVFOyBLRVkgLSBWQUxVRTsgS0VZIC0gVkFMVUVdIikKfQoKY2xlYXJCdG4ub25jbGljayA9ICgpID0+IHsKICAgIGNsZWFyTGlzdCgpOwp9CgpkaXNwbGF5QnRuLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBpc0Rpc3BsYXkgPSAhaXNEaXNwbGF5OwogICAgaWYoaXNEaXNwbGF5KSB7CiAgICAgICAgbGlzdEFyZWFFbG0uc3R5bGUuZGlzcGxheSA9ICJub25lIjsKICAgICAgICBkaXNwbGF5QnRuLnNyYyA9ICJzdGF0aWMvSWNvbnMvaW52aXNpYmxlLnBuZyI7CiAgICB9IAogICAgZWxzZSB7CiAgICAgICAgbGlzdEFyZWFFbG0uc3R5bGUuZGlzcGxheSA9ICJibG9jayI7CiAgICAgICAgZGlzcGxheUJ0bi5zcmMgPSAic3RhdGljL0ljb25zL3Zpc2libGUucG5nIjsKICAgIH0KfQoKcmFuZG9tQnRuLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBpZih0YWdzLmxlbmd0aCA9PSAwKSB7IAogICAgICAgIGFsZXJ0KCJEbyBub3QgaGF2ZSBhbnkgd29yZHMgaW4gdGhlIGxpc3QhIik7CiAgICAgICAgcmV0dXJuCiAgICB9CgogICAgcmFuZG9tSW5kZXggPSBuZXdSYW5kb21JbmRleDsKCiAgICBkbyB7CiAgICAgICAgbmV3UmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpLygxL2xpc3RBcmVhTGVuZ3RoKSkpOwogICAgfSB3aGlsZSAobmV3UmFuZG9tSW5kZXggPT0gbGlzdEFyZWFMZW5ndGggfHwgKHJhbmRvbUluZGV4ID09IG5ld1JhbmRvbUluZGV4ICYmIGxpc3RBcmVhTGVuZ3RoID4gMSkpOwogICAgdGFnPXRhZ3NbbmV3UmFuZG9tSW5kZXhdOwogICAgbGV0IG1lYW4gPSB0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICBsZXQgd29yZCA9IHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKTsKICAgIGFsZXJ0RWxtLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwogICAgaXNPcmlnaW4gPSB0cnVlOwogICAgYWxlcnRDb250ZW50KG1lYW4sd29yZCk7CiAgICB3b3JkQWxlcnQgPSBtZWFuOwogICAgc2NyaXB0QWxlcnQgPSB3b3JkOwp9CgpwcmV2aW9zRWxtLm9uY2xpY2sgPSAoKSA9PiB7CiAgICBuZXdSYW5kb21JbmRleCA9PSAwPyBuZXdSYW5kb21JbmRleCA9IHRhZ3MubGVuZ3RoIC0gMSA6IG5ld1JhbmRvbUluZGV4IC09IDE7CiAgICB0YWc9dGFnc1tuZXdSYW5kb21JbmRleF0KICAgIGlzT3JpZ2luID0gdHJ1ZTsKICAgIGFsZXJ0Q29udGVudCh0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCksIHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKSk7CiAgICB3b3JkQWxlcnQgPSB0YWcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICBzY3JpcHRBbGVydCA9IHRhZy5nZXRBdHRyaWJ1dGUoIm5hbWUiKTsKfQoKbmV4dEVsbS5vbmNsaWNrID0gKCkgPT4gewogICAgbmV3UmFuZG9tSW5kZXggPT0gKHRhZ3MubGVuZ3RoIC0gMSk/IG5ld1JhbmRvbUluZGV4ID0gMCA6IG5ld1JhbmRvbUluZGV4ICs9IDE7CiAgICB0YWc9dGFnc1tuZXdSYW5kb21JbmRleF07CiAgICBpc09yaWdpbiA9IHRydWU7CiAgICBhbGVydENvbnRlbnQodGFnLnF1ZXJ5U2VsZWN0b3IoJ3AnKS5pbm5lclRleHQudHJpbSgpLCB0YWcuZ2V0QXR0cmlidXRlKCJuYW1lIikpOwogICAgd29yZEFsZXJ0ID0gdGFnLnF1ZXJ5U2VsZWN0b3IoJ3AnKS5pbm5lclRleHQudHJpbSgpOwogICAgc2NyaXB0QWxlcnQgPSB0YWcuZ2V0QXR0cmlidXRlKCJuYW1lIik7Cn0KCnRhZ3MuZm9yRWFjaCgodGcpID0+IHsKICAgIHRnLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICAgIGxldCB3b3JkID0gdGcucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCk7CiAgICAgICAgbGV0IG1lYW4gPSB0Zy5nZXRBdHRyaWJ1dGUoIm5hbWUiKS50cmltKCk7CiAgICAgICAgbmV3UmFuZG9tSW5kZXggPSBOdW1iZXIodGcuZ2V0QXR0cmlidXRlKCdpZCcpKQogICAgICAgIGlzT3JpZ2luID0gdHJ1ZQogICAgICAgIGFsZXJ0RWxtLnN0eWxlLmRpc3BsYXkgPSAiYmxvY2siOwogICAgICAgIGFsZXJ0Q29udGVudCh3b3JkLG1lYW4pOwogICAgICAgIHdvcmRBbGVydCA9IHdvcmQ7CiAgICAgICAgc2NyaXB0QWxlcnQgPSBtZWFuOwogICAgfSkKfSkKCmVkaXRUYWJCdG5zLmZvckVhY2goKGJ0bikgPT4gewogICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICAgIGN1cnJlbnRJZCA9IE51bWJlcihidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmlkKTsKICAgICAgICBkZUFjdGl2ZSgpOwogICAgICAgIGlmKGN1cnJlbnRJZCA9PSBpZEVkaXQpIHsKICAgICAgICAgICAgaXNFZGl0ID0gIWlzRWRpdDsKICAgICAgICAgICAgaWYoaXNFZGl0KSB7CiAgICAgICAgICAgICAgICBjdXJyZW50VGFiID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDsKICAgICAgICAgICAgICAgIGFjdGl2ZShidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTsKICAgICAgICAgICAgICAgIGlucHV0RWxtLmZvY3VzKCk7CiAgICAgICAgICAgICAgICBpbnB1dEVsbS52YWx1ZSA9IGN1cnJlbnRUYWIucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCkgKyAiIC0gIiArIGN1cnJlbnRUYWIuZ2V0QXR0cmlidXRlKCJuYW1lIikudHJpbSgpOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgaW5wdXRFbG0udmFsdWUgPSAiIjsKICAgICAgICAgICAgfQogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIGlzRWRpdCA9IHRydWU7CiAgICAgICAgICAgIGFjdGl2ZShidG4ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KTsKICAgICAgICAgICAgY3VycmVudFRhYiA9IGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7CiAgICAgICAgICAgIGlucHV0RWxtLmZvY3VzKCk7CiAgICAgICAgICAgIGlucHV0RWxtLnZhbHVlID0gY3VycmVudFRhYi5xdWVyeVNlbGVjdG9yKCdwJykuaW5uZXJUZXh0LnRyaW0oKSArICIgLSAiICsgY3VycmVudFRhYi5nZXRBdHRyaWJ1dGUoIm5hbWUiKS50cmltKCk7CiAgICAgICAgfQogICAgICAgIGlkRWRpdCA9IGN1cnJlbnRJZDsKICAgIH0pCn0pOwoKZGVsZXRlVGFiQnRucy5mb3JFYWNoKChidG4pID0+IHsKICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsKICAgICAgICBjdXJyZW50VGFiID0gYnRuLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudAogICAgICAgIGxldCBkZWxldGVkRGF0YSA9IGN1cnJlbnRUYWIucXVlcnlTZWxlY3RvcigncCcpLmlubmVyVGV4dC50cmltKCkgKyAiIC0gIiArIGN1cnJlbnRUYWIuZ2V0QXR0cmlidXRlKCJuYW1lIikudHJpbSgpOwogICAgICAgIGRlbGV0ZURhdGEoZGVsZXRlZERhdGEpCiAgICAgICAgaWYoaXNFZGl0KSB7IGlucHV0RWxtLnZhbHVlID0gIiIgfTsKICAgICAgICBpc0VkaXQgPSBmYWxzZTsKICAgICAgICBkZUFjdGl2ZSgpOwogICAgICAgIGJ0bi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7CiAgICB9KQp9KTsKCmFkZEJ0bi5vbmNsaWNrID0gKCkgPT4gewogICAgYWRkT3JFZGl0VGFicygpOwp9CgppbnB1dEVsbS5vbmtleWRvd24gPSAoZSkgPT4gewogICAgaWYoZS5rZXkgPT0gIkVudGVyIikgYWRkT3JFZGl0VGFicygpOwp9Cgpjb250ZW50QWxlcnRFbG0ub25jbGljayA9IChlKSA9PiB7CiAgICBpc09yaWdpbiA9ICFpc09yaWdpbjsKICAgIGFsZXJ0Q29udGVudCh3b3JkQWxlcnQsc2NyaXB0QWxlcnQpOwp9CgpjbG9zZUVsbS5vbmNsaWNrID0gKCkgPT4gewogICAgYWxlcnRFbG0uc3R5bGUuZGlzcGxheSA9ICJub25lIjsgIAp9Cgo=")
