import { Film, Download, Layers, PlayCircle, BookOpen } from 'lucide-react';


interface HeaderProps {
  onSelectTemplate: (templateKey: string) => void;
  onOpenExport: () => void;
  activeTab: 'visual' | 'script';
  setActiveTab: (tab: 'visual' | 'script') => void;
  onAddScene: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTemplate,
  onOpenExport,
  activeTab,
  setActiveTab,
  onAddScene,
}) => {
  return (
    <header className="h-14 bg-[#12151e] border-b border-[#252b3b] px-4 flex items-center justify-between select-none z-20">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
          <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              MineMotion <span className="text-emerald-400 font-black">Studio</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              9:16 Shorts 3D
            </span>
          </div>
        </div>
      </div>

      {/* Center Switch: Visual Timeline vs Storyboard Script */}
      <div className="flex items-center bg-[#0d0f15] p-1 rounded-lg border border-[#252b3b]">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'visual'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Visual Studio
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'script'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Storyboard Script
        </button>
      </div>

      {/* Right Actions: Templates & Export */}
      <div className="flex items-center gap-2.5">
        {/* Template Quick Loader */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 hidden lg:inline">Templates:</span>
          <select
            defaultValue="emerald_heist"
            onChange={(e) => onSelectTemplate(e.target.value)}
            className="bg-[#1a1f2c] border border-[#2e374d] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 hover:bg-[#202738] cursor-pointer"
          >
            <option value="emerald_heist">💎 The Emerald Heist (Player Stole Item, 20s)</option>
            <option value="at_what_cost">💔 You Won, But at What Cost? (Cash)</option>
            <option value="villagers_crazy">🧙‍♂️ Minecraft Villagers are CRAZY (JahCub)</option>
            <option value="dig_million_times">⛏️ ขุด 1,000,000 ครั้ง (MTR Mysterios)</option>
            <option value="no_red_line">🔴 ห้ามโดนเส้นสีแดง! (MTR Mysterios)</option>
            <option value="creeper_jumpscare">💥 Creeper Jump Scare (8s)</option>
          </select>
        </div>

        <button
          onClick={onAddScene}
          className="hidden sm:flex items-center gap-1.5 bg-[#1e2536] hover:bg-[#283147] text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#313b52] transition-colors"
        >
          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
          + Add Scene
        </button>

        {/* Primary Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-emerald-950/50 hover:shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Export 9:16 Video</span>
        </button>
      </div>
    </header>
  );
};
