export const metadata = { title: "隐私政策 · AuthenTone" };

const CSS = `body{background:#faf6ee;color:#2b2620;font-family:Georgia,'Songti SC','Noto Serif SC',serif;line-height:2}
.wrap{max-width:760px;margin:0 auto;padding:40px 20px 80px}
h1{font-size:28px;margin-bottom:8px}h2{font-size:18px;margin:28px 0 8px;color:#b3402a}
p,li{font-size:15px;color:#4a443b}ul{padding-left:22px}
.meta{color:#a89e8c;font-size:13px;margin-bottom:24px}
a{color:#b3402a}`;

export default function Privacy() {
  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        <h1>隐私政策</h1>
        <div className="meta">最后更新：2026 年 10 月 · AuthenTone 由独立开发者运营（个人，未注册公司主体）</div>

        <h2>1. 我们收集什么</h2>
        <ul>
          <li><b>账户信息：</b>你的邮箱地址（用于登录）。</li>
          <li><b>你主动提供的内容：</b>待改写的文本、写作 DNA 样本。</li>
          <li><b>用量记录：</b>每日改写次数（用于额度统计）。</li>
          <li><b>支付信息：</b>由 Stripe 处理，我们不接触、不存储你的银行卡号。</li>
        </ul>

        <h2>2. 内容如何使用</h2>
        <ul>
          <li>你提交的文本仅用于本次分析与改写，会传输给大模型 API 提供方（Google Gemini）处理。</li>
          <li>我们不会把你的文本用于广告，也不会出售给任何第三方。</li>
          <li>写作 DNA 仅保存在你的个人档案中，用于你自己的改写。</li>
        </ul>

        <h2>3. 数据存储与安全</h2>
        <p>数据存储在 Supabase（云数据库），传输全程加密。我们采取合理的技术措施保护数据，但无法承诺绝对安全。</p>

        <h2>4. 你的权利</h2>
        <p>你可以随时在页面上修改或删除写作 DNA；如需删除账户及全部数据，发邮件到 support@authentone.com，我们会在 15 天内处理完毕。</p>

        <h2>5. Cookie</h2>
        <p>我们仅使用维持登录状态所必需的 Cookie，不做广告追踪。</p>

        <h2>6. 政策变更</h2>
        <p>重大变更会提前在网站公示，继续使用即视为接受。</p>

        <h2>7. 联系我们</h2>
        <p>support@authentone.com</p>
      </div>
    </>
  );
}
