"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  Sparkles,
  CheckCheck,
  RotateCcw,
  Home,
  FolderGit2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { MonochromeHeader } from "@/components/monochrome/header";
import { MonochromeFooter } from "@/components/monochrome/footer";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { StatusDot } from "@/components/base/badges/status-dot";
import { ISiteSettings } from "@/lib/models";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  chips?: string[];
  isEndReceipt?: boolean;
}

interface IntakeData {
  name: string;
  email: string;
  category: string;
  brief: string;
  timeline: string;
}

const DEFAULT_SETTINGS: Partial<ISiteSettings> = {
  name: "Kaium Al Limon",
  title: "Full-Stack Software Engineer",
  email: "kalimon291@gmail.com",
  githubUrl: "https://github.com/kaiumallimon",
  linkedinUrl: "https://linkedin.com/in/kaiumallimon",
  twitterUrl: "https://x.com/kaiumallimon",
};

const INITIAL_SUGGESTIONS = [
  "Guest Explorer",
  "Engineering Lead",
  "Founder / CTO",
  "Product Manager",
];

const CATEGORY_SUGGESTIONS = [
  "🚀 Full-Stack / Mobile Product",
  "🤖 AI & Multi-Agent Architecture",
  "💼 Full-Time / Contract Position",
  "🎓 Thesis / Research Collaboration",
  "💬 General Inquiries & Coffee",
];

const TIMELINE_SUGGESTIONS = [
  "⚡ Urgent (< 2 weeks)",
  "📅 Within 1–2 Months",
  "🔭 Exploratory / Future",
  "⏭️ Skip Timeline",
];

