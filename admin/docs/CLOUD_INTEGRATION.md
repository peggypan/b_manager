# 微信云开发接入说明

后台前端已通过 `src/api/client.ts` 统一调用云函数。当前开发环境 `VITE_USE_MOCK=true`，数据来自 `src/mock/`。

## 1. 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_USE_MOCK` | `true` 使用 Mock；生产设为 `false` |
| `VITE_CLOUD_API_BASE` | 云函数 HTTP 网关根地址，例如 `https://your-env.ap-shanghai.app.tcloudbase.com` |

请求格式（建议云函数网关统一实现）：

```http
POST {VITE_CLOUD_API_BASE}/cloud/{云函数名}
Authorization: Bearer {admin_token}
Content-Type: application/json

{ ...payload }
```

响应格式：

```json
{ "code": 0, "message": "ok", "data": { } }
```

## 2. 云函数清单

与 `CloudFunctions` 常量一一对应，建议在云开发中创建 `admin` 目录下的云函数或单一路由云函数 `adminRouter`。

| 云函数名 | 用途 |
| --- | --- |
| `admin.auth.login` | 管理员登录（可与小程序用户体系隔离） |
| `admin.dashboard.stats` | 工作台统计 |
| `admin.audit.listCompanyApply` / `admin.audit.auditCompany` | 企业入驻 |
| `admin.audit.listPublish` / `admin.audit.auditPublish` | 会员发布审核（含工厂信息、供需需求等） |
| `admin.user.list` | 小程序用户（含手机号） |
| `admin.content.listFactories` 等 | 各内容模块列表 |
| `admin.common.deleteRecord` | 按 resource + id 删除内容（与 getRecord/updateRecord 配套） |
| `admin.common.createRecord` | 按 resource + 字段 payload 新增一条内容，返回 `{ id }` |
| `admin.content.auditCommunity` | 社区帖子审核 |

## 3. 建议云数据库集合

与小程序业务对齐（命名可按现有规范调整）：

| 集合 | 说明 |
| --- | --- |
| `users` | 微信用户：openid、nickname、**phone**、会员等级 |
| `membership` | 会员等级、到期时间 |
| `company_apply` | 展厅/企业入驻申请 |
| `directory` | 宠业展厅（工厂/品牌/商家） |
| `industry_org` | 产业园、商协会 |
| **`factories`** | **找工厂列表**（名称、品类、bizTypes、tags、moq、intro、产能资质等） |
| `orders` | 找订单·产品/方案 |
| `store_supply` / `store_demands` | 门店货源 / 门店求购 |
| `invest_projects` / `influencers` | 创投 / 达人 |
| **`publish_items`** | **我的发布**汇总审核：type 见下表 |
| `community_posts` | 社区笔记 |
| `banners` / `media_services` | 运营配置 |

### `publish_items.type`（与小程序 `myPublish` / `localPublish` 对齐）

| type | 小程序场景 | 审核通过后写入 |
| --- | --- | --- |
| `factory_info` | 找工厂页「+ 发布工厂」 | `factories` |
| `factory` | 发工厂需求 → 供需市场「需求」 | 需求集合 / `demands` |
| `order` | 找订单·产品方案 | `orders` |
| `order_demand` | 找订单·需求大厅 | 订单需求集合 |
| `storeSupply` / `storeDemand` | 门店货源 / 求购 | 对应集合 |
| `invest` | 创投发布 | `invest_projects` |
| `directory` | 展厅入驻 | `directory` |
| `industry` | 产业园/商协会 | `industry_org` |
| `community` | 社区笔记 | `community_posts` |

### 状态字段 `status`

- 后台审核流：`pending` → `approved`（Mock 会转为 C 端 `published`）/ `rejected`
- 小程序会员**免审直发**时可直接写 `published`（与 `approved` 同等展示）
- 用户下架 / 后台下架：`offline`

小程序本地存储键（接云前参考，见 `utils/localPublish.js`）：

| 键名 | 模块 |
| --- | --- |
| `localPublishedFactories` | 找工厂 · 会员发布工厂信息 |
| `localPublishedDemands` | 供需市场 · 工厂需求等 |
| `localOrderDemands` | 找订单 · 需求大厅 |
| `localPublishedOrders` | 找订单 · 产品方案 |
| `localPublishedStoreProducts` / `localPublishedStoreDemands` | 门店货源 / 求购 |
| `localPublishedProjects` | 创投 |
| `localPublishedDirectory` | 宠业展厅 · 工厂/品牌/商家 |
| `localPublishedIndustryParks` / `localPublishedAssociations` | 产业园 / 商协会 |

### 联系方式（C 端必填）

入驻与会员发布表单统一要求：**联系人 + 联系电话 + 微信号**（`utils/contactForm.js`）。云库 `company_apply`、`publish_items`、各内容集合建议均存 `contact`、`phone`、`wechat` 三字段。

### 宠业展厅「免费入驻」

首页 / 展厅右下角入口一致：ActionSheet 五选一 → `directory-apply`（工厂/品牌/商家）或 `industry-apply`（产业园/商协会）。

## 4. 权限与安全

- 管理端登录建议使用独立 `admins` 集合 + JWT，不要复用小程序用户 openid 作为后台凭证。
- 云函数内校验管理员角色；写操作记录 `audit_log`。
- 小程序端读列表时只查询 `status` 为 `approved` 或 `published` 的数据，排除 `offline`。

## 5. 本地联调

```bash
cd admin
npm run dev
```

演示账号：`admin` / `admin123`

接入云开发后，在云函数实现与 `src/mock/router.ts` 相同的入参/出参，即可无缝切换。
