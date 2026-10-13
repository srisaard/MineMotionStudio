import React, { useState, useEffect } from 'react';
import { Play, Sparkles, HelpCircle, Check, Copy } from 'lucide-react';
import type { StoryboardProject } from '../storyboard/types';

import { ScriptParser } from '../storyboard/ScriptParser';

interface StoryboardScriptEditorProps {
  project: StoryboardProject;
  onUpdateProject: (newProject: StoryboardProject) => void;
}

export const StoryboardScriptEditor: React.FC<StoryboardScriptEditorProps> = ({
  project,
  onUpdateProject,
}) => {
  const [scriptText, setScriptText] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync script text whenever project updates from outside
  useEffect(() => {
    setScriptText(ScriptParser.projectToScript(project));
  }, [project]);

  const handleCompile = () => {
    try {
      const parsedProject = ScriptParser.scriptToProject(scriptText);
      onUpdateProject(parsedProject);
      setStatusMessage('Compiled successfully! 3D animation updated.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      console.error(e);
      setStatusMessage('Error parsing script. Please check formatting.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0e1118] border-l border-[#202738] p-4 text-xs overflow-hidden select-none">
      {/* Script Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#202738]">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Storyboard Screenplay Script
          </h2>
          <p className="text-[11px] text-slate-400">
            Write or edit your story in natural text. Click Compile to turn text into 3D scenes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#181e2b] hover:bg-[#222a3d] border border-[#2c364c] text-slate-300 font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleCompile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Compile Script to 3D
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="my-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-center">
          {statusMessage}
        </div>
      )}

      {/* Script Code / Textarea */}
      <div className="flex-1 my-3 flex flex-col min-h-0 bg-[#090b10] rounded-xl border border-[#232938] overflow-hidden">
        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          spellCheck={false}
          className="w-full flex-1 p-3 bg-transparent text-slate-200 font-mono text-[12px] leading-relaxed resize-none focus:outline-none"
          placeholder={`# My Minecraft Short

[0.0s - 2.5s] Steve Walks in Forest
Camera: FollowActor
Actor: Steve (steve) -> anim: walk holding torch at [0, 0, 1]
Caption [viral_yellow]: "Heading home after mining..."
Sounds: footstep

[2.5s - 4.5s] Creeper Sneak
Camera: LowAngleHero
Actor: Creeper (creeper) -> anim: creeper_walk at [0, 0, -1]
Caption [neon_punch]: "WHAT IS THAT SOUND?! 💀"
Sounds: creeper_hiss`}
        />
      </div>

      {/* Syntax Guide / Quick Reference */}
      <div className="bg-[#141824] rounded-xl p-3 border border-[#232938] text-[11px] text-slate-400 space-y-1.5">
        <div className="font-semibold text-slate-200 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          Script Format Quick Guide:
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-emerald-400 font-bold">Timestamps:</span> [0.0s - 2.5s] Scene Name
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Cameras:</span> FollowActor, LowAngleHero, CloseUpFace, Orbit, WideReveal
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Actors:</span> Steve, Alex, Zombie, Creeper
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Actions:</span> walk, run, sword_slash, jump, sneak, hurt, victory
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Weapons:</span> diamond_sword, bow, pickaxe, torch, tnt
          </div>
          <div>
            <span className="text-emerald-400 font-bold">Captions:</span> Caption [viral_yellow]: "Text here"
          </div>
        </div>
      </div>
    </div>
  );
};
