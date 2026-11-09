import { Metadata } from "next";
import { getInitialChatState } from "./actions";
import { ContactChatClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact / Autonomous Intake Assistant - Kaium Al Limon",
  description: "Direct autonomous inquiry routing and collaboration consultation with Kaium Al Limon.",
};

// Force dynamic server-rendering so visitor IP telemetry and greeting are evaluated per request
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { initialGreeting, initialSuggestions, telemetry } = await getInitialChatState();

  return (
    <ContactChatClient
      initialGreeting={initialGreeting}
      initialSuggestions={initialSuggestions}
      initialTelemetry={telemetry}
    />
  );
}
