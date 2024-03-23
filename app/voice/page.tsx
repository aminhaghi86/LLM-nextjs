"use client";

import useLLM, { OpenAIMessage } from "usellm";
import { useState } from "react";

export default function VoiceChat() {
  const [status, setStatus] = useState<Status>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });
  const [history, setHistory] = useState<OpenAIMessage[]>([
    {
      role: "system",
      content:
        "You're a voice chatbot powered by the ChatGPT API and developed using useLLM. Reply in a conversational tone, keep answers brief!",
    },
  ]);

  async function handleClick() {
    if (status === "idle") {
      setAudioUrl(null);
      await llm.record();
      setStatus("recording");
    } else if (status === "recording") {
      setStatus("thinking");
      const { audioUrl } = await llm.stopRecording();
      const { audioUrl: responseAudioUrl, messages } = await llm.voiceChat({
        transcribeAudioUrl: audioUrl,
        transcribeLanguage: "en",
        transcribePrompt: "",
        chatMessages: history,
      });
      setHistory([...history, ...messages]);
      setAudioUrl(responseAudioUrl);
      setStatus("idle");
    }
  }

  const Icon = status === "recording" ? Square : Mic;

  return (
    <div className="p-4 flex flex-col items-start overflow-y-scroll">
      <h2 className="font-semibold text-2xl">AI Voice Chat</h2>
      <button
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium mt-4"
        onClick={handleClick}
      >
        <Icon />
      </button>
      {status !== "idle" && (
        <div className="text-center mt-4 text-lg">{capitalize(status)}...</div>
      )}
      {audioUrl && <audio autoPlay className="mt-4" controls src={audioUrl} />}
    </div>
  );
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

const Mic = () => (
  // you can also use an icon library like `react-icons` here
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" x2="12" y1="19" y2="22"></line>
  </svg>
);

const Square = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
  </svg>
);

type Status =
  | "idle"
  | "recording"
  | "transcribing"
  | "understanding"
  | "thinking"
  | "speaking";
