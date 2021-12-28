const { encode } = require('../secure/secure');
const { join } = require('path');
const { createDisk, deletedDisk, getDirObj } = require('./helpers');

const commands = {
    exit: (newState, params) => {
        console.log('Bye-bye');
        process.exit();
    },
    ls: (newState, params) => {
        if (params.length !== 0) throw new Error('Incorrect params length');
        const dirObj = getDirObj(newState.disk, newState.currentDir);
        if (!dirObj.rights.read.includes(newState.user)) throw new Error('Permission denied');
        for (const fileName in dirObj.files) {
            if (dirObj.files[fileName].type === 'directory') console.log('\x1b[33m%s\x1b[0m', fileName);
            else console.log(fileName);
        }
    },
    cd: (newState, params) => {
        if (params.length !== 1) throw new Error('Incorrect params length');
        const dirObj = getDirObj(newState.disk, newState.currentDir, params[0]);
        if (!dirObj) throw new Error('Unknown path');
        if (dirObj.type !== 'directory') throw new Error('This is not a directory!');
        if (!dirObj.rights.read.includes(newState.user)) throw new Error('Permission denied');
        newState.currentDir += params[0] + '/';
    },
    mkdir: (newState, params) => {
        if (params.length !== 1) throw new Error('Incorrect params length');
        let dirObj = getDirObj(newState.disk, newState.currentDir);
        if (!dirObj) throw new Error('Unknown path');
        if (!dirObj.rights.write.includes(newState.user)) throw new Error('Permission denied');
        newState.disk = JSON.parse(JSON.stringify(createDisk(newState.disk, newState.currentDir, params[0], newState.user)));
        const diskPath = join(__dirname, '..', '..', 'Disk:L');
        encode(diskPath, newState.disk);
    },
    rm: (newState, params) => {
        if (params.length !== 1) throw new Error('Incorrect params length');
        let dirObj = getDirObj(newState.disk, newState.currentDir, params[0]);
        if (!dirObj) throw new Error('Unknown path');
        if (!dirObj.rights.delete.includes(newState.user)) throw new Error('Permission denied');
        newState.disk = JSON.parse(JSON.stringify(deletedDisk(newState.disk, newState.currentDir, params[0])));
        const diskPath = join(__dirname, '..', '..', 'Disk:L');
        encode(diskPath, newState.disk);
    },
    vi: (newState, params) => {
        if (params.length !== 1) throw new Error('Incorrect params length');
        let dirObj = getDirObj(newState.disk, newState.currentDir, params[0]);
        if (!dirObj) {
            newState.disk = JSON.parse(JSON.stringify(createDisk(newState.disk, newState.currentDir, params[0], newState.user)));
            const diskPath = join(__dirname, '..', '..', 'Disk:L');
            encode(diskPath, newState.disk);
        }else {
            if (!dirObj.rights.write.includes(newState.user)) throw new Error('Permission denied');
            if (!dirObj.rights.read.includes(newState.user)) throw new Error('Permission denied');
            if (dirObj.type !== 'file') throw new Error('This is not a file!');
        }
        newState.file = params[0];
        newState.content = dirObj.content;
    },
    pwd: (newState, params) => {
        console.log(newState.currentDir)
    },
}

module.exports = {
    commands,
}
