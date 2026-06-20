import React from "react";
import { PRESET_RATIOS, PRESET_FONTS } from "../utils/constants.js";
import { HelpCircle, RefreshCw, Sparkles, Sliders, Type, Palette } from "lucide-react";

export default function ControlPanel({ config, onChange, onReset }) {
  const updateField = (field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const handleRatioSelect = (val) => {
    updateField("ratio", val);
    if (val !== 0) {
      updateField("customRatio", undefined);
    } else {
      updateField("customRatio", 1.25);
    }
  };

  const [fontSearch, setFontSearch] = React.useState("");
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);

  const filteredFonts = PRESET_FONTS.filter((f) =>
    f.name.toLowerCase().includes(fontSearch.toLowerCase())
  );

  return (
    <div className="bg-[#FFFEE5] border-4 border-black p-6 rounded-none shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-6 h-full font-mono text-black">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 border-2 border-black p-1.5 rounded-none shadow-[2px_2px_0px_0px_#111]">
            <Sliders className="w-5 h-5 text-black" />
          </div>
          <h2 className="font-sans font-bold text-lg tracking-tight uppercase">Control Panel</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 bg-[#FFA3A3] hover:bg-[#ff8080] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#000] border-2 border-black px-2 py-1 text-xs font-bold shadow-[2px_2px_0_0_#000] transition-colors"
          title="Reset back to default vibes"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          RESET
        </button>
      </div>

      {/* Font Selector Module */}
      <div className="border-b-2 border-black pb-5">
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-4 h-4 text-purple-600" />
          <h3 className="font-sans font-bold uppercase tracking-wide text-xs">Font Rotation (Google Fonts)</h3>
          <span className="bg-purple-200 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 border border-purple-800 uppercase">Live CDN</span>
        </div>
        
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search or enter any Google Font..."
              value={fontSearch || config.selectedFont}
              onChange={(e) => {
                setFontSearch(e.target.value);
                updateField("selectedFont", e.target.value);
              }}
              onFocus={() => setShowFontDropdown(true)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-purple-50 placeholder-gray-500 rounded-none shadow-[2px_2px_0_0_#000]"
            />
            {fontSearch && (
              <button
                onClick={() => {
                  setFontSearch("");
                  updateField("selectedFont", "Space Grotesk");
                }}
                className="bg-gray-200 border-2 border-black px-3 text-xs font-bold"
              >
                CLEAR
              </button>
            )}
          </div>

          {showFontDropdown && (
            <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border-2 border-black z-50 rounded-none shadow-[4px_4px_0_0_#000] divide-y divide-black">
              <div className="p-1 bg-purple-100 text-[10px] font-bold text-purple-900 border-b border-black select-none">
                POPULAR DRIFTS:
              </div>
              {filteredFonts.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => {
                    updateField("selectedFont", font.name);
                    setFontSearch(font.name);
                    setShowFontDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold flex justify-between items-center hover:bg-yellow-200 transition-colors ${
                    config.selectedFont === font.name ? "bg-purple-300" : "bg-white"
                  }`}
                >
                  <span style={{ fontFamily: `'${font.name}', sans-serif` }}>{font.name}</span>
                  <span className="text-[9px] text-gray-500 bg-gray-100 px-1 border border-gray-300 font-mono">
                    {font.category}
                  </span>
                </button>
              ))}
              {filteredFonts.length === 0 && (
                <div className="p-3 text-xs text-gray-500 italic bg-gray-100 text-center">
                  Press enter to request: "{config.selectedFont}" on the live engine
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Dropdown overlay dismissal helper */}
        {showFontDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowFontDropdown(false)}
          />
        )}
        <p className="text-[10px] text-gray-600 mt-1.5 italic">
          Currently styling as: <strong className="text-black uppercase underline">{config.selectedFont}</strong>. Feel free to type any custom name from Google Fonts.
        </p>
      </div>

      {/* Viewport Boundary Limits Rule */}
      <div className="border-b-2 border-black pb-5">
        <h3 className="font-sans font-bold uppercase tracking-wide text-xs flex items-center justify-between gap-1 mb-3">
          <span>Viewport Staging Gate</span>
          <span className="text-[10px] text-gray-500 font-mono lowercase">Bounds in pixels</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Min Viewport */}
          <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0_0_#000]">
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
              Minimum Width
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="320"
                max="2000"
                value={config.minViewport}
                onChange={(e) => updateField("minViewport", Number(e.target.value) || 320)}
                className="w-full text-sm font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-black"
              />
              <span className="text-xs text-black font-extrabold select-none">PX</span>
            </div>
          </div>

          {/* Max Viewport */}
          <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0_0_#000]">
            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
              Maximum Width
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="320"
                max="3000"
                value={config.maxViewport}
                onChange={(e) => updateField("maxViewport", Number(e.target.value) || 1440)}
                className="w-full text-sm font-bold bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-black"
              />
              <span className="text-xs text-black font-extrabold select-none">PX</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min="320"
            max="1200"
            step="10"
            value={config.minViewport}
            onChange={(e) => updateField("minViewport", Number(e.target.value))}
            className="w-full accent-black cursor-pointer bg-white h-2.5 border-2 border-black max-w-[50%]"
          />
          <input
            type="range"
            min="1200"
            max="2560"
            step="20"
            value={config.maxViewport}
            onChange={(e) => updateField("maxViewport", Number(e.target.value))}
            className="w-full accent-black cursor-pointer bg-white h-2.5 border-2 border-black max-w-[50%]"
          />
        </div>
      </div>

      {/* Font Size Tuning (Min and Max) */}
      <div className="border-b-2 border-black pb-5">
        <h3 className="font-sans font-bold uppercase tracking-wide text-xs mb-3">
          Base Font Size (Step: base)
        </h3>

        <div className="flex flex-col gap-4">
          {/* Min Size */}
          <div className="bg-purple-100 border-2 border-black p-3 shadow-[2px_2px_0_0_#000] relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-extrabold text-purple-700 uppercase">Min Viewport Size</span>
              <span className="bg-black text-white text-[10px] px-1.5 font-bold rounded-none">
                {config.minBaseSize}px / {(config.minBaseSize / 16).toFixed(3)}rem
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="36"
              step="1"
              value={config.minBaseSize}
              onChange={(e) => updateField("minBaseSize", Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2.5 bg-white border-2 border-black"
            />
          </div>

          {/* Max Size */}
          <div className="bg-[#E0F2FE] border-2 border-black p-3 shadow-[2px_2px_0_0_#000] relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-extrabold text-blue-700 uppercase">Max Viewport Size</span>
              <span className="bg-black text-white text-[10px] px-1.5 font-bold rounded-none">
                {config.maxBaseSize}px / {(config.maxBaseSize / 16).toFixed(3)}rem
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={config.maxBaseSize}
              onChange={(e) => updateField("maxBaseSize", Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2.5 bg-white border-2 border-black"
            />
          </div>
        </div>
      </div>

      {/* Typography Modular Scales */}
      <div className="border-b-2 border-black pb-5">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-sans font-bold uppercase tracking-wide text-xs">
            Type Scale Ratio (Interval)
          </h3>
          <span className="bg-emerald-300 border border-black text-black px-1.5 py-0.5 text-[9px] font-extrabold">
            {config.ratio === 0 ? (config.customRatio || 1.25) : config.ratio}
          </span>
        </div>

        {/* Dynamic Grid of Preset Scales - Neo Brutalist styling */}
        <div className="grid grid-cols-2 gap-2">
          {PRESET_RATIOS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleRatioSelect(item.value)}
              className={`text-left p-1.5 text-[10px] font-extrabold border-2 border-black transition-all ${
                config.ratio === item.value
                  ? "bg-emerald-300 shadow-[1px_1px_0_0_#000] translate-x-0.5 translate-y-0.5"
                  : "bg-white hover:bg-gray-100 shadow-[2px_2px_0_0_#000] active:translate-y-0.5"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Custom scale formula entry */}
        {config.ratio === 0 && (
          <div className="mt-3 bg-[#EBF7FF] p-2.5 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-600 uppercase">Ratio value:</span>
            <input
              type="number"
              step="0.001"
              min="1.01"
              max="3"
              value={config.customRatio || ""}
              onChange={(e) => updateField("customRatio", parseFloat(e.target.value) || 1.25)}
              placeholder="e.g. 1.25"
              className="w-24 bg-white border border-black font-mono font-bold text-xs p-1 text-right focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Contrast Auditing Color Pickers & Setup */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Palette className="w-4 h-4 text-pink-600" />
          <h3 className="font-sans font-bold uppercase tracking-wide text-xs">Aesthetic Vibe Colors</h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Text Color HEX setting */}
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0_0_#000]">
            <label className="text-[8px] font-extrabold uppercase text-gray-500 block mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => updateField("textColor", e.target.value)}
                className="w-6 h-6 border-0 p-0 cursor-pointer rounded-none bg-transparent"
              />
              <input
                type="text"
                value={config.textColor}
                onChange={(e) => updateField("textColor", e.target.value)}
                className="w-full text-[10px] font-mono font-bold bg-transparent focus:outline-none uppercase border-b border-dashed border-gray-400"
              />
            </div>
          </div>

          {/* Background Color HEX setting */}
          <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0_0_#000]">
            <label className="text-[8px] font-extrabold uppercase text-gray-500 block mb-1">Canvas Bg</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                className="w-6 h-6 border-0 p-0 cursor-pointer rounded-none bg-transparent"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => updateField("backgroundColor", e.target.value)}
                className="w-full text-[10px] font-mono font-bold bg-transparent focus:outline-none uppercase border-b border-dashed border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
