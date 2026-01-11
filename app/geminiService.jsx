'use client';

/**
 * Client helper — calls server API route. Do NOT import @google/genai here.
 */
export async function fetchExplanation(name, step = '') {
  const res = await fetch(`/api/gemini/explain?name=${encodeURIComponent(name)}&step=${encodeURIComponent(step)}`);
  // always attempt to parse safely
  const text = await (async () => {
    try {
      const json = await res.json();
      return json?.text || '';
    } catch (e) {
      console.error('Failed to parse explanation JSON from /api/gemini/explain', e, await res.text().catch(()=>'')); 
      return '';
    }
  })();

  if (!res.ok) {
    console.error('Server returned error for explanation:', res.status, text);
    return text || 'Explanation unavailable.';
  }
  return text || 'Explanation unavailable.';
}