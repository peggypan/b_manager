const { JOIN_ACTIONS } = require('../services/mock');
const { openModuleActionSheet } = require('./moduleAction');

function openJoinMenu() {
  openModuleActionSheet(JOIN_ACTIONS);
}

module.exports = { openJoinMenu };
