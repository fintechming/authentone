/**
 * Prompt builders for the AuthenTone rewrite engine.
 * Pure functions — easy to unit test and to verify against the live API.
 */

export const INTENSITIES = ["light", "middle", "strong"];
export const PLATFORMS = ["linkedin", "x", "blog", "newsletter"];

/**
 * Step 1: analyze AI-tells in the input text.
 * Returns a prompt that asks the model for strict JSON output.
 */
export function buildAnalyzePrompt(text, lang) {
  const zh = lang === "zh";
  return [
    zh
      ? "你是一个 AI 文本痕迹分析师。分析下面文本中的 AI 写作痕迹。"
      : "You are an AI-writing analyst. Analyze the AI tells in the text below.",
    "",
    zh ? "只输出 JSON，不要输出其他内容，格式如下：" : "Output ONLY JSON, nothing else, in this shape:",
    '{"aiScore": 0-100 之间的整数（越高越像 AI 写的）, "findings": ["用输入文本的语言写 2-4 条具体发现，每条指出一种 AI 痕迹并举例"]}',
    "",
    zh ? "待分析文本：" : "Text to analyze:",
    "<<<TEXT>>>",
    text,
    "<<<END>>>",
  ].join("\n");
}

const INTENSITY_GUIDE = {
  light: {
    zh: "轻度：只修改最明显的 AI 痕迹（机械排比、套话过渡、均匀句式），尽量保留原文结构和用词。",
    en: "LIGHT: only fix the most obvious AI tells (mechanical parallelism, clichéd transitions, uniform sentence rhythm). Keep the original structure and wording as much as possible.",
  },
  middle: {
    zh: "中度：在轻度基础上，重组句式节奏，长短句交错，替换书面化表达，允许调整段落顺序。",
    en: "MEDIUM: on top of light changes, restructure sentence rhythm with varied lengths, replace stiff written-style phrasing, and allow reordering paragraphs.",
  },
  strong: {
    zh: "重度：彻底重写，只保留原意、关键信息和事实。完全换一种说话方式，像真人随手写的一样。",
    en: "STRONG: rewrite thoroughly, keeping only the meaning, key facts and information. Use a completely different voice, as if a real person just wrote it offhand.",
  },
};

const PLATFORM_GUIDE = {
  linkedin: {
    zh: "领英动态：专业但有个人视角，开头有钩子，分段清晰，结尾可留一个讨论问题。",
    en: "LinkedIn post: professional yet personal, strong hook at the start, clear paragraph breaks, may end with a discussion question.",
  },
  x: {
    zh: "X 推文：每条不超过 280 字，短句为主，保留换行，适合做成推文串。",
    en: "X/Twitter post: max 280 characters per post, short punchy sentences, keep line breaks, thread-friendly.",
  },
  blog: {
    zh: "博客文章：篇幅可稍长，随笔感，第一人称，有细节和具体例子。",
    en: "Blog post: can be longer, essay-like, first person, with concrete details and examples.",
  },
  newsletter: {
    zh: "邮件通讯：亲切直接，像给朋友写信，有称呼感，段落短。",
    en: "Newsletter: warm and direct, like writing to a friend, short paragraphs.",
  },
};

/**
 * Step 2: rewrite the text so it sounds human, preserving the user's voice.
 */
export function buildRewritePrompt({ text, dna, intensity, platform, lang }) {
  const zh = lang === "zh";
  const level = INTENSITIES.includes(intensity) ? intensity : "middle";
  const plat = PLATFORMS.includes(platform) ? platform : "blog";

  const lines = [
    zh
      ? "你是一个去 AI 味的改写助手。把输入的 AI 草稿改写得像真人亲手写的一样：打散均匀的句式，注入自然的节奏、口语化的转折和细微的不完美感。"
      : "You are a text humanizer. Rewrite the AI draft below so it reads as if a real person wrote it by hand: break uniform sentence patterns, add natural rhythm, conversational turns, and subtle human imperfection.",
    "",
    zh ? `改写强度：${INTENSITY_GUIDE[level].zh}` : `Rewrite intensity: ${INTENSITY_GUIDE[level].en}`,
    "",
    zh ? `发布平台适配：${PLATFORM_GUIDE[plat].zh}` : `Platform adaptation: ${PLATFORM_GUIDE[plat].en}`,
    "",
  ];

  if (dna && dna.trim()) {
    lines.push(
      zh
        ? "下面是用户的真实写作样本（写作 DNA）。改写时学习它的节奏、用词习惯、口头禅和标点风格，让改写结果听起来像这个人写的，而不是像通用 AI 写的。但不要照搬样本里的具体内容和观点。"
        : "Below is a genuine writing sample from the user (their writing DNA). Learn its rhythm, word choices, pet phrases and punctuation style so the rewrite sounds like THIS person, not generic AI. Do not copy the sample's actual content or opinions.",
      "",
      "<<<DNA>>>",
      dna.trim(),
      "<<<END>>>",
      ""
    );
  }

  lines.push(
    zh ? "硬性要求：" : "Hard requirements:",
    zh
      ? "- 不编造、不删改事实和关键信息；- 只输出改写后的正文，不要解释、不要加标题、不要用引号包裹。"
      : "- Do not invent, remove or alter facts and key information; - Output ONLY the rewritten text: no explanations, no added headline, no surrounding quotes.",
    "",
    zh ? "待改写的 AI 草稿：" : "AI draft to rewrite:",
    "<<<TEXT>>>",
    text,
    "<<<END>>>"
  );

  return lines.join("\n");
}
