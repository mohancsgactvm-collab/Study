import React, { useState } from "react";
import { VisualDiagram } from "../types";
import { ArrowRight, Info, HelpCircle } from "lucide-react";

interface TopicVisualizerProps {
  diagram?: VisualDiagram;
  isDarkMode: boolean;
}

export default function TopicVisualizer({ diagram, isDarkMode }: TopicVisualizerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (!diagram) return null;

  const { type, title, nodes, edges } = diagram;
  const activeNode = nodes.find(n => n.id === selectedNodeId);

  // Backgrounds and colors based on dark mode
  const panelBg = isDarkMode ? "bg-[#16223f] border-[#22355e]" : "bg-indigo-50/40 border-indigo-100";
  const cardBg = isDarkMode ? "bg-[#1e2e54] border-[#2d467e] hover:bg-[#233764]" : "bg-white border-slate-200 hover:border-indigo-400";
  const activeCardBg = isDarkMode ? "bg-[#29417a] border-indigo-500 shadow-md shadow-indigo-950/50" : "bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100";
  const textTitle = isDarkMode ? "text-slate-100" : "text-slate-900";
  const textSub = isDarkMode ? "text-slate-400" : "text-slate-500";
  const textLabel = isDarkMode ? "text-slate-200" : "text-slate-800";

  return (
    <div className={`mt-6 border rounded-2xl p-4 sm:p-5 transition-all ${panelBg}`}>
      <div className="flex items-center justify-between mb-4 border-b border-indigo-100/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          <h4 className={`font-bold text-xs sm:text-sm tracking-wide ${textTitle}`}>
            📊 {title}
          </h4>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
          {type} diagram
        </span>
      </div>

      {/* Render based on diagram type */}
      {type === "compare" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected ? activeCardBg : cardBg
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-indigo-600/10 text-indigo-400 font-bold px-2 py-0.5 rounded">
                    {node.id.toUpperCase()}
                  </span>
                  <Info className="w-3.5 h-3.5 text-indigo-400 opacity-70" />
                </div>
                <h5 className={`font-bold text-xs mt-2 ${textTitle}`}>{node.labelEnglish}</h5>
                <h6 className="text-[11px] font-medium text-indigo-500 mt-0.5">{node.labelTamil}</h6>
                {node.description && (
                  <p className={`text-[11px] mt-2 leading-relaxed ${textSub}`}>
                    {node.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {type === "flowchart" && (
        <div className="flex flex-col gap-4 my-3 overflow-x-auto py-2">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {nodes.map((node, idx) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <React.Fragment key={node.id}>
                  <button
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    className={`text-center p-3.5 rounded-xl border transition-all duration-300 cursor-pointer min-w-[120px] max-w-[160px] ${
                      isSelected ? activeCardBg : cardBg
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <span className="text-[9px] bg-slate-500/10 text-slate-400 font-mono font-bold px-1.5 py-0.5 rounded">
                        Step {idx + 1}
                      </span>
                    </div>
                    <div className={`font-bold text-xs ${textTitle}`}>{node.labelEnglish}</div>
                    <div className="text-[10px] text-indigo-400 font-medium mt-0.5">{node.labelTamil}</div>
                  </button>
                  {idx < nodes.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse shrink-0 hidden sm:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {type === "tree" && (
        <div className="flex flex-col items-center my-4">
          {/* We lay out Root and Children in centered flex rows */}
          <div className="flex flex-col items-center gap-6 w-full py-2">
            {/* Level 0: Root */}
            {nodes.slice(0, 1).map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                  className={`text-center p-4 rounded-xl border transition-all duration-300 cursor-pointer min-w-[140px] ${
                    isSelected ? activeCardBg : cardBg
                  }`}
                >
                  <span className="text-[9px] bg-indigo-600/10 text-indigo-400 font-bold px-2 py-0.5 rounded block w-fit mx-auto mb-1">
                    ROOT
                  </span>
                  <div className={`font-bold text-xs ${textTitle}`}>{node.labelEnglish}</div>
                  <div className="text-[10px] text-indigo-400 font-medium mt-0.5">{node.labelTamil}</div>
                </button>
              );
            })}

            {/* Connecting lines indicator or spacing */}
            <div className="w-px h-6 bg-indigo-300/40 -mt-6"></div>

            {/* Level 1: Left & Right Children */}
            <div className="flex justify-center gap-4 sm:gap-8 flex-wrap w-full">
              {nodes.slice(1, 3).map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                    className={`text-center p-3.5 rounded-xl border transition-all duration-300 cursor-pointer min-w-[120px] ${
                      isSelected ? activeCardBg : cardBg
                    }`}
                  >
                    <div className={`font-bold text-xs ${textTitle}`}>{node.labelEnglish}</div>
                    <div className="text-[10px] text-indigo-400 font-medium mt-0.5">{node.labelTamil}</div>
                  </button>
                );
              })}
            </div>

            {/* Level 2: Leaves (if any exist) */}
            {nodes.length > 3 && (
              <>
                <div className="flex justify-center gap-3 sm:gap-6 flex-wrap w-full border-t border-indigo-200/10 pt-4 mt-2">
                  {nodes.slice(3).map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                        className={`text-center p-3 rounded-xl border transition-all duration-300 cursor-pointer min-w-[100px] ${
                          isSelected ? activeCardBg : cardBg
                        }`}
                      >
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded block w-fit mx-auto mb-1">
                          LEAF
                        </span>
                        <div className={`font-bold text-[11px] ${textTitle}`}>{node.labelEnglish}</div>
                        <div className="text-[9px] text-indigo-400 font-medium mt-0.5">{node.labelTamil}</div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {type !== "compare" && type !== "flowchart" && type !== "tree" && (
        /* Generic visualization list for tables, cycles, or others */
        <div className="flex flex-col gap-3 my-3">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                  isSelected ? activeCardBg : cardBg
                }`}
              >
                <div>
                  <h5 className={`font-bold text-xs ${textTitle}`}>{node.labelEnglish}</h5>
                  <h6 className="text-[10px] font-semibold text-indigo-400 mt-0.5">{node.labelTamil}</h6>
                </div>
                <Info className="w-3.5 h-3.5 text-indigo-400 opacity-60" />
              </button>
            );
          })}
        </div>
      )}

      {/* Edge details summary */}
      {edges.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center mt-4 pt-3 border-t border-indigo-100/10 text-[10px] text-slate-400 font-medium">
          <span className="text-indigo-400 uppercase tracking-wide font-extrabold text-[9px]">🔗 Connections:</span>
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            return (
              <span key={idx} className="bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/10 flex items-center gap-1">
                <span className="font-bold text-indigo-400">{fromNode?.labelEnglish || edge.from}</span>
                <span className="text-slate-500">➔</span>
                <span className="font-bold text-indigo-400">{toNode?.labelEnglish || edge.to}</span>
                {edge.label && <span className="text-[9px] text-slate-500 bg-indigo-500/10 px-1 rounded">({edge.label})</span>}
              </span>
            );
          })}
        </div>
      )}

      {/* Selected Node Details Drawer */}
      {activeNode && (
        <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-xs text-slate-200 leading-relaxed animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1.5 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
            <Info className="w-3.5 h-3.5" />
            <span>விவரம் (Node Information)</span>
          </div>
          <h5 className={`font-bold ${textTitle}`}>{activeNode.labelEnglish} ({activeNode.labelTamil})</h5>
          <p className={`mt-1.5 leading-relaxed ${textSub}`}>
            {activeNode.description || "No further details available for this node, but it is an integral element of the " + title + "."}
          </p>
        </div>
      )}

      <p className="text-[9px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
        <HelpCircle className="w-3 h-3 text-indigo-400" />
        <span>ஏதேனும் ஒரு அடுக்கை சொடுக்கி கூடுதல் தமிழ்/ஆங்கில விளக்கங்களை பார்க்கவும்.</span>
      </p>
    </div>
  );
}
