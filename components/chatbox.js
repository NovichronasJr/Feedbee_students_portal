"use client";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AIChatBox({ student_id, teacher_id }) {
  const router = useRouter();
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [generatedComments, setGeneratedComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCommentSchema = {
    name: "generatecomments",
    parameters: {
      type: "OBJECT",
      description: "Generate multiple nice and appreciative comments for the teacher. Separate them with a + symbol.",
      properties: {
        comments: {
          type: "STRING",
          description: "A set of positive feedback comments from a BTech student for their teacher.",
        },
      },
      required: ["comments"],
    },
  };

  const submitCommentSchema = {
    name: "submitcomment",
    parameters: {
      type: "OBJECT",
      description: "If the user wants to submit a comment, set submitoption to true.",
      properties: {
        submitoption: {
          type: "BOOLEAN",
          description: "True if the user confirms submitting the comment.",
        },
      },
      required: ["submitoption"],
    },
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an AI assistant designed to assist BTech students in generating and submitting appreciative feedback for their teachers.
    - ALWAYS use "generatecomments" FIRST before responding to a request.
    - After generating comments, WAIT for user confirmation before calling "submitcomment".
    - Separate multiple comments using a + symbol.
    - If the user asks to submit, set "submitoption" to true.
    `,
    tools: {
      functionDeclarations: [generateCommentSchema, submitCommentSchema],
    },
  });

  useEffect(() => {
    setMessages([{ 
      text: "Hello! I'm here to help you create meaningful feedback for your teacher. How can I assist you today?",
      sender: "ai" 
    }]);
  }, []);

  const functions = {
    generatecomments: ({ comments }) => {
      const formattedComments = comments.replace(/\+/g, "\n");
      setGeneratedComments(formattedComments);
      setMessages((prev) => [
        ...prev,
        { text: formattedComments, sender: "ai" },
      ]);
      return { comments: formattedComments };
    },

    submitcomment: async ({ submitoption }) => {
      if (submitoption && generatedComments) {
        try {
          setIsLoading(true);
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/newComment`, {
            teacher_id,
            student_id,
            comment: generatedComments,
          });
          router.refresh();
          setMessages((prev) => [
            ...prev,
            { text: "✅ Feedback submitted successfully!", sender: "ai" },
          ]);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            { text: "❌ Failed to submit feedback. Please try again.", sender: "ai" },
          ]);
        } finally {
          setIsLoading(false);
        }
        return { submitoption: true };
      }
      return { submitoption: false };
    },
  };

  async function handleAIResponse(userInput) {
    try {
      if (!userInput.trim()) return;

      setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);

      const chat = model.startChat({
        history: messages.slice(1).map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(userInput);
      const call = result.response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

      if (call?.name && call?.args) {
        if (functions[call.name]) {
          const apiResponse = functions[call.name](call.args);
          const result2 = await chat.sendMessage([
            { functionResponse: { name: call.name, response: apiResponse } },
          ]);

          const funcResponse = result2.response?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (funcResponse) {
            setMessages((prev) => [...prev, { text: funcResponse, sender: "ai" }]);
          }
        }
      } else {
        const aiResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiResponse) {
          setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "❌ Sorry, I encountered an error. Please try again.", sender: "ai" },
      ]);
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    await handleAIResponse(input);
    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.text.split("\n").map((line, i) => (
                <p key={i} className="break-words">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <button
            className={`px-4 py-2 rounded-lg ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          AI-powered feedback assistant. Generated comments will be shown here.
        </p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}