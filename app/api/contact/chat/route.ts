import { NextRequest, NextResponse } from "next/server";
import { checkClientRateLimit, getClientTelemetry } from "@/lib/rate-limit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  return NextResponse.json({
    telemetry: getClientTelemetry(ip),
  });
}

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ChatRequestPayload {
  userMessage?: string;
  isGreeting?: boolean;
  history?: { role: "user" | "assistant"; content: string }[];
  currentData?: ContactData;
  step?: "name" | "email" | "subject" | "message" | "review" | "confirmed";
}

const SYSTEM_PROMPT = `You are Kaium's autonomous assistant (representing Kaium Al Limon, a Full-Stack Software Engineer and CS student at UIU in Dhaka, Bangladesh).
Kaium crafts minimal interfaces, cross-platform apps (Flutter), and distributed services (Next.js, FastAPI, TypeScript, MongoDB, PostgreSQL, Docker).

YOUR PURPOSE:
Engage the visitor in an organic, intelligent, completely unscripted conversation while collecting and validating 4 key pieces of information:
1. Full Name
2. Email Address
3. Subject / Topic of inquiry (e.g. Project Collaboration, Full-Stack Development, Architecture Consulting, Job Opportunity, or General Inquiry)
4. Message details / proposal

CONVERSATIONAL GUIDELINES:
- Identity: You are strictly Kaium's autonomous assistant. Introduce yourself only as "Kaium's autonomous assistant" (never say "intake assistant" or "dispatch assistant").
- Zero Emojis: Never output any emoji under any circumstances.
- Zero Slang & Zero Casual Idioms: Strictly avoid informal slang, street words, or colloquial filler (do NOT say "hey", "yo", "wassup", "sure thing", "cool", "gotcha", "no problem", "awesome", "yep", "nope", "gonna", "wanna", "kinda", "hit me up").
- Zero Vagueness: Strictly avoid vague words, conversational fluff, or imprecise sentences (do NOT say "let's do stuff", "tell me whatever", "we can connect sometime", "share some things"). Communicate with surgical clarity, executive-level professionalism, and articulate English.
- Direct & Specific Prompts: State exactly what information is required with clear, realistic examples strictly formatted in parentheses or brackets like (e.g. Alex Rivera) or (e.g. alex@company.com).
- Vague Input Guard: If the visitor's response is ambiguous, slangy, or lacks substance (e.g. "idk", "yo", "stuff", "asdf"), do not accept it as a valid subject or message. Politely and specifically ask for clear, actionable details.
- Initial Greeting: When asked to generate an initial greeting, welcome the visitor professionally as Kaium's autonomous assistant, state that you can outline requirements and route inquiries to Kaium's inbox, and request their full name with a clean example (e.g. Alex Rivera). Set "step": "name", "suggestions": null.
- Handling Questions: If the visitor asks a specific question about Kaium's background or skills, answer concisely and accurately, then direct them back to the intake process.
- Flexible Subject: If the user explicitly asks to skip or says "no" to specifying a subject, categorize it as "General Inquiry" and move to the message step.
- Email Validation: Verify that the email contains '@' and a valid domain. If invalid, politely explain and ask for a valid email coordinate.
- The Verification Gate (No Premature Sending): Once all 4 fields (name, email, subject, message) are gathered and valid, transition to step "review". Set "suggestions": ["Confirm & Send", "Edit Details"].
- Edit Details: If the user asks to edit or change details during review, ask what they would like to adjust and set suggestions to: ["Edit Name", "Edit Email", "Edit Subject", "Edit Message"].
- Confirmation: When in "review" and the user confirms ("Confirm & Send", "yes", "looks good", "send it"), transition to step "confirmed" with a courteous closing statement acknowledging that their message is now being routed to Kaium's inbox.

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
    const ip = getClientIp(req);
    const payload: ChatRequestPayload = await req.json();
    const {
      userMessage = "",
      isGreeting = false,
      history = [],
      currentData = { name: "", email: "", subject: "", message: "" },
      step = "name",
    } = payload;

    // Client-specific rate limiting & anti-bot protection
    const rateCheck = checkClientRateLimit(ip, userMessage);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: rateCheck.error,
          reply: rateCheck.error,
          retryAfter: rateCheck.retryAfter,
          telemetry: rateCheck.telemetry,
        },
        {
          status: rateCheck.status,
          headers: rateCheck.retryAfter
            ? { "Retry-After": String(rateCheck.retryAfter) }
            : undefined,
        }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    if (apiKey) {
      try {
        const groqMessages = [{ role: "system", content: SYSTEM_PROMPT }];

        if (isGreeting) {
          groqMessages.push({
            role: "user",
            content: "Generate a spontaneous, natural, polite initial greeting welcoming the visitor professionally and asking for their full name with a bracketed example like (e.g. Alex Rivera). Return JSON with 'reply', 'step': 'name', 'suggestions': null.",
          });
        } else {
          history.slice(-8).forEach((m) => {
            groqMessages.push({ role: m.role, content: m.content });
          });
          groqMessages.push({
            role: "user",
            content: `User Input: "${userMessage}"\nCurrent Data: ${JSON.stringify(currentData)}\nCurrent Step: "${step}"`,
          });
        }

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
            temperature: 0.35,
            max_tokens: 750,
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
              temperature: 0.35,
              max_tokens: 750,
            }),
          });
        }

        if (groqRes.ok) {
          const data = await groqRes.json();
          const rawContent = data.choices?.[0]?.message?.content;
          if (rawContent) {
            const parsed = JSON.parse(rawContent);
            const u = parsed.updatedData || currentData;

            // Safety guarantee for review step: ensure formatted brief is always presented
            if (parsed.step === "review") {
              const hasBullets = parsed.reply?.includes("•") || parsed.reply?.includes("- Name");
              if (!hasBullets) {
                parsed.reply = `${parsed.reply || "Please verify your details before sending:"}\n\n• Name: ${u.name}\n• Email: ${u.email}\n• Subject: ${u.subject || "General Inquiry"}\n• Message: ${u.message}\n\nWould you like me to send this now, or would you like to edit anything?`;
              }
              if (!parsed.suggestions || parsed.suggestions.length === 0) {
                parsed.suggestions = ["Confirm & Send", "Edit Details"];
              }
            }

            return NextResponse.json({
              reply: parsed.reply,
              updatedData: u,
              step: parsed.step || step,
              suggestions: parsed.suggestions || null,
              provider: "groq-llm",
              modelName: data.model || model,
              telemetry: rateCheck.telemetry,
            });
          }
        }
      } catch (groqErr) {
        console.warn("[Groq API] Error during completion, falling back to dynamic fallback:", groqErr);
      }
    }

    // Dynamic Server Fallback (only invoked if external LLM network is completely down)
    const trimmed = (userMessage || "").trim();
    const updated = { ...currentData };

    if (isGreeting) {
      return NextResponse.json({
        reply: "Hello. I am Kaium's autonomous assistant.\n\nI can help outline your project or inquiry and route your message directly to Kaium's inbox.\n\nTo begin, may I know your full name? (e.g. Alex Rivera)",
        updatedData: updated,
        step: "name",
        suggestions: null,
        provider: "fallback",
        modelName: model,
      });
    }

    let nextStep = step;
    let reply = "";
    let suggestions: string[] | null = null;

    if (step === "name") {
      if (trimmed.length < 2) {
        reply = "Please share your full name so Kaium knows who is reaching out (e.g. Alex Rivera).";
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
        ? "Understood. Your inquiry has been categorized as General Inquiry. Please outline the specific details of your proposal or inquiry."
        : `Understood regarding ${updated.subject}. Please outline the specific details of your proposal or inquiry.`;
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
        reply = "Understood. Let us revise from the beginning. May I have your full name?";
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
      provider: "fallback",
      modelName: model,
      telemetry: rateCheck.telemetry,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error processing chat intake";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}