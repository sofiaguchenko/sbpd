const { save } = require('../secure/secure');
const { deletedDisk, getDirObj, onlyInf } = require('./helpers');
const { errors } = require('../secure/operation');

module.exports = (state, params) => {
    const { disk, user, currentDir } = state;
    if (params.length !== 1) throw new Error(errors.IncorrectParamsLength(disk, user));
    let dirObj = getDirObj(disk, user, currentDir, params[0]);
    if (!dirObj) throw new Error(errors.UnknownPath(disk, user));
    if (!dirObj.rights.delete.includes(state.user)) throw new Error(errors.PermissionDenied(disk, user));
    state.disk = onlyInf(deletedDisk(disk, currentDir, params[0]));
    save(state.disk);
}
