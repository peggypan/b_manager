const { MEMBER_PLANS, getMembership, activateMembership } = require('../../utils/member');
const { showToast } = require('../../utils/util');

Page({
  data: {
    plans: MEMBER_PLANS,
    membership: {},
    freeRules: [
      '可以浏览全部列表，查看简介',
      '不可以在线沟通',
      '不能查看电话、微信等联系方式',
      '不能发布供需信息'
    ]
  },

  onShow() {
    this.setData({ membership: getMembership() });
  },

  buyPlan(e) {
    const level = e.currentTarget.dataset.level;
    const plan = MEMBER_PLANS.find(p => p.level === level);
    wx.showModal({
      title: `开通${plan.name}`,
      content: `${plan.price}元/${plan.unit}\n${plan.target}`,
      confirmText: '确认开通',
      success: (res) => {
        if (res.confirm) {
          activateMembership(level);
          this.setData({ membership: getMembership() });
          showToast('开通成功');
        }
      }
    });
  }
});
