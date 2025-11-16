
import type { FlowData } from './types';

export const flowData: FlowData = {
  "agent_name": "Sahayak",
  "description": "A gentle and empathetic mental health support agent.",
  "flow": {
    "start": "user_message",
    "steps": {
      "user_message": {
        "title": "User Sends a Message",
        "icon": "💬",
        "next": "safety_check"
      },
      "safety_check": {
        "title": "Safety Check",
        "icon": "🔐",
        "question": "Is the user in crisis or self-harm risk?",
        "branches": {
          "unsafe": "emergency_support",
          "safe": "agent_logic"
        }
      },
      "emergency_support": {
        "title": "Emergency Message + Helpline",
        "icon": "❌",
        "response": "I'm really sorry you're feeling this way. You deserve immediate care. Please reach out to a trusted person or call your local helpline.",
        "next": "end"
      },
      "agent_logic": {
        "title": "Pass to Agent Logic",
        "icon": "✔️",
        "description": "Send user message to LLM for safe response generation.",
        "next": "generate_llm_response"
      },
      "generate_llm_response": {
        "title": "Generate LLM Response",
        "icon": "🤖",
        "model": "OpenAI GPT-4.1 or Llama-3",
        "temperature": 0.7,
        "max_new_tokens": 150,
        "next": "tone_filter"
      },
      "tone_filter": {
        "title": "Emotional Tone Filter",
        "icon": "💗",
        "purpose": "Make response soft, calming, empathetic.",
        "next": "store_interaction"
      },
      "store_interaction": {
        "title": "Store Interaction",
        "icon": "🗂️",
        "save_to": "database/memory.json",
        "fields": ["user_message", "agent_response", "timestamp"],
        "next": "final_response"
      },
      "final_response": {
        "title": "Final Response",
        "icon": "🎉",
        "message": "Send final polished response to the user.",
        "next": "end"
      },
      "end": {
        "title": "End of Flow",
        "icon": "🌈"
      }
    }
  }
};
