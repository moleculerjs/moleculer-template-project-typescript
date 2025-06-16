const fs = require("fs");

let answers;

if (process.env.TRANSPORTER) {
    if (process.env.TRANSPORTER == "None") {
        answers = require("./answers.simple.json");
        answers.transporter = null;
    } else {
        answers = require("./answers.full.json");
        answers.transporter = process.env.TRANSPORTER;
    }
}

fs.writeFileSync("./answers.json", JSON.stringify(answers, null, 4), "utf8");

console.log("Done", answers);