const { verifyUserWithRules } = require('../secure/access');
const { errors } = require('../secure/operation');

module.exports = async (state, params) => {
    const { disk, user } = state;
    if (params.length !== 0 ) throw new Error(errors.IncorrectParamsLength(disk, user));
    const userData = await verifyUserWithRules(disk);
    state.user = userData.login;
    state.currentDir = '/';
}
