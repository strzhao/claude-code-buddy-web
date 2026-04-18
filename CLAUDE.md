@AGENTS.md

# Claude Code Buddy — Skin Store

皮肤包商店 Web 应用，用于上传、审核、分发 Claude Code Buddy macOS 应用的精灵皮肤包。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS v4
- **存储**: Upstash Redis (KV) + Vercel Blob (文件)
- **部署**: Vercel
- **测试**: Vitest (单元/集成) + Playwright (E2E)
- **代码质量**: ESLint + Prettier + husky + lint-staged + commitlint

## 项目架构

```
src/
├── app/
│   ├── api/
│   │   ├── skins/route.ts          # GET /api/skins — 公共接口，返回已批准皮肤
│   │   ├── upload/route.ts         # POST /api/upload — 上传皮肤 zip
│   │   └── admin/skins/            # 管理后台 API
│   │       ├── route.ts            # GET — 按状态列出皮肤
│   │       └── [id]/
│   │           ├── route.ts        # DELETE — 删除皮肤
│   │           ├── approve/route.ts # POST — 批准皮肤
│   │           └── reject/route.ts  # POST — 拒绝皮肤
│   ├── upload/page.tsx             # 上传页面
│   ├── admin/page.tsx              # 管理后台页面
│   ├── error.tsx                   # 错误边界
│   ├── global-error.tsx            # 全局错误边界
│   ├── layout.tsx                  # 根布局
│   └── page.tsx                    # 首页
├── components/
│   ├── UploadForm.tsx              # 上传表单
│   ├── AdminDashboard.tsx          # 管理仪表板
│   └── StatusBadge.tsx             # 状态标签
└── lib/
    ├── types.ts                    # 共享 TypeScript 类型
    ├── constants.ts                # 全局常量
    ├── errors.ts                   # 错误响应工具
    ├── kv.ts                       # Upstash Redis 客户端封装
    ├── storage.ts                  # Vercel Blob 存储封装
    └── validation.ts               # ZIP 验证 + 预览图提取
```

## 开发命令

```bash
npm run dev          # 启动开发服务器 (localhost:3000)
npm run build        # 生产构建
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
npm test             # 运行单元/集成测试 (Vitest)
npm run test:watch   # 测试监听模式
npm run test:e2e     # 运行 E2E 测试 (Playwright)
npm run size         # 检查 bundle 大小
```

## 环境变量

参见 `.env.example`：

- `BLOB_READ_WRITE_TOKEN` — Vercel Blob 读写令牌
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST Token

## 开发约定

- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)
- pre-commit hook 自动运行 lint-staged (ESLint + Prettier)
- API 路由统一使用 `errorResponse()` 返回错误
- 所有路由 handler 包裹 try/catch，catch 内返回 500
- Redis 键命名: `skin:{id}:{version}`，索引集: `skin-ids:*`
- Blob 路径: `skins/{id}/{version}/skin.zip`
