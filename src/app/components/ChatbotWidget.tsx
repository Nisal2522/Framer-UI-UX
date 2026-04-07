import { useMemo, useState } from "react";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";

type ChatMode = "faq" | "admin";

type ChatMessage = {
  id: string;
  role: "bot" | "user" | "admin";
  text: string;
};

const preloadedQuestions = [
  "How can I download a material from Knowledge Hub?",
  "How do I find content by crop type and language?",
  "What does Active and Archived status mean?",
  "How can I request a new training document?",
  "Who can upload materials to the platform?",
];

const faqAnswers: Record<string, string> = {
  "How can I download a material from Knowledge Hub?":
    "Open Knowledge Hub, select the material card, and click Download. If the file is Active, you can download it immediately.",
  "How do I find content by crop type and language?":
    "Use the search bar in Knowledge Hub with crop names, language (Khmer/English/Both), or category keywords to quickly filter results.",
  "What does Active and Archived status mean?":
    "Active materials are currently in use and recommended. Archived materials are older records kept for reference.",
  "How can I request a new training document?":
    "Switch to Chat with Admin and send your request with crop type, location, and language preference so the team can prepare the right material.",
  "Who can upload materials to the platform?":
    "Admins and authorized officers can upload and publish materials for AC users.",
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("faq");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello! I am your assistant. Ask me anything or choose a quick question below.",
    },
  ]);

  const modeTitle = useMemo(
    () => (mode === "faq" ? "Ask Me Anything" : "Chat with Admin"),
    [mode],
  );

  const addMessage = (role: ChatMessage["role"], text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role, text },
    ]);
  };

  const handleQuestionClick = (question: string) => {
    addMessage("user", question);
    addMessage("bot", faqAnswers[question] ?? "Thanks. Please contact admin for detailed support.");
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    addMessage("user", text);
    setInput("");

    if (mode === "faq") {
      addMessage(
        "bot",
        "I can help with common platform questions. For personal support, switch to Chat with Admin.",
      );
      return;
    }

    addMessage(
      "admin",
      "Admin support received your message. We will follow up shortly in this chat.",
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#032EA1] text-white shadow-lg transition-colors hover:bg-[#0447D4]"
          aria-label="Open chatbot"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-30 flex h-[560px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl max-sm:left-4 max-sm:right-4 max-sm:w-auto">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#032EA1] to-[#0447D4] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">Assistant</p>
                <p className="text-xs text-white/80">{modeTitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 transition-colors hover:bg-white/15"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-gray-200 bg-gray-50 p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("faq")}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  mode === "faq"
                    ? "bg-[#032EA1] text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Ask Me Anything
              </button>
              <button
                type="button"
                onClick={() => setMode("admin")}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  mode === "admin"
                    ? "bg-[#032EA1] text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Chat with Admin
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/60 px-3 py-3">
            {mode === "faq" && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="mb-2 text-xs font-semibold text-[#032EA1]">Quick Questions</p>
                <div className="flex flex-wrap gap-2">
                  {preloadedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleQuestionClick(question)}
                      className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs text-blue-800 transition-colors hover:bg-blue-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "admin" && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                You are connected to admin assistance. Describe your issue and include relevant details.
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isAdmin = msg.role === "admin";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#032EA1] text-white"
                        : isAdmin
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border border-gray-200 bg-white text-gray-800"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-1 text-[11px] opacity-75">
                      {isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      <span>{isUser ? "You" : isAdmin ? "Admin" : "Assistant"}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  mode === "faq" ? "Ask your question..." : "Type your message to admin..."
                }
                className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#032EA1]"
              />
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#032EA1] text-white transition-colors hover:bg-[#0447D4]"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

