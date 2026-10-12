export const metadata = { title: "服务条款 · AuthenTone" };

const CSS = `body{background:#faf6ee;color:#2b2620;font-family:Georgia,'Songti SC','Noto Serif SC',serif;line-height:2}
.wrap{max-width:760px;margin:0 auto;padding:40px 20px 80px}
h1{font-size:28px;margin-bottom:8px}h2{font-size:18px;margin:28px 0 8px;color:#b3402a}
p,li{font-size:15px;color:#4a443b}ul{padding-left:22px}
.meta{color:#a89e8c;font-size:13px;margin-bottom:24px}
a{color:#b3402a}`;

export default function Terms() {
  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        <h1>服务条款</h1>
        <div className="meta">最后更新：2026 年 10 月 · AuthenTone 由独立开发者运营（个人，未注册公司主体）</div>

        <h2>1. 服务内容</h2>
        <p>AuthenTone（authentone.com）是一款 AI 文本改写工具：分析文本中的 AI 写作痕迹，并按你的写作风格（写作 DNA）改写文本。改写由第三方大模型 API 驱动，输出质量受模型能力影响，我们不保证每次改写都符合你的预期。</p>

        <h2>2. 账户与免费额度</h2>
        <ul>
          <li>使用改写功能需要注册账户（邮箱魔法链接登录）。</li>
          <li>免费版：每天最多改写 5 次。额度每日重置，不可累积、不可转让。</li>
          <li>你应对账户下的全部行为负责，禁止与他人共享账户。</li>
        </ul>

        <h2>3. 订阅与付费</h2>
        <ul>
          <li>Pro 会员：$9.99/月，按月自动续费，每天最多改写 100 次。</li>
          <li>支付由 Stripe 处理，我们不存储你的银行卡信息。</li>
          <li>可在到期前随时取消，取消后当前周期结束前仍可继续使用 Pro。</li>
          <li>订阅开始 7 天内可申请无理由退款，之后按剩余天数比例处理由我们酌情决定。</li>
        </ul>

        <h2>4. 合理使用</h2>
        <p>禁止将本服务用于：生成虚假信息、学术作弊代写、绕过法律法规的文本伪装、侵犯他人知识产权，以及任何违法用途。我们有权对滥用行为限制或封禁账户，不退还已支付费用。</p>

        <h2>5. 免责</h2>
        <p>本服务按"现状"提供。我们不对改写结果的准确性、适用性作任何明示或默示保证。在法律允许的最大范围内，我们对因使用本服务产生的间接损失不承担责任，累计赔偿上限为你过去 12 个月实际支付的费用。</p>

        <h2>6. 条款变更</h2>
        <p>我们可能更新本条款，重大变更会提前在网站公示。继续使用即视为接受新条款。</p>

        <h2>7. 联系我们</h2>
        <p>support@authentone.com</p>
      </div>
    </>
  );
}
