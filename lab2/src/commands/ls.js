const { getDirObj } = require('./helpers');

module.exports = (state, params) => {
    if (params.length !== 0) throw new Error('Incorrect params length');
    const dirObj = getDirObj(state.disk, state.currentDir);
    if (!dirObj.rights.read.includes(state.user)) throw new Error('Permission denied');
    for (const fileName in dirObj.files) {
        if(!dirObj.files[fileName].rights.read.includes(state.user)) continue;
        else if (dirObj.files[fileName].type === 'directory') console.log('\x1b[33m%s\x1b[0m', fileName);
        else console.log(fileName);
    }
}
