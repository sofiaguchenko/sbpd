const { save } = require('../secure/secure');
const { createDisk, getDirObj, onlyInf } = require('./helpers');

module.exports = (state, params) => {
    if (params.length !== 1) throw new Error('Incorrect params length');
    let dirObj = getDirObj(state.disk, state.currentDir);
    if (!dirObj) throw new Error('Unknown path');
    if (!dirObj.rights.write.includes(state.user)) throw new Error('Permission denied');
    state.disk = onlyInf(createDisk(state.disk, state.currentDir, params[0], state.user));
    save(state.disk);
}
