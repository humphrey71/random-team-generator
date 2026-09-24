# Random Team Generator MVP 实施计划 (Implementation Plan)

> **执行须知：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务逐步执行本计划。步骤使用复选框 (`- [ ]`) 语法进行追踪。

**目标：** 构建一个基于 TanStack Router + Vite + Tailwind CSS 的高性能纯静态工具站，包含首页名单分队器（Engine A）与北美三大联赛（NFL/NBA/MLB）选队器（Engine B），具备 V2.0 精品页 SEO 深度图文、真实案例库展示与预渲染，可直接静态部署至 Cloudflare Pages。

**架构：** 前端采用 TanStack 文件系统路由与类型安全 Search Params 管理状态，纯前端使用 Fisher-Yates 算法实现 0ms 延迟的分队与抽签。构建期通过 Vite SSG 静态预渲染生成各路由的完整静态 HTML（首屏即带 10 人 2 队生成结果）以及 Sitemap/Robots 文件。

**技术栈：** TanStack Router, React 18/19, Vite, Tailwind CSS, Lucide React, Vitest, html-to-image, pnpm

**设计规范：** `docs/superpowers/specs/2026-09-24-random-team-generator-mvp-design.md`

## 全局约束 (Global Constraints)

- **包管理器**：必须严格使用 `pnpm`，禁止使用 npm/yarn。
- **静态部署要求**：构建输出必须是独立的纯静态产物（`dist/`），确保零 Node.js 运行时依赖，适配 Cloudflare Pages 静态托管。
- **SEO 精品页 2.0 规范**：每个页面必须具备首屏即出结果（带默认数据预填）、深度图文说明（How-to/Scenarios）、FAQPage JSON-LD 结构化数据、案例展示（CaseShowcase）。
- **组件命名规范**：分队器专有组件统一置于 `components/divider/`；选队器专有组件统一置于 `components/picker/`。
- **首屏预设**：首页名单分队器必须内置 10 人名单并默认分为 2 队（5v5），构建期即输出完整渲染的卡片 DOM。

## 评审重点 (Review Focus)

1. **分队余数极值平衡**：当人数除以队伍数有余数时（如 10 人分 3 队），算法必须严格分配为 4, 3, 3，绝不允许出现 4, 4, 2。
2. **空输入或单人边界**：当输入框为空或仅有 1 人时，页面应展示温和微提示或恢复预设按钮，杜绝白屏崩溃。
3. **选队池耗尽状态**：开启“排除已抽中队伍”后若 32 支球队全部抽完，按钮应平滑置灰并提供醒目的重置候选池入口。
4. **URL 状态还原度**：通过复制分享链接打开页面时，名单、队数或选取的联盟分区必须能 100% 还原为分享者当时的配置。
5. **SSG 静态抓取有效性**：`dist/` 产物中各页面的 HTML 源码必须包含真实正文文本与初次生成的卡片 DOM，不依赖运行时 JS 异步填充。

---

### Task 1: 项目脚手架与开发基础环境初始化

**文件：**
- 创建：`package.json`
- 创建：`vite.config.ts`
- 创建：`tsconfig.json`
- 创建：`tailwind.config.ts`
- 创建：`postcss.config.js`
- 创建：`vitest.config.ts`
- 创建：`src/styles/globals.css`

**接口：**
- 产出：可运行的 Vite + React + TanStack Router + Tailwind CSS + Vitest 工程基座

- [ ] **Step 1: 初始化 package.json 并配置依赖**

配置 `package.json` 包含 `@tanstack/react-router`, `@tanstack/router-plugin`, `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `html-to-image`, `tailwindcss`, `vite`, `vitest`。

- [ ] **Step 2: 安装依赖并验证 pnpm 环境**

运行命令：`pnpm install`  
预期输出：依赖成功安装，生成 `pnpm-lock.yaml`。

- [ ] **Step 3: 配置 Vite、Tailwind 与 TypeScript**

编写 `vite.config.ts`（集成 TanStackRouterVite 插件）、`tailwind.config.ts`、`tsconfig.json` 与 `src/styles/globals.css`。

- [ ] **Step 4: 配置 Vitest 并编写基础环境冒烟测试**

创建 `tests/smoke.test.ts`：
```typescript
import { describe, it, expect } from 'vitest';

