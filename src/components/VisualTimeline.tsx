import React from 'react';
import {
  Plus,
  Trash2,
  Clock,
  Camera,
  Users,
  MessageSquare,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from 'lucide-react';
import type { StoryboardProject, StoryboardScene } from '../storyboard/types';


interface VisualTimelineProps {
  project: StoryboardProject;
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  onUpdateScene: (index: number, updatedScene: StoryboardScene) => void;
  onAddScene: () => void;
  onDeleteScene: (index: number) => void;
  onDuplicateScene: (index: number) => void;
  onMoveScene: (index: number, direction: 'left' | 'right') => void;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  project,
  currentSceneIndex,
  onSelectScene,
  onUpdateScene,
  onAddScene,
  onDeleteScene,
  onDuplicateScene,
  onMoveScene,
}) => {
  return (
    <div className="h-44 bg-[#0d0f16] border-t border-[#1f2535] p-3 flex flex-col gap-2 select-none overflow-hidden">
      {/* Timeline Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200">Scene Sequence</span>
          <span className="text-[11px] text-slate-500">
            ({project.scenes.length} scenes • {project.scenes.reduce((acc, s) => acc + s.duration, 0).toFixed(1)}s total)
          </span>
        </div>

        <button
          onClick={onAddScene}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#1a2130] hover:bg-[#252e42] border border-[#2b364d] text-emerald-400 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Scene
        </button>
      </div>

      {/* Horizontal Scrollable Scene Cards */}
      <div className="flex-1 flex gap-3 overflow-x-auto pb-2 items-center">
        {project.scenes.map((scene, index) => {
          const isSelected = index === currentSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(index)}
              className={`flex-shrink-0 w-64 h-full rounded-xl border p-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#182030] border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'bg-[#121622] border-[#222a3b] hover:border-[#2d3850]'
              }`}
            >
              {/* Scene Card Top */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-[#222a3b] text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={scene.title}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateScene(index, { ...scene, title: e.target.value })}
                    className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none focus:bg-[#0a0d14] px-1 rounded truncate max-w-[130px]"
                  />
                </div>

                {/* Duration Control */}
                <div
                  className="flex items-center gap-1 text-[11px] text-slate-400 bg-[#0d1017] px-2 py-0.5 rounded border border-[#202738]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <input
                    type="number"
                    min={0.5}
                    max={15}
                    step={0.1}
                    value={scene.duration}
                    onChange={(e) =>
                      onUpdateScene(index, { ...scene, duration: Math.max(0.5, parseFloat(e.target.value) || 1) })
                    }
                    className="w-10 bg-transparent text-right font-mono focus:outline-none text-slate-200"
                  />
                  <span>s</span>
                </div>
              </div>

              {/* Scene Badges Track */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] my-1">
                {/* Camera Badge */}
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e2738] text-slate-300 border border-[#2a364d]">
                  <Camera className="w-2.5 h-2.5 text-cyan-400" />
                  {scene.cameraPreset}
                </span>

                {/* Actors Count */}
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e2738] text-slate-300 border border-[#2a364d]">
                  <Users className="w-2.5 h-2.5 text-amber-400" />
                  {scene.actors.length} {scene.actors.length === 1 ? 'Actor' : 'Actors'}
                </span>

                {/* Sound Cues */}
                {scene.sounds.length > 0 && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1e2738] text-slate-300 border border-[#2a364d]">
                    <Volume2 className="w-2.5 h-2.5 text-emerald-400" />
                    {scene.sounds.length} SFX
                  </span>
                )}
              </div>

              {/* Caption preview / Card Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-[#1e2536]">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-[130px]">
                  <MessageSquare className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                  <span className="truncate italic">
                    {scene.caption?.text ? `"${scene.caption.text}"` : 'No caption'}
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {index > 0 && (
                    <button
                      onClick={() => onMoveScene(index, 'left')}
                      title="Move Scene Left"
                      className="p-1 rounded hover:bg-[#252f44] text-slate-400 hover:text-slate-200"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  )}

                  {index < project.scenes.length - 1 && (
                    <button
                      onClick={() => onMoveScene(index, 'right')}
                      title="Move Scene Right"
                      className="p-1 rounded hover:bg-[#252f44] text-slate-400 hover:text-slate-200"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={() => onDuplicateScene(index)}
                    title="Duplicate Scene"
                    className="p-1 rounded hover:bg-[#252f44] text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {project.scenes.length > 1 && (
                    <button
                      onClick={() => onDeleteScene(index)}
                      title="Delete Scene"
                      className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
