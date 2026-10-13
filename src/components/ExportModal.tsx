import React, { useState } from 'react';
import {
  X,
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { StoryboardProject, ExportSettings } from '../storyboard/types';
import { VideoExporter } from '../export/VideoExporter';


interface ExportModalProps {
  project: StoryboardProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [resolution, setResolution] = useState<'1080x1920' | '720x1280'>('1080x1920');
  const [fps, setFps] = useState<30 | 60>(60);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [includeCaptions, setIncludeCaptions] = useState(true);
  const [includeGameHud, setIncludeGameHud] = useState(true);
  const [includeAudio, setIncludeAudio] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setError(null);
    setExportedBlob(null);

    const settings: ExportSettings = {
      resolution,
      fps,
      format,
      includeCaptions,
      includeGameHud,
      includeAudio,
      showSafeZonesDuringPreview: false,
    };

    try {
      const blob = await VideoExporter.exportVideo(
        project,
        settings,
        (percent, frame, total) => {
          setProgress(percent);
          setCurrentFrame(frame);
          setTotalFrames(total);
        }
      );

      setExportedBlob(blob);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Export failed. Please check browser WebCodecs support.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${cleanTitle}_9x16.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#121622] border border-[#2b354a] rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 text-xs text-slate-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222a3b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Export 9:16 Short / Reel
              </h3>
              <p className="text-[11px] text-slate-400">
                High-fidelity 60 FPS deterministic render for YouTube Shorts & Reels
              </p>
            </div>
          </div>

          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#202738] text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Export Completed Screen */}
        {downloadUrl ? (
          <div className="py-6 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">
                Render Complete!
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Your 9:16 vertical video ({resolution}, {fps} FPS, {format.toUpperCase()}) is ready.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-3 w-full">
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                Download {format.toUpperCase()} Video
              </button>

              <button
                onClick={() => {
                  setDownloadUrl(null);
                  setExportedBlob(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-[#1e2536] hover:bg-[#283248] text-slate-200 font-semibold border border-[#303c54]"
              >
                Render Again
              </button>
            </div>
          </div>
        ) : isExporting ? (
          /* Active Export Progress Screen */
          <div className="py-6 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Rendering 3D Minecraft Animation...
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Frame {currentFrame} of {totalFrames} ({progress}%)
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1b2230] rounded-full h-2.5 border border-[#2c364c] overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Deterministic frame-by-frame rendering ensures smooth 60 FPS without frame drops.
            </p>
          </div>
        ) : (
          /* Export Configuration Settings */
          <div className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Resolution Selector */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Vertical Resolution (9:16)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResolution('1080x1920')}
                  className={`p-2.5 rounded-xl border text-left transition-colors ${
                    resolution === '1080x1920'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#181e2b] border-[#293347] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs text-white">1080 × 1920 (Full HD)</div>
                  <div className="text-[10px] text-slate-400">Recommended for YouTube & Reels</div>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution('720x1280')}
                  className={`p-2.5 rounded-xl border text-left transition-colors ${
                    resolution === '720x1280'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#181e2b] border-[#293347] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-xs text-white">720 × 1280 (Fast HD)</div>
                  <div className="text-[10px] text-slate-400">Faster rendering speed</div>
                </button>
              </div>
            </div>

            {/* Frame Rate & Format */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Frame Rate</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFps(60)}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      fps === 60
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#181e2b] border-[#293347] text-slate-400'
                    }`}
                  >
                    60 FPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setFps(30)}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      fps === 30
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#181e2b] border-[#293347] text-slate-400'
                    }`}
                  >
                    30 FPS
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Video Format</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('mp4')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      format === 'mp4'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#181e2b] border-[#293347] text-slate-400'
                    }`}
                  >
                    MP4 (H.264)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('webm')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      format === 'webm'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#181e2b] border-[#293347] text-slate-400'
                    }`}
                  >
                    WebM (VP9)
                  </button>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1 border-t border-[#202738]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCaptions}
                  onChange={(e) => setIncludeCaptions(e.target.checked)}
                  className="rounded bg-[#1b2230] border-[#303c54] text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Bake viral animated captions into video</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGameHud}
                  onChange={(e) => setIncludeGameHud(e.target.checked)}
                  className="rounded bg-[#1b2230] border-[#303c54] text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Bake Minecraft Game HUD (Crosshair, Hearts, Hotbar)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAudio}
                  onChange={(e) => setIncludeAudio(e.target.checked)}
                  className="rounded bg-[#1b2230] border-[#303c54] text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Include Minecraft sound effects & combat audio</span>
              </label>
            </div>

            {/* Start Export Button */}
            <button
              onClick={handleStartExport}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Render 9:16 Video Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
