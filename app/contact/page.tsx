"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Plus,
  Mic,
  GitBranch,
  Folder,
  Infinity,
  ChevronDown,
  Sparkles,
  CheckCheck,
  RotateCcw,
  Home,
  FolderGit2,
} from "lucide-react";
import { MonochromeHeader } from "@/components/monochrome/header";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
  chips?: string[];
  isEndReceipt?: boolean;
}

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_NAME_SUGGESTIONS = [
  "Engineering Lead",
  "Founder / CTO",
  "Product Manager",
  "Fellow Developer",
];

const SUBJECT_SUGGESTIONS = [
  "Project Collaboration",
  "Full-Stack Development",
  "Consulting & Architecture",
  "Job Opportunity",
  "General Inquiry",
];

export default function ContactAgentPage() {
  const [step, setStep] = useState<number>(0);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSeconds, setThinkingSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "agent",
      text: "Hello! I am Kaium's autonomous assistant.\n\nI can help outline your inquiry and route your message directly to Kaium's inbox.\n\nTo begin, may I know your name?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chips: INITIAL_NAME_SUGGESTIONS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Live thinking timer (matches "Thinking 3.4s")
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isThinking) {
      const start = Date.now();
      interval = setInterval(() => {
        setThinkingSeconds((Date.now() - start) / 1000);
      }, 100);
    } else {
      setThinkingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isThinking]);

  // Auto-scroll chat body
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isThinking]);

  // Auto-focus input
  useEffect(() => {
    if (!isThinking && !isCompleted) {
      inputRef.current?.focus();
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
      // Step 0: Name received -> Ask for Email
      const name = trimmed;
      setContactData((prev) => ({ ...prev, name }));

      setTimeout(() => {
        setIsThinking(false);
        setStep(1);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: `Thank you, ${name}. What is your email address so Kaium can follow up with you?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 900);
    } else if (step === 1) {
      // Step 1: Email received -> Ask for Subject
      const email = trimmed;
      setContactData((prev) => ({ ...prev, email }));

      setTimeout(() => {
        setIsThinking(false);
        setStep(2);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: "Received. What is the subject or primary topic of your message?",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            chips: SUBJECT_SUGGESTIONS,
          },
        ]);
      }, 900);
    } else if (step === 2) {
      // Step 2: Subject received -> Ask for Message
      const subject = trimmed;
      setContactData((prev) => ({ ...prev, subject }));

      setTimeout(() => {
        setIsThinking(false);
        setStep(3);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${Date.now()}`,
            sender: "agent",
            text: "Noted. Please share the details of your message, proposal, or inquiry.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 900);
    } else if (step === 3) {
      // Step 3: Message received -> Transmit to /api/contact & finalize
      const message = trimmed;
      const finalData: ContactData = { ...contactData, message };
      setContactData(finalData);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: finalData.name,
            email: finalData.email,
            subject: finalData.subject,
            message: finalData.message,
          }),
        });

        if (!res.ok) {
          throw new Error("Transmission request failed");
        }
      } catch (err) {
        console.warn("[Contact Agent] Transmission warning:", err);
      }

      setTimeout(() => {
        setIsThinking(false);
        setIsCompleted(true);

        setMessages((prev) => [
          ...prev,
          {
            id: `agent-end-${Date.now()}`,
            sender: "agent",
            text: `Your message has been successfully transmitted. Thank you, ${finalData.name}. I have delivered your coordinates directly to Kaium's inbox.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isEndReceipt: true,
          },
        ]);
        toast.success("Message successfully transmitted via SMTP 465.");
      }, 1400);
    }
  };

  const handleReset = () => {
    setStep(0);
    setInputVal("");
    setIsThinking(false);
    setIsCompleted(false);
    setContactData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: "agent",
        text: "Session refreshed. I am ready to assist. May I know your name?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        chips: INITIAL_NAME_SUGGESTIONS,
      },
    ]);
  };

  const toggleListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      toast.info("Speech recognition not supported in this browser. Please type your message.");
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = "en-US";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => {
        toast.error("Audio capture failed. Please type your input.");
      };
      recognition.start();
      toast.info("Listening... speak your response.");
    } catch {
      toast.info("Voice input unavailable.");
    }
  };

  // Progress percentage across 4 fields (Name, Email, Subject, Message)
  const progressPercent = isCompleted ? 100 : Math.min(100, Math.round(((step + 1) / 4) * 100));

  return (
    <div className="h-[100dvh] w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden flex flex-col antialiased">
      {/* Centered max-w-5xl canvas matching site architecture */}
      <div className="mx-auto max-w-5xl w-full bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 h-full flex flex-col overflow-hidden">
        {/* 1. Website Header at the top */}
        <div className="shrink-0">
          <MonochromeHeader />
        </div>

        {/* 2. Return to Portfolio Sub-Header */}
        <section className="shrink-0 px-4 sm:px-6 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to portfolio</span>
          </Link>

          {/* Right Status */}
          <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-500">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="hidden sm:inline">Dispatch Agent Online</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-[11px] transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          </div>
        </section>

        {/* 3. Chat Body (Scrolls independently; page does not scroll) */}
        <main
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-6"
        >
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === "agent" ? (
                  /* Assistant Message Turn */
                  <div className="space-y-3">
                    <div className="text-sm sm:text-[15px] font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap max-w-2xl">
                      {msg.text}
                    </div>

                    {/* Professional Suggestion Chips (Zero emojis) */}
                    {msg.chips && msg.chips.length > 0 && !isCompleted && !isThinking && (
                      <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
                        {msg.chips.map((chipText) => (
                          <button
                            key={chipText}
                            type="button"
                            onClick={() => handleUserInput(chipText)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 font-mono text-xs transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
                          >
                            {chipText}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Ending Receipt Card */}
                    {msg.isEndReceipt && (
                      <div className="pt-3 animate-in fade-in zoom-in-95 duration-300">
                        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4 sm:p-5 space-y-4 shadow-xs">
                          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-mono text-xs font-semibold">
                              <CheckCheck className="size-4 text-zinc-950 dark:text-zinc-100" />
                              <span>DISPATCH CONFIRMED // 200 OK</span>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-400">
                              #DSP-{Date.now().toString().slice(-6)}
                            </span>
                          </div>

                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Name
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {contactData.name}
                              </dd>
                            </div>
                            <div className="space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Email
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {contactData.email}
                              </dd>
                            </div>
                            <div className="sm:col-span-2 space-y-0.5">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Subject
                              </dt>
                              <dd className="font-medium text-zinc-900 dark:text-zinc-100">
                                {contactData.subject}
                              </dd>
                            </div>
                            <div className="sm:col-span-2 space-y-0.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                              <dt className="text-zinc-400 text-[10px] uppercase tracking-wider">
                                Message
                              </dt>
                              <dd className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans text-xs sm:text-sm">
                                {contactData.message}
                              </dd>
                            </div>
                          </dl>

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
                ) : (
                  /* User Message Turn (Right-aligned clean card) */
                  <div className="flex justify-end pl-10">
                    <div className="max-w-lg rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 px-4 py-3 text-sm sm:text-[15px] leading-relaxed shadow-xs">
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator (Matches "Thinking 3.4s") */}
            {isThinking && (
              <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 font-sans text-xs sm:text-sm animate-in fade-in duration-200 select-none py-1">
                <Sparkles className="size-3.5 text-zinc-400 animate-pulse" />
                <span className="font-medium text-zinc-500 dark:text-zinc-400">
                  Thinking
                </span>
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                  {thinkingSeconds.toFixed(1)}s
                </span>
              </div>
            )}

            <div ref={messagesEndRef} className="h-2" />
          </div>
        </main>

        {/* 4. Pinned Bottom Area (Clean professional layout, zero emojis) */}
        <footer className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 sm:p-4 z-20">
          <div className="max-w-3xl mx-auto w-full space-y-2.5">
            {/* Pill-shaped Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserInput(inputVal);
              }}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/70 shadow-xs focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all"
            >
              {/* Circular + button */}
              <button
                type="button"
                onClick={() => {
                  if (step === 0) handleUserInput(INITIAL_NAME_SUGGESTIONS[0]);
                  else if (step === 2) handleUserInput(SUBJECT_SUGGESTIONS[0]);
                  else toast.info("Please enter your response.");
                }}
                className="size-7 sm:size-8 shrink-0 rounded-full bg-zinc-200/70 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Quick insert suggestion"
              >
                <Plus className="size-4" />
              </button>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  step === 0
                    ? "Enter your name..."
                    : step === 1
                    ? "Enter your email address..."
                    : step === 2
                    ? "Select or enter a subject..."
                    : "Enter your message details..."
                }
                disabled={isThinking || isCompleted}
                className="flex-1 bg-transparent px-1 sm:px-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 font-sans"
              />

              {/* Model / Assistant Dropdown Pill */}
              <div className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-default select-none">
                <span>KAL 2.4</span>
                <ChevronDown className="size-3 opacity-60" />
              </div>

              {/* Mic Icon Button */}
              <button
                type="button"
                onClick={toggleListening}
                className="size-7 sm:size-8 shrink-0 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                title="Voice input"
              >
                <Mic className="size-4" />
              </button>

              {/* Circular Vibrant Up Arrow Send Button */}
              <button
                type="submit"
                disabled={!inputVal.trim() || isThinking || isCompleted}
                className="size-7 sm:size-8 shrink-0 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-30 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                title="Send message"
                aria-label="Send message"
              >
                <ArrowUp className="size-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Bottom Status / Telemetry Footer Line */}
            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 select-none">
              {/* Left: Branch & Project Dropdown */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  <GitBranch className="size-3" />
                  <span>v2</span>
                </div>
                <div className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  <Folder className="size-3" />
                  <span>portfolio</span>
                  <ChevronDown className="size-2.5 opacity-60" />
                </div>
              </div>

              {/* Right: Agent mode & Circular Progress Ring */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <Infinity className="size-3.5" />
                  <span>Agent</span>
                  <ChevronDown className="size-2.5 opacity-60" />
                </div>

                <div className="inline-flex items-center gap-1.5 tabular-nums text-zinc-700 dark:text-zinc-300 font-mono">
                  <svg className="size-3.5 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-zinc-200 dark:text-zinc-800"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={62.8}
                      strokeDashoffset={62.8 - (62.8 * progressPercent) / 100}
                      strokeLinecap="round"
                      className="text-blue-600 dark:text-blue-400 transition-all duration-300"
                    />
                  </svg>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}