/**
 * B端资源撮合平台 Mock 数据
 */

const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';

const BANNERS = [
  { id: 1, image: 'https://picsum.photos/seed/bb1/750/320', title: '开通会员 解锁全平台联系方式' },
  { id: 2, image: 'https://picsum.photos/seed/bb2/750/320', title: '企业黄页免费入驻' },
  { id: 3, image: 'https://picsum.photos/seed/bb3/750/320', title: '找工厂 找订单 一站式对接' }
];

const STORE_SUPPLY_CATEGORIES = ['全部', '主粮', '零食', '猫砂', '洗护', '用品'];
const STORE_SUPPLY_ORIGINS = ['全部', '山东', '浙江', '广东', '河北', '江苏'];

/** 门店一件代发货源 */
const STORE_SUPPLY_PRODUCTS = [
  {
    id: 1, name: '鲜肉无谷狗粮 2kg', factoryId: 1, factoryName: '宠安食品工厂',
    category: '主粮', origin: '山东', price: 28.5, moq: 1,
    dropship: true, factoryDirect: true, inStock: true,
    image: 'https://picsum.photos/seed/supply1/400/400',
    hasVideo: true, videoCover: 'https://picsum.photos/seed/supplyv1/400/400',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    specs: '2kg/袋，蛋白质≥26%', stock: '现货充足', delivery: '24小时内发货',
    afterSale: '7天质量问题包退换，未拆封可退',
    params: '适用犬种：全犬期；保质期18个月；存储阴凉干燥',
    images: ['https://picsum.photos/seed/supply1a/400/400', 'https://picsum.photos/seed/supply1b/400/400'],
    workshopVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    intro: '门店热销款，支持一件代发，工厂直发宠物店或顾客',
    phone: '0535-8881234', wechat: 'chongan_factory'
  },
  {
    id: 2, name: '豆腐猫砂 2.5kg', factoryId: 2, factoryName: '萌宠用品智造',
    category: '猫砂', origin: '浙江', price: 12.8, moq: 1,
    dropship: true, factoryDirect: true, inStock: true,
    image: 'https://picsum.photos/seed/supply2/400/400',
    hasVideo: false,
    specs: '2.5kg/袋，低尘除臭', stock: '现货5000+', delivery: '48小时内发货',
    afterSale: '破损包赔，批量拿货更优价',
    params: '可冲厕所；适用全猫种',
    images: ['https://picsum.photos/seed/supply2a/400/400'],
    workshopVideo: '',
    intro: '平价猫砂爆款，宠物店复购率高，一件起批',
    phone: '0579-8556677', wechat: 'mengchong_odm'
  },
  {
    id: 3, name: '冻干鸡肉粒 100g', factoryId: 1, factoryName: '宠安食品工厂',
    category: '零食', origin: '山东', price: 9.9, moq: 1,
    dropship: true, factoryDirect: true, inStock: true,
    image: 'https://picsum.photos/seed/supply3/400/400',
    hasVideo: true, videoCover: 'https://picsum.photos/seed/supplyv3/400/400',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    specs: '100g/袋，纯肉冻干', stock: '现货', delivery: '24小时内发货',
    afterSale: '质量问题包退，支持拿样',
    params: '猫狗通用；无添加剂',
    images: ['https://picsum.photos/seed/supply3a/400/400'],
    workshopVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
    intro: '高利润零食，适合门店引流和代发',
    phone: '0535-8881234', wechat: 'chongan_factory'
  },
  {
    id: 4, name: '宠物沐浴露 500ml', factoryId: 2, factoryName: '萌宠用品智造',
    category: '洗护', origin: '浙江', price: 15.5, moq: 1,
    dropship: true, factoryDirect: true, inStock: false,
    image: 'https://picsum.photos/seed/supply4/400/400',
    hasVideo: false,
    specs: '500ml/瓶，温和配方', stock: '3天到货', delivery: '预订3天内发货',
    afterSale: '开瓶后非质量问题不退',
    params: '猫狗通用；无硅油',
    images: ['https://picsum.photos/seed/supply4a/400/400'],
    workshopVideo: '',
    intro: '门店洗护配套，支持小批量代发',
    phone: '0579-8556677', wechat: 'mengchong_odm'
  },
  {
    id: 5, name: '自动喂食器', factoryId: 2, factoryName: '萌宠用品智造',
    category: '用品', origin: '浙江', price: 58, moq: 1,
    dropship: true, factoryDirect: true, inStock: true,
    image: 'https://picsum.photos/seed/supply5/400/400',
    hasVideo: true, videoCover: 'https://picsum.photos/seed/supplyv5/400/400',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    specs: '2L容量，智能定时', stock: '现货200+', delivery: '48小时内发货',
    afterSale: '1年质保，非人为损坏免费换',
    params: 'ABS+不锈钢；APP远程控制',
    images: ['https://picsum.photos/seed/supply5a/400/400'],
    workshopVideo: '',
    intro: '智能用品高客单，工厂直发',
    phone: '0579-8556677', wechat: 'mengchong_odm'
  }
];

