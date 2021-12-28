const { getDirObj } = require('./helpers');
const { errors } = require('../secure/operation');

module.exports = (state, params) => {
    const { disk, user, currentDir } = state;
    if (params.length !== 0) throw new Error(errors.IncorrectParamsLength(disk, user));
    const dirObj = getDirObj(disk, user, currentDir);
    if (!dirObj.rights.read.includes(state.user)) throw new Error(errors.PermissionDenied(disk, user));
    for (const fileName in dirObj.files) {
        if(!dirObj.files[fileName].rights.read.includes(state.user)) continue;
        else if (dirObj.files[fileName].type === 'directory') console.log('\x1b[33m%s\x1b[0m', fileName);
        else console.log(fileName);
    }
}
