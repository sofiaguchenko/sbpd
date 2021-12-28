const { decode, getPublicKey } = require('./secure/secure');
const { initDisk } = require('./init/init');
const { cliLine } = require('./cli/cli');
const { verifyUserWithRules } = require('./secure/access');

(async () => {
    try {
        initDisk();
        const disk = decode();
        const publicKey = getPublicKey(disk);
        const userData = await verifyUserWithRules(disk);
        await cliLine({ user: userData.login, currentDir: '/', disk, publicKey });
    } catch (e) {
        console.log('\x1b[31m%s\x1b[0m', e.message);
    }
})();