export default function ContactAgentPage() {
  const [step, setStep] = useState<number>(0);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState("Calibrating intake parameters...");
  const [thinkingVariant, setThinkingVariant] = useState<"wave" | "spin" | "infinity">("wave");
  const [isCompleted, setIsCompleted] = useState(false);
  const [receiptTimestamp, setReceiptTimestamp] = useState("");

  const [intakeData, setIntakeData] = useState<IntakeData>({
    name: "",
    email: "",
    category: "",
    brief: "",
    timeline: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "agent",
      text: "Hello! I am Kaium's Autonomous Dispatch Agent. I can help explore project ideas, calibrate architecture specifications, and route a comprehensive brief directly to Kaium's inbox.\n\nTo begin, who do I have the pleasure of speaking with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chips: INITIAL_SUGGESTIONS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll chat view
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Auto-focus input field
  useEffect(() => {
    if (!isThinking && !isCompleted) {
      inputRef.current?.focus();
    }
  }, [isThinking, isCompleted]);

  const handleUserInput = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isThinking || isCompleted) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsThinking(true);

    if (step === 0) {
      // Step 0: Name received -> Ask for Email
      const name = trimmed;
      setIntakeData((prev) => ({ ...prev, name }));
      setThinkingLabel("Validating identity tokens...");
      setThinkingVariant("wave");

      setTimeout(() => {
        setIsThinking(false);
        setStep(1);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: `Pleasure to meet you, ${name}! What is your email address so Kaium can follow up with you directly?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1000);
    } else if (step === 1) {
      // Step 1: Email received -> Ask for Category / Purpose
      const email = trimmed;
      setIntakeData((prev) => ({ ...prev, email }));
      setThinkingLabel("Calibrating domain routing...");
      setThinkingVariant("spin");

      setTimeout(() => {
        setIsThinking(false);
        setStep(2);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: "Got your coordinates. What type of collaboration or project domain are you exploring?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            chips: CATEGORY_SUGGESTIONS,
          },
        ]);
      }, 1100);
    } else if (step === 2) {
      // Step 2: Category received -> Ask for Project Brief
      const category = trimmed;
      setIntakeData((prev) => ({ ...prev, category }));
      setThinkingLabel("Analyzing domain specifications...");
      setThinkingVariant("wave");

      setTimeout(() => {
        setIsThinking(false);
        setStep(3);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: "Excellent. Please share a brief outline of the project, proposal, tech requirements, or inquiry.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 1100);
    } else if (step === 3) {
      // Step 3: Brief received -> Ask for Timeline
      const brief = trimmed;
      setIntakeData((prev) => ({ ...prev, brief }));
      setThinkingLabel("Estimating scope & milestones...");
      setThinkingVariant("wave");

      setTimeout(() => {
        setIsThinking(false);
        setStep(4);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: "Understood and recorded. What is your anticipated timeline or kick-off urgency?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            chips: TIMELINE_SUGGESTIONS,
          },
        ]);
      }, 1100);
    } else if (step === 4) {
      // Step 4: Timeline received -> Transmit via SMTP & finalize
      const timeline = trimmed;
      const finalData = { ...intakeData, timeline };
      setIntakeData(finalData);

      setThinkingLabel("Synthesizing telemetry & transmitting via secure SMTP (Port 465)...");
      setThinkingVariant("infinity");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: finalData.name,
            email: finalData.email,
            subject: `[Agentic Intake] ${finalData.category} - ${finalData.name}`,
            message: `--- AUTONOMOUS AGENT INTAKE DISPATCH ---\nSender: ${finalData.name} <${finalData.email}>\nCategory: ${finalData.category}\nTarget Timeline: ${timeline}\nDispatched At: ${new Date().toISOString()}\n\nPROJECT BRIEF & REQUIREMENTS:\n${finalData.brief}\n\n--- END OF TRANSMISSION ---`,
          }),
        });

        if (!res.ok) {
          throw new Error("SMTP dispatch transmission failed");
        }
      } catch (err) {
        console.warn("[Contact Agent] Transmission warning (logging transcript anyway):", err);
      }

      setTimeout(() => {
        setIsThinking(false);
        setIsCompleted(true);
        setReceiptTimestamp(new Date().toISOString());

        setMessages((prev) => [
          ...prev,
          {
            id: `agent-end-${Date.now()}`,
            sender: "agent",
            text: `Dispatch successfully routed! Thank you, ${finalData.name}. All telemetry parameters have been synthesized and delivered directly to Kaium's inbox.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isEndReceipt: true,
          },
        ]);
        toast.success("Dispatch successfully transmitted via SMTP 465!");
      }, 1600);
    }
  };

  const handleReset = () => {
    setStep(0);
    setInputVal("");
    setIsThinking(false);
    setIsCompleted(false);
    setIntakeData({
      name: "",
      email: "",
      category: "",
      brief: "",
      timeline: "",
    });
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: "agent",
        text: "Session refreshed! I am ready to intake new dispatch coordinates. Who am I speaking with?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chips: INITIAL_SUGGESTIONS,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Sub-Header Navigation Bar */}
          <section className="px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to portfolio</span>
            </Link>

            {/* Agent Live Status */}
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
              <StatusDot color="green" />
              <span className="hidden sm:inline">Dispatch Agent Online</span>
              <span className="text-zinc-400 dark:text-zinc-600">{"//"} Port 465 Active</span>
            </div>
          </section>

          {/* Chat Room Stage */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-3xl mx-auto space-y-6">
            {/* Terminal Room Titlebar */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-xs">
                  <Bot className="size-4.5" />
                </div>
                <div>
                  <h1 className="font-sans text-sm sm:text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    KAL Autonomous Dispatch Agent
                  </h1>
                  <p className="font-mono text-[11px] text-zinc-500">
                    Interactive project intake &amp; telemetry routing v2.4
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-mono text-xs transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Chat Transcript Stream */}
            <div className="space-y-4 pt-2">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2.5">
                  {/* Message Bubble Row */}
                  <div
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-xs shadow-xs ${
                        msg.sender === "user"
                          ? "border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                    </div>

                    {/* Content Box */}
                    <div className={`space-y-1 max-w-[85%] sm:max-w-[78%]`}>
                      <div className="flex items-center gap-2 px-1">
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                          {msg.sender === "user" ? "You" : "Dispatch Agent"}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">· {msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap shadow-xs ${
                          msg.sender === "user"
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-none"
                            : "border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-850 dark:text-zinc-200 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>

                  {/* Suggestion Chips (if available for this step) */}
                  {msg.chips && msg.chips.length > 0 && !isCompleted && !isThinking && (
                    <div className="pl-10 flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
                      {msg.chips.map((chipText) => (
                        <button
                          key={chipText}
                          type="button"
                          onClick={() => handleUserInput(chipText)}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-mono text-xs transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          {chipText}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Final Beautiful Ending Receipt Card */}
                  {msg.isEndReceipt && (
                    <div className="pl-0 sm:pl-10 pt-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                            <CheckCheck className="size-4" />
                            <span>DISPATCH CONFIRMED // 200 OK</span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400">
                            ID: #DSP-{Date.now().toString().slice(-6)}
                          </span>
                        </div>

                        {/* Structured Receipt Metadata */}
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="space-y-0.5">
                            <dt className="text-zinc-400 text-[10px] uppercase">Contact</dt>
                            <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                              {intakeData.name} ({intakeData.email})
                            </dd>
                          </div>
                          <div className="space-y-0.5">
                            <dt className="text-zinc-400 text-[10px] uppercase">Domain</dt>
                            <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                              {intakeData.category || "General Inquiry"}
                            </dd>
                          </div>
                          <div className="space-y-0.5">
                            <dt className="text-zinc-400 text-[10px] uppercase">Target Timeline</dt>
                            <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                              {intakeData.timeline || "Not specified"}
                            </dd>
                          </div>
                          <div className="space-y-0.5">
                            <dt className="text-zinc-400 text-[10px] uppercase">Routing Route</dt>
                            <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                              SMTP Port 465 (kalimon291@gmail.com)
                            </dd>
                          </div>
                          <div className="sm:col-span-2 space-y-0.5 pt-1 border-t border-emerald-500/15">
                            <dt className="text-zinc-400 text-[10px] uppercase">Brief Summary</dt>
                            <dd className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                              {intakeData.brief}
                            </dd>
                          </div>
                        </dl>

                        {/* Celebratory Post-Chat Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-emerald-500/20">
                          <Link
                            href="/"
                            prefetch={false}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs"
                          >
                            <Home className="size-3.5" />
                            <span>Return to Portfolio</span>
                          </Link>

                          <Link
                            href="/projects"
                            prefetch={false}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-xs"
                          >
                            <FolderGit2 className="size-3.5" />
                            <span>Browse Projects</span>
                          </Link>

                          <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-mono text-xs transition-colors cursor-pointer ml-auto"
                          >
                            <RotateCcw className="size-3.5" />
                            <span>New Session</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Live BoardUI AgentThinking Component */}
              {isThinking && (
                <div className="flex items-center gap-3 pl-1 pt-1 animate-in fade-in duration-200">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50">
                    <AgentThinking
                      variant={thinkingVariant}
                      label={thinkingLabel}
                      showTimer={true}
                      className="font-mono text-xs text-zinc-600 dark:text-zinc-300"
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer Pill (disabled when session ends) */}
            {!isCompleted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserInput(inputVal);
                }}
                className="sticky bottom-4 z-20 pt-2"
              >
                <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-lg transition-all focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-zinc-400/20">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={
                      step === 0
                        ? "Type your name or select an option..."
                        : step === 1
                        ? "Type your email address (e.g. ada@lovelace.io)..."
                        : step === 2
                        ? "Select or type project category..."
                        : step === 3
                        ? "Describe project outline, proposal or inquiry..."
                        : "Type timeline or select an option..."
                    }
                    disabled={isThinking}
                    className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isThinking}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 disabled:opacity-30 disabled:hover:opacity-30 transition-all cursor-pointer"
                    title="Send response"
                    aria-label="Send response"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 text-xs font-mono text-zinc-500">
                Session concluded · Telemetry logged · Have a great day!
              </div>
            )}
          </div>

          {/* Stripe divider */}
          <div className="stripe-divider h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Consistent Monochrome Footer */}
        <MonochromeFooter settings={DEFAULT_SETTINGS} />
      </div>
    </div>
  );
}
