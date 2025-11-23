# CRISP – CBC Career Navigator
### *AI-powered pathway & career guidance for CBC learners (Grades 1–12).*

---

## 🚀 Overview
**CRISP** is an AI-driven platform designed for the **Kenyan Competency-Based Curriculum (CBC)**.  
It helps learners:

- Discover interests (Grades 1–6)
- Select the right CBC pathway (Grades 7–9)
- Plan STEM-related careers (Grades 10–12)

The system uses **Google Genkit**, **Agent Development Kit (ADK)**, and **Vertex AI (Gemini)** to generate personalized learning and career guidance.

---

## 🎯 Features

### **CRISP Kids (Grades 1–6)**
- Visual interest assessment  
- CBC-aligned STEM activities  
- Early strengths discovery  

### **JSS Pathways (Grades 7–9)**
- CBC pathway recommendations  
- Strength profiling  
- Mini project suggestions  

### **Career Planner (Grades 10–12)**
- STEM career matching  
- Required subjects  
- Step-by-step learning roadmap  

### **CRISP AI Assistant**
Powered by **Google ADK**, offering:
- CBC Q&A  
- Career guidance  
- General learning support  

---

## 🧠 Tech Stack
- **Google Vertex AI** – model inference  
- **Google AI Studio** – prompting  
- **Agent Development Kit (ADK)** – AI assistant  
- **Genkit** – workflow orchestration  
- **Firebase** – hosting, auth, Firestore  
- **React / Next.js** – frontend  

---

## 🏗️ Architecture
**Frontend (React/Next.js)**

  ↓
  
Firebase Hosting & Functions

↓

Genkit Flow → Vertex AI (Gemini)

↓

Structured Output (pathway, plan, activity)


---

## 📦 Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/crisp-cbc-navigator.git
cd crisp-cbc-navigator
```
### 2. Install dependencies
```
npm install
```

### 3. Add environment variables

```
Create a .env.local file:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GOOGLE_AI_API_KEY=
```

### 4. Run the project
```
npm run dev
```
## 🎥 Demo Video
[Watch the Demo Video](https://drive.google.com/file/d/1Zg9dnk9NRcOWgNMy1-yu20xp-JcdyUgn/view?usp=sharing)

---

## 📄 License
MIT License.

---

## 👤 Author
**Crispin Oigara**  
Build With AI – Unstacked Labs




