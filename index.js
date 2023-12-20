const targetString = "computer science";
const compareTo = [
    "how to learn computer science",
    "how to learn computer science bla bla bla bla bla bla",
    "biology exam",
    "sugar cookie recipe",
    "bill",
    "how to learn about computers",
    "how do you learn computer science",
    "learn computer science hew to",
    "computer science",
    "computer science bla bla bla bla bla bla bla",
];
var similarityValues = [];
var targetWords = targetString.split(" ");

function test(func) {
    similarityValues = [];
    compareTo.forEach(func);
    let result = compareTo.sort((a, b) => {
        return similarityValues[compareTo.indexOf(a)] - similarityValues[compareTo.indexOf(b)];
    });
    console.log(result);
}

function compareMethodOne(element) {
    var compareWords = element.split(" ");

    var a = 0;
    for (i = 0; i < compareWords.length; i++) {
        if (targetString.includes(compareWords[i])) {
            a++;
        }
    }
    similarityValues.push(compareWords.length - a + Math.abs(Math.floor((targetString.length - element.length) / 2)));
}

function compareMethodTwo(element) {
    const elementCharSum = element.split(" ").map((word) => {
        let total = 0;
        for (i = 0; i < word.length; i++) {
            total += word.charCodeAt(i);
        }
        return total;
    });
    const targetCharSum = targetString.split(" ").map((word) => {
        let total = 0;
        for (i = 0; i < word.length; i++) {
            total += word.charCodeAt(i);
        }
        return total;
    });

    var total = 0;
    for (i = 0; i < targetCharSum.length; i++) {
        total += Math.min(...elementCharSum.map((c) => Math.abs(c - targetCharSum[i])));
    }
    similarityValues.push(total);
}

function compareMethodThree(element) {
    const elementWords = element.split(" ");
    const elementCharSum = element.split(" ").map((word) => {
        let total = 0;
        for (i = 0; i < word.length; i++) {
            total += word.charCodeAt(i);
        }
        return total;
    });
    const targetCharSum = targetString.split(" ").map((word) => {
        let total = 0;
        for (i = 0; i < word.length; i++) {
            total += word.charCodeAt(i);
        }
        return total;
    });

    var total = 0;
    for (i = 0; i < targetCharSum.length; i++) {
        total += Math.min(
            ...elementCharSum.map(
                (c) =>
                    Math.abs(c - targetCharSum[i]) * (Math.abs(targetWords[i].length - elementWords[elementCharSum.indexOf(c)].length) + 1)
            )
        );
    }
    similarityValues.push(total);
}

// stolen from google bard
// o(mn)
function levenshteinDistance(str2) {
    var str1 = targetString;
    const m = str1.length;
    const n = str2.length;
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

    // Base cases:
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    // Fill the dynamic programming table:
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1, // deletion
                    dp[i][j - 1] + 1, // insertion
                    dp[i - 1][j - 1] + 1 // substitution
                );
            }
        }
    }

    // The Levenshtein distance is the value in the bottom-right corner:
    similarityValues.push(dp[m][n]);
}

test(compareMethodOne);
test(compareMethodTwo);
test(compareMethodThree);
test(levenshteinDistance);
