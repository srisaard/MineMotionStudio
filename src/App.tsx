import React, { useState } from 'react';
import { Header } from './components/Header';
import { Viewport916 } from './components/Viewport916';
import { VisualTimeline } from './components/VisualTimeline';
import { CharacterInspector } from './components/CharacterInspector';
import { StoryboardScriptEditor } from './components/StoryboardScriptEditor';
import { ExportModal } from './components/ExportModal';
import type { StoryboardProject, StoryboardScene, CameraPreset } from './storyboard/types';
import { STORY_TEMPLATES } from './storyboard/presets';

export function App() {
  // Current active project
  const [project, setProject] = useState<StoryboardProject>(
    STORY_TEMPLATES.at_what_cost

  );

  // Studio playback & navigation state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Tab: 'visual' or 'script'
  const [activeTab, setActiveTab] = useState<'visual' | 'script'>('visual');

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Active scene
  const activeScene = project.scenes[currentSceneIndex] || project.scenes[0];

  // Template switch handler
  const handleSelectTemplate = (key: string) => {
    const template = STORY_TEMPLATES[key];
    if (template) {
      setProject(JSON.parse(JSON.stringify(template)));
      setCurrentSceneIndex(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Add a new scene
  const handleAddScene = () => {
    const newScene: StoryboardScene = {
      id: `scene_${Date.now()}`,
      title: `Scene ${project.scenes.length + 1}`,
      duration: 2.5,
      cameraPreset: 'FollowActor',
      actors: [
        {
          id: `steve_${Date.now()}`,
          name: 'Steve',
          type: 'steve',
          position: [0, 0, 0],
          rotationY: 0,
          animation: 'walk',
          heldItem: 'diamond_sword',
        },
      ],
      caption: {
        text: 'New moment in action!',
        style: 'viral_yellow',
        positionY: 'bottom',
      },
      sounds: [{ id: `snd_${Date.now()}`, timeOffset: 0.2, type: 'footstep' }],
    };

    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
    setCurrentSceneIndex(project.scenes.length);
  };

  // Delete scene
  const handleDeleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    const filtered = project.scenes.filter((_, i) => i !== index);
    setProject((prev) => ({ ...prev, scenes: filtered }));
    if (currentSceneIndex >= filtered.length) {
      setCurrentSceneIndex(filtered.length - 1);
    }
  };

  // Duplicate scene
  const handleDuplicateScene = (index: number) => {
    const target = project.scenes[index];
    const cloned: StoryboardScene = {
      ...JSON.parse(JSON.stringify(target)),
      id: `scene_${Date.now()}`,
      title: `${target.title} (Copy)`,
    };
    const newScenes = [...project.scenes];
    newScenes.splice(index + 1, 0, cloned);
    setProject((prev) => ({ ...prev, scenes: newScenes }));
    setCurrentSceneIndex(index + 1);
  };

  // Move scene left/right
  const handleMoveScene = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.scenes.length) return;

    const newScenes = [...project.scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIdx];
    newScenes[targetIdx] = temp;

    setProject((prev) => ({ ...prev, scenes: newScenes }));
    setCurrentSceneIndex(targetIdx);
  };

  // Update specific scene
  const handleUpdateScene = (index: number, updated: StoryboardScene) => {
    const newScenes = [...project.scenes];
    newScenes[index] = updated;
    setProject((prev) => ({ ...prev, scenes: newScenes }));
  };

  // Quick camera preset change from Viewport
  const handleCameraPresetChange = (preset: CameraPreset) => {
    handleUpdateScene(currentSceneIndex, {
      ...activeScene,
      cameraPreset: preset,
    });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#090b10] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <Header
        onSelectTemplate={handleSelectTemplate}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddScene={handleAddScene}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Central 9:16 Vertical 3D Viewport */}
        <Viewport916
          project={project}
          currentSceneIndex={currentSceneIndex}
          onSceneChange={setCurrentSceneIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          onCameraPresetChange={handleCameraPresetChange}
        />

        {/* Right Panel: either Visual Inspector or Storyboard Script Editor */}
        {activeTab === 'visual' ? (
          <CharacterInspector
            scene={activeScene}
            onUpdateScene={(updated) => handleUpdateScene(currentSceneIndex, updated)}
          />
        ) : (
          <div className="w-[480px] h-full flex flex-col">
            <StoryboardScriptEditor
              project={project}
              onUpdateProject={(newProj) => {
                setProject(newProj);
                setCurrentSceneIndex(0);
                setCurrentTime(0);
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Scene Sequence Timeline */}
      <VisualTimeline
        project={project}
        currentSceneIndex={currentSceneIndex}
        onSelectScene={(idx) => {
          setCurrentSceneIndex(idx);
          // Calculate start timestamp of this scene
          let start = 0;
          for (let i = 0; i < idx; i++) {
            start += project.scenes[i].duration;
          }
          setCurrentTime(start);
        }}
        onUpdateScene={handleUpdateScene}
        onAddScene={handleAddScene}
        onDeleteScene={handleDeleteScene}
        onDuplicateScene={handleDuplicateScene}
        onMoveScene={handleMoveScene}
      />

      {/* 9:16 High-Res Video Export Modal */}
      <ExportModal
        project={project}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

export default App;
