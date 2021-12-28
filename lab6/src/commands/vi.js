const { save } = require('../secure/secure');
const { createDisk, getDirObj, onlyInf } = require('./helpers');
const { write } = require('../cli/rl');
const { errors } = require('../secure/operation');
const { decodeContent, encodeContent } = require('../secure/idea');

module.exports = (state, params) => {
    const { disk, user, currentDir } = state;
    if (params.length !== 1) throw new Error(errors.IncorrectParamsLength(disk, user));
    let dirObj = getDirObj(disk, user, currentDir, params[0]);
    if (!dirObj) {
        const content = encodeContent('', state.publicKey);
        state.disk = onlyInf(createDisk(disk, currentDir, params[0], user, 'file', content, true));
        save(state.disk);
        dirObj = getDirObj(disk, user, currentDir, params[0]);
    }else {
        if (!dirObj.rights.write.includes(user)) throw new Error(errors.PermissionDenied(disk, user));
        if (!dirObj.rights.read.includes(user)) throw new Error(errors.PermissionDenied(disk, user));
        if (dirObj.type !== 'file') throw new Error(errors.NotFile(disk, user));
    }

    let content = dirObj.content;
    if(dirObj.isEncrypted) content = decodeContent(content, state.publicKey);
    state.file = params[0];
    state.dirObj = dirObj;
    write('\n' + content);
}
