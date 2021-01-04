var globalAnswer = "0";

function removeLeadingZero(string) {
    var newString = string;
    if (newString[0] === "0") {
        newString = newString.slice(1);
    }
    return newString;
}

function makeCurrentValueNegative() {
    var currentValue = document.getElementById("currentValue").innerHTML;
    if (currentValue[0] === "-") {
        currentValue = currentValue.slice(1);
        $("#currentValue").html(currentValue);
    } else {
        $("#currentValue").prepend("-");
    }
    return currentValue;
}

function removeLeadingSymbol(string) {
    var newString = string;
    var symbols = ["*", "/", "+", "-", "%"];
    if (symbols.includes(newString[0])) {
        newString = newString.slice(1);
    }
    return newString;
}

function storeAnswer(value) {
    var value = removeLeadingZero(value);
    globalAnswer = value;
    $("#globalAnswer").html(globalAnswer);
    return value;
}

function getCurrentValue() {
    var currentValue = document.getElementById("currentValue").innerHTML;
    return currentValue;
}

function clearCurrentValue() {
    $("#currentValue").html("0");
    return storeAnswer("0");
}

function equals() {
    var answer = globalAnswer;
    var removeEqualSign = answer.split("=");
    var newAnswer = removeEqualSign[0];
    newAnswer = replaceTimesAndDivides(newAnswer);
    newAnswer = removeLeadingSymbol(newAnswer);
    var finalAnswer = eval(newAnswer);
    finalAnswer = finalAnswer.toString();
    storeAndReset(finalAnswer, finalAnswer);
    return finalAnswer;
}

function clickButton(event) {
    $(".btn").click(function (event) {
        var thingClicked = this.innerHTML;

        if ($(this).hasClass("orange")) {
            return addSymbolToAnswer(thingClicked);
        }

        if ($(this).hasClass("num")) {
            return createNewNumber(thingClicked);
        }

        if ($(this).hasClass("clear")) {
            return clearCurrentValue();
        }

        if ($(this).hasClass("negative")) {
            return makeCurrentValueNegative();
        }

        if ($(this).hasClass("equals")) {
            addSymbolToAnswer(thingClicked);
            return equals();
        }
    });
}
clickButton(event);

function replaceTimesAndDivides(string) {
    string = string.replace("x", "*");
    string = string.replace("÷", "/");
    return string;
}

function addSymbolToAnswer(string) {
    $(".negative").prop("disabled", true);
    var symbolString = string;
    symbolString = replaceTimesAndDivides(symbolString);
    var currentValue = getCurrentValue();
    var symbols = ["*", "/", "+", "-", "%"];

    if (globalAnswer === currentValue) {
        var newGlobalAnswer = currentValue + symbolString;
        return storeAndReset(newGlobalAnswer, symbolString);
    }
    if (symbols.includes(currentValue)) {
        currentValue = currentValue.replace(currentValue, symbolString);
        var newGlobalAnswer = globalAnswer.slice(0, -1) + currentValue;
        return storeAndReset(newGlobalAnswer, symbolString);
    } else {
        currentValue = currentValue + symbolString;
        var newGlobalAnswer = globalAnswer + currentValue;
        return storeAndReset(newGlobalAnswer, symbolString);
    }
}

function storeAndReset(newGlobalAnswer, newCurrentValue) {
    storeAnswer(newGlobalAnswer);
    $("#currentValue").html(newCurrentValue);
    return newCurrentValue;
}

function createNewNumber(string) {
    $(".negative").prop("disabled", false);
    var thingClicked = string;
    var currentValue = getCurrentValue();
    var newString = currentValue + thingClicked;
    newString = removeLeadingZero(newString);
    newString = removeLeadingSymbol(newString);
    $("#currentValue").html(newString);
    return newString;
}
