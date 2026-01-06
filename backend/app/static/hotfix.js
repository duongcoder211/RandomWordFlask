function checkInputString(stringInput) {
    currentLanguage = document.querySelector('#change-language-button').getAttribute('src')
    if(stringInput.includes(";")) {
        let arrInput = inputElm.value.split(";");
        arrInput.forEach((elm) => {
            if(elm.trim() != "") { 
                if(elm.includes("-")) {
                    elm = elm.split("-");
                    vncheck = vnRegex.test(elm[0].trim())
                    rucheck = cyrillicRegex.test(elm[1].trim())
                    encheck = latinRegex.test(elm[1].trim())

                    if((currentLanguage == '/static/Icons/russia.png') && ((vncheck && rucheck) == false)) {
                        return {isValid: false, language: "russian"};
                    }
                    else if ((currentLanguage == '/static/Icons/united-states.png') && ((vncheck && encheck) == false)) {
                        return {isValid: false, language: "english"};
                    }
                } else {
                    language = (currentLanguage == '/static/Icons/russia.png')? "russian" : "english";
                    return {isValid: false, language: language};
                }
            }
        })
        if((currentLanguage == '/static/Icons/russia.png')) {
            return {isValid: true, language: "russian"};
        }
        else if ((currentLanguage == '/static/Icons/united-states.png')) {
            return {isValid: true, language: "english"};
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