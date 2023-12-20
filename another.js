var pos = require("pos");

var notes = ["note", "material", "concept", "lecture", "topic"];
var reminders = ["when", "where"];
var finance = ["much", "spend", "money", "pay"];
var guide = ["how", "guide"];

function testSentence(target) {
    var words = new pos.Lexer().lex(target);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);
    var result = [];
    for (i = 0; i < taggedWords.length; i++) {
        if (
            taggedWords[i][1].startsWith("V") ||
            taggedWords[i][1].startsWith("N") ||
            taggedWords[i][1].startsWith("CD") ||
            taggedWords[i][1].startsWith("W") ||
            taggedWords[i][1].startsWith("JJ")
        ) {
            if (taggedWords[i][0] != "/" && taggedWords[i][0] != "-" && taggedWords[i][0] != "\\") {
                result.push(taggedWords[i]);
            }
        }
    }

    result = getType(result);
    console.log(result[0]);
    result = getRestriction(result[1]);
    console.log(result[0]);
    console.log(getSubject(result[1]));
    console.log();
}

function getType(wordArray) {
    for (i = 0; i < wordArray.length; i++) {
        let word = wordArray[i][0].toLowerCase();
        for (j = 0; j < notes.length; j++) {
            if (word.includes(notes[j])) {
                wordArray.splice(i, 1);
                return ["notes", wordArray];
            }
        }
    }
    for (i = 0; i < wordArray.length; i++) {
        let word = wordArray[i][0].toLowerCase();
        for (j = 0; j < finance.length; j++) {
            if (word.includes(finance[j])) {
                wordArray.splice(i, 1);
                return ["finance", wordArray];
            }
        }
    }
    for (i = 0; i < wordArray.length; i++) {
        let word = wordArray[i][0].toLowerCase();
        for (j = 0; j < guide.length; j++) {
            if (word.includes(guide[j])) {
                wordArray.splice(i, 1);
                return ["guide", wordArray];
            }
        }
    }

    return ["reminder", wordArray];
}

function getSubject(wordArray) {
    let output = [];
    for (i = 0; i < wordArray.length; i++) {
        if (wordArray[i][1].startsWith("JJ") || wordArray[i][1].startsWith("NN")) {
            output.push(wordArray[i]);
        }
    }
    let str = "";
    for (i = 0; i < output.length; i++) {
        str += output[i][0] + " ";
    }
    return str;
}

const monthArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december"];

function getRestriction(wordArray) {
    let tempResult = "";
    for (i = wordArray.length - 1; i >= 0; i--) {
        let type = wordArray[i][1];
        let word = wordArray[i][0].toLowerCase();
        for (j = 0; j < monthArray.length; j++) {
            if (word == monthArray[j]) {
                tempResult += monthArray[j] + " ";
                wordArray.splice(i, 1);
                break;
            }
        }
        if (type == "CD") {
            tempResult += word + " ";
            wordArray.splice(i, 1);
        }
    }

    return [tempResult, wordArray];
}

testSentence("Give me notes about how to do computer science that I took during 2020-20-20");
testSentence("I need my computer science notes please");
testSentence("I need my horse notes");
testSentence("Computer science notes");
testSentence("Computer science notes I took between August 26 2020 and September 1 2020");
testSentence("During 8/26/2020, what notes did I have?");

testSentence("How much money did I spend on 8/26/2020?");
testSentence("What payment is coming up next?");

testSentence("How do I make lasanga?");

testSentence("When do I have to go to first period?");
