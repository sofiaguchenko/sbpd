const { getDirObj } = require('./helpers');

module.exports = (state, params) => {
    if (params.length !== 1) throw new Error('Incorrect params length');
    if(params[0] === '..') {
        const fileNames = (state.currentDir).split('/').filter(Boolean);
        fileNames.pop();
        return state.currentDir = '/' + fileNames.join('/');
    }
    const dirObj = getDirObj(state.disk, state.currentDir, params[0]);
    if (!dirObj) throw new Error('Unknown path');
    if (!dirObj.rights.read.includes(state.user)) throw new Error('Permission denied');
    if (dirObj.type !== 'directory') throw new Error('This is not a directory!');
    state.currentDir += params[0] + '/';
}
