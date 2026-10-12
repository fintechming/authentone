"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

const T = {
  zh: {
    tagline: "写得像你。而不是像所有人的 AI。",
    sub: "先学习你的写作 DNA，再改写 AI 草稿——通过人味测试，不交声音税。",
    loginTitle: "免费次数用完了？登录继续",
    loginSub: "匿名体验每天可改写 3 次。登录后每天 5 次免费，还能保存你的写作 DNA。",
    anonBar: "匿名体验中 · 每天 3 次免费改写",
    anonLeft: (n) => `匿名体验中 · 今日免费改写还剩 ${n} 次`,
    loginCta: "登录解锁更多",
    emailPh: "你的邮箱地址",
    sendLink: "发送登录链接",
    sending: "发送中…",
    linkSent: "登录链接已发送，请查收邮箱（注意垃圾箱）。",
    logout: "退出",
    freeNote: "免费版每天可改写 5 次",
    proNote: "Pro 会员每天可改写 100 次",
    upgrade: "升级 Pro · $9.99/月",
    upgrading: "跳转中…",
    proBadge: "PRO",
    upgradedOk: "升级成功，欢迎来到 Pro！",
    err_checkout: "发起支付失败，请稍后重试。",
    step1: "粘贴 AI 草稿",
    placeholder: "把 AI 生成的文本粘贴到这里…",
    loadSample: "载入示例",
    analyze: "扫描 AI 痕迹",
    analyzing: "扫描中…",
    step2: "AI 痕迹分析",
    aiScore: "AI 味浓度",
    step3: "改写 · 保住你的声音",
    dnaLabel: "你的写作样本（写作 DNA）",
    dnaPh: "粘贴一段你自己写的文字，改写时会学它的语气…",
    saveDna: "保存写作 DNA",
    dnaSaved: "已保存",
    intensity: "改写强度",
    levels: { light: "轻", middle: "中", strong: "强" },
    platform: "发布平台",
    platforms: { linkedin: "领英", x: "X", blog: "博客", newsletter: "邮件通讯" },
    rewrite: "开始改写",
    rewriting: "改写中…",
    copy: "复制",
    copied: "已复制",
    restart: "重新开始",
    footer: "AuthenTone · 真实 AI 引擎内测版",
    navHow: "工作原理",
    navDemo: "在线演示",
    navPricing: "定价",
    navTry: "试一试",
    heroSmall: "无需注册 · 支持中文与英文",
    heroDemo: "体验交互演示",
    heroHow: "查看工作原理",
    howTitle: "三步搞定，零声音税。",
    how1t: "粘贴 AI 草稿",
    how1d: "把 AI 生成的文本粘贴进来，5000 字以内，即贴即用。",
    how2t: "喂入你的写作 DNA",
    how2d: "贴一段你自己写的文字，改写时会学它的节奏、用词和口头禅。",
    how3t: "保住声音的改写",
    how3d: "三档强度、四种平台适配，改完一键复制，直接发布。",
    methodTitle: "不是「骗过检测器」，是「保住你的声音」。",
    m1t: "先读你的声音",
    m1d: "改写前先学习你的节奏、用词和口头禅，而不是套模板。",
    m2t: "只改 AI 痕迹",
    m2d: "不动你的观点和结构，只去掉那些一眼 AI 的味道。",
    m3t: "强度随你定",
    m3d: "轻、中、强三档，从微调语气到彻底重写，你说了算。",
    m4t: "适配你的场",
    m4d: "领英、X、博客、邮件通讯，一键切换平台语气。",
    pricingTitle: "免费开始，需要时再升级。",
    freeName: "免费版",
    freePrice: "$0",
    freePer: "/月",
    freeF: ["每天 3 次匿名改写（登录后 5 次）", "AI 痕迹扫描", "写作 DNA（本次有效）", "中英双语"],
    freeCta: "开始使用",
    proName: "专业版",
    proPrice: "$9.99",
    proPer: "/月",
    proTag: "最受欢迎",
    proF: ["每天 100 次改写", "写作 DNA 云端保存", "AI 痕迹扫描", "中英双语", "优先支持"],
    proCta: "升级 Pro",
    faqTitle: "常见问题",
    faqs: [
      ["这又是一个绕过 AI 检测器的工具吗？", "不是。AuthenTone 不帮你“骗过”谁，它帮你保住自己的声音——去掉 AI 味，留下你的语气。"],
      ["我的文字会被拿去训练吗？", "不会。你的写作 DNA 只存在你的账号里，可随时删除，不会用于训练共享模型。"],
      ["支持中文吗？", "支持。英文调校最细，但写作 DNA 与语言无关，中文稿同样保真。"],
      ["免费版和专业版有什么区别？", "免费版每天可改写 5 次（匿名 3 次），专业版每天 100 次，并可云端保存写作 DNA。"],
    ],
    ctaTitle: "你的想法，你的声音，只是更快。",
    ctaBtn: "打开交互演示",
    err_login_required: "请先登录再使用。",
    err_quota_exceeded: "今日免费次数已用完（5/5），明天再来。",
    err_auth: "登录链接无效或已过期，请重新发送。",
    err_failed: "请求失败，请稍后重试。",
  },
  en: {
    tagline: "Write like you. Not like everyone's AI.",
    sub: "It learns your writing DNA first, then rewrites the AI draft — passes the human test without the voice tax.",
    loginTitle: "Out of free tries? Log in",
    loginSub: "Anonymous trial: 3 rewrites/day. Log in for 5 free/day and save your writing DNA.",
    anonBar: "Trying anonymously · 3 free rewrites/day",
    anonLeft: (n) => `Trying anonymously · ${n} free rewrites left today`,
    loginCta: "Log in for more",
    emailPh: "Your email address",
    sendLink: "Send login link",
    sending: "Sending…",
    linkSent: "Login link sent — check your inbox (and spam).",
    logout: "Log out",
    freeNote: "Free plan: 5 rewrites per day",
    proNote: "Pro: 100 rewrites per day",
    upgrade: "Upgrade to Pro · $9.99/mo",
    upgrading: "Redirecting…",
    proBadge: "PRO",
    upgradedOk: "Upgrade successful — welcome to Pro!",
    err_checkout: "Could not start checkout, please try again later.",
    step1: "Paste your AI draft",
    placeholder: "Paste AI-generated text here…",
    loadSample: "Load sample",
    analyze: "Scan for AI tells",
    analyzing: "Scanning…",
    step2: "AI-tell analysis",
    aiScore: "AI-ness",
    step3: "Rewrite · keep your voice",
    dnaLabel: "Your writing sample (writing DNA)",
    dnaPh: "Paste something you wrote — the rewrite will learn its tone…",
    saveDna: "Save writing DNA",
    dnaSaved: "Saved",
    intensity: "Intensity",
    levels: { light: "Light", middle: "Medium", strong: "Strong" },
    platform: "Platform",
    platforms: { linkedin: "LinkedIn", x: "X", blog: "Blog", newsletter: "Newsletter" },
    rewrite: "Humanize it",
    rewriting: "Rewriting…",
    copy: "Copy",
    copied: "Copied",
    restart: "Start over",
    footer: "AuthenTone · live AI engine beta",
    navHow: "How it works",
    navDemo: "Live demo",
    navPricing: "Pricing",
    navTry: "Try it",
    heroSmall: "No sign-up needed · Chinese & English",
    heroDemo: "Try the live demo",
    heroHow: "How it works",
    howTitle: "Three steps. Zero voice tax.",
    how1t: "Paste your AI draft",
    how1d: "Paste AI-generated text, up to 5,000 characters. Ready instantly.",
    how2t: "Feed it your writing DNA",
    how2d: "Paste something you wrote — the rewrite learns its rhythm, words, and pet phrases.",
    how3t: "Rewrite that keeps your voice",
    how3d: "Three intensities, four platform presets. Copy and publish in one click.",
    methodTitle: "Not about “beating detectors.” About keeping your voice.",
    m1t: "Read your voice first",
    m1d: "It studies your rhythm, word choices, and pet phrases before rewriting — no templates.",
    m2t: "Only fix AI tells",
    m2d: "Your ideas and structure stay untouched; only the obvious AI-ness goes.",
    m3t: "You set the intensity",
    m3d: "Light, medium, strong — from a tonal touch-up to a full rewrite. Your call.",
    m4t: "Fit your platform",
    m4d: "LinkedIn, X, blog, newsletter — one tap to switch platform tone.",
    pricingTitle: "Start free. Upgrade when you need it.",
    freeName: "Free",
    freePrice: "$0",
    freePer: "/mo",
    freeF: ["3 anonymous rewrites/day (5/day after login)", "AI-tell scanning", "Writing DNA (session only)", "Chinese & English"],
    freeCta: "Start free",
    proName: "Pro",
    proPrice: "$9.99",
    proPer: "/mo",
    proTag: "Most popular",
    proF: ["100 rewrites/day", "Writing DNA saved to your profile", "AI-tell scanning", "Chinese & English", "Priority support"],
    proCta: "Upgrade to Pro",
    faqTitle: "FAQ",
    faqs: [
      ["Is this another AI-detector bypass tool?", "No. AuthenTone doesn't help you “fool” anyone — it keeps your voice: removes the AI-ness, keeps your tone."],
      ["Will my text be used for training?", "No. Your writing DNA lives only in your account, deletable anytime, never used to train shared models."],
      ["Does it support Chinese?", "Yes. English is the most tuned, but writing DNA is language-independent — Chinese drafts keep their voice too."],
      ["What's the difference between Free and Pro?", "Free: 5 rewrites/day (3 anonymously). Pro: 100/day with writing DNA saved to your profile."],
    ],
    ctaTitle: "Your ideas. Your voice. Just faster.",
    ctaBtn: "Open the live demo",
    err_login_required: "Please log in first.",
    err_quota_exceeded: "Daily free rewrites used up (5/5). Come back tomorrow.",
    err_auth: "Login link invalid or expired — please resend it.",
    err_failed: "Request failed, please try again later.",
  },
};

