import React, { useRef, useState, useEffect } from "react";
import { Eye, Monitor, Smartphone, Tablet, Laptop, GripVertical, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { auditContrast } from "../utils/math.js";

export default function ViewportCanvas({ config, computedSteps }) {
  // Staging width state in pixels (clamped between minViewport and maxViewport of config)
  const [canvasWidth, setCanvasWidth] = useState(1024);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [activeTab, setActiveTab] = useState("specimen");
  const [specimenMode, setSpecimenMode] = useState("steps"); // "steps" or "layout"
  const [customText, setCustomText] = useState("Vibe Check Fr Fr!");
  
  // Custom states for active range
  const [activeRange, setActiveRange] = useState("");

  const getRangeLabel = (width) => {
    if (width <= 480) return "📱 Mobile Range";
    if (width <= 768) return "📟 Tablet Range";
    if (width <= 1024) return "💻 Laptop Range";
    return "🖥️ Desktop Range";
  };

  // Keep simulated width within reasonable bounds
  useEffect(() => {
    if (canvasWidth > config.maxViewport) {
      setCanvasWidth(config.maxViewport);
    } else if (canvasWidth < config.minViewport) {
      setCanvasWidth(config.minViewport);
    }
  }, [config.minViewport, config.maxViewport]);

  // Handle Dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    // Clamp between config min and max
    const newWidth = Math.max(
      config.minViewport,
      Math.min(config.maxViewport, relativeX)
    );
    setCanvasWidth(Math.round(newWidth));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Preset Sizes
  const setPresetWidth = (width) => {
    const clamped = Math.max(config.minViewport, Math.min(config.maxViewport, width));
    setCanvasWidth(clamped);
  };

  // Auto detect scale transitions
  useEffect(() => {
    const currentLabel = getRangeLabel(canvasWidth);
    setActiveRange(currentLabel);
  }, [canvasWidth]);

  // Simple contrast audit calculation
  const contrastAudit = auditContrast(config.textColor, config.backgroundColor);

  // Computes the simulated current pixel font size of a step based on simulated canvasWidth
  const getSimulatedStepSize = (step) => {
    const { minViewport, maxViewport } = config;
    if (maxViewport === minViewport) {
      return step.minPx;
    }
    const ratio = (canvasWidth - minViewport) / (maxViewport - minViewport);
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return step.minPx + clampedRatio * (step.maxPx - step.minPx);
  };

  // Curated demo spec text
  const demoTexts = {
    xs: "CAPITALISM IS TIRE-SOME",
    sm: "We are building responsive and dynamic UI without writing useless breakpoint overrides.",
    base: "Fluid typography optimizes your typographic hierarchy across all viewport resolutions linearly. By using the mathematical clamp formula, browsers handle text sizing natively without layout shifts or expensive redraw cascades.",
    lg: "Design System Tokens",
    xl: "Nocap Scale System",
    "2xl": "Mathematical Sizing",
    "3xl": "Responsive Playground",
    "4xl": "Typography is Art",
    "5xl": "Fluid Scaling",
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-black h-full">
      {/* Top Controller Bar */}
      <div className="bg-[#FFF6E5] border-3 border-black p-4 shadow-[4px_4px_0_0_#000] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-600" />
          <h3 className="font-sans font-black tracking-tight text-sm uppercase">VIBE STAGE (SIMULATOR)</h3>
        </div>

        {/* Preset controls with highly visual status indicator active styling */}
        <div className="flex flex-wrap items-center gap-2">
          {(() => {
            const isMobileActive = canvasWidth <= 480;
            const isTabletActive = canvasWidth > 480 && canvasWidth <= 768;
            const isLaptopActive = canvasWidth > 768 && canvasWidth <= 1024;
            const isDesktopActive = canvasWidth > 1024;

            return (
              <>
                <button
                  onClick={() => setPresetWidth(375)}
                  className={`flex items-center gap-1.5 border-3 border-black px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_0_#000] active:translate-y-0.5 transition-all cursor-pointer ${
                    isMobileActive
                      ? "bg-[#ADFA1D] text-black scale-105 shadow-[1.5px_1.5px_0_0_#000]"
                      : "bg-white text-gray-700 hover:bg-yellow-100"
                  }`}
                  title="Simulate smartphone viewport (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>375px</span>
                  {isMobileActive && <span className="ml-1 text-[9px] bg-black text-[#ADFA1D] px-1 py-0.5 font-sans rounded">ACTIVE</span>}
                </button>

                <button
                  onClick={() => setPresetWidth(768)}
                  className={`flex items-center gap-1.5 border-3 border-black px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_0_#000] active:translate-y-0.5 transition-all cursor-pointer ${
                    isTabletActive
                      ? "bg-[#C084FC] text-black scale-105 shadow-[1.5px_1.5px_0_0_#000]"
                      : "bg-white text-gray-700 hover:bg-yellow-100"
                  }`}
                  title="Simulate tablet viewport (768px)"
                >
                  <Tablet className="w-4 h-4" />
                  <span>768px</span>
                  {isTabletActive && <span className="ml-1 text-[9px] bg-black text-[#C084FC] px-1 py-0.5 font-sans rounded">ACTIVE</span>}
                </button>

                <button
                  onClick={() => setPresetWidth(1024)}
                  className={`flex items-center gap-1.5 border-3 border-black px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_0_#000] active:translate-y-0.5 transition-all cursor-pointer ${
                    isLaptopActive
                      ? "bg-[#FB923C] text-black scale-105 shadow-[1.5px_1.5px_0_0_#000]"
                      : "bg-white text-gray-700 hover:bg-yellow-100"
                  }`}
                  title="Simulate laptop viewport (1024px)"
                >
                  <Laptop className="w-4 h-4" />
                  <span>1024px</span>
                  {isLaptopActive && <span className="ml-1 text-[9px] bg-black text-[#FB923C] px-1 py-0.5 font-sans rounded">ACTIVE</span>}
                </button>

                <button
                  onClick={() => setPresetWidth(1440)}
                  className={`flex items-center gap-1.5 border-3 border-black px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_0_#000] active:translate-y-0.5 transition-all cursor-pointer ${
                    isDesktopActive
                      ? "bg-[#38BDF8] text-black scale-105 shadow-[1.5px_1.5px_0_0_#000]"
                      : "bg-white text-gray-700 hover:bg-yellow-100"
                  }`}
                  title="Simulate desktop viewport (1440px)"
                >
                  <Monitor className="w-4 h-4" />
                  <span>1440px</span>
                  {isDesktopActive && <span className="ml-1 text-[9px] bg-black text-[#38BDF8] px-1 py-0.5 font-sans rounded">ACTIVE</span>}
                </button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Tabs selector */}
      <div className="flex gap-1 border-b-2 border-black pb-0.5">
        <button
          onClick={() => setActiveTab("specimen")}
          className={`px-4 py-2 text-xs font-bold uppercase border-3 border-black border-b-0 transition-colors ${
            activeTab === "specimen" ? "bg-[#ADFA1D] text-black" : "bg-white text-gray-500 hover:text-black"
          }`}
        >
          Specimen Sheet
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-bold uppercase border-3 border-black border-b-0 transition-colors ${
            activeTab === "audit" ? "bg-[#C084FC] text-black" : "bg-white text-gray-500 hover:text-black"
          }`}
        >
          Contrast/Metrics Audit
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`px-4 py-2 text-xs font-bold uppercase border-3 border-black border-b-0 transition-colors ${
            activeTab === "metrics" ? "bg-[#FB923C] text-black" : "bg-white text-gray-500 hover:text-black"
          }`}
        >
          X-Height Guide
        </button>
      </div>

      {/* Main Drag-Simulation Arena */}
      <div className="relative w-full overflow-x-auto p-2 bg-gray-100 border-3 border-dashed border-black min-h-[500px]">

        {/* Dynamic Scale Indicator banner */}
        <div className="mb-3 flex justify-between items-center text-xs bg-black text-white px-3 py-1.5 rounded-none font-bold">
          <span>Simulation Width: <strong className="text-[#ADFA1D] font-mono">{canvasWidth}px</strong></span>
          <span className="text-[10px] uppercase text-gray-400">
            {canvasWidth <= 480 ? "📱 Mobile Range" : canvasWidth <= 768 ? "📟 Tablet Range" : canvasWidth <= 1024 ? "💻 Laptop Range" : "🖥️ Desktop Range"}
          </span>
        </div>

        {/* Resizable Wrapper container */}
        <div ref={containerRef} className="relative w-full" style={{ minWidth: `${config.minViewport}px` }}>
          <div
            className="border-4 border-black transition-all ease-out duration-75 relative bg-white"
            style={{
              width: `${canvasWidth}px`,
              maxWidth: "100%",
              backgroundColor: activeTab === "specimen" ? config.backgroundColor : undefined,
              color: activeTab === "specimen" ? config.textColor : undefined,
            }}
          >
            {/* Mock Web page Header */}
            <div className="border-b-4 border-black p-2 bg-gray-100 text-xs font-extrabold flex justify-between items-center select-none text-black">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black inline-block"></span>
              </div>
              <div className="bg-white border border-black px-4 py-0.5 text-[10px] w-1/2 text-center rounded truncate font-mono">
                https://vibes.design/font/{config.selectedFont.toLowerCase().replace(/\s+/g, "-")}
              </div>
              <span className="text-[9px] text-gray-500">{canvasWidth}px</span>
            </div>

            {/* Simulated Live Frame Content */}
            <div className="p-6 overflow-hidden min-h-[350px]" style={{ fontFamily: `'${config.selectedFont}', sans-serif` }}>
              
              {/* SPECIMEN TAB */}
              {activeTab === "specimen" && (
                <div className="flex flex-col gap-6">
                  {/* Flat Button Toggle for Specimen Modes */}
                  <div className="flex gap-2 border-b border-black pb-3 select-none justify-start">
                    <button
                      type="button"
                      onClick={() => setSpecimenMode("steps")}
                      className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                        specimenMode === "steps"
                          ? "bg-black text-[#ADFA1D] shadow-[1.5px_1.5px_0_0_#000] translate-x-0.5"
                          : "bg-white text-black hover:bg-gray-100 shadow-[3px_3px_0_0_#000]"
                      }`}
                    >
                      📐 Scale Steps List
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpecimenMode("layout")}
                      className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                        specimenMode === "layout"
                          ? "bg-black text-[#ADFA1D] shadow-[1.5px_1.5px_0_0_#000] translate-x-0.5"
                          : "bg-white text-black hover:bg-gray-100 shadow-[3px_3px_0_0_#000]"
                      }`}
                    >
                      📰 Layout Specimen Sheet
                    </button>
                  </div>

                  {specimenMode === "steps" ? (
                    <div className="flex flex-col gap-8">
                      {/* Fluid Dynamic Specimen steps */}
                      {[...computedSteps].reverse().map((step) => {
                        const simPx = getSimulatedStepSize(step);
                        return (
                          <div key={step.name} className="border-b border-gray-100 pb-4 last:border-0 relative group">
                            {/* Step Metadata badge */}
                            <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px] font-bold text-gray-500 opacity-80 group-hover:opacity-100 transition-opacity">
                              <span className="bg-black text-[#ADFA1D] px-1 py-0.5 uppercase tracking-wide">
                                step: {step.name} (pow: {step.power})
                              </span>
                              <span>
                                {simPx.toFixed(1)}px / {(simPx / 16).toFixed(3)}rem
                              </span>
                            </div>

                            {/* Rendering font specimen element with computed dynamic font style size */}
                            <p
                              className="leading-tight break-words transition-all duration-75 text-left"
                              style={{ fontSize: `${simPx}px` }}
                            >
                              {demoTexts[step.name] || `${config.selectedFont} style specimen`}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* The Structured Layout Specimen representing <TypographySpecimenSheet /> */
                    <div className="flex flex-col gap-10 text-left">
                      {/* Hero Section */}
                      <div className="border-b-4 border-black pb-8">
                        <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 bg-[#FF6B6B] text-white tracking-widest inline-block mb-3">
                          Featured Case Study Showcase
                        </span>
                        <h1 
                          className="font-extrabold tracking-tight leading-none uppercase mb-4"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "5xl") || computedSteps[computedSteps.length - 1])}px` }}
                        >
                          The Era of Fluid Digital Canvas is Here fr fr!
                        </h1>
                        <p 
                          className="font-mono text-gray-500 uppercase font-black tracking-wide"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "sm") || computedSteps[1])}px` }}
                        >
                          How mathematical scale bounds are shaping modern responsive design systems.
                        </p>
                      </div>

                      {/* H1 Headline Section */}
                      <div className="flex flex-col gap-6">
                        <h2 
                          className="font-black uppercase tracking-tight leading-none"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "3xl") || computedSteps[computedSteps.length - 3])}px` }}
                        >
                          1. Typographic Scalability without Breakpoints
                        </h2>
                        
                        {/* H2 Sub-section Title */}
                        <h3 
                          className="font-bold uppercase tracking-tight leading-tight"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "2xl") || computedSteps[computedSteps.length - 4])}px` }}
                        >
                          Mathematical Harmonization of Type Scales
                        </h3>

                        {/* H3 Category Label */}
                        <h4 
                          className="font-black text-purple-700 uppercase tracking-widest"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "xl") || computedSteps[computedSteps.length - 5])}px` }}
                        >
                          THE CLAMP() EQUATION UNDER THE HOOD
                        </h4>

                        {/* Paragraph Blocks */}
                        <p 
                          className="leading-relaxed text-justify font-sans grayscale-50"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "base") || computedSteps[2])}px` }}
                        >
                          By compiling linear interpolation math directly into computed custom properties, front-end engines bypass hardcoded break-lines to provide adaptive, eye-safe displays across any physical device gate. Rather than designing separate, jagged typography rules for multiple devices, fluid scaling creates a smooth mathematical curve between the minimum viewport boundaries and the extreme desktop scale maximums (usually between {config.minViewport}px and {config.maxViewport}px).
                        </p>

                        <p 
                          className="leading-relaxed text-justify font-sans"
                          style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "base") || computedSteps[2])}px` }}
                        >
                          This approach solves the problem of "font-size jumps" that degrade the reading experience during window resizing. The resulting layout maintains high typographic density while remaining readable across all spectrum limits.
                        </p>

                        {/* Caption Block */}
                        <div className="border-l-4 border-black pl-3 py-1.5 bg-yellow-50 my-2">
                          <p 
                            className="italic text-gray-600 font-mono leading-tight"
                            style={{ fontSize: `${getSimulatedStepSize(computedSteps.find(s => s.name === "xs") || computedSteps[0])}px` }}
                          >
                            Fig 1.1: Linear interpolation equation of fluid scaling where y = mx + b matches screen density seamlessly.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONTRAST & AUDIT TAB */}
              {activeTab === "audit" && (
                <div className="text-black font-sans bg-white p-4 flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b-2 border-black pb-3">
                    <h4 className="font-bold uppercase tracking-tight font-sans text-base">WCAG 2.1 Contrast Audit Score</h4>
                    <span className="text-xs font-mono font-bold bg-[#ADFA1D] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0_0_#000]">
                      RATIO: {contrastAudit.ratio.toFixed(2)}:1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                    {/* Normal Text Box */}
                    <div className="border-2 border-black p-3 bg-[#FCFEF4]">
                      <h5 className="font-bold text-xs uppercase mb-2 text-purple-900">Normal Text (Body)</h5>
                      <span className="text-[10px] text-gray-500 block mb-3">Req: AA &ge; 4.5:1, AAA &ge; 7:1</span>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-white border border-black p-2">
                          <span className="text-xs font-bold">Contrast AA:</span>
                          {contrastAudit.normalAA ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 border border-red-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> FAIL
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center bg-white border border-black p-2">
                          <span className="text-xs font-bold">Contrast AAA:</span>
                          {contrastAudit.normalAAA ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 border border-red-600 flex items-center gap-1 font-sans">
                              RATIO'D
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Large Text Box */}
                    <div className="border-2 border-black p-3 bg-[#EBF7FF]">
                      <h5 className="font-bold text-xs uppercase mb-2 text-blue-900">Large Text (Headers)</h5>
                      <span className="text-[10px] text-gray-500 block mb-3">Req: AA &ge; 3.0:1, AAA &ge; 4.5:1</span>

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-white border border-black p-2">
                          <span className="text-xs font-bold">Contrast AA:</span>
                          {contrastAudit.largeAA ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 border border-red-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> FAIL
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center bg-white border border-black p-2">
                          <span className="text-xs font-bold">Contrast AAA:</span>
                          {contrastAudit.largeAAA ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> PASS
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 border border-red-600 flex items-center gap-1 font-sans">
                              RATIO'D
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFEE5] border-2 border-black p-3 font-mono text-xs text-black">
                    <span className="font-bold block uppercase mb-1">Vibe Status:</span>
                    {contrastAudit.scoreCard === "PASS_AAA" ? (
                      <span className="text-emerald-700 font-bold block">🔥 WCAG Premium AAA Level achieved. Safe on all monitors. Real deal.</span>
                    ) : contrastAudit.scoreCard === "PASS_AA" ? (
                      <span className="text-indigo-700 font-bold block">⚡ Safe for typical web layouts (AA Compliant). Readable fr fr.</span>
                    ) : (
                      <span className="text-red-700 font-bold block">💀 CAUTION: Low contrast detected. Might cause eye strain. Crank up the contrast!</span>
                    )}
                  </div>
                </div>
              )}

              {/* X-HEIGHT GUIDE TAB */}
              {activeTab === "metrics" && (
                <div className="text-black font-sans bg-white p-4 flex flex-col gap-5">
                  <div className="border-b-2 border-black pb-3">
                    <h4 className="font-bold uppercase tracking-tight text-base font-sans">X-Height & Font Geometry Audit</h4>
                    <p className="text-xs text-gray-500 font-mono">Observe alignment guides, baseline heights and descenders dynamically computed below</p>
                  </div>

                  {/* Input box to change geometry test letters */}
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-mono font-bold lowercase">Letter test:</span>
                    <input
                      type="text"
                      maxLength={12}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="border-2 border-black px-2 py-1 text-sm bg-white font-bold"
                    />
                  </div>

                  {/* Visual letter specs with alignment lines */}
                  <div className="bg-[#FAF9F6] border-2 border-black p-8 flex justify-center items-center relative overflow-hidden h-72">
                    {/* Geometry Guideline lines overlay */}
                    <div className="absolute inset-x-0 w-full flex flex-col justify-between h-[120px] pointer-events-none font-mono text-[9px] font-bold">
                      <div className="border-t border-red-500 w-full relative">
                        <span className="absolute left-2 -top-3.5 bg-red-100 text-red-500 px-1 border border-red-400">CAP-HEIGHT/ASCENT</span>
                      </div>
                      <div className="border-t border-purple-500 border-dashed w-full relative">
                        <span className="absolute left-2 -top-1.5 bg-purple-100 text-purple-600 px-1 border border-purple-400">X-HEIGHT</span>
                      </div>
                      <div className="border-t-2 border-black w-full relative">
                        <span className="absolute left-2 -top-3.5 bg-black text-white px-1">BASELINE</span>
                      </div>
                      <div className="border-t border-blue-400 w-full relative">
                        <span className="absolute left-2 -top-3.5 bg-blue-100 text-blue-500 px-1 border border-blue-400">DESCENDER</span>
                      </div>
                    </div>

                    {/* Rendering the text specimen with geometry alignment */}
                    <div
                      className="text-center z-10 font-bold transition-all duration-75 relative"
                      style={{
                        fontFamily: `'${config.selectedFont}', sans-serif`,
                        fontSize: "64px",
                        lineHeight: 1,
                      }}
                    >
                      {customText || "Z"}
                    </div>
                  </div>

                  <div className="font-mono text-xs bg-gray-50 p-3 border border-black flex gap-2">
                    <Info className="w-5 h-5 flex-shrink-0 text-gray-600" />
                    <p className="text-gray-600">
                      <strong>X-Height Info:</strong> The lowercase x-height governs legibility significantly more than capitalization rules. Large x-heights relative to capital letters hold legibility better at small screen responsive gates.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Draggable Handle on the right side - Neo Brutalist styled handle */}
          <div
            onMouseDown={handleMouseDown}
            className="absolute top-0 bottom-0 -right-4 w-4 bg-yellow-300 hover:bg-yellow-400 border-t-4 border-b-4 border-r-4 border-black flex items-center justify-center cursor-col-resize select-none z-30 shadow-[2px_0px_0px_0px_#000]"
            title="Drag left/right to scale viewport width"
          >
            <GripVertical className="w-4 h-4 text-black font-extrabold" />
          </div>
        </div>
      </div>
    </div>
  );
}
