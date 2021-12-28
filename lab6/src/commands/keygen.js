const { errors } = require('../secure/operation');
const { createDisk, getDirObj, onlyInf } = require('./helpers');
const { genKey, changeEncode } = require('../secure/idea');
const { save } = require('../secure/secure');

module.exports = (state, params) => {
     const { disk, user } = state;
     if(user !== 'admin') throw new Error(errors.PermissionDenied(disk, user));
     if (params.length !== 0) throw new Error(errors.IncorrectParamsLength(disk, user));
     const dirObj = disk.files.secure.files.codeBook;
     const publicKey = genKey();
     const secretKey = genKey();
     const newContent = JSON.stringify(
         [
             ...JSON.parse(dirObj.content),
             { created: Date.now(), publicKey, secretKey }
         ]
     );
     const newDisk = changeEncode(state.disk, publicKey, secretKey);
     state.disk = onlyInf(createDisk(newDisk, '/secure', 'codeBook', state.user, 'file', newContent));
     save(state.disk);
     state.publicKey = publicKey;
}
