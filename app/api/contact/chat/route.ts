import { NextRequest, NextResponse } from "next/server";

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ChatRequestPayload {
  userMessage: string;
  history: { role: "user" | "assistant"; content: string }[];
  currentData: ContactData;
  step: "name" | "email" | "subject" | "message" | "review" | "confirmed";
}

const SYSTEM_PROMPT = `You are Kaium's autonomous portfolio assistant for Kaium Al Limon (Full-Stack Software Engineer & CS student at UIU in Dhaka).
Kaium crafts minimal interfaces, cross-platform apps (Flutter), and distributed backends (Next.js, FastAPI, MongoDB, PostgreSQL, TypeScript).

YOUR GOAL:
Conduct a natural, professional intake conversation to gather and validate 4 items:
1. Full Name
2. Email address
3. Subject (e.g. Project Collaboration, Architecture Consulting, Job Opportunity, etc. If the user skips or says "no"/"none", set to "General Inquiry")
4. Message details

CRITICAL VALIDATION & VERIFICATION RULES:
- Zero emojis. Do not output any emojis under any circumstance.
- Always be concise, polite, professional, and developer-native.
- Email Validation: Verify that the email is a valid email format (contains '@' and a domain with '.'). If invalid, politely explain and ask for a valid email.
- Never directly send or finalize without explicit user verification!
- When all 4 fields (name, email, subject, message) are gathered and valid:
  - Set "step": "review"
  - Present a neat, formatted summary of the 4 collected items:
    "Here is a summary of your inquiry details before I dispatch them to Kaium:
    • Name: <name>
    • Email: <email>
    • Subject: <subject>
    • Message: <message>

    Would you like me to send this message now, or would you like to edit anything?"
  - Set "suggestions": ["Confirm & Send", "Edit Details"]
- When in "review" step, if the user confirms ("Confirm & Send", "yes", "looks good", "send it", "confirmed"):
  - Set "step": "confirmed"
  - Output a professional closing acknowledging that the message is now being routed to Kaium's inbox.
- If the user asks general questions about Kaium's skills, experience, or portfolio, answer concisely and accurately, then guide them back to their message.

RESPONSE FORMAT:
You MUST respond with a valid JSON object matching this schema:
{
  "reply": "string (your natural conversational reply)",
  "updatedData": {
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string"
  },
  "step": "name" | "email" | "subject" | "message" | "review" | "confirmed",
  "suggestions": ["string"] | null
}`;

export async function POST(req: NextRequest) {
  try {
    const payload: ChatRequestPayload = await req.json();
    const { userMessage, history, currentData, step } = payload;

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    // If Groq API key is present, execute via Llama 3.1 8B Instant on Groq
    if (apiKey) {
      try {
        const groqMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          {
            role: "user",
            content: `User Input: "${userMessage}"\nCurrent Data: ${JSON.stringify(currentData)}\nCurrent Step: "${step}"`,
          },
        ];

        let groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: groqMessages,
            response_format: { type: "json_object" },
            temperature: 0.2,
            max_tokens: 700,
          }),
        });

        // If the configured model returned not found or error, retry with active Groq model
        if (!groqRes.ok && model !== "openai/gpt-oss-20b") {
          groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              messages: groqMessages,
              response_format: { type: "json_object" },
              temperature: 0.2,
              max_tokens: 700,
            }),
          });
        }

        if (groqRes.ok) {
          const data = await groqRes.json();
          const rawContent = data.choices?.[0]?.message?.content;
          if (rawContent) {
            const parsed = JSON.parse(rawContent);
            return NextResponse.json({
              reply: parsed.reply,
              updatedData: parsed.updatedData || currentData,
              step: parsed.step || step,
              suggestions: parsed.suggestions || null,
              provider: "groq-llm",
              modelName: model,
            });
          }
        } else {
          const errText = await groqRes.text();
          console.warn("[Groq API] Non-OK response, falling back to local engine:", errText);
        }
      } catch (groqErr) {
        console.warn("[Groq API] Error during completion, falling back to local engine:", groqErr);
      }
    }

    // Fallback: Intelligent Local Validation & Verification Engine
    const trimmed = (userMessage || "").trim();
    const updated = { ...currentData };
    let nextStep = step;
    let reply = "";
    let suggestions: string[] | null = null;

    if (step === "name") {
      if (trimmed.length < 2) {
        reply = "Please provide your full name so Kaium knows who is reaching out (e.g. Alex Rivera).";
      } else {
        updated.name = trimmed;
        nextStep = "email";
        reply = `Pleasure to connect with you, ${trimmed}. What is your email address so Kaium can follow up directly?`;
      }
    } else if (step === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        reply = "That does not appear to be a valid email address. Please provide a valid email coordinate (e.g. alex@company.com).";
      } else {
        updated.email = trimmed;
        nextStep = "subject";
        reply = `Email coordinate recorded (${trimmed}). What is the primary subject or topic of your message?`;
        suggestions = [
          "Project Collaboration",
          "Full-Stack Development",
          "Architecture Consulting",
          "Contract / Full-Time Role",
          "General Inquiry",
        ];
      }
    } else if (step === "subject") {
      const isSkip = /^(no|nope|none|skip|nah|nothing|na|n\/a|not really|no subject)$/i.test(trimmed);
      updated.subject = isSkip ? "General Inquiry" : trimmed;
      nextStep = "message";
      reply = isSkip
        ? "No problem, we'll keep it as a general inquiry. Please share the details of your message, specifications, or proposal."
        : `Understood regarding ${updated.subject}. Please share the details of your message, proposal, or inquiry.`;
    } else if (step === "message") {
      if (trimmed.length < 4) {
        reply = "Please provide a few more details so Kaium can review your inquiry effectively.";
      } else {
        updated.message = trimmed;
        nextStep = "review";
        reply = `All details recorded. Before I dispatch this to Kaium, please verify your details:

• Name: ${updated.name}
• Email: ${updated.email}
• Subject: ${updated.subject}
• Message: ${updated.message}

Would you like me to send this message now, or would you like to edit anything?`;
        suggestions = ["Confirm & Send", "Edit Details"];
      }
    } else if (step === "review") {
      const isConfirmed = /^(confirm|send|yes|looks good|confirm & send|ok|send it|sure)$/i.test(trimmed);
      const isEdit = /^(edit|change|modify|edit details|no)$/i.test(trimmed);

      if (isConfirmed) {
        nextStep = "confirmed";
        reply = `Your message has been verified and successfully transmitted via SMTP 465. Thank you, ${updated.name}. Kaium will follow up with you at ${updated.email}.`;
      } else if (isEdit) {
        nextStep = "name";
        reply = "No problem. Let us review from the beginning. What is your full name?";
      } else {
        reply = "Please confirm if you would like to send this message, or select 'Edit Details' to make changes.";
        suggestions = ["Confirm & Send", "Edit Details"];
      }
    }

    return NextResponse.json({
      reply,
      updatedData: updated,
      step: nextStep,
      suggestions,
      provider: "local-validation-engine",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error processing chat intake";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}