/** 门店求购需求 */
const STORE_SUPPLY_DEMANDS = [
  {
    id: 1, title: '求平价猫砂一件代发', storeName: '萌宠小屋', category: '猫砂',
    intro: '需要2.5kg规格，单价15元以内，支持代发', time: '2026-09-12', hasMedia: true, dropship: true,
    region: '上海', quantity: '月销200袋',
    detail: '门店日常消耗大，希望找稳定供货工厂，支持一件代发至客户',
    phone: '13800138001', wechat: 'mengchong_store',
    images: ['https://picsum.photos/seed/demand1/400/400'],
    videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/demandv1/400/400'
  },
  {
    id: 2, title: '求鲜肉狗粮一件代发', storeName: '汪星人宠物店', category: '主粮',
    intro: '2kg装，品质稳定，可长期合作', time: '2026-09-10', hasMedia: false, dropship: true,
    region: '江苏南京', quantity: '月订300袋',
    detail: '希望工厂有SC认证，可提供质检报告',
    phone: '13800138002', wechat: 'wangxing_store',
    images: []
  },
  {
    id: 3, title: '求冻干零食代发 门店试销', storeName: '宠悦连锁', category: '零食',
    intro: '冻干鸡肉/鸭肉小包装，适合门店扫码一件代发', time: '2026-09-08', hasMedia: true, dropship: true,
    region: '广东深圳', quantity: '先试50件/周',
    detail: '连锁10家门店，先试销后长期合作',
    phone: '13800138003', wechat: 'chongyue_chain',
    images: ['https://picsum.photos/seed/demand3/400/400']
  }
];

const MODULES = [
  {
    id: 'factory', name: '找工厂', subtitle: 'OEM / ODM / 现货',
    desc: '现货批发/OEM/ODM贴牌代工', url: '/pages/factory/factory',
    bg: 'linear-gradient(135deg, #60A5FA 0%, #1A56DB 100%)',
    iconMain: '🏭', iconSub: '🦴'
  },
  {
    id: 'order', name: '找订单', subtitle: '代工方案 / 现货产品',
    desc: '工厂产品/代工方案对接品牌', url: '/pages/order-market/order-market',
    bg: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
    iconMain: '📋', iconSub: '🐕'
  },
  {
    id: 'storeSupply', name: '门店货源', subtitle: '一件代发 / 工厂直发',
    desc: '一件起批·工厂直发·无需囤货', url: '/pages/store-supply/store-supply',
    bg: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
    iconMain: '🏪', iconSub: '📦'
  },
  {
    id: 'directory', name: '宠业展厅', subtitle: '工厂 / 品牌 / 商家',
    desc: '工厂/品牌/商家入驻展示', url: '/pages/directory/directory',
    bg: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    iconMain: '📇', iconSub: '🏢'
  },
  {
    id: 'invest', name: '宠业创投', subtitle: '项目路演，资源合作',
    desc: '投融资对接 / 推广服务 / 达人合作', url: '/pages/invest/invest',
    bg: 'linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 100%)',
    wide: true, noIcon: true
  },
  {
    id: 'join', name: '免费入驻', subtitle: '宠物工厂 · 宠物品牌 · 宠物门店 · 宠物产业园 · 宠物商协会',
    desc: '工厂/品牌/门店/产业园/商协会免费入驻', action: 'join',
    bg: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)',
    wide: true, noIcon: true
  }
];

