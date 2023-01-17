const readline = require('readline');

async function readLineAsync(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    var promptInput = await new Promise((resolve) => {
        rl.question(message, (answer) => {
            resolve(answer);
        });
    });
    readline.cursorTo(rl, 0);
    readline.moveCursor(rl, 0, -1);
    readline.clearLine(rl, 0);
    rl.close();
    return promptInput;
}


module.exports = { readLineAsync };