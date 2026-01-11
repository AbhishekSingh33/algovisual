import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req) {
  try {
    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      const msg = 'GENAI_API_KEY not set on the server';
      console.error(msg);
      return new Response(JSON.stringify({ text: '', error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'algorithm';
    const step = searchParams.get('step') || '';

    // Correct SDK initialization
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Explain the ${name} algorithm to a computer science student. ${step ? `Focus: ${step}` : ''} Provide a concise explanation and why it's useful. Use markdown.`;

    // Correct API call
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (err) {
    console.error('Gemini API error:', err?.message || err);
    if (err?.message?.includes('API_KEY')) {
      return new Response(JSON.stringify({ text: 'API key invalid or expired.', error: 'Auth error' }), { status: 401, headers: { 'Content-Type': 'application/json' }});
    }
    if (err?.message?.includes('429')) {
      return new Response(JSON.stringify({ text: 'Rate limited. Try again in a moment.', error: '429' }), { status: 429, headers: { 'Content-Type': 'application/json' }});
    }
    return new Response(JSON.stringify({ text: 'Explanation unavailable.', error: err?.message || 'server error' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
  }
}






// import { GoogleGenerativeAI } from '@google/generative-ai';

// const FALLBACK_EXPLANATIONS = {
//   'bubble-sort': 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if in wrong order. Simple but inefficient for large datasets. Time: O(n²), Space: O(1).',
//   'quick-sort': 'Quick Sort divides array using a pivot, recursively sorts partitions. Average O(n log n). Widely used in practice due to cache efficiency.',
//   'merge-sort': 'Merge Sort divides array in half, recursively sorts, then merges. Guaranteed O(n log n), stable sort. Extra space needed for merging.',
//   'insertion-sort': 'Insertion Sort builds sorted array one item at a time. Efficient for small/nearly-sorted data. O(n²) worst case, O(n) best case.',
//   'binary-search': 'Binary Search halves search space each iteration on sorted data. O(log n) time. Requires data to be pre-sorted.',
//   'bfs': 'Breadth-First Search explores graph level by level using a queue. Finds shortest path in unweighted graphs. O(V+E) time.',
//   'dfs': 'Depth-First Search explores as far as possible along each branch using a stack. Good for detecting cycles. O(V+E) time.',
//   'dijkstra': "Dijkstra's Algorithm finds shortest path from source to all vertices using a priority queue. O(E log V) with binary heap.",
// };

// export async function GET(req) {
//   try {
//     const apiKey = process.env.GENAI_API_KEY;
//     if (!apiKey) {
//       const msg = 'GENAI_API_KEY not set on the server';
//       console.error(msg);
//       return new Response(JSON.stringify({ text: '', error: msg }), { status: 500, headers: { 'Content-Type': 'application/json' }});
//     }

//     const { searchParams } = new URL(req.url);
//     const name = searchParams.get('name') || 'algorithm';
//     const step = searchParams.get('step') || '';

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

//     const prompt = `Explain the ${name} algorithm to a computer science student. ${step ? `Focus: ${step}` : ''} Provide a concise explanation and why it's useful. Use markdown.`;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return new Response(JSON.stringify({ text }), { status: 200, headers: { 'Content-Type': 'application/json' }});
//   } catch (err) {
//     console.error('Gemini API error:', err?.message || err);

//     // Handle quota exceeded (429)
//     if (err?.message?.includes('429') || err?.status === 429) {
//       const { searchParams } = new URL(req.url);
//       const name = searchParams.get('name') || 'algorithm';
//       const fallback = FALLBACK_EXPLANATIONS[name.toLowerCase().replace(' ', '-')] || 
//         `${name} is an important algorithm. The AI tutor quota is temporarily exceeded. Please try again later or check your Google Cloud API quota.`;
//       return new Response(JSON.stringify({ text: fallback, error: 'Quota exceeded (429) - using fallback' }), { status: 200, headers: { 'Content-Type': 'application/json' }});
//     }

//     // Handle auth errors
//     if (err?.message?.includes('API_KEY') || err?.status === 401) {
//       return new Response(JSON.stringify({ text: 'API key invalid. Check your GENAI_API_KEY in .env.local', error: 'Auth error' }), { status: 401, headers: { 'Content-Type': 'application/json' }});
//     }

//     // Generic error fallback
//     return new Response(JSON.stringify({ text: 'Explanation currently unavailable. Check back soon!', error: err?.message || 'server error' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
//   }
// }