const JOIN_ACTIONS = [
  { name: '宠物工厂', url: '/pages/directory-apply/directory-apply?type=工厂' },
  { name: '宠物品牌方', url: '/pages/directory-apply/directory-apply?type=品牌' },
  { name: '宠物门店', url: '/pages/directory-apply/directory-apply?type=商家' },
  { name: '宠物产业园', url: '/pages/industry-apply/industry-apply?type=产业园' },
  { name: '宠物商协会', url: '/pages/industry-apply/industry-apply?type=商协会' }
];

const FACTORIES = [
  { id: 1, name: '宠安食品工厂', category: '主粮', bizTypes: ['现货批发', 'OEM贴牌'], moq: '500kg', region: '山东烟台', tags: ['可打样', '支持贴牌'], intro: '专注宠物主粮OEM/ODM代工15年，月产能2000吨', capacity: '月产2000吨', cert: 'ISO9001、HACCP', samplePolicy: '免费打样3kg', phone: '0535-8881234', wechat: 'chongan_factory', memberOnly: true, images: ['https://picsum.photos/seed/factory1/600/400', 'https://picsum.photos/seed/factory1b/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/factoryv1/600/400' },
  { id: 2, name: '萌宠用品智造', category: '用品', bizTypes: ['ODM定制'], moq: '1000件', region: '浙江义乌', tags: ['支持贴牌'], intro: '宠物用品ODM定制，涵盖食具、玩具、清洁用品', capacity: '月产50万件', cert: 'BSCI认证', samplePolicy: '打样费100元可抵扣', phone: '0579-8556677', wechat: 'mengchong_odm', memberOnly: true, images: ['https://picsum.photos/seed/factory2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/factoryv2/600/400' },
  { id: 3, name: '瑞鹏生物科技', category: '保健', bizTypes: ['现货批发', 'OEM贴牌', 'ODM定制'], moq: '300盒', region: '广东广州', tags: ['可打样', '支持贴牌'], intro: '宠物保健品研发制造，益生菌、营养膏等', capacity: '月产100万盒', cert: 'GMP、SC生产许可', samplePolicy: '免费寄样', phone: '020-3889900', wechat: 'ruipeng_bio', memberOnly: true, images: ['https://picsum.photos/seed/factory3/600/400'], videoUrl: '', videoPoster: '' }
];

const ORDERS = [
  { id: 1, factoryName: '宠安食品工厂', title: '成犬粮 OEM贴牌方案', type: '代工方案', category: '主粮', moq: '500kg', price: '面议', delivery: '15-20天', intro: '提供配方定制、包装设计、生产代工全流程', params: '蛋白质≥26%，脂肪≥14%', cases: '已服务20+品牌贴牌', phone: '0535-8881234', wechat: 'chongan_factory', images: ['https://picsum.photos/seed/order1/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/orderv1/600/400' },
  { id: 2, factoryName: '萌宠用品智造', title: '宠物自动喂食器 现货', type: '现货产品', category: '智能设备', moq: '500件', price: '68元/件', delivery: '3-7天', intro: '2L大容量智能喂食器，支持APP远程控制', params: '容量2L，材质ABS+不锈钢', cases: '出口欧美、日韩', phone: '0579-8556677', wechat: 'mengchong_odm', images: ['https://picsum.photos/seed/order2/600/400', 'https://picsum.photos/seed/order2b/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/orderv2/600/400' },
  { id: 3, factoryName: '瑞鹏生物科技', title: '宠物益生菌 现货批发', type: '现货产品', category: '保健', moq: '300盒', price: '28元/盒', delivery: '5天', intro: '10种菌株复合益生菌，改善宠物肠道健康', params: '30袋/盒，活菌数≥100亿', cases: '全国200+宠物店合作', phone: '020-3889900', wechat: 'ruipeng_bio', images: ['https://picsum.photos/seed/order3/600/400'], videoUrl: '', videoPoster: '' }
];

const DEMANDS = [
  { id: 1, type: 'factory', title: '寻找猫主粮OEM工厂', company: '喵星品牌', category: '主粮', moq: '1000kg', region: '不限', intro: '新品牌寻找猫主粮OEM代工，要求有出口资质', time: '2026-09-10' },
  { id: 2, type: 'order', title: '采购宠物零食 月订5000件', company: '汪星人连锁', category: '零食', moq: '5000件', region: '江浙沪', intro: '连锁宠物店采购冻干零食，需稳定供货', time: '2026-09-08' },
  { id: 3, type: 'influencer', title: '招募抖音宠物达人分销', company: '宠悦品牌', category: '全品类', moq: '-', region: '全国', intro: '粉丝10万+宠物垂类达人，佣金20%+', time: '2026-09-05' }
];

const PROJECTS = [
  { id: 1, name: '智能宠物健康监测项圈', track: '智能硬件', stage: 'A轮', need: '寻求500万融资', intro: '基于IoT的宠物健康监测设备，已获2项专利', team: '核心团队来自华为、小米', bp: 'BP附件.pdf', phone: '13800001111', wechat: 'pet_iot_fund', images: ['https://picsum.photos/seed/project1/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/projectv1/600/400' },
  { id: 2, name: '宠物连锁洗护品牌', track: '线下服务', stage: '天使轮', need: '寻求200万融资+区域合作', intro: '标准化宠物洗护连锁，已在3城开设12家店', team: '创始人10年宠物行业经验', bp: 'BP附件.pdf', phone: '13900002222', wechat: 'pet_wash_brand', images: ['https://picsum.photos/seed/project2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/projectv2/600/400' },
  { id: 3, name: '宠物食品新零售平台', track: '电商', stage: 'Pre-A', need: '寻求战略投资', intro: 'B2B2C宠物食品供应链平台，月GMV 500万', team: '阿里、京东背景团队', bp: 'BP附件.pdf', phone: '13700003333', wechat: 'pet_food_b2b', images: ['https://picsum.photos/seed/project3/600/400'], videoUrl: '', videoPoster: '' }
];

const INFLUENCERS = [
  { id: 1, name: '萌宠日记', platform: '抖音', fans: '128万', category: '猫狗日常', mode: '分销带货', cases: '单月带货GMV 80万+', intro: '记录两只柯基的日常，粉丝粘性高', products: '主粮、零食、用品', phone: '18600001111', wechat: 'mengchong_diary', images: ['https://picsum.photos/seed/influencer1/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/influencerv1/600/400' },
  { id: 2, name: '猫咪研究所', platform: '小红书', fans: '56万', category: '猫咪科普', mode: '坑位费+分销', cases: '合作品牌30+', intro: '专业猫咪养护知识分享，女性用户占比85%', products: '猫粮、猫砂、保健品', phone: '18600002222', wechat: 'cat_lab', images: ['https://picsum.photos/seed/influencer2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/influencerv2/600/400' },
  { id: 3, name: '汪星人大本营', platform: '快手', fans: '89万', category: '狗狗训练', mode: '分销带货', cases: '狗粮品类TOP达人', intro: '狗狗训练+好物推荐，下沉市场覆盖广', products: '狗粮、训练用品', phone: '18600003333', wechat: 'dog_camp', images: ['https://picsum.photos/seed/influencer3/600/400'], videoUrl: '', videoPoster: '' }
];

const COMPANIES = [
  { id: 1, name: '宠安食品工厂', type: '工厂', category: '主粮/零食', region: '山东烟台', intro: '15年宠物食品代工经验，服务200+品牌', products: '主粮OEM、零食ODM', cert: 'ISO9001、HACCP、出口资质', phone: '0535-8881234', wechat: 'chongan_factory', status: 'approved', image: 'https://picsum.photos/seed/comp1/600/400', images: ['https://picsum.photos/seed/comp1/600/400', 'https://picsum.photos/seed/comp1b/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/compv1/600/400' },
  { id: 2, name: '喵星品牌', type: '品牌', category: '猫粮', region: '上海', intro: '新锐猫粮品牌，主打无谷低敏配方', products: '猫粮、猫罐头', cert: '商标注册、SC许可', phone: '021-55667788', wechat: 'miaoxing_brand', status: 'approved', image: 'https://picsum.photos/seed/comp2/600/400', images: ['https://picsum.photos/seed/comp2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/compv2/600/400' },
  { id: 3, name: '华南宠物产业园', type: '产业园', category: '综合', region: '广东佛山', intro: '集生产、研发、展示于一体的宠物产业集聚地', products: '厂房租赁、政策扶持、资源对接', cert: '省级产业园', phone: '0757-8889900', wechat: 'hn_pet_park', status: 'approved', image: 'https://picsum.photos/seed/comp3/600/400', images: ['https://picsum.photos/seed/comp3/600/400', 'https://picsum.photos/seed/comp3b/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/compv3/600/400' },
  { id: 4, name: '中国宠物行业协会', type: '商协会', category: '行业组织', region: '北京', intro: '全国性宠物行业组织，会员企业3000+', products: '行业资讯、展会、标准制定', cert: '民政部登记', phone: '010-8887766', wechat: 'cpia_official', status: 'approved', image: 'https://picsum.photos/seed/comp4/600/400', images: ['https://picsum.photos/seed/comp4/600/400'], videoUrl: '', videoPoster: '' }
];

const MEDIA_SERVICES = [
  { id: 1, name: '短视频拍摄套餐', price: '3000起', desc: '含脚本、拍摄、剪辑、发布指导', cases: '服务品牌50+', image: 'https://picsum.photos/seed/media1/600/400' },
  { id: 2, name: '直播代播服务', price: '5000/场', desc: '专业主播+运营+场控，全链路代播', cases: '单场GMV最高50万', image: 'https://picsum.photos/seed/media2/600/400' },
  { id: 3, name: '品牌包装策划', price: '9800起', desc: '品牌定位、VI设计、包装升级', cases: '助力10+新品牌上市', image: 'https://picsum.photos/seed/media3/600/400' },
  { id: 4, name: '账号代运营', price: '6800/月', desc: '内容策划、日常运营、数据分析', cases: '平均涨粉3000+/月', image: 'https://picsum.photos/seed/media4/600/400' }
];

const COMPANY_TYPES = ['工厂', '品牌', '商家'];
const INDUSTRY_ORG_TYPES = ['产业园', '商协会'];

/** 产业园列表 */
const INDUSTRY_PARKS = [
  { id: 3, name: '华南宠物产业园', type: '产业园', category: '综合', region: '广东佛山', intro: '集生产、研发、展示于一体的宠物产业集聚地，占地500亩', products: '厂房租赁、政策扶持、资源对接、物流配套', cert: '省级产业园', phone: '0757-8889900', wechat: 'hn_pet_park', status: 'approved', image: 'https://picsum.photos/seed/comp3/600/400', scale: '500亩 · 入驻企业80+', images: ['https://picsum.photos/seed/comp3/600/400', 'https://picsum.photos/seed/park3b/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/parkv3/600/400' },
  { id: 5, name: '华东宠物产业孵化园', type: '产业园', category: '孵化加速', region: '江苏南通', intro: '专注宠物新品牌孵化，提供从研发到渠道全链路支持', products: '共享实验室、打样中心、渠道对接', cert: '市级重点产业园', phone: '0513-6667788', wechat: 'hd_pet_park', status: 'approved', image: 'https://picsum.photos/seed/park2/600/400', scale: '200亩 · 入驻企业45+', images: ['https://picsum.photos/seed/park2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/parkv2/600/400' }
];

/** 商协会列表 */
const ASSOCIATIONS = [
  { id: 4, name: '中国宠物行业协会', type: '商协会', category: '行业组织', region: '北京', intro: '全国性宠物行业组织，会员企业3000+，主导行业标准制定', products: '行业资讯、展会、标准制定、政策解读', cert: '民政部登记', phone: '010-8887766', wechat: 'cpia_official', status: 'approved', image: 'https://picsum.photos/seed/comp4/600/400', scale: '会员企业3000+', images: ['https://picsum.photos/seed/comp4/600/400'], videoUrl: '', videoPoster: '' },
  { id: 6, name: '广东省宠物行业商会', type: '商协会', category: '区域商会', region: '广东广州', intro: '华南地区最具影响力的宠物行业商会，链接政产学研资源', products: '政企对接、行业培训、供应链撮合', cert: '民政登记商会', phone: '020-3334455', wechat: 'gd_pet_chamber', status: 'approved', image: 'https://picsum.photos/seed/assoc2/600/400', scale: '会员企业800+', images: ['https://picsum.photos/seed/assoc2/600/400'], videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/assocv2/600/400' }
];

/** 宠业社区分类 */
const COMMUNITY_TABS = ['推荐', '行业动态', '投资资讯', '新闻', '交流'];

/** 宠业社区笔记 */
const COMMUNITY_POSTS = [
  {
    id: 1, category: '行业动态', title: '2026宠业风向标：猫经济持续领跑',
    content: '据最新行业报告，猫粮、猫砂、智能猫用品三大品类增速超25%，门店应重点布局猫垂直产品线。工厂端也在加大猫主粮研发投入，OEM订单明显向猫品类倾斜。',
    author: '宠业观察', avatar: 'https://picsum.photos/seed/cav1/100/100',
    cover: 'https://picsum.photos/seed/cp1/400/520', coverH: 520,
    images: ['https://picsum.photos/seed/cp1/400/520', 'https://picsum.photos/seed/cp1b/400/400'],
    videoUrl: '', videoPoster: '', tags: ['猫经济', '趋势'], likes: 328, comments: 56, time: '2小时前'
  },
  {
    id: 2, category: '投资资讯', title: '宠物智能穿戴赛道再获资本青睐',
    content: '某宠物健康监测项圈项目完成A轮融资5000万，投资方看好宠物医疗+IoT结合场景。B端工厂可关注传感器、模组供应链机会。',
    author: '投研社', avatar: 'https://picsum.photos/seed/cav2/100/100',
    cover: 'https://picsum.photos/seed/cp2/400/460', coverH: 460,
    images: ['https://picsum.photos/seed/cp2/400/460'],
    videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/cpv2/400/460',
    tags: ['融资', '智能硬件'], likes: 215, comments: 34, time: '5小时前'
  },
  {
    id: 3, category: '新闻', title: '农业农村部发布宠物饲料新规解读',
    content: '新规对宠物饲料标签、添加剂使用提出更严格要求，工厂需关注配方合规与检测认证更新，品牌方选品也要看供应商资质。',
    author: '政策速递', avatar: 'https://picsum.photos/seed/cav3/100/100',
    cover: 'https://picsum.photos/seed/cp3/400/380', coverH: 380,
    images: ['https://picsum.photos/seed/cp3/400/380'],
    videoUrl: '', videoPoster: '', tags: ['政策', '合规'], likes: 189, comments: 41, time: '昨天'
  },
  {
    id: 4, category: '交流', title: '宠物店淡季怎么过？同行来聊聊',
    content: '最近客流下降明显，大家有什么引流妙招？社群、直播、异业合作都试过，欢迎分享实战经验～',
    author: '萌宠小屋老板', avatar: 'https://picsum.photos/seed/cav4/100/100',
    cover: 'https://picsum.photos/seed/cp4/400/440', coverH: 440,
    images: ['https://picsum.photos/seed/cp4/400/440', 'https://picsum.photos/seed/cp4b/400/360'],
    videoUrl: '', videoPoster: '', tags: ['门店', '运营'], likes: 97, comments: 68, time: '昨天'
  },
  {
    id: 5, category: '行业动态', title: '冻干零食代工价格战打响',
    content: '多家山东工厂下调冻干代工报价，起订量也降到200kg。品牌方可以趁机谈更好的合作条件，但要盯紧原料溯源。',
    author: '供应链老K', avatar: 'https://picsum.photos/seed/cav5/100/100',
    cover: 'https://picsum.photos/seed/cp5/400/500', coverH: 500,
    images: ['https://picsum.photos/seed/cp5/400/500'],
    videoUrl: SAMPLE_VIDEO, videoPoster: 'https://picsum.photos/seed/cpv5/400/500',
    tags: ['冻干', '代工'], likes: 156, comments: 29, time: '2天前'
  },
  {
    id: 6, category: '投资资讯', title: '宠物洗护连锁模式值得投吗？',
    content: '标准化洗护+会员制在一线城市验证不错，下沉市场还在试水。想加盟或投资的可以一起拆解单店模型。',
    author: '连锁研究', avatar: 'https://picsum.photos/seed/cav6/100/100',
    cover: 'https://picsum.photos/seed/cp6/400/400', coverH: 400,
    images: ['https://picsum.photos/seed/cp6/400/400'],
    videoUrl: '', videoPoster: '', tags: ['洗护', '连锁'], likes: 88, comments: 19, time: '3天前'
  }
];

const COMMUNITY_EMOJIS = ['😀', '😂', '👍', '❤️', '🔥', '👏', '🎉', '💪', '🐱', '🐶', '🦴', '💰', '📈', '✅', '👀', '🤝', '💡', '📝', '🏭', '🏪'];

const getById = (list, id) => list.find(item => item.id === Number(id));

/** 企业黄页（不含产业园/商协会） */
const getDirectoryCompanies = () => COMPANIES.filter(c => COMPANY_TYPES.includes(c.type));

/** 根据 ID 获取产业园或商协会 */
const getIndustryOrgById = (id) => {
  return getById(INDUSTRY_PARKS, id) || getById(ASSOCIATIONS, id) || getById(COMPANIES, id);
};

module.exports = {
  BANNERS, MODULES, JOIN_ACTIONS, FACTORIES, ORDERS, DEMANDS, PROJECTS,
  INFLUENCERS, COMPANIES, MEDIA_SERVICES, COMPANY_TYPES,
  INDUSTRY_ORG_TYPES, INDUSTRY_PARKS, ASSOCIATIONS,
  STORE_SUPPLY_CATEGORIES, STORE_SUPPLY_ORIGINS,
  STORE_SUPPLY_PRODUCTS, STORE_SUPPLY_DEMANDS,
  COMMUNITY_TABS, COMMUNITY_POSTS, COMMUNITY_EMOJIS,
  getDirectoryCompanies,
  getCommunityPostById: (id) => getById(COMMUNITY_POSTS, id),
  getFactoryById: (id) => getById(FACTORIES, id),
  getOrderById: (id) => getById(ORDERS, id),
  getProjectById: (id) => getById(PROJECTS, id),
  getInfluencerById: (id) => getById(INFLUENCERS, id),
  getCompanyById: (id) => getById(COMPANIES, id),
  getIndustryOrgById,
  getStoreSupplyById: (id) => getById(STORE_SUPPLY_PRODUCTS, id),
  getStoreDemandById: (id) => getById(STORE_SUPPLY_DEMANDS, id)
};
