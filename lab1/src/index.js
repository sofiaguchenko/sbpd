const { decode, users } = require('./secure/secure');
const { initDisk } = require('./init/init');
const { join } = require('path');
const { cliLine, password } = require('./cli/cli');

(async () => {
    const diskPath = join(__dirname, '..', 'Disk:L');
    initDisk(diskPath);
    const enteredPassword = await password();
    const user = users[enteredPassword];
    if(!user) {
        console.log('Incorrect password');
        process.exit();
    }
    const disk = decode(diskPath);
    await cliLine({ user, currentDir: '/', disk });
})()
