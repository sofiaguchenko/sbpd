const { cliQuestions } = require('../cli/rl');
const { LOGIN_TIME, LOGIN_ATTEMPTS, USERS_LENGTH, ADMIN_PASSWORD_LENGTH, USER_PASSWORD_LENGTH } = require('../secure/access');
const { onlyInf, createDisk, changeRightsObj } = require('./helpers');
const { save } = require('../secure/secure');

const newUser = (oldUsers, newUserInf) => {
    let find = false;
    const newUserObj = {
        login: newUserInf.login,
        password: newUserInf.password,
        time: Date.now(),
    };
    const newUsers = oldUsers.map(user => {
        if(user.login === newUserInf.login) {
            find = true;
            return newUserObj
        }
        return user
    });
    if(find) return newUsers;
    return [...newUsers, newUserObj];
}

module.exports = async (state, params) => {
    if(state.user !== 'admin') throw new Error('Permission denied');
    if (params.length !== 0 ) throw new Error('Incorrect params length');

    let done = false;
    const timerId = setTimeout(() => {
        if(!done){
            console.log('\nLogin time is passed');
            process.exit();
        }
    }, LOGIN_TIME);
    const allUsers = JSON.parse(state.disk.files.secure.files.register.content);
    if(allUsers.length >= USERS_LENGTH) throw new Error('Excess number of new users');
    for (let i = 0; i < LOGIN_ATTEMPTS; i++) {
        const newUserInf = await cliQuestions([
            { name: 'login', question: 'New user login: ' },
            { name: 'password', secure: true },
            { name: 'repeatPassword', secure: true, question: 'Repeat password: ' },
        ]);
        if(newUserInf.password !== newUserInf.repeatPassword) {
            console.log('Password and repeated password not same');
            continue;
        }
        if(newUserInf.login === 'admin' && newUserInf.password.length < ADMIN_PASSWORD_LENGTH){
            console.log('Password is too short');
            continue;
        }
        if(newUserInf.login !== 'admin' && newUserInf.password.length < USER_PASSWORD_LENGTH){
            console.log('Password is too short');
            continue;
        }
        done = true;
        clearTimeout(timerId);
        const newUsers = newUser(allUsers, newUserInf);
        state.disk = onlyInf(
            createDisk(state.disk, '/secure/', 'register', state.user, 'file', JSON.stringify(newUsers))
        );
        state.disk.rights = changeRightsObj(state.disk.rights, newUserInf.login, true, true, false);
        save(state.disk);
        return;
    }
    clearTimeout(timerId);
    done = true;
    console.log('You have exceeded the login limit');
    process.exit();
}
