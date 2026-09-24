# Random Team Generator MVP 技术设计规范 (Design Spec)

- **项目名称**：Random Team Generator & Sports Team Picker
- **文档版本**：v1.0.0
- **创建日期**：2026-09-24
- **状态**：待用户审核 (Pending Review)

---

## 1. 背景与目标

根据关键词与竞争情报研究（参考 [docs/research.md](file:///d:/MyAwesomeProjects/random-team-generator/docs/research.md)）：
* 主词 **`random team generator`**（月搜 22,200，KD 52.9）属于通用名单分队需求，主要面向课堂、团建与聚会破冰场景；
* 联盟衍生词 **`random nfl team generator`**（9,900，KD 38.9）、**`random nba team generator`**（8,100，KD 39.7）、**`random mlb team generator`**（2,900，KD 33.3）属于体育抽签与选秀需求，主要面向体育迷、Fantasy 玩家及娱乐聚会；
* 竞品盘面（如 Randomlists、Pickerwheel、Jamesbaum）普遍存在跳出率高（60%~74%）、广告遮挡、首屏依赖客户端白屏加载等痛点。

### MVP 核心目标
1. **双引擎架构立项**：
   * **Engine A（分队器 Divider）**：承接首页通用词，支持名单自由粘贴、按队伍数/每队人数分组，首屏直接内置并渲染 10 人分 2 队的即时结果；
   * **Engine B（选队器 Picker）**：以独立一级页面承接三大联盟（NFL、NBA、MLB），提供“卡片随机翻牌抽取”与“选秀顺位打乱（Draft Order）”双模态交互。
2. **极致用户体验**：
   * 0 阻塞广告、首屏毫秒级直接呈现预填结果；
   * 完美适配移动端与桌面端，提供一键复制、URL 状态一键分享与图片生成导出。
3. **SEO 权重汇聚与合规**：
   * 严格遵循“不同词分开做、相同词放一个页面”与“全站之力汇聚首页”原则；
   * 落地页遵循 V2.0 标准（工具区 + 深度图文区 + PAA FAQ 问答 + 结构化数据 Schema）；
   * 构建期全量静态预渲染（SSG），零运行时服务器依赖，静态托管部署至 Cloudflare Pages。

---

## 2. 技术选型与规范

| 领域 | 选型 | 说明 |
|---|---|---|
| **包管理工具** | `pnpm` | 严格遵守团队全局规范，杜绝使用 npm/yarn |
| **基础脚手架** | TanStack Start / Router + Vite | 基于文件系统路由（File-based Routing），极致构建性能与强类型安全 |
| **UI 与样式** | React 18/19 + Tailwind CSS | 原子化 CSS 极小产物，配合 Lucide React 图标库 |
| **状态与路由** | TanStack Router Search Params | 类型安全的 URL 查询参数双向绑定，实现分享即还原状态 |
| **构建与预渲染** | Vite SSG Prerender | 构建生成 100% 纯静态 HTML/CSS/JS，满足爬虫开箱即抓需求 |
| **托管平台** | Cloudflare Pages | 全球 Anycast CDN 静态分发，零服务器成本 |
| **测试框架** | Vitest | 覆盖分队均衡算法、洗牌随机性与工具函数单测 |

---

## 3. 页面路由与 SEO 矩阵设计

```
/ (首页) ───────────────► 目标词: random team generator (22.2k)
├── /random-nfl-team-generator  ► 目标词: random nfl team generator (9.9k)
├── /random-nba-team-generator  ► 目标词: random nba team generator (8.1k)
├── /random-mlb-team-generator  ► 目标词: random mlb team generator (2.9k)
├── /privacy-policy             ► 基础法务合规页
└── /terms                      ► 基础使用条款页
```

### 3.1 页面 TDK 与权重导流规划
* **首页 `/`**：
  * **Title**：`Random Team Generator — Split Names into Balanced Teams & Groups`
  * **Description**：`Free and fast random team generator. Paste your list of names and instantly split them into balanced groups by team count or group size. Perfect for classrooms, sports, and games.`
  * **H1**：`Random Team Generator`
  * **内链出口**：工具区下方展示 `Popular Sports Team Pickers` 卡片网格，分别指向 NFL、NBA、MLB。
* **NFL 选队页 `/random-nfl-team-generator`**：
  * **Title**：`Random NFL Team Generator — Pick a Football Team & Draft Order`
  * **Description**：`Randomly generate an NFL football team from all 32 franchises. Filter by AFC/NFC, shuffle fantasy draft orders, and spin for your next team.`
  * **H1**：`Random NFL Team Generator`
  * **内链出口**：正文底部一句话引导回首页分队器；同级互链推荐 NBA 与 MLB 选队器。
* **NBA 选队页 `/random-nba-team-generator`**：
  * **Title**：`Random NBA Team Generator — Basketball Team Picker & Draft Shuffle`
  * **Description**：`Pick a random NBA basketball team from all 30 franchises. Filter by Eastern and Western Conference, generate draft orders, and pick teams instantly.`
  * **H1**：`Random NBA Team Generator`
* **MLB 选队页 `/random-mlb-team-generator`**：
  * **Title**：`Random MLB Team Generator — Baseball Team Picker & Order Generator`
  * **Description**：`Generate a random Major League Baseball team from all 30 clubs. Filter by AL or NL, shuffle team lists, and make fair picks.`
  * **H1**：`Random MLB Team Generator`

---

## 4. 工程目录结构规范

严格将组件按职责进行功能命名（`divider` 与 `picker`）：

```
random-team-generator/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── logos/
│       ├── nfl/                     # 32 支 NFL 球队 Logo (SVG/WebP)
│       ├── nba/                     # 30 支 NBA 球队 Logo (SVG/WebP)
│       └── mlb/                     # 30 支 MLB 球队 Logo (SVG/WebP)
├── src/
│   ├── routes/
│   │   ├── __root.tsx               # 全局 Layout（注入 Head、全站 Header、全站 Footer）
│   │   ├── index.tsx                # 首页（分队器 Engine A）
│   │   ├── random-nfl-team-generator.tsx  # NFL 选队页（选队器 Engine B）
│   │   ├── random-nba-team-generator.tsx  # NBA 选队页
│   │   ├── random-mlb-team-generator.tsx  # MLB 选队页
│   │   ├── privacy-policy.tsx       # 隐私声明
│   │   └── terms.tsx                # 服务条款
│   ├── components/
│   │   ├── layout/                  # SiteHeader, SiteFooter, Container
│   │   ├── divider/                 # 分队器专有组件
│   │   │   ├── RosterInput.tsx      # 名单多行输入与清洗工具条
│   │   │   ├── DividerControls.tsx  # 模式切换(按队数/按人数)与步进器
│   │   │   ├── DividedTeamsGrid.tsx # 分组卡片网格响应式展示
│   │   │   ├── DividerActions.tsx   # 洗牌、复制文本、分享链接、导出图片
│   │   │   └── CaseShowcase.tsx     # 精品页2.0：真实场景案例列表与一键套用 (5v5/课堂/团建/桌游)
│   │   ├── picker/                  # 选队器专有组件
│   │   │   ├── LeaguePickerHeader.tsx # 联赛信息与分区快速筛选条 (All/AFC/NFC等)
│   │   │   ├── PickerModeSwitch.tsx   # 模式切换 (Card Draw vs Draft Order Table)
│   │   │   ├── TeamCardDraw.tsx       # 翻牌单队抽取卡片与排除机制
│   │   │   ├── DraftOrderTable.tsx    # 1~32 顺位打乱表格
│   │   │   ├── SportsPickerActions.tsx# 重新抽取/洗牌、复制、分享
│   │   │   └── SportsCaseShowcase.tsx # 精品页2.0：Fantasy选秀顺位与对局案例展示
│   │   ├── seo/                     # SEO 专用组件
│   │   │   ├── FaqSection.tsx       # PAA 折叠问答模块
│   │   │   ├── HowToSection.tsx     # 图文使用教程
│   │   │   ├── SchemaScript.tsx     # JSON-LD 结构化数据注入
│   │   │   └── InternalLinkHub.tsx  # 推荐工具卡片矩阵
│   │   └── ui/                      # 基础 UI 原子库 (Button, Card, Badge, Modal, Tabs)
│   ├── data/
│   │   ├── types.ts                 # 球队与分队全局 TypeScript 契约
│   │   ├── nfl-teams.ts             # 32 支 NFL 球队元数据
│   │   ├── nba-teams.ts             # 30 支 NBA 球队元数据
│   │   └── mlb-teams.ts             # 30 支 MLB 球队元数据
│   ├── lib/
│   │   ├── shuffle.ts               # Fisher-Yates 伪随机与种子随机洗牌算法
│   │   ├── team-divider.ts          # 分队与余数均衡分配核心算法
│   │   └── share.ts                 # 剪贴板复制、URL 参数编码/解码、海报图导出
│   └── styles/
│       └── globals.css              # Tailwind 核心与动画类
├── vite.config.ts                   # Vite 配置与 Prerender / Sitemap 设置
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. 核心模块与业务逻辑规范

### 5.1 Engine A：名单分队器（`components/divider/`）

#### 初始状态配置
* **内置预设**：默认加载 10 位常见人名（`Alex`, `Blake`, `Chris`, `Dana`, `Evan`, `Frank`, `Grace`, `Henry`, `Ivy`, `Jack`）。
* **默认规则**：模式为 `by-team-count`（按队数划分），初始队伍数设为 **2 队**（平均每队 5 人，呈现经典 5v5 均衡对局）。
* **静态直出**：首屏 HTML 预先内嵌该默认计算结果，爬虫抓取即可识别完整分组卡片。

#### 核心算法逻辑（`lib/team-divider.ts`）
1. **名单清洗**：
   * 支持换行符 `\n`、中文逗号 `，`、英文逗号 `,`、制表符分隔；
   * 自动 trim 并过滤纯空白项；
   * 提供实时去重检查与警告提示（不阻止重名，兼容现实同名场景）。
2. **分组计算与余数均衡**：
   * **按队伍数划分（By Number of Teams）**：指定 $K$ 队，总人数 $N$。
   * **按每队人数划分（By Team Size）**：指定每队 $S$ 人，队伍数 $K = \lceil N / S \rceil$。
3. **CaseShowcase（精选场景案例库与一键套用）**：
   * 展示 4 个高频真实场景卡片：
     1. **🏀 5v5 Pickup Game**：10 人名单，自动分为 2 队（Team Blue vs Team Red，各 5 人）；
     2. **🏫 Classroom Project Groups**：16 位学生名单，精准分为 4 个小组（每组 4 人）；
     3. **🎉 Team Building Icebreaker**：12 位员工名单，分为 3 支趣味破冰队伍；
     4. **🎲 Trivia / Board Game Night**：8 位朋友名单，快速分为 2 组对抗阵营。
   * 每个案例卡片展示：场景描述、名单预览、预生成结果预览，以及显式的 `[Load & Shuffle]` 按钮。
   * **交互动效**：用户点击 `Load & Shuffle`，页面平滑滚动回顶部分队器，自动注入案例名单、切换参数并执行一次洗牌动画，极大拉高用户在页停留时间与交互率（Engaged Session）。

---

### 5.2 Engine B：体育选队器（`components/picker/`）

#### 数据模型（`src/data/types.ts`）
```typescript
export interface SportsTeam {
  id: string;              // 唯一 ID，如 "kansas-city-chiefs"
  name: string;            // 全名，如 "Kansas City Chiefs"
  shortName: string;       // 简称，如 "Chiefs"
  city: string;            // 城市，如 "Kansas City"
  league: 'nfl' | 'nba' | 'mlb';
  conference: string;      // 顶级大区: AFC/NFC, Eastern/Western, AL/NL
  division: string;        // 细大赛区: 如 "AFC West", "Atlantic"
  primaryColor: string;    // 主色调 Hex (#E31837)
  secondaryColor: string;  // 辅助色 Hex (#FFB81C)
  logoPath: string;        // 本地 Logo 文件路径
}
```

#### 交互模式规范
1. **模式一：单队抽取（Card Draw）**：
   * 点击 `Pick a Team` 触发翻牌动效（CSS 3D Rotate 或柔和缩放过渡）；
   * 高亮展示抽中的球队卡片：队徽、队名、城市、所属赛区徽标、主色渐变底纹；
   * **防重复开关（Elimination Mode）**：开启后，已抽中的队伍从当前候选池移除并记录在时间轴下方，候选数量递减；全部抽完时展示重置池子提示。
2. **模式二：选秀顺位打乱（Draft Order Table）**：
   * 切换至顺位表格视图，展示 1 到 30/32 位的完整队伍排位；
   * 支持一键 `Shuffle Draft Order` 重新随机打乱；
   * 支持一键 `Copy Order List`（格式化为带序号的文本列表，便于直接发送给 Fantasy 盟友）。
3. **分区快速过滤**：
   * 标签栏允许只在特定分区池子内进行抽选（如只在 AFC 16 支球队中抽取）。
4. **SportsCaseShowcase（体育玩法案例展示）**：
   * 展示 10-Team Fantasy Draft Order Showcase（真实 10 人梦幻联赛选秀顺位模拟案例）；
   * 展示 Console Game Matchup Challenge（Madden / 2K 游戏随机选队对决案例）；
   * 为页面注入深厚的高价值体育实体关键词，降低跳出率。

---

## 6. SEO 精品页规范与结构化数据

每个页面底部必须包含丰富的 SEO 图文与微数据（按 V2.0 标准交付）：

### 6.1 图文模块排布
1. **How to Use Section**：清晰的三步法说明（输入名单/选择联盟 -> 调整参数 -> 立即生成与复制）。
2. **Key Scenarios & Applications**：
   * 首页：聚焦课堂分组、团建破冰、聚会桌游、体育运动对局；
   * 联盟页：聚焦 Fantasy Football/Basketball Draft 顺位判定、FIFA/Madden/2K 随机对阵挑战。
3. **FAQ Section（高频 PAA 问答）**：
   * 每个页面提供 4~5 个核心问答，折叠交互流畅，答案翔实专业。

### 6.2 JSON-LD Schema 微数据注入
全站自动注入两类标准 Schema：
* **`WebApplication` / `SoftwareApplication`**：标明为免费无安装在线工具。
* **`FAQPage`**：将页面内的所有问答完整格式化注入，助力 Google 搜索结果直出问答富片段。

---

## 7. 异常处理与边界用例

| 异常/边界用例 | 系统响应与处理策略 |
|---|---|
| 用户将输入框全部清空后点击分队 | 给出友好 Toast 提示，并展示“Restore Sample Names（恢复示例）”按钮，不出现白屏崩溃 |
| 输入人数小于队伍数（如 2 人分 5 队） | 动态将最大队数限制为实际人数，并以微提示告知用户 |
| 输入内容包含特殊字符或超长字符串 | 文本清洗阶段过滤非打印字符，展示截断并做 XSS 转义防御 |
| 体育选队开启排除模式直到池子为空 | 按钮置灰，展示“All teams have been picked!”，并提供醒目的“Reset Pool”恢复初始状态 |
| 网络离线或断网状态 | 全功能纯前端静态计算，100% 离线可用（Local-First） |

---

## 8. 构建、验证与部署

1. **测试驱动验证（Vitest）**：
   * `team-divider.test.ts`：验证 10 人分 2 队（5, 5）、10 人分 3 队（4, 3, 3）的公平性；验证超长名单清洗。
   * `shuffle.test.ts`：验证打乱算法在统计学意义上的分布均匀性。
2. **构建校验（`pnpm build`）**：
   * 执行静态预渲染流程，校验 `dist/` 目录下是否完整产出各路由对应的 HTML；
   * 检查 `dist/sitemap.xml` 与 `dist/robots.txt` 格式与 URL 是否合法。
3. **Cloudflare Pages 静态上线**：
   * Build Command: `pnpm build`
   * Output Directory: `dist`
   * 启用全球边缘 CDN 加速。

---

## 9. 后续规划（Post-MVP）

* 扩展更多热门联赛（NHL、NCAA、Premier League、Champions League）；
* 增加幸运大转盘（Wheel Spinner）作为附加可视化模式；
* 流量起量且跳出率稳定后，合规接入 Google AdSense 广告位。
