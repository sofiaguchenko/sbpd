const { save } = require('./secure');

const errors = {
    IncorrectCommand: (disk, user, command) => operation(disk, `Incorrect command "${command}"`, 0, user),
    IncorrectParamsLength: (disk, user) => operation(disk,'Incorrect params length', 0, user),
    UnknownPath: (disk, user) => operation(disk,'Unknown path', 0, user),
    PermissionDenied: (disk, user) => operation(disk,'Permission denied', 2, user),
    NotDir: (disk, user) => operation(disk,'This is not a directory!', 3, user),
    IncorrectAnswer: (disk, user) => operation(disk,'Incorrect answer', 1, user),
    UnknownUser: (disk, user) => operation(disk,'Unknown user', 1, user),
    LoginTimePassed: (disk, user) => operation(disk,'Login time is passed', 1, user),
    ExcessNumberOfUsers: (disk, user) => operation(disk,'Excess number of new users', 0, user),
    PasswordNotSame: (disk, user) => operation(disk,'Password and repeated password not same', 1, user),
    PasswordShort: (disk, user) => operation(disk,'Password is too short', 1, user),
    ExceededLimit: (disk, user) => operation(disk,'You have exceeded the login limit', 1, user),
    NotFile: (disk, user) => operation(disk,'This is not a file!', 3, user),
    IncorrectLoginOrPassword: (disk, user) => operation(disk,'Incorrect login or password', 1, user),
    ExpiredPassword: (disk, user) => operation(disk,'This user\'s password has expired. Contact the administrator for help', 1, user),
}

const operation = (disk, message, lvl, user) => {
    const operationLog = JSON.parse(disk.files.secure.files.operation.content);
    if(!operationLog[user]) return message;
    operationLog[user][lvl].push({ message, date: Date.now() });
    disk.files.secure.files.operation.content = JSON.stringify(operationLog);
    save(disk);
    return message;
}

module.exports = {
    operation,
    errors
}
