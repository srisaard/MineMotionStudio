# MineMotion Studio 🎬⛏️

> **A web-based 3D Minecraft animation studio powered by Three.js tailored for 9:16 vertical YouTube Shorts, TikTok, and Instagram Reels.**

![MineMotion Studio](https://img.shields.io/badge/Three.js-r183-black?style=flat-square&logo=three.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.x-purple?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Export](https://img.shields.io/badge/Export-1080x1920%2060FPS-emerald?style=flat-square)

---

## ✨ Features

- **📝 Storyboard Screenplay Scripting**:
  - Type or paste natural storyboards/screenplays (e.g. `[0.0s - 2.5s] Steve walks. Camera: LowAngleHero. Caption: "Heading back home"`) and click **"Compile Script to 3D"**.
  - Includes pre-built viral Short templates: *Creeper Jump Scare (8s)*, *Found Diamonds! (7s)*, and *Midnight Zombie Siege (8s)*.

- **🎮 Full 3D Minecraft Engine (Three.js)**:
  - **Procedural Character Rigs**: Steve, Alex (3px slim arms), Zombie, and Creeper with authentic 1.8+ dual-layer geometry (3D hats, jackets, sleeves, and pants).
  - **Custom Skin Uploader**: Drag & drop any standard 64x64 Minecraft skin PNG (from NameMC, Skindex, or official Minecraft launcher).
  - **3D Weapons & Props**: Diamond Sword, Iron Sword, Diamond Pickaxe, Bow, Torch with dynamic lighting, and TNT blocks.
  - **Animation Library**: Walk, sprint, sword slash combo, jump, sneak, hurt (Minecraft red flash), fall, victory cheer, and Creeper detonation swell.
  - **Voxel World & Atmosphere**: Procedural grass/dirt terrain with cobblestone path, oak trees, torches, drifting cubic clouds, dynamic sun & moon, and soft shadows.

- **🎥 Cinematic 9:16 Mobile Camera Director**:
  - 55° vertical FOV optimized for mobile portrait viewports.
  - Camera presets: `FollowActor`, `LowAngleHero`, `CloseUpFace`, `Orbit`, `WideReveal`, `TopDownIsometric`.
  - **Screen Shake Effect**: Trauma-based camera shake for explosion and sword clash feedback.
  - **Reels & Shorts UI Safe-Zone Guides**: Overlay guide showing where YouTube Shorts / Instagram Reels UI buttons and titles sit.

- **💬 Viral Subtitles & Web Audio Engine**:
  - Animated caption presets: *Viral Yellow* (Impact bold yellow with black outline), *Minecraft Pixel*, *Neon Punch*, and *Clean Pill*.
  - Procedural Web Audio API sound effects: *sword_slash*, *creeper_hiss*, *explosion*, *hit*, *footstep*, and *ding*.

- **📦 Deterministic 9:16 Video Export**:
  - Frame-by-frame rendering pipeline via `mp4-muxer`, `webm-muxer`, and the browser's native `WebCodecs API` (`VideoEncoder`).
  - Supports **1080x1920 (Full HD Vertical)** and **720x1280** at **60 FPS** or **30 FPS**.
  - Exports directly to **MP4 (H.264)** or **WebM (VP9)** with baked captions and synced audio.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/srisaard/MineMotionStudio.git

# Navigate into project directory
cd MineMotionStudio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your web browser.

---

## 🛠️ Project Structure

```
src/
├── components/               # React UI components
│   ├── Header.tsx            # Navigation header & template presets
│   ├── Viewport916.tsx       # Interactive 9:16 vertical Three.js preview
│   ├── VisualTimeline.tsx    # Multi-scene sequencer & duration controls
│   ├── CharacterInspector.tsx# Character selector, skin uploader, props & poses
│   ├── StoryboardScriptEditor.tsx # Screenplay text editor & parser
│   └── ExportModal.tsx       # 1080x1920 60FPS video exporter modal
├── engine/                   # Three.js 3D graphics & animation engine
│   ├── MinecraftRig.ts       # Rigged dual-layer humanoid & Creeper meshes
│   ├── MinecraftSkinTextures.ts # 64x64 skin textures & custom PNG loader
│   ├── AnimationLibrary.ts   # Deterministic skeletal animation cycles
│   ├── CameraDirector.ts     # 9:16 cinematic camera presets & shake
│   ├── ItemLibrary.ts        # 3D blocky weapons and held items
│   ├── ParticleSystem.ts     # Critical hit stars & explosion smoke
│   └── VoxelWorld.ts         # Terrain, trees, torches, and cubic clouds
├── export/
│   └── VideoExporter.ts      # WebCodecs + mp4-muxer 9:16 video renderer
├── storyboard/
│   ├── types.ts              # Data models for scenes, actors, and timelines
│   ├── presets.ts            # Pre-made viral story templates
│   ├── ScriptParser.ts       # Screenplay script-to-3D parser
│   └── SoundFX.ts            # Web Audio API sound synthesizer
├── App.tsx                   # Main studio container
└── main.tsx                  # Application entry point
```

---

## 📜 License
MIT License. Built for creators.
