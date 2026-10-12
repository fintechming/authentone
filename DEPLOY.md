# AuthenTone 部署清单（Vercel + authentone.com）

> 代码已就绪。下面每一步标了（需要你的账号/登录）和（代码里已完成）。

## 一、准备工作

1. 注册 GitHub 账号（github.com），把 `app/` 目录推上去：
```bash
cd app && git remote add origin <你的仓库地址> && git push -u origin main
```
2. 注册 Vercel 账号（vercel.com），用 GitHub 登录 → Import 刚才的仓库。Vercel 会自动识别 Next.js，直接 Deploy（先不用管环境变量， deploy 会失败，没关系，下一步补）。

## 二、环境变量

Vercel 项目 → Settings → Environment Variables，逐个添加（Production/Preview/Development 全选）：

| 变量名 | 值从哪来 |
|---|---|
| `GEMINI_API_KEY` | 你的 Gemini API key（AI Studio 申请的那个） |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 后台 Settings → API → Project URL（已给你） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 同上，anon public key（已给你） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 后台 Settings → API → service_role key（**保密，不要贴聊天里**） |
| `CREEM_API_KEY` | Creem 后台 Developers → API keys（`creem_...` 正式 / `creem_test_...` 测试，**保密，不要贴聊天里**） |
| `CREEM_PRO_PRODUCT_ID` | 下一步在 Creem 建 $9.99/月商品后得到（`prod_...`） |
| `CREEM_WEBHOOK_SECRET` | 下下步建 webhook 后得到（保密） |
| `NEXT_PUBLIC_SITE_URL` | `https://authentone.com` |

加完后去 Deployments 点 Redeploy。

## 三、Creem 商品与 Webhook

1. Creem 后台 → Products → Create product：名称 `AuthenTone Pro`，价格 **$9.99/月**，billing type 选 **recurring / every-month** → 复制 Product ID（`prod_...`）填到上面的表。
2. Developers → Webhooks → Add endpoint：URL 填 `https://authentone.com/api/webhook`，勾选事件 `subscription.paid`、`subscription.canceled`、`subscription.expired`、`subscription.paused` → 复制 Webhook secret 填表。
3. 建议先用 **Test mode**（`creem_test_...` key）跑一遍：走完一次测试订阅，确认用户档案变成 pro。

## 四、Supabase 回调地址

Supabase 后台 → Authentication → URL Configuration → Redirect URLs，添加：
`https://authentone.com/auth/callback`（本地测试已用 `http://localhost:3000/auth/callback`，Vercel 预览域名也建议加上）

## 五、域名

1. Vercel 项目 → Settings → Domains → Add `authentone.com`（连带 `www.authentone.com`）。
2. 按 Vercel 给的提示去你的域名注册商加 DNS 记录（一般是 A 记录或 CNAME），等生效（几分钟到几小时）。

## 六、上线前检查

- [] 条款/隐私页里的 `support@authentone.com` 换成你真实能收件的邮箱（或做好转发）
- [] 首页跑一次完整流程：注册 → 粘贴 → 扫描 → 改写 → 复制
- [] 测试一次 Creem 测试模式升级，确认额度从 5 变成 100
- [] 删掉 `.env.local` 里的真实 key 再推送（该文件已在.gitignore，不会进仓库）

## 费用小结（上线后）

- Vercel：免费版起步够用；Supabase：免费版够用；Gemini API：免费额度内 $0，超了按量（Flash 模型很便宜）；Creem：按成交收 3.9% + $0.40，无月费。都不用预付。
