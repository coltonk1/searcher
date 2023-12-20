var pos = require("pos");

// Keywords to determine type
const types = {
    notes: [
        "note",
        "notes",
        "material",
        "materials",
        "concept",
        "concepts",
        "lecture",
        "lectures",
        "topic",
        "topics",
        "learn",
        "study",
        "revise",
        "review",
    ],
    reminders: ["when", "where", "remind", "schedule", "schedules", "reminder", "reminders", "due", "deadline", "deadlines"],
    finance: [
        "money",
        "spend",
        "cost",
        "budget",
        "budgets",
        "pay",
        "paid",
        "bill",
        "billed",
        "finance",
        "finances",
        "financed",
        "expense",
        "expenses",
        "much",
    ],
    guide: [
        "how",
        "guide",
        "guides",
        "instruct",
        "explain",
        "explains",
        "teach",
        "teaches",
        "advice",
        "instruction",
        "instructions",
        "tutorial",
        "tutorials",
    ],
};

// Testing each method with multiple sentences
function testSentence(target) {
    var words = new pos.Lexer().lex(target);
    var tagger = new pos.Tagger();
    var taggedWords = tagger.tag(words);
    var result = [];
    // Removing unnecessary words
    for (i = 0; i < taggedWords.length; i++) {
        if (
            taggedWords[i][1].startsWith("V") ||
            taggedWords[i][1].startsWith("N") ||
            taggedWords[i][1].startsWith("CD") ||
            taggedWords[i][1].startsWith("W") ||
            taggedWords[i][1].startsWith("JJ") ||
            taggedWords[i][0].toLowerCase() === "ago"
        ) {
            if (taggedWords[i][0] != "/" && taggedWords[i][0] != "-" && taggedWords[i][0] != "\\") {
                result.push(taggedWords[i]);
            }
        }
    }

    console.log("-----------");
    console.log("Sentence: " + target);
    result = getType(result);
    console.log("Type: " + result[0]);
    result = getRestriction(result[1]);
    console.log("Time: " + result[0]);
    console.log("Subject: " + getSubject(result[1]));
}

function getType(wordArray) {
    let foundTypes = [];
    // Checks if any word is one of the keywords
    for (const [type, keywords] of Object.entries(types)) {
        for (const word of wordArray) {
            const lowerWord = word[0].toLowerCase();
            if (keywords.includes(lowerWord)) {
                foundTypes.push(type);
                wordArray.splice(wordArray.indexOf(word), 1);
            }
        }
    }

    // Prioritize certain types if multiple are found
    // May change this to keep all types found
    const priorityTypes = ["finance", "guide", "notes"];
    for (const priorityType of priorityTypes) {
        if (foundTypes.includes(priorityType)) {
            return [priorityType, wordArray];
        }
    }

    // Default to "reminder" if no other types are found
    return ["reminder", wordArray];
}

function getSubject(wordArray) {
    const subjectTokens = [];
    // Removes "/"
    for (let i = 0; i < wordArray.length; i++) {
        const tag = wordArray[i][1];
        if (wordArray[i][0] == "/") continue;

        // Prioritize nouns and adjectives
        if (tag.startsWith("NN") || tag.startsWith("JJ")) {
            subjectTokens.push(wordArray[i][0]);
        }
    }

    return subjectTokens.join(" ");
}

const monthArray = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "november", "december", ""];

const timeArray = ["this", "next", "week", "weeks", "month", "months", "year", "tomorrow", "today", "end", "last", "now", "ago"];

function getRestriction(wordArray) {
    let tempResult = "";
    for (i = wordArray.length - 1; i >= 0; i--) {
        let type = wordArray[i][1];
        let word = wordArray[i][0].toLowerCase();
        for (j = 0; j < monthArray.length; j++) {
            if (word == monthArray[j]) {
                tempResult += j + 1 + " ";
                wordArray.splice(i, 1);
                break;
            } else if (word == timeArray[j]) {
                tempResult += timeArray[j] + " ";
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
testSentence("Computer science notes I took between today and the end of next month");
testSentence("Computer science notes I took between the beginning of last week and the end of next month");
testSentence("Computer science notes I took between the beginning of last week and the end of 2 weeks from now");
testSentence("Computer science notes I took between the beginning from 2 weeks ago to the end of this month");
testSentence("During 8/26/2020, what notes did I have?");
testSentence("How much money did I spend on 8/26/2020?");
testSentence("What payment is coming up next?");
testSentence("How do I make lasanga?");
testSentence("When do I have to go to first period?");
testSentence("How much money do I need to spend this week?");
