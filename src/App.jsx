import React, { useState, useEffect } from "react";
import { computeTypeScale, decodeConfigFromQuery } from "./utils/math.js";
import ControlPanel from "./components/ControlPanel.jsx";
import ViewportCanvas from "./components/ViewportCanvas.jsx";
import ExportTerminal from "./components/ExportTerminal.jsx";
import { Sparkles, Star, FolderHeart, Trash2, Heart, RefreshCw, Layers, Copy, Check, ShieldAlert } from "lucide-react";

const DEFAULT_CONFIG = {
  minViewport: 320,
  maxViewport: 1440,
  minBaseSize: 16,
  maxBaseSize: 20,
  ratio: 1.25, // Major Third
  selectedFont: "Space Grotesk",
  textColor: "#121212",
  backgroundColor: "#FCFBF7",
};

export default function App() {
  // Config state
  const [config, setConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      if (search) {
        try {
          return decodeConfigFromQuery(search, DEFAULT_CONFIG);
        } catch (e) {
          console.error("Failed to decode queries", e);
        }
      }
      const stored = localStorage.getItem("fluid_type_playground_config");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return DEFAULT_CONFIG;
  });

  // Saved bookmark scales state
  const [savedPresets, setSavedPresets] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fluid_type_playground_faves_v2");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return [
      {
        id: "space-augmented",
        name: "Cyber Augmented (Default)",
        config: { ...DEFAULT_CONFIG, ratio: 1.414, selectedFont: "Space Grotesk" },
        createdAt: new Date().toISOString(),
      },
      {
        id: "bricolage-perfect",
        name: "Bricolage Golden Vibe",
        config: { ...DEFAULT_CONFIG, ratio: 1.618, selectedFont: "Bricolage Grotesque" },
        createdAt: new Date().toISOString(),
      }
    ];
  });

  const [presetNameInput, setPresetNameInput] = useState("");
  const [notification, setNotification] = useState(null);

  // Sync Google Fonts dynamic loading stylesheet
  useEffect(() => {
    const fontName = config.selectedFont;
    const linkId = "google-fonts-loader";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
  }, [config.selectedFont]);

  // Sync state to local storage config
  useEffect(() => {
    localStorage.setItem("fluid_type_playground_config", JSON.stringify(config));
  }, [config]);

  // Sync faves to local storage
  useEffect(() => {
    localStorage.setItem("fluid_type_playground_faves_v2", JSON.stringify(savedPresets));
  }, [savedPresets]);

  // Compute scale
  const computedSteps = computeTypeScale(config);

  // Dynamic Style Injection of CSS custom properties (variables) into a local <style> tag in the DOM header
  useEffect(() => {
    if (typeof window !== "undefined") {
      const styleId = "fluid-type-custom-properties";
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      
      let cssContent = `:root {\n`;
      cssContent += `  --active-typeface: '${config.selectedFont}', sans-serif;\n`;
      computedSteps.forEach((step) => {
        cssContent += `  --step-${step.name}: ${step.clampString};\n`;
      });
      cssContent += `}\n`;
      
      styleTag.textContent = cssContent;
    }
  }, [config, computedSteps]);

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    triggerAlert("Vibe reset back to default Space Grotesk!");
  };

  const handleSavePreset = (e) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: presetNameInput.trim(),
      config: JSON.parse(JSON.stringify(config)),
      createdAt: new Date().toLocaleString(),
    };

    setSavedPresets((prev) => [newPreset, ...prev]);
    setPresetNameInput("");
    triggerAlert("Vibe bookmarked safely in LocalStorage!");
  };

  const loadPreset = (preset) => {
    setConfig(JSON.parse(JSON.stringify(preset.config)));
    triggerAlert(`Switched to preset "${preset.name}"`);
  };

  const deletePreset = (id, e) => {
    e.stopPropagation();
    setSavedPresets((prev) => prev.filter((p) => p.id !== id));
    triggerAlert("Bookmark dismissed.");
  };

  const triggerAlert = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFEEB] text-black font-mono relative overflow-x-hidden selection:bg-[#ADFA1D] selection:text-black pb-12">
      
      {/* Dynamic Slide-in Notification toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[999] bg-[#C084FC] border-3 border-black px-4 py-2 text-xs font-black shadow-[4px_4px_0_0_#000] animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Neon Ribbon Alert Banner */}
      <div className="bg-black text-[#ADFA1D] py-1.5 px-4 text-center text-xs font-bold border-b-4 border-black select-none tracking-widest uppercase flex items-center justify-center gap-2 animate-pulse">
        <Layers className="w-3.5 h-3.5" />
        <span>CYBERSCALE TYPOGRAPHY ENGINE ON AIR • ACCURATE MATHEMATICAL MATH</span>
        <Layers className="w-3.5 h-3.5" />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-12 flex flex-col gap-8 relative">
        
        {/* Floating stickers anchored to the main responsive container */}
        <div className="absolute -top-7 left-4 md:left-8 select-none bg-pink-300 border-2 border-black px-2.5 py-1 text-[10px] font-black shadow-[3px_3px_0_0_#000] rotate-0 z-10 hover:-translate-y-0.5 transition-all duration-200">
          MATH IS MATHING Fr Fr!
        </div>
        
        <div className="absolute -top-7 right-4 md:right-8 flex items-center gap-2 select-none bg-yellow-300 border-2 border-black px-2.5 py-1 text-[9px] font-bold shadow-[2px_2px_0_0_#000] rotate-6 z-10 hover:-translate-y-0.5 hover:rotate-0 transition-all duration-200">
          <Star className="w-3 h-3 text-black fill-black" />
          <span>NO CAP GRAPH RATIO</span>
        </div>

        {/* Page title card */}
        <section className="bg-[#ADFA1D] border-4 border-black p-6 md:p-8 rounded-none shadow-[8px_8px_0px_0px_#000000] relative overflow-hidden">
          {/* Sticker decoration */}
          <div className="absolute top-4 right-4 bg-black text-white px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-none select-none">
            Scale Matrix
          </div>

          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight leading-none uppercase mb-3 text-black">
              Typography Typeface Fluid-Scale Playground
            </h1>
            <p className="text-xs md:text-sm text-black font-semibold leading-relaxed border-t-2 border-black/10 pt-2 font-mono">
              Fluid typography uses modern CSS math functions like <code className="bg-black/15 px-1 font-bold">clamp()</code>, <code className="bg-black/15 px-1 font-bold">calc()</code>, and viewport units to scale text scales seamlessly between device thresholds. No media-query breakpoints. Zero browser latency. Run client-side fr fr.
            </p>
          </div>
        </section>

        {/* Bento Board Layout Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Configuration sliders (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ControlPanel config={config} onChange={setConfig} onReset={handleReset} />

            {/* Local storage favorite presets manager */}
            <div className="bg-white border-4 border-black p-6 rounded-none shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-4 font-mono text-black">
              <div className="flex items-center gap-2 border-b-2 border-black pb-3">
                <FolderHeart className="w-5 h-5 text-pink-500" />
                <h3 className="font-sans font-bold uppercase text-sm">Bookmarks & Presets</h3>
              </div>

              {/* Bookmark Name Input Form */}
              <form onSubmit={handleSavePreset} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Vibe name..."
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-black px-3 py-1.5 text-xs font-bold focus:outline-none focus:bg-pink-50"
                />
                <button
                  type="submit"
                  className="bg-[#FFAEC9] hover:bg-[#ff85a9] border-2 border-black text-black font-extrabold px-3 py-1.5 text-xs shadow-[2px_2px_0_0_#000] active:translate-y-0.5"
                >
                  SAVE
                </button>
              </form>

              {/* Saved bookmarks list */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mt-2">
                {savedPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="flex items-center justify-between p-2 border-2 border-black bg-gray-50 hover:bg-yellow-100 cursor-pointer text-xs font-bold transition-colors"
                  >
                    <div className="truncate pr-2">
                      <span className="block font-black truncate">{preset.name}</span>
                      <span className="text-[8px] text-gray-500 block uppercase font-mono mt-0.5">
                        {preset.config.selectedFont} • R: {preset.config.ratio === 0 ? preset.config.customRatio: preset.config.ratio}
                      </span>
                    </div>

                    <button
                      onClick={(e) => deletePreset(preset.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {savedPresets.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center p-4">
                    No presets bookmarked yet. Save your scale combos above!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Viewport drag spec sheet & terminal compiler (Span 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Viewport Canvas staging */}
            <ViewportCanvas config={config} computedSteps={computedSteps} />

            {/* Tabular export code terminal */}
            <ExportTerminal config={config} computedSteps={computedSteps} />
          </div>

        </section>

        {/* Footer Credit & Brand Section */}
        <footer className="border-t-4 border-black pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-700 leading-relaxed gap-4 mt-8">
          <div>
            <span className="font-extrabold text-black uppercase block">🎨 CYBER FLUID SCALE • NO CAP LABS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-black text-[#ADFA1D] px-2 py-0.5 font-bold uppercase tracking-wider">v1.2.0 stable</span>
            <span className="text-black font-extrabold">&copy; 2026 CS-FLUID.FR</span>
          </div>
        </footer>

        {/* Middle-bottom credit at the very last */}
        <div className="text-center text-xs font-black bg-white text-black border-2 border-black px-4 py-2 self-center shadow-[3px_3px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all duration-250 ease-out cursor-pointer mb-6 select-none">
          Made with React • Crafted by Sanika Kangane
        </div>

      </main>
    </div>
  );
}
