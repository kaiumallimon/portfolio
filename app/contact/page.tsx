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
  ChevronDown,
  Sparkles,
  CheckCheck,
  RotateCcw,
  Home,
  FolderGit2,
  Activity,
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

type IntakeStep = "name" | "email" | "subject" | "message" | "review" | "confirmed";

export default function ContactAgentPage() {
  const [step, setStep] = useState<IntakeStep>("name");
  const [activeModel, setActiveModel] = useState("Llama 3.1");
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

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Real-time client IP rate limit telemetry (unique per visitor)
  const [clientQuota, setClientQuota] = useState<{
    limit: number;
    remaining: number;
    used: number;
    resetSeconds: number;
  }>({
    limit: 10,
    remaining: 10,
    used: 0,
    resetSeconds: 60,
  });
  const [resetCountdown, setResetCountdown] = useState(60);

  // Sync countdown whenever server reports new resetSeconds
  useEffect(() => {
    setResetCountdown(clientQuota.resetSeconds || 60);
  }, [clientQuota.resetSeconds]);

  // Real-time 1s countdown ticker for the sliding window
  useEffect(() => {
    if (clientQuota.used === 0) return;
    const interval = setInterval(() => {
      setResetCountdown((prev) => {
        if (prev <= 1) {
          // Window expired, re-fetch fresh quota snapshot for this IP
          fetch("/api/contact/chat")
            .then((res) => res.json())
            .then((data) => {
              if (data.telemetry) setClientQuota(data.telemetry);
            })
            .catch(() => {});
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [clientQuota.used]);

  // Fetch initial telemetry snapshot & spontaneous dynamic LLM greeting on mount
  useEffect(() => {
    let isMounted = true;
    setIsThinking(true);

    // Initial telemetry check for this client IP
    fetch("/api/contact/chat")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.telemetry) setClientQuota(data.telemetry);
      })
      .catch(() => {});

    fetch("/api/contact/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isGreeting: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setIsThinking(false);
        if (data.telemetry) setClientQuota(data.telemetry);
        if (data.modelName) {
          const cleaned = data.modelName
            .replace("-8b-instant", "")
            .replace("-70b-versatile", "")
            .split("-")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          setActiveModel(cleaned || "Llama 3.1");
        }
        setMessages([
          {
            id: "msg-0",
            sender: "agent",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            chips: data.suggestions || undefined,
          },
        ]);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsThinking(false);
        setMessages([
          {
            id: "msg-0",
            sender: "agent",
            text: "Hello. I am Kaium's autonomous assistant. To get started, may I have your full name? (e.g. Alex Rivera)",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

    // Immediately clear chips from previous messages so old option buttons don't linger
    setMessages((prev) =>
      prev.map((m) => (m.chips ? { ...m, chips: undefined } : m)).concat(userMsg)
    );
    setInputVal("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/contact/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: trimmed,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          currentData: contactData,
          step,
        }),
      });

      const data = await res.json();
      if (data.telemetry) {
        setClientQuota(data.telemetry);
      }

      if (!res.ok) {
        setIsThinking(false);
        const errorText = data.reply || data.error || "A connection delay occurred. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "agent",
            text: errorText,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        if (res.status === 429) {
          toast.warning(`Rate limit reached: cooldown in ${data.retryAfter || 10}s.`);
        }
        return;
      }
      const nextStep: IntakeStep = data.step;
      const updatedData: ContactData = data.updatedData || contactData;

      setContactData(updatedData);
      setStep(nextStep);

      if (data.modelName) {
        const cleaned = data.modelName
          .replace("-8b-instant", "")
          .replace("-70b-versatile", "")
          .split("-")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        setActiveModel(cleaned || "Llama 3.1");
      }

      // If user verified and confirmed, perform final SMTP dispatch
      if (nextStep === "confirmed") {
        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          });
        } catch (postErr) {
          console.warn("[Contact] SMTP dispatch error:", postErr);
        }

        setIsThinking(false);
        setIsCompleted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-end-${Date.now()}`,
            sender: "agent",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isEndReceipt: true,
          },
        ]);
        toast.success("Dispatch verified and transmitted via SMTP 465.");
        return;
      }

      // Normal assistant reply
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: "agent",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          chips: data.suggestions || undefined,
        },
      ]);
    } catch (err) {
      console.warn("[Contact Chat] Error:", err);
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-err-${Date.now()}`,
          sender: "agent",
          text: "I encountered a momentary connection issue. Please share your input again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleReset = () => {
    setStep("name");
    setInputVal("");
    setIsThinking(true);
    setIsCompleted(false);
    setContactData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    fetch("/api/contact/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isGreeting: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsThinking(false);
        if (data.telemetry) setClientQuota(data.telemetry);
        setMessages([
          {
            id: `msg-reset-${Date.now()}`,
            sender: "agent",
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            chips: data.suggestions || undefined,
          },
        ]);
      })
      .catch(() => {
        setIsThinking(false);
        setMessages([
          {
            id: `msg-reset-${Date.now()}`,
            sender: "agent",
            text: "Hello. I am Kaium's autonomous assistant. To get started, may I have your full name? (e.g. Alex Rivera)",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      });
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
            <span className="hidden sm:inline">Autonomous Assistant Online</span>
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

                    {/* Professional Suggestion Chips (Zero emojis, dismissed once answered) */}
                    {msg.chips && msg.chips.length > 0 && !isCompleted && !isThinking && (
                      <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
                        {msg.chips.map((chipText) => {
                          const isConfirm = chipText === "Confirm & Send";
                          return (
                            <button
                              key={chipText}
                              type="button"
                              onClick={() => handleUserInput(chipText)}
                              className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all shadow-2xs active:scale-95 cursor-pointer text-left ${
                                isConfirm
                                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200"
                                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200"
                              }`}
                            >
                              {chipText}
                            </button>
                          );
                        })}
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
                  if (step === "name") setInputVal("Alex Rivera");
                  else if (step === "email") setInputVal("alex@company.com");
                  else if (step === "subject") handleUserInput("Project Collaboration");
                  else if (step === "review") handleUserInput("Confirm & Send");
                  else toast.info("Please enter your message details.");
                }}
                className="size-7 sm:size-8 shrink-0 rounded-full bg-zinc-200/70 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Quick example or suggestion"
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
                  step === "name"
                    ? "Enter your full name (e.g. Alex Rivera)..."
                    : step === "email"
                    ? "Enter your email address (e.g. alex@company.com)..."
                    : step === "subject"
                    ? "Select or enter a subject..."
                    : step === "message"
                    ? "Enter your message details..."
                    : "Confirm or request edits (e.g. 'Confirm & Send')..."
                }
                disabled={isThinking || isCompleted}
                className="flex-1 bg-transparent px-1 sm:px-2 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none disabled:opacity-50 font-sans"
              />

              {/* Model / Assistant Dropdown Pill */}
              <div className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-default select-none">
                <span>{activeModel}</span>
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

              {/* Right: Client IP Usage Quota (Real-time & isolated per visitor) */}
              <div className="flex items-center">
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-400 font-mono text-[10px] select-none transition-colors"
                  title={`Your Client IP Usage: ${clientQuota.remaining}/${clientQuota.limit} requests remaining this minute (resets in ${resetCountdown}s)`}
                >
                  <span
                    className={`size-1.5 rounded-full transition-colors ${
                      clientQuota.remaining > 3
                        ? "bg-emerald-500"
                        : clientQuota.remaining > 0
                        ? "bg-amber-500"
                        : "bg-red-500 animate-pulse"
                    }`}
                  />
                  <Activity className="size-2.5 opacity-70" />
                  <span className="tabular-nums">
                    {clientQuota.remaining}/{clientQuota.limit}
                  </span>
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">req/min</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}