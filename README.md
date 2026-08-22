# CasparCG Client Next.js App & MySQL Graphics Playout Controller

A modern, high-performance Next.js application that serves as a professional **CasparCG Broadcast Client** connected to a **MySQL Database**. 

It allows broadcast operators to query graphics records from MySQL, map fields onto CasparCG HTML graphics templates, and trigger live playout (ADD, PLAY, UPDATE, STOP, CLEAR) over CasparCG's **AMCP (Advanced Media Control Protocol) TCP Socket (Port 5250)**.

---

## 🌟 Key Features

1. **CasparCG AMCP TCP Socket Controller**:
   - Sends real-time TCP socket commands to CasparCG Server (`127.0.0.1:5250`).
   - Supports `CG ADD`, `CG PLAY`, `CG UPDATE`, `CG STOP`, `CG REMOVE`, `CLEAR CHANNEL`, and raw AMCP command execution.
   - Built-in TCP telemetry monitor with auto-fallback to interactive simulation mode when CasparCG Server is offline.

2. **MySQL Database Data Explorer**:
   - Queries tables (`lower_thirds`, `news_tickers`, `breaking_news`, `scoreboards`).
   - Built-in search, filtering, and 1-click **"Parse & Cue"** field mapping.
   - Includes automatic mock database fallback if live MySQL is not connected.

3. **CasparCG HTML Graphics Templates Included**:
   - `/templates/lower-third` — Glassmorphism name & title lower third graphic.
   - `/templates/ticker` — Bottom news ticker overlay strip.
   - `/templates/breaking-news` — Red flashing alert banner.
   - `/templates/scoreboard` — TV sports scorebug.
   - Standard CasparCG HTML JS functions implemented (`window.play()`, `window.stop()`, `window.update(data)`).

4. **Master Control Room UI**:
   - Broadcast channel router (Channels 1-4, Layers 1-30).
   - Real-time monospaced AMCP terminal response logger.
   - 16:9 interactive web preview modal.

---

## 🛠️ Quick Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (`.env.local`)
Create `.env.local` or edit existing configuration:
```env
# CasparCG Server IP & AMCP TCP Port
CASPARCG_HOST=127.0.0.1
CASPARCG_PORT=5250

# MySQL Database Settings
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=casparcg_db
```

### 3. Import MySQL Database Schema
Run the provided `schema.sql` script in MySQL:
```bash
mysql -u root -p < schema.sql
```

### 4. Start Next.js Client
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📺 Connecting to CasparCG Server

In CasparCG Server `casparcg.config`, add an HTML consumer or play templates directly via AMCP:

### Playing HTML Templates in CasparCG:
```amcp
CG 1-1 ADD 1 "http://localhost:3000/templates/lower-third" 1 "{\"f0\":\"John Doe\",\"f1\":\"Presenter\"}"
CG 1-1 PLAY 1
CG 1-1 STOP 1
```

Or click the **PLAY ON AIR** button in the client interface to send the commands automatically!
