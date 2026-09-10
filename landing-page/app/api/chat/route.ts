import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PROPERTIES } from '@/data/properties';
import { LOCATIONS } from '@/data/locations';

// Knowledge Base System Prompt for House & Sky AI Real Estate Concierge
const REAL_ESTATE_KB = `
You are the AI Real Estate & Investment Advisory Concierge for House & Sky / Hippo Infra.
You provide sophisticated, knowledgeable, and elegant assistance regarding luxury residential properties, architectural plot layouts (Naksa), pricing structures, and agent network inquiries across India.

### KNOWLEDGE BASE:

1. PROPERTIES & TOWNSHIPS:
- Bandra West, Mumbai: The Solitaire Sky Villa & Penthouses (₹24.5 Cr - ₹45 Cr). Features double-height living rooms, private elevators, 360-degree Arabian Sea views, 5,400 sq ft.
- Assagao, North Goa: Casa De Assagao Luxury Villas (₹8.5 Cr - ₹16 Cr). Private plunge pools, lush tropical landscaping, 100% legal title lineage, Portuguese-modern architecture.
- Golf Course Road, Gurgaon / Delhi NCR: Credenza Duplex & Golf View Suites (₹14.2 Cr - ₹22 Cr). Private sky decks, smart home automation, 4,200 sq ft.
- Executive Townships (Noida / NCR): Gated residential plot developments with complete Naksa layout mapping (Plot sizes 180 - 500 sq yrd).

2. PLOT PRICING & BREAKDOWN FORMULA:
- Base Rate: Charged per sq yard on sellable area.
- PLC (Preferential Location Charges): 12m/9m road facing, Corner plot, Park facing. Charged per sq yard.
- OTMC: One-Time Maintenance Charge (₹250/sq yrd).
- GST: 18% applied specifically on Other Charges (PLC + OTMC).
- Total Plot Cost = (Base Rate * Sellable Yrd) + PLC Charges + OTMC Charges + 18% GST.

3. MLM AGENT & ADVISORY NETWORK:
- Career Progression Ranks: Business Executive (5%), Sr Business Executive (8%), Team Leader (10%), Sr Team Leader (12%), Business Development Manager (15%), Associate Sales Director (18%), Director Sales (20%).
- Differential Payout: Direct sale commission based on rank differential down the upline tree.
- Instant Payout Requests: Managed via Admin Desk with automated ledger sync.

4. PRIVATE ADVISORY & TOURS:
- Private Viewing Desk: Scheduling available 7 days a week.
- Direct Advisory Line: +91 022 8800 9900
- Confidential Off-Market Vault: Available under NDA for high-net-worth acquisitions.

### RESPONSE GUIDELINES:
- Keep your tone sophisticated, helpful, and concise.
- Highlight specific pricing, sq ft, or locations where relevant.
- Invite the user to book a private tour or request an off-market consultation.
`;

const FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-pro-preview',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    let suggestedProperties: Array<{ title: string; price: string; location: string; slug: string }> = [];

    // Filter relevant property cards based on message context
    if (lower.includes('bandra') || lower.includes('mumbai') || lower.includes('penthouse') || lower.includes('sea')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('bandra')) || PROPERTIES[0];
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      });
    } else if (lower.includes('goa') || lower.includes('villa') || lower.includes('assagao')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('goa')) || PROPERTIES[1];
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      });
    } else if (lower.includes('gurgaon') || lower.includes('delhi') || lower.includes('golf') || lower.includes('ncr')) {
      const p = PROPERTIES.find((prop) => prop.slug.includes('gurgaon')) || PROPERTIES[2];
      suggestedProperties.push({
        title: p.title,
        price: p.formattedPrice,
        location: `${p.location.area}, ${p.location.city}`,
        slug: p.slug,
      });
    } else {
      PROPERTIES.slice(0, 2).forEach((p) => {
        suggestedProperties.push({
          title: p.title,
          price: p.formattedPrice,
          location: `${p.location.area}, ${p.location.city}`,
          slug: p.slug,
        });
      });
    }

    let aiReply = '';
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Attempt AI Generation with Model Fallbacks
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);

      for (const modelName of FALLBACK_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const prompt = `${REAL_ESTATE_KB}\n\nUSER QUESTION: "${message}"\n\nProvide a concise, elegant answer (2-4 sentences):`;
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          if (responseText && responseText.trim().length > 0) {
            aiReply = responseText.trim();
            break;
          }
        } catch (modelErr: any) {
          console.warn(`[Gemini Chat AI] Model ${modelName} attempted note:`, modelErr?.message || modelErr);
        }
      }
    }

    // 2. Rule-based Fallback if AI Key is absent or all models failed
    if (!aiReply) {
      if (lower.includes('bandra') || lower.includes('mumbai')) {
        const p = PROPERTIES.find((prop) => prop.slug.includes('bandra')) || PROPERTIES[0];
        aiReply = `We feature architecturally distinguished residences in Bandra West, Mumbai, including **${p.title}** starting from ${p.formattedPrice}. It offers ${p.specs.bedrooms} bedrooms, panoramic ocean views, and private elevator landings.`;
      } else if (lower.includes('goa') || lower.includes('villa')) {
        const p = PROPERTIES.find((prop) => prop.slug.includes('goa')) || PROPERTIES[1];
        aiReply = `In Goa, we represent private architectural estates such as **${p.title}** (${p.formattedPrice}). Set in Assagao, it features private plunge pools and 100% verified legal titles.`;
      } else if (lower.includes('plot') || lower.includes('naksa') || lower.includes('price') || lower.includes('calculator')) {
        aiReply = `Our plot pricing structure follows transparent client formulas: Total Cost = (Base Rate × Sellable Area) + PLC Charges + OTMC (₹250/sq yrd) + 18% GST on non-land charges. Would you like to review an interactive layout map?`;
      } else if (lower.includes('agent') || lower.includes('commission') || lower.includes('mlm')) {
        aiReply = `Our Hippo Advisory Network supports 7 rank tiers ranging from Business Executive (5%) up to Director Sales (20%), with instant differential commission calculation.`;
      } else {
        aiReply = `Welcome to House & Sky Real Estate Advisory. We represent curated trophy penthouses, modern villas, and plot developments across Mumbai, Goa, Delhi NCR, and Gurgaon. How may I assist your search today?`;
      }
    }

    return NextResponse.json({
      reply: aiReply,
      properties: suggestedProperties,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      {
        reply: 'Welcome to House & Sky Real Estate Advisory. How may I assist with your luxury property discovery or private tour scheduling today?',
        properties: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
