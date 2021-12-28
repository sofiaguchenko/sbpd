const robin = require('../generator/robin');
const bignum = require('../bignum/bignum');
const IDEA = require('../idea/idea');

const encodeContent = (content, publicKey, secretKey) => {
    const cipher = new IDEA(publicKey);
    return cipher.encrypt(secretKey, content);
}

const decodeContent = (content, publicKey) => {
    const cipher = new IDEA(publicKey);
    return cipher.decrypt(content);
}

const min16 = bignum().minForDischarge(16);
const max16 = bignum().maxForDischarge(16);

const genKey = () => {
    return robin(min16, max16);
}

const changeELoop = (disk, oldKey, publicKey, secretKey) => {
    if(disk.type === 'file') return {
        ...disk,
        content: disk.isEncrypted ?
            encodeContent(decodeContent(disk.content, oldKey), publicKey, secretKey) :
            disk.content
    }
    return {
        ...disk, files: disk.files.map(file => changeELoop(file, oldKey, publicKey, secretKey))
    }
}

const changeEncode = (disk, oldKey, publicKey, secretKey) => {
    return changeELoop(disk, oldKey, publicKey, secretKey);
}

module.exports = {
    encodeContent,
    decodeContent,
    genKey,
    changeEncode,
}
