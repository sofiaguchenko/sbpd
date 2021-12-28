const { cliQuestions } = require('../cli/rl');
const { onlyInf, changeRights, changeRightsObj } = require('./helpers');
const { getDirObj } = require('./helpers');
const { save } = require('../secure/secure');

const ynToBool = (answer) => {
    if(answer === 'y' || answer === 'Y') return true;
    if (answer === 'n' || answer === 'N') return false;
    throw Error('Incorrect answer');
};

const existUserByLogin = (allUsers, login) => {
    const [ user ] = allUsers.filter(user => user.login === login);
    return user;
};

module.exports = async (state, params) => {
    if(state.user !== 'admin') throw new Error('Permission denied');
    if (params.length !== 1 ) throw new Error('Incorrect params length');
    const dirObj = getDirObj(state.disk, state.currentDir, params[0]);
    if (!dirObj) throw new Error('Unknown path');

    const { login, r, w, d } = await cliQuestions([
        { name: 'login', question: 'User login: ' },
        { name: 'r', question: 'Read (y|N): ' },
        { name: 'w', question: 'Write (y|N): ' },
        { name: 'd', question: 'Delete (y|N): ' },
    ]);
    const allUsers = JSON.parse(state.disk.files.secure.files.register.content);
    if(!existUserByLogin(allUsers, login)) throw new Error('Unknown user');

    const read = ynToBool(r);
    const write = ynToBool(w);
    const del = ynToBool(d);

    const newRights = changeRightsObj(dirObj.rights, login, read, write, del);

    state.disk = onlyInf(
        changeRights(state.disk, state.currentDir, params[0], login, newRights)
    );
    save(state.disk);
}
