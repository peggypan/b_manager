const mock = require('../services/mock');

const KEYS = {
  factories: 'localPublishedFactories',
  demands: 'localPublishedDemands',
  orders: 'localPublishedOrders',
  storeProducts: 'localPublishedStoreProducts',
  storeDemands: 'localPublishedStoreDemands',
  projects: 'localPublishedProjects',
  directory: 'localPublishedDirectory',
  parks: 'localPublishedIndustryParks',
  associations: 'localPublishedAssociations',
  influencers: 'localPublishedInfluencers',
};

const read = (key) => wx.getStorageSync(key) || [];
const write = (key, list) => wx.setStorageSync(key, list);

const isVisible = (item) => item && item.status !== 'offline';

function prepend(key, item) {
  const record = { ...item, status: item.status || 'published' };
  write(key, [record, ...read(key)]);
  return record;
}

function mergeMock(localKey, mockList) {
  const local = read(localKey).filter(isVisible);
  const mockIds = new Set(mockList.map((x) => x.id));
  const unique = local.filter((x) => !mockIds.has(x.id));
  return [...unique, ...mockList];
}

function removeByType(type, id) {
  const numId = Number(id);
  const map = {
    factory: KEYS.demands,
    factory_info: KEYS.factories,
    community: null,
    order: KEYS.orders,
    order_demand: 'localOrderDemands',
    storeSupply: KEYS.storeProducts,
    storeDemand: KEYS.storeDemands,
    invest: KEYS.projects,
    directory: KEYS.directory,
    industry: null,
    influencer: KEYS.influencers,
  };
  const key = map[type];
  if (key === 'localOrderDemands') {
    write(
      key,
      read(key).filter((x) => Number(x.id) !== numId),
    );
    return;
  }
  if (key) write(key, read(key).filter((x) => Number(x.id) !== numId));
  if (type === 'industry') {
    write(KEYS.parks, read(KEYS.parks).filter((x) => Number(x.id) !== numId));
    write(
      KEYS.associations,
      read(KEYS.associations).filter((x) => Number(x.id) !== numId),
    );
  }
}

function setOfflineByType(type, id) {
  const numId = Number(id);
  const patch = (key) => {
    write(
      key,
      read(key).map((x) =>
        Number(x.id) === numId ? { ...x, status: 'offline' } : x,
      ),
    );
  };
  if (type === 'factory') patch(KEYS.demands);
  if (type === 'factory_info') patch(KEYS.factories);
  if (type === 'order') patch(KEYS.orders);
  if (type === 'order_demand') patch('localOrderDemands');
  if (type === 'storeSupply') patch(KEYS.storeProducts);
  if (type === 'storeDemand') patch(KEYS.storeDemands);
  if (type === 'invest') patch(KEYS.projects);
  if (type === 'directory') patch(KEYS.directory);
  if (type === 'industry') {
    patch(KEYS.parks);
    patch(KEYS.associations);
  }
  if (type === 'influencer') patch(KEYS.influencers);
}

function getMergedDemands() {
  const local = [
    ...read(KEYS.demands).filter(isVisible),
    ...read('localOrderDemands').filter(isVisible),
  ];
  const mockIds = new Set(mock.DEMANDS.map((x) => x.id));
  const unique = local.filter((x) => !mockIds.has(x.id));
  return [...unique, ...mock.DEMANDS];
}

function getDemandById(id) {
  const numId = Number(id);
  return getMergedDemands().find((d) => d.id === numId) || null;
}

function getMergedFactories() {
  return mergeMock(KEYS.factories, mock.FACTORIES);
}

function getFactoryById(id) {
  const numId = Number(id);
  const local = read(KEYS.factories).find((x) => Number(x.id) === numId);
  if (local && isVisible(local)) return local;
  return mock.getFactoryById(numId);
}

function getMergedOrders() {
  return mergeMock(KEYS.orders, mock.ORDERS);
}

function getMergedStoreProducts() {
  return mergeMock(KEYS.storeProducts, mock.STORE_SUPPLY_PRODUCTS);
}

function getMergedStoreDemands() {
  return mergeMock(KEYS.storeDemands, mock.STORE_SUPPLY_DEMANDS);
}

function getMergedProjects() {
  return mergeMock(KEYS.projects, mock.PROJECTS);
}

function getDirectoryListByFilter(filterType) {
  const local = read(KEYS.directory).filter(isVisible);
  if (filterType === '全部') {
    return [
      ...local,
      ...mock.getDirectoryCompanies(),
      ...mock.INDUSTRY_PARKS,
      ...mock.ASSOCIATIONS,
    ];
  }
  if (filterType === '宠物产业园') {
    return [...read(KEYS.parks).filter(isVisible), ...mock.INDUSTRY_PARKS];
  }
  if (filterType === '宠物商协会') {
    return [...read(KEYS.associations).filter(isVisible), ...mock.ASSOCIATIONS];
  }
  return [
    ...local.filter((c) => c.type === filterType),
    ...mock.getDirectoryCompanies().filter((c) => c.type === filterType),
  ];
}

function getOrderById(id) {
  const numId = Number(id);
  return (
    read(KEYS.orders).find((x) => x.id === numId) || mock.getOrderById(numId)
  );
}

function getProjectById(id) {
  const numId = Number(id);
  return (
    read(KEYS.projects).find((x) => x.id === numId) || mock.getProjectById(numId)
  );
}

function getStoreSupplyById(id) {
  const numId = Number(id);
  return (
    read(KEYS.storeProducts).find((x) => x.id === numId) ||
    mock.getStoreSupplyById(numId)
  );
}

function getStoreDemandById(id) {
  const numId = Number(id);
  return (
    read(KEYS.storeDemands).find((x) => x.id === numId) ||
    mock.getStoreDemandById(numId)
  );
}

function getMergedInfluencers() {
  return mergeMock(KEYS.influencers, mock.INFLUENCERS);
}

function getInfluencerById(id) {
  const numId = Number(id);
  const local = read(KEYS.influencers).find((x) => Number(x.id) === numId);
  if (local && isVisible(local)) return local;
  return mock.getInfluencerById(numId);
}

function getDirectoryRecordById(id) {
  const numId = Number(id);
  return (
    read(KEYS.directory).find((x) => x.id === numId) ||
    read(KEYS.parks).find((x) => x.id === numId) ||
    read(KEYS.associations).find((x) => x.id === numId) ||
    mock.getIndustryOrgById(numId)
  );
}

module.exports = {
  KEYS,
  prepend,
  removeByType,
  setOfflineByType,
  getMergedDemands,
  getDemandById,
  getMergedFactories,
  getFactoryById,
  getMergedOrders,
  getMergedStoreProducts,
  getMergedStoreDemands,
  getMergedProjects,
  getDirectoryListByFilter,
  getOrderById,
  getProjectById,
  getStoreSupplyById,
  getStoreDemandById,
  getDirectoryRecordById,
  getMergedInfluencers,
  getInfluencerById,
};
