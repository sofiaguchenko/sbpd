const { readFileSync, writeFileSync } = require('fs');
const v8 = require('v8');
const { join } = require('path');

const diskPath = join(__dirname, '..', '..', 'Disk:L');

const save = (content) => {
    const encodedContent = v8.serialize(content);
    writeFileSync(diskPath, encodedContent);
}

const decode = () => {
    const content = readFileSync(diskPath);
    return v8.deserialize(content);
}

const getPublicKey = (disk) => {
    const codeBook = JSON.parse(disk.files.secure.files.codeBook.content);
    return codeBook[codeBook.length - 1].publicKey;
}

module.exports = {
    save,
    decode,
    diskPath,
    getPublicKey,
}