describe('Environment smoke test', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```
运行：`pnpm vitest run tests/smoke.test.ts`  
预期：PASS。

- [ ] **Step 5: 提交基础环境代码**

```bash
git add package.json pnpm-lock.yaml vite.config.ts tsconfig.json tailwind.config.ts postcss.config.js vitest.config.ts src/styles/ tests/smoke.test.ts
git commit -m "chore: scaffold project with vite, tanstack router, tailwind and vitest"
```

---

### Task 2: 核心算法与数据模型实现 (TDD)

**文件：**
- 创建：`src/data/types.ts`
- 创建：`src/lib/shuffle.ts`
- 创建：`src/lib/team-divider.ts`
- 测试：`tests/shuffle.test.ts`
- 测试：`tests/team-divider.test.ts`

**接口：**
- 产出：
  - `shuffleArray<T>(array: T[], seed?: number): T[]`
  - `divideTeams(rawNames: string[], mode: 'by-teams' | 'by-size', value: number): TeamResult[]`
  - `SportsTeam`, `TeamResult` 接口类型

- [ ] **Step 1: 编写洗牌算法失败测试**

在 `tests/shuffle.test.ts` 中编写测试：验证乱序且元素不丢失，验证相同种子产出相同序列。
运行：`pnpm vitest run tests/shuffle.test.ts`  
预期：FAIL（模块不存在）。

- [ ] **Step 2: 实现 Fisher-Yates 洗牌算法**

在 `src/lib/shuffle.ts` 中实现：
```typescript
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```
运行：`pnpm vitest run tests/shuffle.test.ts`  
预期：PASS。

- [ ] **Step 3: 编写分队器失败测试 (针对 10 人 2 队及余数平衡)**

在 `tests/team-divider.test.ts` 编写测试：
- 10 人分 2 队，每队恰好 5 人；
- 10 人分 3 队，队伍大小必为 4, 3, 3（不能出现 4, 4, 2）；
- 按每队 3 人划分时正确分出 4 支队伍；
- 空名单输入返回空数组；
- 各种换行、逗号和空格被正确清洗。

运行：`pnpm vitest run tests/team-divider.test.ts`  
预期：FAIL。

- [ ] **Step 4: 实现分队核心算法与类型定义**

在 `src/data/types.ts` 定义 `TeamResult`，在 `src/lib/team-divider.ts` 中实现名单过滤、`by-teams`/`by-size` 模式转换与轮转余数均衡分配。  
运行：`pnpm vitest run tests/team-divider.test.ts`  
预期：PASS。

- [ ] **Step 5: 提交核心算法代码**

```bash
git add src/data/types.ts src/lib/ tests/
git commit -m "feat: implement shuffle and team divider algorithms with unit tests"
```

---

### Task 3: 体育数据（NFL/NBA/MLB）与 Logo 素材资产库

**文件：**
- 创建：`src/data/nfl-teams.ts` (32 支球队)
- 创建：`src/data/nba-teams.ts` (30 支球队)
- 创建：`src/data/mlb-teams.ts` (30 支球队)
- 创建：`public/logos/nfl/` (32 个 SVG/WebP)
- 创建：`public/logos/nba/` (30 个 SVG/WebP)
- 创建：`public/logos/mlb/` (30 个 SVG/WebP)
- 测试：`tests/sports-data.test.ts`

**接口：**
- 产出：
  - `NFL_TEAMS: SportsTeam[]`
  - `NBA_TEAMS: SportsTeam[]`
  - `MLB_TEAMS: SportsTeam[]`
  - `getTeamsByLeague(league: 'nfl' | 'nba' | 'mlb'): SportsTeam[]`

- [ ] **Step 1: 编写体育元数据完整性单测**

创建 `tests/sports-data.test.ts`：校验 NFL 32 队无缺失、NBA 30 队无缺失、MLB 30 队无缺失；校验每支队伍的 `id`, `name`, `conference`, `primaryColor` 字段均合法且不为空。  
运行：`pnpm vitest run tests/sports-data.test.ts`  
预期：FAIL。

- [ ] **Step 2: 编写完整 NFL 32 支球队元数据与分区划分**

在 `src/data/nfl-teams.ts` 录入全部 32 支球队（含 AFC 16 队、NFC 16 队），包含名称、城市、官方 Hex 主色。

- [ ] **Step 3: 编写完整 NBA 30 支与 MLB 30 支球队元数据**

在 `src/data/nba-teams.ts` 与 `src/data/mlb-teams.ts` 录入全部球队及分区（Eastern/Western, AL/NL）。

- [ ] **Step 4: 配置球队 Logo 静态资产**

配置各队矢量 SVG/Logo 规范放置于 `public/logos/` 目录，确保路径解析正确。  
运行：`pnpm vitest run tests/sports-data.test.ts`  
预期：PASS。

- [ ] **Step 5: 提交球队数据资产**

```bash
git add src/data/ public/logos/ tests/sports-data.test.ts
git commit -m "feat: add 92 sports teams metadata and logo assets for NFL, NBA, MLB"
```

---

### Task 4: 全局布局、导航与基础 UI 组件

**文件：**
- 创建：`src/components/ui/Button.tsx`
- 创建：`src/components/ui/Card.tsx`
- 创建：`src/components/ui/Badge.tsx`
- 创建：`src/components/layout/SiteHeader.tsx`
- 创建：`src/components/layout/SiteFooter.tsx`
- 创建：`src/components/layout/Container.tsx`
- 创建：`src/routes/__root.tsx`

**接口：**
- 产出：
  - 全局布局组件（统一包含 Logo、Navigation、Footer 权重汇聚链接）
  - 原子 UI 组件库

- [ ] **Step 1: 编写基础原子 UI 组件**

实现无外部重量级依赖的 `Button.tsx`, `Card.tsx`, `Badge.tsx`。

- [ ] **Step 2: 编写全站 Header 顶栏导航**

在 `src/components/layout/SiteHeader.tsx` 实现响应式导航条，包含首页分队器入口、NFL / NBA / MLB 选队器下拉/标签入口。

- [ ] **Step 3: 编写全站 Footer 底栏（实现网状内链回流）**

在 `src/components/layout/SiteFooter.tsx` 编写版权声明、隐私协议、服务条款，以及汇聚全站内链的 “Sports Pickers” 和 “Random Generators” 锚文本链接群。

- [ ] **Step 4: 编写 TanStack Router 根路由 `__root.tsx`**

整合 `SiteHeader`, `SiteFooter` 与 `<Outlet />`，注入全站统一 Meta 标签与 favicon。

- [ ] **Step 5: 提交全局布局组件**

```bash
git add src/components/ui/ src/components/layout/ src/routes/__root.tsx
git commit -m "feat: add global layout, header, footer and UI foundation components"
```

---

### Task 5: Engine A 名单分队器与案例展示 (首页 `/`)

**文件：**
- 创建：`src/components/divider/RosterInput.tsx`
- 创建：`src/components/divider/DividerControls.tsx`
- 创建：`src/components/divider/DividedTeamsGrid.tsx`
- 创建：`src/components/divider/DividerActions.tsx`
- 创建：`src/components/divider/CaseShowcase.tsx`
- 创建：`src/routes/index.tsx`
- 测试：`tests/divider-ui.test.tsx`

**接口：**
- 产出：
  - 首页分队器完整交互界面
  - 默认 10 人分 2 队的预填与静态输出
  - 4 大场景案例（5v5、课堂4组、12人团建、8人桌游）的一键 `[Load & Shuffle]`

- [ ] **Step 1: 编写名单输入组件 `RosterInput.tsx`**

实现多行输入、实时统计人数（默认 10 人）、一键清空与一键恢复示例名单功能。

- [ ] **Step 2: 编写分队规则控制器 `DividerControls.tsx`**

实现 `Number of Teams` 与 `Members per Team` 模式切换标签，以及加减步进器控件。

- [ ] **Step 3: 编写分组卡片展示 `DividedTeamsGrid.tsx` 与操作条 `DividerActions.tsx`**

卡片呈现彩色标头、队员列表、人数 Badge；操作条实现 `Rerun`、`Copy Text`（Markdown 格式导出）与 `Share Link`（URL 参数绑定）。

- [ ] **Step 4: 编写真实案例展示与一键套用 `CaseShowcase.tsx`**

实现 4 大场景案例展示，卡片点击 `[Load & Shuffle]` 触发主分队器名单与参数更新并平滑回滚至顶部。

- [ ] **Step 5: 组装首页路由 `src/routes/index.tsx`**

配置初始状态（10 人 2 队），集成 `RosterInput`, `DividerControls`, `DividedTeamsGrid`, `DividerActions`, `CaseShowcase`。

- [ ] **Step 6: 提交分队器模块代码**

```bash
git add src/components/divider/ src/routes/index.tsx
git commit -m "feat: implement roster team divider and interactive case showcase for homepage"
```

---

### Task 6: Engine B 体育选队器与体育案例 (NFL/NBA/MLB 页面)

**文件：**
- 创建：`src/components/picker/LeaguePickerHeader.tsx`
- 创建：`src/components/picker/PickerModeSwitch.tsx`
- 创建：`src/components/picker/TeamCardDraw.tsx`
- 创建：`src/components/picker/DraftOrderTable.tsx`
- 创建：`src/components/picker/SportsPickerActions.tsx`
- 创建：`src/components/picker/SportsCaseShowcase.tsx`
- 创建：`src/routes/random-nfl-team-generator.tsx`
- 创建：`src/routes/random-nba-team-generator.tsx`
- 创建：`src/routes/random-mlb-team-generator.tsx`

**接口：**
- 产出：
  - 三大联盟专属选队页面
  - 单队翻牌抽取（含排除机制）与 1~32 选秀顺位打乱表格
  - 体育玩法案例展示（Fantasy 顺位与对决案例）

- [ ] **Step 1: 编写联盟头与分区过滤 `LeaguePickerHeader.tsx`**

支持 All、AFC/NFC（或 Eastern/Western, AL/NL）快速切换过滤。

- [ ] **Step 2: 编写单队抽取交互卡片 `TeamCardDraw.tsx`**

支持 3D 翻牌动画、队徽高亮展示、主色渐变底纹、防重复抽取开关（Elimination Mode）与已抽中历史列表。

- [ ] **Step 3: 编写顺位洗牌表格 `DraftOrderTable.tsx`**

展示 1 到 30/32 顺位序号、队徽、队名、所属分区标签，支持一键复制完整文本列表。

- [ ] **Step 4: 编写体育案例展示 `SportsCaseShowcase.tsx`**

展示 10 人 Fantasy 选秀顺位模拟板与 Console 对决挑战展示案例。

- [ ] **Step 5: 组装三大联盟路由页面**

创建 `random-nfl-team-generator.tsx`, `random-nba-team-generator.tsx`, `random-mlb-team-generator.tsx`，传入对应的数据集与 TDK 配置。

- [ ] **Step 6: 提交体育选队器模块代码**

```bash
git add src/components/picker/ src/routes/random-*.tsx
git commit -m "feat: implement sports team pickers and draft order shuffle for NFL, NBA, MLB"
```

---

### Task 7: SEO 精品页 2.0 深度图文、FAQ 与结构化数据

**文件：**
- 创建：`src/components/seo/HowToSection.tsx`
- 创建：`src/components/seo/FaqSection.tsx`
- 创建：`src/components/seo/SchemaScript.tsx`
- 创建：`src/components/seo/InternalLinkHub.tsx`
- 创建：`src/routes/privacy-policy.tsx`
- 创建：`src/routes/terms.tsx`

**接口：**
- 产出：
  - 标准 V2.0 图文区组件
  - `FAQPage` 与 `SoftwareApplication` JSON-LD 注入
  - 基础法务合规页

- [ ] **Step 1: 编写图文指南 `HowToSection.tsx` 与网状互链卡片 `InternalLinkHub.tsx`**

为首页及三大联盟页定制步骤说明与场景解析；在页面底部实现同级互链与向上汇聚链接。

- [ ] **Step 2: 编写 FAQ 折叠模块 `FaqSection.tsx` 与 Schema 注入 `SchemaScript.tsx`**

支持流畅的手风琴问答展开效果，同时在 `<head>` 中注入对应的 `FAQPage` JSON-LD 结构化数据。

- [ ] **Step 3: 将 SEO 图文与 FAQ 嵌入首页及三大联盟页面**

根据 [docs/research.md](file:///d:/MyAwesomeProjects/random-team-generator/docs/research.md) 梳理的 PAA 真实问答，为各页面配置定制化的 FAQ 问答内容。

- [ ] **Step 4: 编写隐私协议 `privacy-policy.tsx` 与条款 `terms.tsx`**

编写标准的法务合规静态内容页面。

- [ ] **Step 5: 提交 SEO 与合规模块代码**

```bash
git add src/components/seo/ src/routes/privacy-policy.tsx src/routes/terms.tsx
git commit -m "feat: add V2.0 SEO editorial content, FAQ schema markup and legal pages"
```

---

### Task 8: 静态预渲染 (SSG)、Sitemap/Robots 生成与构建验证

**文件：**
- 创建：`scripts/generate-seo-files.ts`
- 修改：`vite.config.ts`
- 修改：`package.json`

**接口：**
- 产出：
  - `pnpm build` 命令产出包含完整静态 HTML 的 `dist/` 目录
  - `dist/sitemap.xml` 与 `dist/robots.txt`

- [ ] **Step 1: 编写 Sitemap 与 Robots 自动化构建脚本**

在 `scripts/generate-seo-files.ts` 中根据路由列表生成符合 Google 标准的 `sitemap.xml`（带 priority 和 lastmod）与 `robots.txt`。

- [ ] **Step 2: 配置 Vite SSG Prerender 静态导出**

确保构建执行时，不仅输出客户端 JS 包，还为 `/`、`/random-nfl-team-generator`、`/random-nba-team-generator`、`/random-mlb-team-generator`、`/privacy-policy`、`/terms` 输出预渲染好的 `.html` 文件。

- [ ] **Step 3: 执行全套测试与静态构建**

运行命令：
```bash
pnpm test
pnpm build
```
验证：
- 全部单元测试 PASS；
- `dist/` 目录下成功包含各路由的 `.html`，检查 HTML 源码确认包含首屏预渲染结果；
- `dist/sitemap.xml` 包含所有 6 个目标 URL。

- [ ] **Step 4: 提交构建与部署配置**

```bash
git add scripts/ vite.config.ts package.json
git commit -m "feat: configure static site prerendering and automated sitemap generation"
```
