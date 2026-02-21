# Smart Botanical Assistant

> An interactive web platform for plant identification, garden planning, conservation awareness, and botanical education.

## Overview

**Problem Statement:**
Plant enthusiasts and gardeners struggle to identify species, plan seasonal gardens, and stay informed about endangered plants. Educational resources are often scattered across multiple platforms, lacking gamification to maintain engagement.

**Solution:**
Smart Botanical Assistant consolidates plant identification, seasonal garden planning, interactive quizzes, and conservation tracking into a single gamified platform. Users earn points and badges while learning about botany and contributing to environmental awareness.

---

## Tech Stack

### Frontend
- React.js 
- Tailwind CSS 
- Vite 
- Lucide React (Icon library)

### Backend & APIs
- Trefle Botanical API 
- Wikipedia API 

### Data Storage
- Browser LocalStorage (User authentication, progress, quiz scores, pledges)

---

## Key Features

- **Plant Identification System:** Search and identify plant species with scientific names, families, discovery years, and habitat information
- **Seasonal Garden Planner:** Plan gardens based on spring, summer, fall, or winter with recommended plants and expert gardening tips
- **Endangered Species Tracker:** Browse critically endangered plants, learn about threats, and make conservation pledges
- **Dark Mode:** Seamless theme switching with persistent user preference
- **User Authentication:** Secure login/registration system with LocalStorage-based session management

---

## User Roles

- **General User:** Access all features after authentication (identification, planning, quizzes, tracking)
- **Guest User:** Browse plant identification and view information without earning points or saving progress

---

## System Architecture
```
User Interface (React Components)
        ↓
State Management (React Context API )
        ↓
External API Layer (Trefle API, Wikipedia API)
        ↓
LocalStorage (User Data Persistence)
```

**Data Flow:**
1. User interacts with React components (search plants, take quiz, add garden items)
2. State updates trigger API calls to Trefle or Wikipedia for plant data
3. User actions (login, quiz completion, pledges) are saved to browser LocalStorage
4. On page load, LocalStorage data rehydrates user session and progress

---

## Screenshots & Demo

**Live Demo:** https://abhi930941.github.io/botanical-app

**Repository:** https://github.com/Abhi930941/botanical-app

**Screenshots:**
<table>
  <tr>
    <td><img src="screenshots/Screenshot 2026-02-22 001634.png" alt="Home" /></td>
    <td><img src="screenshots/Screenshot 2026-02-22 002211.png" alt="Identify Page" /></td>
    <td><img src="screenshots/Screenshot 2026-02-22 002418.png" alt="After Searching " /></td>
  </tr>
  <tr>
    <td align="center">Home</td>
    <td align="center">Identify Page</td>
    <td align="center">After Searching</td>
  </tr>

  <tr>
    <td><img src="screenshots/Screenshot 2026-02-22 002644.png" alt="Planner Page " /></td>
    <td><img src="screenshots/Screenshot 2026-02-22 002733.png" alt=" Quiz Page" /></td>
    <td><img src="screenshots/Screenshot 2026-02-22 002815.png" alt="Tracker Page" /></td>
  </tr>
  <tr>
    <td align="center">Planner Page</td>
    <td align="center">Quiz Page</td>
    <td align="center">Tracker Page</td>
  </tr>
</table>

---

## Why This Project Matters

Combines education, planning, and conservation in one platform—addressing the gap between botanical knowledge and practical gardening while raising endangered species awareness.

---

## Contact

**Developer:** Abhishek Sahani

**LinkedIn:** [linkedin.com/in/abhishek-sahani-447851341](https://www.linkedin.com/in/abhishek-sahani-447851341)

**Email:** abhishek242443@gmail.com

**Portfolio:** [abhi930941.github.io/Portfolio](https://abhi930941.github.io/Portfolio/)

---
