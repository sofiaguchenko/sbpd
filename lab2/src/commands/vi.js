const { save } = require('../secure/secure');
const { createDisk, getDirObj, onlyInf } = require('./helpers');
const { write } = require('../cli/rl');

module.exports = (state, params) => {
    if (params.length !== 1) throw new Error('Incorrect params length');
    let dirObj = getDirObj(state.disk, state.currentDir, params[0]);
    if (!dirObj) {
        state.disk = onlyInf(createDisk(state.disk, state.currentDir, params[0], state.user, 'file'));
        save(state.disk);
        dirObj = getDirObj(state.disk, state.currentDir, params[0]);
    }else {
        if (!dirObj.rights.write.includes(state.user)) throw new Error('Permission denied');
        if (!dirObj.rights.read.includes(state.user)) throw new Error('Permission denied');
        if (dirObj.type !== 'file') throw new Error('This is not a file!');
    }
    state.file = params[0];
    write('\n' + dirObj.content);
}
