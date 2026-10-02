const { deletePost, getUserPosts, setPostOffline } = require('./community');
const localPublish = require('./localPublish');

const TYPE_LABELS = {
  community: '社区笔记',
  factory: '找工厂需求',
  factory_info: '工厂信息',
  order: '找订单',
  order_demand: '找订单',
  storeSupply: '门店货源',
  storeDemand: '门店求购',
  directory: '宠业展厅',
  invest: '宠业创投',
  industry: '免费入驻',
  influencer: '达人入驻',
};

function formatTime(raw) {
  if (!raw) return '—';
  const s = String(raw);
  return s.length > 10 ? s.slice(0, 10) : s;
}

/** 汇总用户在各模块的发布/入驻记录 */
function buildAllPublishRows() {
  const rows = [];
  const seen = new Set();
  const add = (row) => {
    const key = `${row.type}_${row.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push(row);
  };

  getUserPosts().forEach((p) => {
    add({
      id: p.id,
      type: 'community',
      title: p.title,
      time: p.time || '刚刚',
      status: p.status || 'published',
    });
  });

  (wx.getStorageSync('myPublish') || []).forEach((p) => {
    add({
      id: p.id,
      type: p.type,
      title: p.title,
      time: formatTime(p.time),
      status: p.status || 'published',
    });
  });

  const company = wx.getStorageSync('company');
  if (company && company.name && company.status && company.status !== 'none') {
    add({
      id: 'company_apply',
      type: 'directory',
      title: company.name,
      time: formatTime(company.applyTime),
      status: company.status,
    });
  }

  (wx.getStorageSync('industryOrgApply') || []).forEach((a) => {
    add({
      id: a.id,
      type: 'industry',
      title: a.name,
      time: formatTime(a.applyTime),
      status: a.status || 'published',
    });
  });

  return rows.sort((a, b) => {
    const aid = a.id === 'company_apply' ? 0 : Number(a.id) || 0;
    const bid = b.id === 'company_apply' ? 0 : Number(b.id) || 0;
    return bid - aid;
  });
}

function filterRowsByTab(rows, tabKey) {
  if (!tabKey) return rows;
  if (tabKey === 'order_group') {
    return rows.filter((p) => p.type === 'order' || p.type === 'order_demand');
  }
  if (tabKey === 'factory') {
    return rows.filter((p) => p.type === 'factory' || p.type === 'factory_info');
  }
  return rows.filter((p) => p.type === tabKey);
}

function offlinePublishEntry(id, type) {
  if (type === 'community') {
    setPostOffline(id);
    return { ok: true };
  }
  if (type === 'directory') {
    const company = wx.getStorageSync('company');
    if (company && company.name) {
      wx.setStorageSync('company', { ...company, status: 'offline' });
    }
    return { ok: true };
  }
  if (type === 'industry') {
    const applies = wx.getStorageSync('industryOrgApply') || [];
    wx.setStorageSync(
      'industryOrgApply',
      applies.map((a) =>
        Number(a.id) === Number(id) ? { ...a, status: 'offline' } : a,
      ),
    );
    const org = wx.getStorageSync('industryOrg');
    if (org && Number(org.id) === Number(id)) {
      wx.setStorageSync('industryOrg', { ...org, status: 'offline' });
    }
    return { ok: true };
  }

  const numId = Number(id);
  const list = (wx.getStorageSync('myPublish') || []).map((p) =>
    Number(p.id) === numId ? { ...p, status: 'offline' } : p,
  );
  wx.setStorageSync('myPublish', list);

  localPublish.setOfflineByType(type, id);
  return { ok: true };
}

/** 删除 myPublish 条目及关联本地数据 */
function removePublishEntry(id, type) {
  if (type === 'community') {
    deletePost(Number(id));
    return;
  }

  const numId = id === 'company_apply' ? null : Number(id);

  if (type === 'directory') {
    wx.setStorageSync('company', { name: '', status: 'none' });
    if (id === 'company_apply') {
      wx.setStorageSync(localPublish.KEYS.directory, []);
    } else {
      localPublish.removeByType('directory', id);
    }
  } else if (type === 'industry') {
    const applies = (wx.getStorageSync('industryOrgApply') || []).filter(
      (a) => Number(a.id) !== numId,
    );
    wx.setStorageSync('industryOrgApply', applies);
    const org = wx.getStorageSync('industryOrg');
    if (org && Number(org.id) === numId) {
      wx.removeStorageSync('industryOrg');
    }
    localPublish.removeByType('industry', id);
  } else {
    localPublish.removeByType(type, id);
  }

  const list = (wx.getStorageSync('myPublish') || []).filter((p) => {
    if (numId == null) return p.type !== 'directory';
    return Number(p.id) !== numId;
  });
  wx.setStorageSync('myPublish', list);
}

module.exports = {
  TYPE_LABELS,
  buildAllPublishRows,
  filterRowsByTab,
  offlinePublishEntry,
  removePublishEntry,
};
