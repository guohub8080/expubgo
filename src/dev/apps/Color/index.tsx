import React from "react";
import { useColorState } from "./state/useColorState.ts";
import { IroLayoutExamples } from "./components/IroLayoutExamples.tsx";
import { GoogleColor } from "./components/GoogleColor.tsx";
import { TailwindColor } from "./components/TailwindColor.tsx";

const Color: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"iro" | "google" | "tailwind">("iro");
  const [enableAlpha, setEnableAlpha] = React.useState(false);
  const [alpha, setAlpha] = React.useState(1);
  const {
    hex,
    setHex,
    rgba,
    hsla,
    displayOklch,
    invalid,
    displayHex,
    displayRgba,
    displayHsla,
    handlePickWithEyedropper,
    handlePickWithInput,
    colorInputRef,
    copyValue,
    universalInput,
    setUniversalInput,
    detectedKind,
    recognizeUniversalInput,
  } = useColorState({ externalAlpha: alpha, enableAlpha, onExternalAlphaChange: setAlpha, onEnableAlphaChange: setEnableAlpha });

  return (
    <div className="px-6 py-4 max-w-7xl mx-auto">
      {/* 顶部 Tabs */}
      <div className="mb-4 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-xl border bg-background p-1">
          <button
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition ${activeTab === "iro" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("iro")}
            aria-pressed={activeTab === "iro"}
          >
            <span className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-sm bg-gradient-to-br from-red-500 to-blue-500 shrink-0" aria-hidden />
            <span>颜色信息</span>
          </button>
          <button
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition ${activeTab === "google" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("google")}
            aria-pressed={activeTab === "google"}
          >
            <span className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-sm bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 shrink-0" aria-hidden />
            <span>Google配色</span>
          </button>
          <button
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition ${activeTab === "tailwind" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
            onClick={() => setActiveTab("tailwind")}
            aria-pressed={activeTab === "tailwind"}
          >
            <span className="inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-sm bg-gradient-to-br from-teal-400 via-green-500 to-emerald-600 shrink-0" aria-hidden />
            <span>Tailwind配色</span>
          </button>
        </div>
      </div>

      
      {activeTab === "google" && (
        <GoogleColor onColorChange={setHex} />
      )}

      {activeTab === "tailwind" && (
        <TailwindColor onColorChange={setHex} />
      )}

      {activeTab === "iro" && (
        <IroLayoutExamples
          hex={hex}
          onColorChange={setHex}
          enableAlpha={enableAlpha}
          onEnableAlphaChange={setEnableAlpha}
          alpha={alpha}
          onAlphaChange={setAlpha}
          handlePickWithEyedropper={handlePickWithEyedropper}
          handlePickWithInput={handlePickWithInput}
          recognizeUniversalInput={recognizeUniversalInput}
          universalInput={universalInput}
          setUniversalInput={setUniversalInput}
        />
      )}
    </div>
  );
};

export default Color;


