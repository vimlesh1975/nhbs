# NHBS - Newsroom Headlines & Graphics Playout Studio

A professional, high-performance Next.js application designed as a live **Newsroom Control System (NRCS) Graphics Client** for **CasparCG Broadcast Server** connected to a **MySQL NRCS Database (`nrcsnew`)**.

Built for television broadcast operators, newsroom directors, and MCR engineers, this application provides instant database-driven graphics playout, multi-layer routing, 2-line lower third graphics, and real-time live AMCP Mixer positioning & scaling controls.

---

## 🌟 Key Features & Architecture

### 📰 1. 3-Column Newsroom Data Explorer
- **Broadcast Date & Bulletin Selector**: Easily select broadcast dates and news bulletins from the MySQL database.
- **HEADLINES (Layer 2)**:
  - Queries records with `SlugName = 'headlines'`.
  - Routes playout directly to **Channel 1 — Layer 2 (`1-2`)**.
  - Template: `http://127.0.0.1:3000/templates/lower-third` (Custom transparent overlay).
- **ONELINER (Layer 3)**:
  - Queries records with `SlugName = 'oneliner'`.
  - Routes playout directly to **Channel 1 — Layer 3 (`1-3`)**.
  - Template: `http://127.0.0.1:3000/templates/oneliner` (Dark glassmorphism background strip bar).
- **TWOLINER (Layer 4)**:
  - Queries records with `SlugName = 'twoliner'`.
  - Automatically parses `Name $$$$ Designation` format into stacked Line 1 (Name) & Line 2 (Designation) editable fields.
  - Routes playout directly to **Channel 1 — Layer 4 (`1-4`)**.
  - Template: `http://127.0.0.1:3000/templates/twoliner` (2-line animated lower third strip).

---

### 🎛️ 2. Real-Time Live AMCP Mixer Controls
- **4-DOF Layer Manipulation** for Layer 2, Layer 3, and Layer 4:
  - **X**: Horizontal position offset (`0.01` step).
  - **Y**: Vertical position offset (`0.01` step).
  - **SX**: Horizontal Scale Factor (`0.05` step, default `1.0`).
  - **SY**: Vertical Scale Factor (`0.05` step, default `1.0`).
- **Live Real-Time Execution**: Adjusting numeric values automatically dispatches AMCP commands live on air:
  ```amcp
  MIXER 1-2 FILL 0.05 -0.02 0.95 0.95
  ```
- **RST Button**: Instantly resets positioning and issues `MIXER 1-X CLEAR`.
- **Persistent Settings**: All Mixer parameters auto-save to browser `localStorage` and persist across page reloads.

---

### 📡 3. Multi-Layer Playout Routing & Protection
- **Multi-Layer Matrix Badges**: Live visual indicators showing **ON AIR** state for **HEADLINES (L2)**, **ONELINER (L3)**, and **TWOLINER (L4)**.
- **App-Scoped Clear Action**:
  - **CLEAR APP LAYERS (L2, L3, L4)** stops and clears **ONLY** layers 2, 3, and 4 used by this client application.
  - External channel media (video clips, channel logos, tickers on other layers) remain 100% active and untouched.

---

### 🎨 4. Broadcast Alpha Fill & Key HTML Templates
- Fully transparent HTML alpha canvas (`1920x1080`) optimized for CasparCG SDI / NDI fill & key output.
- Smooth CSS animations, clean typography, glassmorphism aesthetics, and native CasparCG HTML Template API (`window.play()`, `window.stop()`, `window.update()`).

---

## 🛠️ Hardware & Software Requirements

- **Node.js**: v18.0 or higher
- **CasparCG Server**: 2.3.x or 2.4.x (running HTML Producer enabled)
- **MySQL Database**: v8.0 or MariaDB (Database: `nrcsnew`, Table: `Script`)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vimlesh1975/nhbs.git
cd nhbs
npm install
```

### 2. Configure Environment Variables (`.env.local`)
Create `.env.local` in the project root:
```env
# CasparCG Server Configuration
CASPARCG_HOST=127.0.0.1
CASPARCG_PORT=5250

# MySQL NRCS Database Credentials
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=itmaint
DB_PASSWORD=itddkchn
DB_NAME=nrcsnew
```

### 3. Database Schema Overview
The system queries the `Script` table:
```sql
SELECT Script FROM Script 
WHERE bulletinname = '0830' 
  AND LOWER(SlugName) = LOWER('headlines') 
  AND DATE(bulletindate) = '2026-08-22' 
ORDER BY id DESC LIMIT 50;
```
For 2-line graphics, format text in MySQL with the `$$$$` delimiter:
```
Dr. Sarah Jenkins $$$$ Chief AI Scientist
```

### 4. Start Next.js Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

## 📡 CasparCG AMCP Command Syntax Reference

This client communicates over TCP socket (`5250`) using standard AMCP commands:

```amcp
# Headlines (Layer 2)
CG 1-2 ADD 1 "http://127.0.0.1:3000/templates/lower-third?f0=Headline%20Text" 1 "{\"f0\":\"Headline Text\"}"
CG 1-2 STOP 1

# Oneliner (Layer 3)
CG 1-3 ADD 1 "http://127.0.0.1:3000/templates/oneliner?f0=Oneliner%20Text" 1 "{\"f0\":\"Oneliner Text\"}"
CG 1-3 STOP 1

# Twoliner (Layer 4)
CG 1-4 ADD 1 "http://127.0.0.1:3000/templates/twoliner?f0=Name&f1=Designation" 1 "{\"f0\":\"Name\",\"f1\":\"Designation\"}"
CG 1-4 STOP 1

# Real-Time Layer Mixer Positioning
MIXER 1-2 FILL 0.05 0 0.9 0.9
MIXER 1-2 CLEAR
```

---

## 📁 Repository Structure

```
nhbs/
├── app/
│   ├── api/
│   │   ├── casparcg/        # AMCP TCP socket bridge route handler
│   │   └── db/              # MySQL script and bulletin query APIs
│   ├── templates/
│   │   ├── lower-third/     # Headlines single-line overlay template
│   │   ├── oneliner/        # Dark glassmorphism strip template
│   │   └── twoliner/        # 2-line Name & Designation graphic template
│   ├── globals.css          # Transparent html/body broadcast styles
│   ├── layout.js            # Root layout
│   └── page.js              # Master Playout Controller
├── components/
│   ├── ChannelMatrix.jsx    # Live ON AIR layer status badge matrix
│   ├── DatabaseExplorer.jsx # 3-Column Newsroom Deck & Mixer controls
│   ├── Header.jsx           # CasparCG TCP connection indicator
│   └── AmcpConsole.jsx      # Real-time AMCP telemetry command log
├── lib/
│   ├── casparcg.js          # Net Socket TCP connection helper
│   └── db.js                # mysql2 connection pool
├── package.json
└── README.md
```

---

## 📜 License

Distributed under the MIT License.
