// /netlify/functions/ask-ai.js
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { question, context } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('APIキーが設定されていません。');
    const prompt = `以下の「ドキュメント」の内容のみに基づいて、ユーザーからの「質問」に日本語で、マークダウン形式で分かりやすく回答してください。回答はドキュメントの内容に忠実でなければなりません。回答が表形式で表現する方が分かりやすい場合（例えば、仕様の比較やプラン内容など）、積極的にマークダウンの表形式を使用してください。ドキュメントに記載されていない情報については、回答に含めず、「ドキュメント内に該当する情報が見つかりませんでした。」と明確に述べてください。\n\n# ドキュメント\n${context}\n\n# 質問\n${question}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`APIリクエストに失敗しました: ${response.statusText}`);
    const result = await response.json();
    const answer = result.candidates?.[0]?.content?.parts?.[0]?.text || "有効な回答を生成できませんでした。";
    return { statusCode: 200, body: JSON.stringify({ answer }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};