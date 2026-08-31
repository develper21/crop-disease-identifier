
export interface AssistMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AdvisorContext {
  location?: string; // e.g., district/state
  crop?: string;     // e.g., Tomato
  season?: string;   // e.g., Rabi/Kharif or month
}

// Choose API endpoint via env so we can swap providers without code changes
const ADVISOR_API_URL = process.env.EXPO_PUBLIC_AI_ADVISOR_API_URL;

export async function sendAdvisorMessage(
  messages: AssistMessage[],
  context?: AdvisorContext
): Promise<AssistMessage> {
  // If no backend configured, return a helpful mock so UI still works in hackathon
  if (!ADVISOR_API_URL) {
    const crop = context?.crop || 'your crop';
    const season = context?.season || 'upcoming season';
    return {
      role: 'assistant',
      content:
        `Here is a quick plan for ${crop} in the ${season}:
1) Variety: Choose disease‑tolerant, locally recommended seeds.
2) Soil prep: Add well‑decomposed compost (2–3 t/acre), maintain pH 6–7.
3) Nursery: Treat seeds with Trichoderma; maintain hygiene.
4) Nutrition: Basal NPK, then split N; add micronutrients as per soil test.
5) Protection: Monitor weekly; use neem oil early; rotate actives if disease appears.
6) Water: Early morning drip/sprinkler; avoid leaf wetness at night.
7) Harvest: Staggered picking; grade and store in shade.

Ask me specific questions about spacing, dose, or local pests.`,
    };
  }

  const payload = {
    messages,
    context: context || {},
  };

  const res = await fetch(ADVISOR_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Advisor API error: ${res.status}`);
  }

  const data = await res.json();
  // Expect { reply: string }
  return { role: 'assistant', content: data.reply || 'Sorry, I could not generate a response.' };
}


