const { cliQuestions } = require('../cli/rl');
const { errors } = require('./operation');

const verifyUser = (allUsers, userData) => {
    const [ selectedUser ] = allUsers.filter(user => user.login === userData.login && user.password === userData.password);
    return selectedUser;
}

const LOGIN_TIME = 1000 * 60 * 2;
const LOGIN_ATTEMPTS = 5;
const USERS_LENGTH = 9;
const TIME_VALID = 1000 * 60 * 60 * 24 * 7;
const ADMIN_PASSWORD_LENGTH = 8;
const USER_PASSWORD_LENGTH = 4;

const verifyUserWithRules = async (disk, attempts = LOGIN_ATTEMPTS, time = LOGIN_TIME) => {
    let done = false;
    let lastLogin;
    const timerId = setTimeout(() => {
        if(!done){
            console.log(`\n${errors.LoginTimePassed(disk, lastLogin)}`);
            process.exit();
        }
    }, time);
    const allUsers = JSON.parse(disk.files.secure.files.register.content);
    for (let i = 0; i < attempts; i++) {
        const userData = await cliQuestions([
            { name: 'login', question: 'User login: '},
            { name: 'password', secure: true }
        ]);
        lastLogin = userData.login;
        const selectedUser = verifyUser(allUsers, userData);
        if (!selectedUser) console.log(errors.IncorrectLoginOrPassword(disk, lastLogin));
        else if(selectedUser.time && Date.now() - selectedUser.time > TIME_VALID) {
            console.log(errors.ExpiredPassword(disk, lastLogin));
        }
        else {
            done = true
            if(selectedUser.time) {
                console.log('Your password is valid until ' + new Date(selectedUser.time + TIME_VALID));
            }
            return userData;
        }
    }
    clearTimeout(timerId);
    done = true;
    console.log(errors.ExceededLimit(disk, lastLogin));
    process.exit();
}

module.exports = {
    verifyUser,
    LOGIN_ATTEMPTS,
    LOGIN_TIME,
    USERS_LENGTH,
    ADMIN_PASSWORD_LENGTH,
    USER_PASSWORD_LENGTH,
    verifyUserWithRules,
}