const SAMPLE_ZH =
  "人工智能正在深刻地改变我们的工作方式。首先，它显著提高了工作效率。其次，它使个性化服务成为可能。最后，它为创新提供了新的可能性。总而言之，拥抱人工智能是时代发展的必然选择。";
const SAMPLE_EN =
  "Artificial intelligence is profoundly transforming the way we work. First, it significantly improves efficiency. Second, it makes personalized services possible. Finally, it opens up new possibilities for innovation. In conclusion, embracing AI is an inevitable choice of our time.";

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#faf6ee;color:#2b2620;font-family:Georgia,'Songti SC','Noto Serif SC',serif;min-height:100vh}
.wrap{max-width:860px;margin:0 auto;padding:32px 20px 60px}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px}
.logo{font-size:26px;font-weight:700;letter-spacing:.5px}
.logo span{color:#b3402a}
.lang button{border:1px solid #d8cfbc;background:transparent;padding:6px 14px;margin-left:8px;border-radius:20px;cursor:pointer;font-size:13px;color:#6b6257}
.lang button.on{background:#b3402a;border-color:#b3402a;color:#fff}
.hero{text-align:center;margin-bottom:44px}
.hero h1{font-size:40px;line-height:1.35;margin-bottom:12px}
.hero p{color:#6b6257;font-size:16px}
.card{background:#fff;border:1px solid #e8dfcc;border-radius:14px;padding:22px;margin-bottom:20px;box-shadow:0 2px 10px rgba(120,90,40,.06)}
.card h2{font-size:17px;margin-bottom:14px}
.card h2 b{color:#b3402a;margin-right:8px}
.card p.desc{color:#6b6257;font-size:14px;margin-bottom:14px;line-height:1.7}
textarea{width:100%;min-height:150px;border:1px solid #d8cfbc;border-radius:10px;padding:14px;font-size:15px;line-height:1.7;font-family:inherit;resize:vertical;background:#fffdf8;color:#2b2620}
textarea.dna{min-height:90px}
input.email{width:100%;border:1px solid #d8cfbc;border-radius:10px;padding:12px 14px;font-size:15px;font-family:inherit;background:#fffdf8;color:#2b2620}
.row{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;align-items:center}
button.act{background:#b3402a;color:#fff;border:none;border-radius:10px;padding:11px 26px;font-size:15px;cursor:pointer;font-family:inherit}
button.act:disabled{opacity:.5;cursor:default}
button.ghost{background:transparent;border:1px solid #d8cfbc;border-radius:10px;padding:10px 20px;font-size:14px;cursor:pointer;color:#6b6257;font-family:inherit}
.seg{display:flex;gap:8px;flex-wrap:wrap}
.seg button{border:1px solid #d8cfbc;background:#fffdf8;border-radius:20px;padding:8px 18px;font-size:14px;cursor:pointer;color:#6b6257;font-family:inherit}
.seg button.on{background:#2b2620;color:#fff;border-color:#2b2620}
label.lbl{display:block;font-size:14px;color:#6b6257;margin:16px 0 8px}
.score{display:flex;align-items:center;gap:16px;margin:6px 0 12px}
.bar{flex:1;height:10px;background:#eee5d3;border-radius:6px;overflow:hidden}
.bar i{display:block;height:100%;background:#b3402a;border-radius:6px;transition:width .5s}
.findings{list-style:none}
.findings li{padding:8px 0;border-top:1px dashed #e8dfcc;font-size:14px;color:#5c554a;line-height:1.7}
.output{white-space:pre-wrap;font-size:15px;line-height:1.9;background:#fffdf8;border:1px dashed #d8dfcc;border-radius:10px;padding:18px}
.foot{text-align:center;color:#a89e8c;font-size:13px;margin-top:44px}
.err{color:#b3402a;font-size:14px;margin-top:10px}
.userbar{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e8dfcc;border-radius:12px;padding:12px 18px;margin-bottom:20px;font-size:14px;color:#6b6257}
.userbar b{color:#2b2620}
.ok{color:#3a7d44;font-size:14px;margin-top:10px}
.nav{display:flex;gap:22px;align-items:center}
.nav a{color:#6b6257;font-size:14px;text-decoration:none;cursor:pointer}
.nav a:hover{color:#b3402a}
.topright{display:flex;align-items:center;gap:10px}
button.outline{background:transparent;border:1px solid #b3402a;color:#b3402a;border-radius:10px;padding:9px 20px;font-size:14px;cursor:pointer;font-family:inherit}
.hero .small{margin-top:14px;color:#a89e8c;font-size:13px}
.hero .cta-row{display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap}
.section{margin:60px 0 8px}
.section h2.sec{font-size:26px;text-align:center;margin-bottom:26px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.grid4{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.pcard{background:#fff;border:1px solid #e8dfcc;border-radius:14px;padding:22px}
.pcard h3{font-size:16px;margin-bottom:10px}
.pcard h3 b{color:#b3402a;margin-right:8px}
.pcard p{font-size:14px;color:#5c554a;line-height:1.7}
.price{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.price .pcard.hot{border:2px solid #b3402a;position:relative}
.price .tag{position:absolute;top:-12px;right:18px;background:#b3402a;color:#fff;font-size:12px;padding:3px 12px;border-radius:12px}
.price .amt{font-size:32px;font-weight:700;margin:8px 0 2px}
.price .amt small{font-size:14px;color:#6b6257;font-weight:400}
.price ul{list-style:none;margin:14px 0}
.price li{font-size:14px;color:#5c554a;padding:7px 0;border-top:1px dashed #e8dfcc;line-height:1.6}
.faq details{background:#fff;border:1px solid #e8dfcc;border-radius:12px;padding:16px 18px;margin-bottom:10px}
.faq summary{cursor:pointer;font-size:15px;font-weight:700}
.faq p{margin-top:10px;font-size:14px;color:#5c554a;line-height:1.8}
.cta{background:#2b2620;color:#faf6ee;border-radius:16px;padding:46px 24px;text-align:center;margin:60px 0 8px}
.cta h2{font-size:28px;margin-bottom:22px;line-height:1.4}
@media(max-width:640px){.grid3,.grid4{grid-template-columns:1fr}.price{grid-template-columns:1fr}.nav{display:none}}
`;

export default function Page() {
  const [lang, setLang] = useState("zh");
  const t = T[lang];
  const [user, setUser] = useState(null); // {email, plan} or null
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [text, setText] = useState("");
  const [dna, setDna] = useState("");
  const [dnaSaved, setDnaSaved] = useState(false);
  const [intensity, setIntensity] = useState("middle");
  const [platform, setPlatform] = useState("blog");
  const [analysis, setAnalysis] = useState(null);
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [upgradeBusy, setUpgradeBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [needLogin, setNeedLogin] = useState(false); // anon quota exhausted
  const [anonLeft, setAnonLeft] = useState(null); // remaining anon rewrites today

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("auth=error")) setError("err_auth");
      if (window.location.search.includes("upgraded=1")) setNotice("upgradedOk");
    }
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setUser({ email: d.email, plan: d.plan });
          setDna(d.writing_dna || "");
        }
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  async function sendLink() {
    if (!email.includes("@")) return;
    setAuthBusy(true);
    setError("");
    try {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/auth/callback" },
      });
      if (error) throw error;
      setLinkSent(true);
    } catch {
      setError("err_failed");
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    await supabaseBrowser().auth.signOut();
    setUser(null);
    setDna("");
    setAnalysis(null);
    setResult("");
  }

  async function upgrade() {
    setUpgradeBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "err_checkout");
      window.location.href = data.url;
    } catch (e) {
      setError(e.message === "err_checkout" ? "err_checkout" : "err_failed");
      setUpgradeBusy(false);
    }
  }

  async function saveDna() {
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writing_dna: dna }),
      });
      if (!res.ok) throw new Error();
      setDnaSaved(true);
      setTimeout(() => setDnaSaved(false), 1500);
    } catch {
      setError("err_failed");
    }
  }

  async function call(step) {
    setBusy(step);
    setError("");
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, text, dna, intensity, platform }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.error || "err_failed");
        err.used = data.used;
        err.limit = data.limit;
        throw err;
      }
      if (step === "analyze") setAnalysis(data);
      else setResult(data.text);
      if (data.anon && typeof data.anonRewritesLeft === "number") {
        setAnonLeft(data.anonRewritesLeft);
      }
    } catch (e) {
      const key = "err_" + (e.message || "failed");
      if (e.message === "quota_exceeded" && e.used !== undefined) {
        setError(`quota_dynamic:${e.used}/${e.limit}`);
      } else if (e.message === "anon_quota_exceeded") {
        setNeedLogin(true);
        setError(`anon_quota:${e.used ?? "?"}/${e.limit ?? 3}`);
        setTimeout(() => {
          document.getElementById("logincard")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(t[key] ? key : "err_failed");
      }
    } finally {
      setBusy("");
    }
  }

  function reset() {
    setText("");
    setAnalysis(null);
    setResult("");
    setError("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("err_failed");
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        <div className="top">
          <div className="logo">
            Authen<span>Tone</span>
          </div>
          <div className="nav">
            <a href="#how">{t.navHow}</a>
            <a href="#demo">{t.navDemo}</a>
            <a href="#pricing">{t.navPricing}</a>
          </div>
          <div className="topright">
            <div className="lang">
              <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>
                中文
              </button>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
                EN
              </button>
            </div>
            <button
              className="outline"
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.navTry}
            </button>
          </div>
        </div>

        <div className="hero">
          <h1>{t.tagline}</h1>
          <p>{t.sub}</p>
          <p className="small">{t.heroSmall}</p>
          <div className="cta-row">
            <button
              className="act"
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.heroDemo}
            </button>
            <button
              className="ghost"
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.heroHow}
            </button>
          </div>
        </div>

        {needLogin && !user && (
          <div className="card" id="logincard">
            <h2>{t.loginTitle}</h2>
            <p className="desc">{t.loginSub}</p>
            {linkSent ? (
              <p className="ok">{t.linkSent}</p>
            ) : (
              <div className="row">
                <input
                  className="email"
                  style={{ flex: 1, minWidth: 200 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPh}
                  type="email"
                />
                <button className="act" disabled={authBusy || !email.includes("@")} onClick={sendLink}>
                  {authBusy ? t.sending : t.sendLink}
                </button>
              </div>
            )}
          </div>
        )}

        {!user && !needLogin && (
          <div className="userbar">
            <span>{anonLeft !== null ? t.anonLeft(anonLeft) : t.anonBar}</span>
            <span style={{ display: "flex", gap: 8 }}>
              <button
                className="ghost"
                onClick={() => {
                  setNeedLogin(true);
                  setTimeout(() => {
                    document.getElementById("logincard")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                {t.loginCta}
              </button>
            </span>
          </div>
        )}

        {user && (
          <div className="userbar">
            <span>
              <b>{user.email}</b>
              {user.plan === "pro" ? (
                <>
                  {" · "}
                  <b style={{ color: "#b3402a" }}>{t.proBadge}</b>
                  {" · " + t.proNote}
                </>
              ) : (
                " · " + t.freeNote
              )}
            </span>
            <span style={{ display: "flex", gap: 8 }}>
              {user.plan !== "pro" && (
                <button className="act" style={{ padding: "8px 18px", fontSize: 14 }} disabled={upgradeBusy} onClick={upgrade}>
                  {upgradeBusy ? t.upgrading : t.upgrade}
                </button>
              )}
              <button className="ghost" onClick={logout}>
                {t.logout}
              </button>
            </span>
          </div>
        )}

        {notice && <div className="ok" style={{ marginBottom: 20 }}>{t[notice]}</div>}

        <div id="demo">
          <>
          <div className="card">
              <h2>
                <b>①</b>
                {t.step1}
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t.placeholder}
              />
              <div className="row">
                <button className="act" disabled={!text.trim() || busy} onClick={() => call("analyze")}>
                  {busy === "analyze" ? t.analyzing : t.analyze}
                </button>
                <button className="ghost" onClick={() => setText(lang === "zh" ? SAMPLE_ZH : SAMPLE_EN)}>
                  {t.loadSample}
                </button>
              </div>
            </div>

            {analysis && (
              <div className="card">
                <h2>
                  <b>②</b>
                  {t.step2}
                </h2>
                <div className="score">
                  <span style={{ fontSize: 14, color: "#6b6257" }}>{t.aiScore}</span>
                  <div className="bar">
                    <i style={{ width: analysis.aiScore + "%" }} />
                  </div>
                  <b style={{ color: "#b3402a", fontSize: 20 }}>{analysis.aiScore}%</b>
                </div>
                <ul className="findings">
                  {analysis.findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis && !result && (
              <div className="card">
                <h2>
                  <b>③</b>
                  {t.step3}
                </h2>
                <label className="lbl">{t.dnaLabel}</label>
                <textarea
                  className="dna"
                  value={dna}
                  onChange={(e) => setDna(e.target.value)}
                  placeholder={t.dnaPh}
                />
                {user ? (
                  <div className="row">
                    <button className="ghost" onClick={saveDna}>
                      {dnaSaved ? t.dnaSaved : t.saveDna}
                    </button>
                  </div>
                ) : null}
                <label className="lbl">{t.intensity}</label>
                <div className="seg">
                  {Object.entries(t.levels).map(([k, v]) => (
                    <button key={k} className={intensity === k ? "on" : ""} onClick={() => setIntensity(k)}>
                      {v}
                    </button>
                  ))}
                </div>
                <label className="lbl">{t.platform}</label>
                <div className="seg">
                  {Object.entries(t.platforms).map(([k, v]) => (
                    <button key={k} className={platform === k ? "on" : ""} onClick={() => setPlatform(k)}>
                      {v}
                    </button>
                  ))}
                </div>
                <div className="row">
                  <button className="act" disabled={busy} onClick={() => call("rewrite")}>
                    {busy === "rewrite" ? t.rewriting : t.rewrite}
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="card">
                <h2>
                  <b>③</b>
                  {t.step3}
                </h2>
                <div className="output">{result}</div>
                <div className="row">
                  <button className="act" onClick={copy}>
                    {copied ? t.copied : t.copy}
                  </button>
                  <button className="ghost" onClick={reset}>
                    {t.restart}
                  </button>
                </div>
              </div>
            )}
          </>
        </div>

        <div className="section" id="how">
          <h2 className="sec">{t.howTitle}</h2>
          <div className="grid3">
            <div className="pcard">
              <h3><b>①</b>{t.how1t}</h3>
              <p>{t.how1d}</p>
            </div>
            <div className="pcard">
              <h3><b>②</b>{t.how2t}</h3>
              <p>{t.how2d}</p>
            </div>
            <div className="pcard">
              <h3><b>③</b>{t.how3t}</h3>
              <p>{t.how3d}</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="sec">{t.methodTitle}</h2>
          <div className="grid4">
            <div className="pcard"><h3>{t.m1t}</h3><p>{t.m1d}</p></div>
            <div className="pcard"><h3>{t.m2t}</h3><p>{t.m2d}</p></div>
            <div className="pcard"><h3>{t.m3t}</h3><p>{t.m3d}</p></div>
            <div className="pcard"><h3>{t.m4t}</h3><p>{t.m4d}</p></div>
          </div>
        </div>

        <div className="section" id="pricing">
          <h2 className="sec">{t.pricingTitle}</h2>
          <div className="price">
            <div className="pcard">
              <h3>{t.freeName}</h3>
              <div className="amt">{t.freePrice}<small>{t.freePer}</small></div>
              <ul>{t.freeF.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <button
                className="ghost"
                onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              >
                {t.freeCta}
              </button>
            </div>
            <div className="pcard hot">
              <span className="tag">{t.proTag}</span>
              <h3>{t.proName}</h3>
              <div className="amt">{t.proPrice}<small>{t.proPer}</small></div>
              <ul>{t.proF.map((f, i) => <li key={i}>{f}</li>)}</ul>
              <button
                className="act"
                disabled={upgradeBusy}
                onClick={() => {
                  if (user) upgrade();
                  else {
                    setNeedLogin(true);
                    setTimeout(() => {
                      document.getElementById("logincard")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
              >
                {upgradeBusy ? t.upgrading : t.proCta}
              </button>
            </div>
          </div>
        </div>

        <div className="section faq">
          <h2 className="sec">{t.faqTitle}</h2>
          {t.faqs.map(([q, a], i) => (
            <details key={i}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>

        <div className="cta">
          <h2>{t.ctaTitle}</h2>
          <button
            className="act"
            style={{ background: "#b3402a" }}
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t.ctaBtn}
          </button>
        </div>

        {error && (
          <div className="err">
            {error.startsWith("quota_dynamic:")
              ? (lang === "zh"
                  ? `今日免费次数已用完（${error.slice(14)}），明天再来。`
                  : `Daily free rewrites used up (${error.slice(14)}). Come back tomorrow.`)
              : error.startsWith("anon_quota:")
              ? (lang === "zh"
                  ? `今日免费体验次数已用完（${error.slice(11)}），登录后每天 5 次免费。`
                  : `Free trial used up (${error.slice(11)}). Log in for 5 free/day.`)
              : t[error] || error}
          </div>
        )}

        <div className="foot">{t.footer}</div>
      </div>
    </>
  );
}
