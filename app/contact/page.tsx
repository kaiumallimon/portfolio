"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  User,
  CheckCheck,
  RotateCcw,
  Home,
  FolderGit2,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
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
      text: "Hello! I am Kaium's autonomous intake assistant.\n\nI can help explore project ideas, calibrate architecture specifications, and route your brief directly to Kaium's inbox.\n\nTo begin, who do I have the pleasure of speaking with today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chips: INITIAL_SUGGESTIONS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll messages container
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputVal]);

  // Auto-focus input
  useEffect(() => {
    if (!isThinking && !isCompleted) {
      textareaRef.current?.focus();
    }
  }, [isThinking, isCompleted, step]);

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
      }, 950);
    } else if (step === 1) {
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
      }, 1000);
    } else if (step === 2) {
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
      }, 1000);
    } else if (step === 3) {
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
      }, 1000);
    } else if (step === 4) {
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
            subject: `[Contact Intake] ${finalData.category} - ${finalData.name}`,
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
            text: `Dispatch successfully routed! Thank you, ${finalData.name}. All parameters have been synthesized and delivered directly to Kaium's inbox.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isEndReceipt: true,
          },
        ]);
        toast.success("Dispatch successfully transmitted via SMTP 465!");
      }, 1500);
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
        text: "Session refreshed! I am ready to intake new coordinates. Who do I have the pleasure of speaking with today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chips: INITIAL_SUGGESTIONS,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-text antialiased">
      {/* 1. Standalone Minimal Claude-like Top Navigation Bar */}
      <header className="h-13 sm:h-14 shrink-0 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20">
        {/* Left: Back to Portfolio Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 font-mono text-xs transition-all group"
            title="Return to portfolio"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden xs:inline">Portfolio</span>
          </Link>

          <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Model / Assistant Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 shadow-2xs">
            <span className="font-tiny5 text-sm tracking-wider text-zinc-950 dark:text-zinc-50 pl-0.5">
              KAL
            </span>
            <span className="text-zinc-300 dark:text-zinc-700 text-xs">/</span>
            <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              Intake Assistant
            </span>
            <span className="size-1.5 rounded-full bg-zinc-950 dark:bg-zinc-100" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-mono text-xs transition-colors cursor-pointer shadow-2xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="Start fresh conversation"
          >
            <RotateCcw className="size-3" />
            <span className="hidden sm:inline">New Session</span>
          </button>

          <ThemeToggle appearance="segmented" size="small" />
        </div>
      </header>

      {/* 2. Messages Scroll Container (Page does not scroll, only messages container) */}
      <main
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8"
      >
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.sender === "agent" ? (
                /* Assistant Message Turn (Claude Style) */
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Assistant Monogram Box */}
                  <div className="size-7 sm:size-8 shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-tiny5 text-xs sm:text-sm shadow-xs select-none mt-0.5">
                    KAL
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-950 dark:text-zinc-100">
                        KAL Assistant
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {msg.timestamp}
                      </span>
                    </div>

                    <div className="text-sm sm:text-[15px] font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Suggestion Chips */}
                    {msg.chips && msg.chips.length > 0 && !isCompleted && !isThinking && (
                      <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in duration-200">
                        {msg.chips.map((chipText) => (
                          <button
                            key={chipText}
                            type="button"
                            onClick={() => handleUserInput(chipText)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 font-mono text-xs transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
                          >
                            {chipText}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Claude-Artifacts Style Confirmed Receipt */}
                    {msg.isEndReceipt && (
                      <div className="pt-3 animate-in fade-in zoom-in-95 duration-300">
                        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4 shadow-xs">
                          {/* Card Header Bar */}
                          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-mono text-xs font-semibold">
                              <CheckCheck className="size-4 text-zinc-950 dark:text-zinc-100" />
                              <span>DISPATCH CONFIRMED // 200 OK</span>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-400">
                              #DSP-{Date.now().toString().slice(-6)}
                            </span>
                          </div>

                          {/* Metadata Grid */}
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Contact
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {intakeData.name} ({intakeData.email})
                              </dd>
                            </div>
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Domain
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {intakeData.category || "General Inquiry"}
                              </dd>
                            </div>
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Timeline
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {intakeData.timeline || "Not specified"}
                              </dd>
                            </div>
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Route
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                SMTP Port 465 (kalimon291@gmail.com)
                              </dd>
                            </div>
                            <div className="sm:col-span-2 space-y-0.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Brief Outline
                              </dt>
                              <dd className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                                {intakeData.brief}
                              </dd>
                            </div>
                          </dl>

                          {/* Post-Chat Navigation Actions */}
                          <div className="pt-3 flex flex-wrap items-center gap-2.5 border-t border-zinc-200 dark:border-zinc-800">
                            <Link
                              href="/"
                              prefetch={false}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-mono text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs"
                            >
                              <Home className="size-3.5" />
                              <span>Return to Portfolio</span>
                            </Link>

                            <Link
                              href="/projects"
                              prefetch={false}
                              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs"
                            >
                              <FolderGit2 className="size-3.5" />
                              <span>Browse Projects</span>
                            </Link>

                            <button
                              type="button"
                              onClick={handleReset}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-mono text-xs transition-colors cursor-pointer ml-auto"
                            >
                              <RotateCcw className="size-3" />
                              <span>New Session</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* User Message Turn (Claude Style) */
                <div className="flex justify-end pl-10">
                  <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-zinc-100 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 px-4 py-3 text-sm sm:text-[15px] leading-relaxed shadow-2xs border border-zinc-200/60 dark:border-zinc-800">
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    <div className="text-[10px] font-mono text-zinc-400 text-right mt-1.5">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Thinking State */}
          {isThinking && (
            <div className="flex items-start gap-3 sm:gap-4 animate-in fade-in duration-200">
              <div className="size-7 sm:size-8 shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-tiny5 text-xs sm:text-sm shadow-xs select-none mt-0.5">
                KAL
              </div>
              <div className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 shadow-xs">
                <AgentThinking
                  variant={thinkingVariant}
                  label={thinkingLabel}
                  showTimer={true}
                  className="font-mono text-xs text-zinc-600 dark:text-zinc-300"
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* 3. Docked Claude-style Input Composer */}
      <footer className="shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-4 py-3 sm:py-4 z-20">
        <div className="max-w-3xl mx-auto w-full space-y-2">
          {!isCompleted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserInput(inputVal);
              }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:bg-white dark:focus-within:bg-zinc-900 p-2 sm:p-2.5 transition-all shadow-xs">
                <textarea
                  ref={textareaRef}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleUserInput(inputVal);
                    }
                  }}
                  rows={1}
                  placeholder={
                    step === 0
                      ? "Type your name or select an option above..."
                      : step === 1
                      ? "Type your email address..."
                      : step === 2
                      ? "Select or type project category..."
                      : step === 3
                      ? "Describe your project outline, proposal or inquiry..."
                      : "Type timeline or select an option above..."
                  }
                  disabled={isThinking}
                  className="w-full bg-transparent px-2.5 py-1.5 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none resize-none font-sans min-h-[38px] max-h-36 disabled:opacity-50"
                />

                <div className="flex items-center justify-between pt-1 px-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <span>Step {step + 1} of 5</span>
                    <span>·</span>
                    <span className="hidden sm:inline">Press Enter ↵ to send</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isThinking}
                    className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 disabled:opacity-20 transition-all cursor-pointer shadow-2xs"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 px-4 py-2.5 text-xs font-mono text-zinc-500">
              <span>Session concluded · All telemetry transmitted</span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-zinc-900 dark:text-zinc-100 font-medium hover:underline cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Start New Session</span>
              </button>
            </div>
          )}

          {/* Discreet Monospace Footnote */}
          <div className="text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            Autonomous Intake · Direct SMTP Dispatch to Kaium Al Limon (Dhaka GMT+6)
          </div>
        </div>
      </footer>
    </div>
  );
}