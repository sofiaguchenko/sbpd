const { readFileSync, writeFileSync } = require('fs');
const v8 = require('v8');

const users = {
    '123456': 'user',
    'password': 'admin',
}

const encode = (filePath, content) => {
    const encodedContent = v8.serialize(content);
    writeFileSync(filePath, encodedContent);
}

const decode = (filePath) => {
    const content = readFileSync(filePath);
    return v8.deserialize(content);
}

module.exports = {
    encode,
    decode,
    users,
}
