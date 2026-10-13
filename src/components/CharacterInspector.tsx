import React, { useRef, useState } from 'react';
import {
  Upload,
  User,
  Sword,
  Activity,
  Compass,
  MessageSquare,
  Volume2,
  Plus,
  Camera,
} from 'lucide-react';
import type {
  StoryboardScene,
  ActorState,
  CharacterType,
  HeldItemType,
  AnimationType,
  CameraPreset,
  CaptionStyle,
  SoundCue,
} from '../storyboard/types';


interface CharacterInspectorProps {
  scene: StoryboardScene;
  onUpdateScene: (updatedScene: StoryboardScene) => void;
}

export const CharacterInspector: React.FC<CharacterInspectorProps> = ({
  scene,
  onUpdateScene,
}) => {
  const [selectedActorId, setSelectedActorId] = useState<string>(
    scene.actors[0]?.id || ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedActor =
    scene.actors.find((a) => a.id === selectedActorId) || scene.actors[0];

  const updateActor = (patch: Partial<ActorState>) => {
    if (!selectedActor) return;
    const updatedActors = scene.actors.map((a) =>
      a.id === selectedActor.id ? { ...a, ...patch } : a
    );
    onUpdateScene({ ...scene, actors: updatedActors });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateActor({ customSkinUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const addActor = () => {
    const newActor: ActorState = {
      id: `actor_${Date.now()}`,
      name: 'Steve',
      type: 'steve',
      position: [1.2, 0, 0],
      rotationY: 0,
      animation: 'idle',
      heldItem: 'none',
    };
    onUpdateScene({ ...scene, actors: [...scene.actors, newActor] });
    setSelectedActorId(newActor.id);
  };

  const removeActor = (actorId: string) => {
    if (scene.actors.length <= 1) return;
    const filtered = scene.actors.filter((a) => a.id !== actorId);
    onUpdateScene({ ...scene, actors: filtered });
    setSelectedActorId(filtered[0]?.id || '');
  };

  const addSoundCue = (type: any) => {
    const newSound: SoundCue = {
      id: `snd_${Date.now()}`,
      timeOffset: 0.2,
      type,
    };
    onUpdateScene({ ...scene, sounds: [...scene.sounds, newSound] });
  };

  const removeSoundCue = (id: string) => {
    onUpdateScene({
      ...scene,
      sounds: scene.sounds.filter((s) => s.id !== id),
    });
  };

  return (
    <div className="w-80 bg-[#10131c] border-l border-[#202738] p-3 text-xs flex flex-col gap-3 select-none overflow-y-auto">
      {/* 1. Actors Section */}
      <div className="bg-[#151a26] rounded-xl p-3 border border-[#222a3a] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            Scene Actors ({scene.actors.length})
          </span>

          <button
            onClick={addActor}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1e2536] hover:bg-[#283248] text-emerald-400 font-semibold text-[11px] border border-[#2f3b52] cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Add Actor
          </button>
        </div>

        {/* Actor Tabs Selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {scene.actors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => setSelectedActorId(actor.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                actor.id === selectedActor?.id
                  ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300'
                  : 'bg-[#1b2230] border-[#293448] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{actor.name}</span>
              {scene.actors.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeActor(actor.id);
                  }}
                  className="hover:text-rose-400 ml-1 text-slate-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedActor && (
          <div className="space-y-2.5 pt-2 border-t border-[#202838]">
            {/* Character Type Preset */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Character Model</label>
              <select
                value={selectedActor.type}
                onChange={(e) => {
                  const type = e.target.value as CharacterType;
                  updateActor({
                    type,
                    name: type.charAt(0).toUpperCase() + type.slice(1),
                    animation: type === 'creeper' ? 'creeper_walk' : 'walk',
                  });
                }}
                className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="steve">Steve (Standard 4px arms)</option>
                <option value="alex">Alex (Slim 3px arms)</option>
                <option value="zombie">Zombie (Undead)</option>
                <option value="creeper">Creeper (Voxel Mob)</option>
                <option value="villager">Villager (Long Nose & Robe 🧙‍♂️)</option>
              </select>
            </div>

            {/* Custom Minecraft Skin Upload */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Custom Skin (.png)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-dashed border-[#34405a] hover:border-emerald-500 bg-[#161c29] hover:bg-[#1c2436] text-slate-300 font-medium transition-colors cursor-pointer text-[11px]"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                {selectedActor.customSkinUrl ? '✓ Custom Skin Loaded (Change)' : 'Upload Skin (.png)'}
              </button>
            </div>

            {/* Animation Pose */}
            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                <Activity className="w-3 h-3 text-emerald-400" /> Animation Action
              </label>
              <select
                value={selectedActor.animation}
                onChange={(e) => updateActor({ animation: e.target.value as AnimationType })}
                className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                {selectedActor.type === 'creeper' ? (
                  <>
                    <option value="idle">Creeper Idle</option>
                    <option value="creeper_walk">Creeper Walk</option>
                    <option value="creeper_ignite">Creeper Ignite / Swell (Tssss!)</option>
                  </>
                ) : (
                  <>
                    <option value="idle">Idle Breathing</option>
                    <option value="walk">Walk Cycle</option>
                    <option value="run">Sprint / Run</option>
                    <option value="sword_slash">Sword Slash & Combo</option>
                    <option value="dig_frantic">⛏️ Frantic Mining (MTR Style)</option>
                    <option value="parkour_leap">🚀 Parkour Leap (MTR Style)</option>
                    <option value="sad_defeat">💔 Sad Defeat / At What Cost (Cash)</option>
                    <option value="villager_talk">🧙‍♂️ Villager Hrmm Nod (JahCub)</option>
                    <option value="villager_panic">😱 Villager Panic Run (JahCub)</option>
                    <option value="shocked">🤯 Meme Shocked Reaction</option>
                    <option value="jump">Jump Parabolic</option>
                    <option value="sneak">Sneak / Crouch</option>
                    <option value="hurt">Damage / Knockback (Red Flash)</option>
                    <option value="fall">Fall & Flail</option>
                    <option value="victory">Victory Dance & Cheer</option>
                  </>
                )}
              </select>
            </div>

            {/* Held Weapon / Item */}
            {selectedActor.type !== 'creeper' && (
              <div>
                <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
                  <Sword className="w-3 h-3 text-emerald-400" /> Held Item / Weapon
                </label>
                <select
                  value={selectedActor.heldItem}
                  onChange={(e) => updateActor({ heldItem: e.target.value as HeldItemType })}
                  className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                >
                  <option value="none">None (Empty Hands)</option>
                  <option value="diamond_sword">Diamond Sword ⚔️</option>
                  <option value="iron_sword">Iron Sword 🗡️</option>
                  <option value="diamond_pickaxe">Diamond Pickaxe ⛏️</option>
                  <option value="emerald">Emerald Gem 🟢</option>
                  <option value="dirt_block">Dirt Block 🟫</option>
                  <option value="bow">Bow 🏹</option>
                  <option value="torch">Torch (Glow Light) 🕯️</option>
                  <option value="tnt">TNT Block 🧨</option>
                </select>
              </div>
            )}

            {/* Transform Controls (X, Z, Rotation) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400" /> Position & Facing
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <div>
                  <span className="text-slate-500 text-[10px]">X:</span>
                  <input
                    type="number"
                    step={0.2}
                    value={selectedActor.position[0]}
                    onChange={(e) =>
                      updateActor({
                        position: [parseFloat(e.target.value) || 0, selectedActor.position[1], selectedActor.position[2]],
                      })
                    }
                    className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 px-1.5 py-1 rounded focus:outline-none text-center"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Z:</span>
                  <input
                    type="number"
                    step={0.2}
                    value={selectedActor.position[2]}
                    onChange={(e) =>
                      updateActor({
                        position: [selectedActor.position[0], selectedActor.position[1], parseFloat(e.target.value) || 0],
                      })
                    }
                    className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 px-1.5 py-1 rounded focus:outline-none text-center"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Facing:</span>
                  <input
                    type="number"
                    step={45}
                    value={Math.round((selectedActor.rotationY * 180) / Math.PI)}
                    onChange={(e) =>
                      updateActor({
                        rotationY: ((parseFloat(e.target.value) || 0) * Math.PI) / 180,
                      })
                    }
                    className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 px-1.5 py-1 rounded focus:outline-none text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Captions & Shorts Subtitle Section */}
      <div className="bg-[#151a26] rounded-xl p-3 border border-[#222a3a] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Shorts Subtitles
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={scene.caption?.enabled !== false}
              onChange={(e) =>
                onUpdateScene({
                  ...scene,
                  caption: {
                    text: scene.caption?.text || '',
                    style: scene.caption?.style || 'viral_yellow',
                    positionY: scene.caption?.positionY || 'bottom',
                    enabled: e.target.checked,
                  },
                })
              }
              className="rounded bg-[#1b2131] border-[#2d374d] text-amber-500 focus:ring-0"
            />
            <span className="text-[10px] text-slate-300 font-semibold">
              {scene.caption?.enabled !== false ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        <div className={scene.caption?.enabled === false ? 'opacity-40 pointer-events-none' : ''}>
          <input
            type="text"
            value={scene.caption?.text || ''}
            onChange={(e) =>
              onUpdateScene({
                ...scene,
                caption: {
                  text: e.target.value,
                  style: scene.caption?.style || 'viral_yellow',
                  positionY: scene.caption?.positionY || 'bottom',
                  enabled: scene.caption?.enabled !== false,
                },
              })
            }
            placeholder="Type viral caption..."
            className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Style</label>
              <select
                value={scene.caption?.style || 'viral_yellow'}
                onChange={(e) =>
                  onUpdateScene({
                    ...scene,
                    caption: {
                      text: scene.caption?.text || '',
                      style: e.target.value as CaptionStyle,
                      positionY: scene.caption?.positionY || 'bottom',
                      enabled: scene.caption?.enabled !== false,
                    },
                  })
                }
                className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="viral_yellow">Viral Yellow</option>
                <option value="minecraft_pixel">Minecraft Pixel</option>
                <option value="neon_punch">Neon Punch</option>
                <option value="clean_white">Clean Pill</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Placement</label>
              <select
                value={scene.caption?.positionY || 'bottom'}
                onChange={(e) =>
                  onUpdateScene({
                    ...scene,
                    caption: {
                      text: scene.caption?.text || '',
                      style: scene.caption?.style || 'viral_yellow',
                      positionY: e.target.value as any,
                      enabled: scene.caption?.enabled !== false,
                    },
                  })
                }
                className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="bottom">Bottom Safe Zone</option>
                <option value="middle">Center Attention</option>
                <option value="top">Top Header</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Camera Angle & Director Section */}
      <div className="bg-[#151a26] rounded-xl p-3 border border-[#222a3a] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            Camera Angle Director
          </span>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5">Camera Angle Preset</label>
          <select
            value={scene.cameraPreset}
            onChange={(e) => onUpdateScene({ ...scene, cameraPreset: e.target.value as CameraPreset })}
            className="w-full bg-[#1b2131] border border-[#2d374d] text-slate-200 text-[11px] rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="FirstPersonPOV">👀 1st Person POV (Minecraft)</option>
            <option value="ThirdPersonBack">🎮 F5 3rd Person Back</option>
            <option value="ThirdPersonFront">🤳 F5 Selfie / Reaction (Cash)</option>
            <option value="SideTracking">🏃 Side Tracking Leap/Chase (MTR)</option>
            <option value="OverTheShoulder">🗣️ Over The Shoulder (Trade)</option>
            <option value="FollowActor">🎥 Follow Hero Smooth</option>
            <option value="LowAngleHero">⚡ Hero Low Angle</option>
            <option value="CloseUpFace">😱 Close-up Face</option>
            <option value="Orbit">🔄 360° Drone Orbit</option>
            <option value="WideReveal">🌄 Wide World Reveal</option>
            <option value="TopDownIsometric">🗺️ Top-down Isometric</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#222a3a]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(scene.cameraShake)}
              onChange={(e) => onUpdateScene({ ...scene, cameraShake: e.target.checked })}
              className="rounded bg-[#1b2131] border-[#2d374d] text-amber-500 focus:ring-0"
            />
            <span className="text-[11px] text-slate-300 font-medium">💥 Camera Shake on Impact</span>
          </label>
        </div>
      </div>

      {/* 3. Sound FX Cues Section */}
      <div className="bg-[#151a26] rounded-xl p-3 border border-[#222a3a] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            Sound Effects Cues
          </span>

          {/* Quick Sound Add Dropdown */}
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                addSoundCue(e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-[#1e2536] border border-[#2f3b52] text-cyan-400 text-[10px] font-semibold rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="" disabled>+ Add SFX</option>
            <option value="sword_slash">⚔️ Sword Slash</option>
            <option value="villager_hrm">🧙‍♂️ Villager Hrmm (JahCub)</option>
            <option value="villager_trade">🎉 Villager Trade (JahCub)</option>
            <option value="laser_buzz">⚡ Laser Warning Buzz (MTR)</option>
            <option value="sad_piano">🎹 Sad Piano (Cash)</option>
            <option value="block_break">⛏️ Block Crunch (MTR)</option>
            <option value="fail_buzzer">🚨 Fail Buzzer</option>
            <option value="creeper_hiss">🐍 Creeper Hiss</option>
            <option value="explosion">💥 Explosion</option>
            <option value="hit">💢 Hit / Damage</option>
            <option value="footstep">👟 Footstep</option>
            <option value="ding">🔔 Experience Ding</option>
          </select>
        </div>

        {/* Red Line Laser Hazard Toggle */}
        <label className="flex items-center gap-2 cursor-pointer pt-1.5 border-t border-[#222a3a]">
          <input
            type="checkbox"
            checked={Boolean(scene.hasRedLine)}
            onChange={(e) => onUpdateScene({ ...scene, hasRedLine: e.target.checked })}
            className="rounded bg-[#1b2131] border-[#2d374d] text-rose-500 focus:ring-0"
          />
          <span className="text-rose-300 font-bold text-[11px] flex items-center gap-1">
            🔴 Red Line Laser Hazard (MTR)
          </span>
        </label>

        {scene.sounds.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic">No sound cues in this scene.</p>
        ) : (
          <div className="space-y-1.5">
            {scene.sounds.map((cue) => (
              <div
                key={cue.id}
                className="flex items-center justify-between bg-[#191f2e] border border-[#263145] px-2 py-1 rounded text-[11px]"
              >
                <span className="text-slate-200 font-medium capitalize">
                  {cue.type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>at {cue.timeOffset}s</span>
                  <button
                    onClick={() => removeSoundCue(cue.id)}
                    className="hover:text-rose-400 ml-1 text-slate-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
