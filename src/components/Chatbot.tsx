
import "./Chatbot.css";
import { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } from "../state/api";
import { folEngine } from "./folEngine";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi! This is Finbird🐥. What would you like help with today?✨" },
  ]);
  const [input, setInput] = useState("");

  // Scroll ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch backend data
  const { data: kpis } = useGetKpisQuery();
  const { data: products } = useGetProductsQuery();
  const { data: transactions } = useGetTransactionsQuery();

  // Auto-responses
  const autoResponses: Record<string, string> = {
    hello: "Hey there! 👋 How can I help you with your finances today?",
    hi: "Hey hey! Ask me about profits, expenses, or any product detail. 💼",
    thanks: "Anytime! 😊 Got another query?",
    bye: "Goodbye! 💸 Keep those profits growing!",
    help: "You can ask things like 'show monthly revenue', 'top buyers', or 'predict next month'. 📊",
    "what is kpi":
      "KPI (Key Performance Indicator) helps track and measure business performance and goals effectively.",
    "what is regression":
      "Regression predicts future trends from historical data, helping businesses make informed decisions.",
    "can i upload my own data":
      "Yes! You can use datasets with productId, amount, and date. FinSite will process it for ML predictions.",
    "what does this dashboard do":
      "It visualizes KPIs, transactions, and predicts future trends using Machine Learning.",
    "how to read sales chart":
      "The sales chart shows revenue trends over time. Peaks indicate high sales periods, while dips show lower activity.",
    "why ml is used":
      "ML helps forecast future data trends, detect patterns, and generate insights automatically from your data.",
    "what is predicted data":
      "Predicted data is generated using ML models to estimate future business performance based on historical trends.",
    "how to use finsight":
      "Use the dashboard to explore KPIs, view charts, and interact with Finbird 🐥 for instant guidance.",
    "how are you": "Feeling profitable today 💸, how about you?",
    "who made you": "I was built by your FinSite dev team to make data talk!",
  };

  // Auto scroll when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send
  const handleSend = async (message?: string) => {
    const userInput = message || input;
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = { from: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(async () => {
      const lower = userInput.toLowerCase().trim();

      const matchedAuto = Object.entries(autoResponses).find(([key]) =>
        lower.includes(key)
      );

      let reply = "";
      if (matchedAuto) {
        reply = matchedAuto[1];
      } else {
        reply = await folEngine(lower, kpis, products, transactions);
      }

      const botMsg: ChatMessage = { from: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-modal">
        <div className="chatbot-header">
          <h2>FinBird 🐥</h2>
          <button className="chatbot-close" onClick={onClose}>❌</button>
        </div>

        {/* Auto-response buttons */}
        <div className="chatbot-quick-replies">
          {Object.keys(autoResponses).map((key) => (
            <button key={key} onClick={() => handleSend(key)}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        {/* Chat messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            placeholder="Ask about revenue, expenses, products, or trends..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={() => handleSend()}>Send</button>
        </div>

        <button className="chatbot-end" onClick={onClose}>End Chat</button>
      </div>
    </div>
  );
};

export default Chatbot;
