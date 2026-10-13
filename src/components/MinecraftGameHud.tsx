import React from 'react';
import type { HeldItemType } from '../storyboard/types';

interface MinecraftGameHudProps {
  visible: boolean;
  isFirstPerson: boolean;
  heldItem: HeldItemType;
  isSwinging: boolean;
}

export const MinecraftGameHud: React.FC<MinecraftGameHudProps> = ({
  visible,
  isFirstPerson,
  heldItem,
  isSwinging,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-15 flex flex-col justify-between overflow-hidden">
      {/* 1. Center Crosshair (Classic Minecraft '+') */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" className="mix-blend-difference">
          {/* Inverted Crosshair */}
          <line x1="10" y1="3" x2="10" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </div>

      {/* 2. First-Person Hand & Held Item (Bottom-Right Viewmodel) */}
      {isFirstPerson && (
        <div
          className={`absolute -bottom-6 -right-4 w-44 h-48 transition-transform duration-75 origin-bottom-right ${
            isSwinging ? 'rotate-[-28deg] translate-y-3 translate-x-[-12px]' : 'rotate-[-6deg]'
          }`}
        >
          {/* Minecraft Steve Right Arm */}
          <div className="relative w-full h-full flex flex-col items-end justify-end">
            {/* Held Item */}
            <div className="absolute -top-4 right-10 text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
              {heldItem === 'diamond_sword' && '⚔️'}
              {heldItem === 'diamond_pickaxe' && '⛏️'}
              {heldItem === 'emerald' && '🟢'}
              {heldItem === 'torch' && '🕯️'}
              {heldItem === 'dirt_block' && '🟫'}
              {heldItem === 'bow' && '🏹'}
              {heldItem === 'tnt' && '🧨'}
              {heldItem === 'iron_sword' && '🗡️'}
            </div>

            {/* Arm block */}
            <div className="w-20 h-32 bg-[#c68c53] border-4 border-[#865933] rounded-t-sm shadow-2xl flex flex-col justify-between p-1">
              <div className="w-full h-8 bg-[#00a3a9] border-b-2 border-[#007b80]" />
              <div className="w-full h-4 bg-[#a87342]" />
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div />

      {/* 3. Bottom Gameplay HUD (Hearts, Food, XP Bar, Hotbar) */}
      <div className="w-full pb-3 flex flex-col items-center gap-1">
        {/* Hearts & Food Row */}
        <div className="w-[280px] max-w-[90%] flex items-center justify-between text-[11px] mb-0.5">
          {/* 10 Red Hearts */}
          <div className="flex gap-[1px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="text-red-500 drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-xs">
                ❤️
              </span>
            ))}
          </div>

          {/* 10 Food Drumsticks */}
          <div className="flex gap-[1px]">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="text-amber-600 drop-shadow-[0_1px_1px_rgba(0,0,0,1)] text-xs">
                🍗
              </span>
            ))}
          </div>
        </div>

        {/* XP Level Number & Green Progress Bar */}
        <div className="w-[280px] max-w-[90%] flex flex-col items-center">
          <span
            className="font-mono font-black text-xs text-[#55ff55] leading-none mb-0.5 tracking-wider"
            style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
          >
            100
          </span>
          {/* Green Experience Bar */}
          <div className="w-full h-1.5 bg-[#1a2e1a] border border-black/80 rounded-[1px] overflow-hidden p-[0.5px]">
            <div className="w-full h-full bg-gradient-to-r from-[#44dd44] to-[#77ff77]" />
          </div>
        </div>

        {/* 9-Slot Minecraft Hotbar */}
        <div className="mt-0.5 bg-[#8f8f8f] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#373737] border-b-[#373737] p-[2px] rounded-[2px] flex gap-[2px] shadow-2xl">
          {/* Slot 1 (Active slot with white border highlight) */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-white flex items-center justify-center text-sm shadow-inner relative">
            {heldItem === 'diamond_sword' && '⚔️'}
            {heldItem === 'diamond_pickaxe' && '⛏️'}
            {heldItem === 'emerald' && '🟢'}
            {heldItem === 'torch' && '🕯️'}
            {heldItem === 'dirt_block' && '🟫'}
            {heldItem === 'bow' && '🏹'}
            {heldItem === 'tnt' && '🧨'}
            {heldItem === 'iron_sword' && '🗡️'}
            {heldItem === 'none' && '✊'}
          </div>

          {/* Slot 2: Pickaxe */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs">
            ⛏️
          </div>

          {/* Slot 3: Golden Apple */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs">
            🍎
          </div>

          {/* Slot 4: Torches */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs relative">
            🕯️
            <span className="absolute bottom-0 right-0.5 text-[8px] font-mono font-bold text-white leading-none">64</span>
          </div>

          {/* Slot 5: Bread */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs relative">
            🍞
            <span className="absolute bottom-0 right-0.5 text-[8px] font-mono font-bold text-white leading-none">32</span>
          </div>

          {/* Slot 6: Ender Pearl */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs relative">
            🔮
            <span className="absolute bottom-0 right-0.5 text-[8px] font-mono font-bold text-white leading-none">16</span>
          </div>

          {/* Slot 7: Blocks */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs relative">
            🟫
            <span className="absolute bottom-0 right-0.5 text-[8px] font-mono font-bold text-white leading-none">64</span>
          </div>

          {/* Slot 8: Emeralds */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs relative">
            🟢
            <span className="absolute bottom-0 right-0.5 text-[8px] font-mono font-bold text-white leading-none">64</span>
          </div>

          {/* Slot 9: Water Bucket */}
          <div className="w-7 h-7 bg-[#8b8b8b] border-2 border-t-[#373737] border-l-[#373737] border-r-[#dfdfdf] border-b-[#dfdfdf] flex items-center justify-center text-xs">
            🪣
          </div>
        </div>
      </div>
    </div>
  );
};
