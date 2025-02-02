import React, { useState } from "react";
import axios from "axios";

const FireChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you?" },
  ]);   
  const [input, setInput] = useState("");

  // Function to send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat/", {
        user_input: input,
      });

      setMessages([...newMessages, { sender: "bot", text: response.data.response }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: "#ffa500",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "20px",
        }}>
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div style={{
          width: "300px",
          backgroundColor: "#ffa500",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          padding: "10px",
          marginTop: "10px",
          display: "flex",
          flexDirection: "column"
        }}>
          <h3 style={{
            textAlign: "center",
            background: "#ffa500",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
          }}>
            FireBot
          </h3>

          {/* Messages Window */}
          <div style={{
            height: "250px",
            overflowY: "scroll",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "10px",
            backgroundColor: "#DDDDDD",
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === "bot" ? "left" : "right" }}>
                <p style={{
                  backgroundColor: msg.sender === "bot" ? "#ddd" : "white",
                  color: "#333333",
                  display: "inline-block",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: "5px 0"
                }}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input & Send Button */}
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: "5px", borderRadius: "5px", border: "1px solid #ddd" }}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} style={{
              padding: "5px 10px",
              backgroundColor: "#333333",
              color: "white",
              border: "none",
              marginLeft: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FireChatbot;
