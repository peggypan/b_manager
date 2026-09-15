function openModuleActionSheet(actions) {
  wx.showActionSheet({
    itemList: actions.map((item) => item.name),
    success(res) {
      const action = actions[res.tapIndex];
      if (action) wx.navigateTo({ url: action.url });
    }
  });
}

module.exports = { openModuleActionSheet };
