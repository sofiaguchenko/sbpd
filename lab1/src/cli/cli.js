const readline = require('readline');
const { commands } = require('../commands/commands');
const { createDisk } = require('../commands/helpers');
const { encode } = require('../secure/secure');
const { join } = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const write = (content) => rl.write(content);

const line = (path) => new Promise(resolve => rl.question(path, data => resolve(data)));

const password = () => new Promise(resolve => {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    let password = '';
    let done = false;
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    rl.write('Password: ');
    process.stdin.on('keypress', (chunk, key) => {
        if(!done){
            if(key.name === 'return') {
                done = true;
                resolve(password);
            }
            else if(password && key.name === 'backspace') password = password.substring(0, password.length - 1);
            else {
                readline.cursorTo(process.stdout, 0, 0);
                readline.clearScreenDown(process.stdout);
                rl.write('Password: ');
                password += key.name;
            }
        }
    });
})

const cliLine = async (state) => {
    const answer = await line(state.file ? '' : state.currentDir + ':$ ');
    const [command, ...params] = answer.split(' ');
    const commandFunc = commands[command];
    if(!commandFunc && !state.file) console.log('Incorrect command "' + command + '"');
    else if(state.file){
        state.disk = JSON.parse(JSON.stringify(createDisk(state.disk, state.currentDir, params[0], state.user, 'file')));
        const diskPath = join(__dirname, '..', '..', 'Disk:L');
        encode(diskPath, newState.disk);
        delete state.file;
        delete state.content;
    }
    else {
        try {
            commandFunc(state, params);
            if(command === 'vi') write('\n' + state.content);
        }catch (e){
            console.log(e);
        }
    }
    await cliLine(state);
}

module.exports = {
    line,
    cliLine,
    password,
};
