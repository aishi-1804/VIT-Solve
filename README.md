# VIT Solve 🚀

A mobile app that helps university students post doubts and get answers — enhanced with AI-powered answer evaluation.

## ✨ Features
- Post academic doubts
- Peer-to-peer answering system
- AI-based semantic evaluation of answers
- Structured scoring (relevance, accuracy, completeness)
- FastAPI backend with LangChain pipeline

## 🧠 AI Evaluation
Each answer is evaluated using an LLM based on:
- Conceptual alignment
- Factual accuracy
- Completeness
- Pedagogical value

Returns:
- Relevance score (0–1)
- Label (Relevant / Partially Relevant / etc.)
- Justification

## 🛠 Tech Stack
Frontend: React Native (Expo)  
Backend: FastAPI  
AI: LangChain + Groq  
Database: SQLite  

## 🚀 Status
Backend complete ✅  
Frontend complete ✅  
Integration in progress 🔄  

## 📌 Next Steps
- Connect frontend with backend
- Display AI evaluation in UI
- Rank answers based on quality
