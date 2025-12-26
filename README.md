# Team-67
# 🍽 NGO Food Distribution Automation Platform

A full-stack MERN web application developed during a hackathon to help NGOs automate the *collection of excess food from donors* and distribute it efficiently to *hunger spots, while also managing **volunteers, vehicles, and funding*.

## 🧭 Table of Contents

- [🔍 Overview](#-overview)
- [🚀 Live Demo](#-live-demo)
- [🛠 Tech Stack](#-tech-stack)
- [🧩 Features](#-features)
- [🏗 Architecture](#-architecture)
- [⚙ Installation](#-installation)
- [👥 Team Workflow](#-team-workflow)
- [📦 Folder Structure](#-folder-structure)
- [📈 Future Scope](#-future-scope)

---

## 🔍 Overview

This project aims to digitize and automate the NGO's manual workflow by offering:

- A portal for *donors* to submit excess food
- A dashboard for *volunteers* to manage pickup tasks
- A control panel for *admins* to manage logistics and hunger spots
- A *donation system* to raise funds using Razorpay
- A *tracking system* for vehicles and deliveries

---

## 🚀 Live Demo

> Coming Soon: https://your-project-url.vercel.app/

---

## 🛠 Tech Stack

| Layer        | Technologies Used                                             |
|--------------|---------------------------------------------------------------|
| Frontend     | React.js, React Router, Axios, Tailwind CSS      |
| Backend      | Node.js, Express.js, REST APIs, JWT Auth       |
| Database     | MongoDB Atlas, Mongoose, GeoJSON           |
| Payment      | Razorpay API Integration                                      |
| Tracking     | Mapbox API (Live Vehicle Tracking)                            |
| DevOps       | GitHub, Vercel (Frontend), Render/Heroku (Backend)            |

---

## 🧩 Features

### 👤 Donor Portal
- Submit food details (type, quantity, pickup location)
- Automatically eligible if food serves more than 50 people
- View request status and impact stats

### 🦸 Volunteer Portal
- Register and log availability
- Accept/decline food pickup tasks
- View assigned orders and mark as completed

### 🛠 Admin Dashboard
- Monitor orders, vehicles, volunteers, hunger spots
- Assign vehicles to high-priority orders
- View analytics on orders, funds, volunteer activity

### 💰 Fundraising
- Donors can contribute money via Razorpay (UPI, card, net banking)
- Admins can track total funds and generate receipts
- All donation data is securely stored

### 🗺 Hunger Spot Mapping
- Hunger spots geolocated and tracked
- Admins can view food distribution coverage

---

## 🏗 Architecture Overview
