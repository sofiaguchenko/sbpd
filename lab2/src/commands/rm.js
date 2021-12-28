const { save } = require('../secure/secure');
const { deletedDisk, getDirObj, onlyInf } = require('./helpers');

module.exports = (state, params) => {
    if (params.length !== 1) throw new Error('Incorrect params length');
    let dirObj = getDirObj(state.disk, state.currentDir, params[0]);
    if (!dirObj) throw new Error('Unknown path');
    if (!dirObj.rights.delete.includes(state.user)) throw new Error('Permission denied');
    state.disk = onlyInf(deletedDisk(state.disk, state.currentDir, params[0]));
    save(state.disk);
}
