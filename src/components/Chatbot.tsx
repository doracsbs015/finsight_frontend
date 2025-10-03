import { useState } from "react";
import "./Chatbot.css";

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

  // Enhanced predefined Q&A
  const predefinedQA: Record<string, string> = {
    "what is kpi": "KPI (Key Performance Indicator) helps track and measure business performance and goals effectively.",
    "what is regression": "Regression predicts future trends from historical data, helping businesses make informed decisions.",
    "can i upload my own data": "Yes! You can use datasets with productId, amount, and date. FinCite will process it for ML predictions.",
    "what does this dashboard do": "It visualizes KPIs, transactions, and predicts future trends using Machine Learning.",
    "how to read sales chart": "The sales chart shows revenue trends over time. Peaks indicate high sales periods, while dips show lower activity.",
    "why ml is used": "ML helps forecast future data trends, detect patterns, and generate insights automatically from your data.",
    "what is predicted data": "Predicted data is generated using ML models to estimate future business performance based on historical trends.",
    "how to use FInSight": "Use the dashboard to explore KPIs, view charts, and interact with the Finbird chatbot for instant guidance.",
  };

  const quickReplies = Object.keys(predefinedQA);

  const handleSend = (message?: string) => {
    const userInput = message || input;
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = { from: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);

    const lowerInput = userInput.toLowerCase();
    let reply = "Sorry, I don’t understand that yet. Please try one of the suggested questions.";

    for (const key in predefinedQA) {
      if (lowerInput.includes(key)) {
        reply = predefinedQA[key];
        break;
      }
    }

    const botMsg: ChatMessage = { from: "bot", text: reply };
    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-modal">
        {/* Header */}
        <div className="chatbot-header">
          <h2>FinBird 🐥</h2>
          <button className="chatbot-close" onClick={onClose}>
            ❌
          </button>
        </div>

        {/* Chat messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-message ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Quick reply buttons */}
        <div className="chatbot-quick-replies">
          {quickReplies.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)}>
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}
        </div>

        {/* Input section */}
        <div className="chatbot-input-container">
          <input
            type="text"
            value={input}
            placeholder="Type your question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={() => handleSend()}>Send</button>
        </div>

        <button className="chatbot-end" onClick={onClose}>
          End Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
