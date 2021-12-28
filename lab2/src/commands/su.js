const { verifyUserWithRules } = require('../secure/access');

module.exports = async (state, params) => {
    if (params.length !== 0 ) throw new Error('Incorrect params length');
    const userData = await verifyUserWithRules(state.disk);
    state.user = userData.login;
    state.currentDir = '/';
}
