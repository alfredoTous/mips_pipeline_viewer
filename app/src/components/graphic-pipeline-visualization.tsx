'use client';
import React from 'react';
import { useSimulationState } from '@/context/SimulationContext';

type AreaComponent = { x: number; y: number; w: number; h: number; label: string };

const IF_COMPONENTS: AreaComponent[] = [
    // MUX
    { x: 6.2, y: 39, w: 2.3, h: 13, label: 'MUX' },

    // PC
    { x: 10, y: 40, w: 2.3, h: 12, label: 'PC' },

    // Adder
    { x: 19.5, y: 15, w: 4.55, h: 15, label: 'Add' },

    // Instruction Memory 
    { x: 15.2, y: 44, w: 11.4, h: 25.5, label: 'IM' },

    // IF/ID pipeline 
    { x: 30.8, y: 11.3, w: 2.6, h: 83, label: 'IF/ID' },
    ];


const ID_COMPONENTS: AreaComponent[] = [
    // Registers
    { x: 37.5, y: 44,  w: 11.5,  h: 25, label: 'Registers' },

    // Imm Gen (Bit extender)
    { x: 44.5, y: 74,  w: 4, h: 14.3, label: 'IG' },

    // ID/EX pipeline 
    { x: 52.5, y: 11.3,  w: 2.6, h: 83, label: 'ID/EX' },
];

const EX_COMPONENTS: AreaComponent[] = [
    // MUX
    { x: 58.8, y: 56,  w: 2.3, h: 14, label: 'MUX' },

    // ALU 
    { x: 63.5, y: 46,  w: 6, h: 17.5, label: 'ALU' },

    // EX/MEM  pipeline
    { x: 72.3, y: 11.3,  w: 2.6, h: 83, label: 'EX/MEM' },
];


const MEM_COMPONENTS: AreaComponent[] = [
  // Data memory
  { x: 77.8, y: 51,  w: 11.2, h: 25.5, label: 'Memory' },

  // MEM/WB  pipeline
  { x: 90.7, y: 11.3,  w: 2.6,  h: 83,   label: 'MEM/WB' },
];

const WB_COMPONENTS: AreaComponent[] = [
    // MUX 
    { x: 96, y: 55,  w: 2.3, h: 14, label: 'MUX' },
];


const ALL_COMPONENTS: AreaComponent[] = [
    ...IF_COMPONENTS,
    ...ID_COMPONENTS,
    ...EX_COMPONENTS,
    ...MEM_COMPONENTS,
    ...WB_COMPONENTS,
];

type Half = 'left' | 'right' | 'both';

const letterForIndex = (i: number) => String.fromCharCode('A'.charCodeAt(0) + i);

const colorForIndex = (i: number) => {
  const hue = (i * 137.508) % 360; 
  return `hsl(${hue}deg 70% 50% / 0.55)`; 
};

const getAreaByLabel = (label: string, all: AreaComponent[]) =>
  all.find((a) => a.label === label);

type Props = {
    imageSrc?: string;
    showGuides?: boolean;
    maxWidthPx?: number;
};

// IF stage for LOAD instructions
function IFLoadOverlays({
    allAreas,
}:  {
    allAreas: AreaComponent[];
})  {

    const {
        instructions,
        instructionStages,
        registerUsage,
        currentCycle,
    } = useSimulationState();

    const i = 0;

    // Validate useSimulationState data
    if (!instructions[i]) return null;
    const usage = registerUsage[i];
    if (!usage || !usage.isLoad) return null;    // Only load
    const stageIndex = instructionStages[i];     // Current stage 
    if (stageIndex !== 0) return null;           // 0 = IF 

    const label = letterForIndex(i);             // Letter for instruction
    const bg = colorForIndex(i);

    // Where to draw and what half
    const targets: Array<{ label: string; half: Half }> = [
        { label: 'MUX',   half: 'both'  },
        { label: 'PC',    half: 'both'  },
        { label: 'Add',   half: 'both'  },
        { label: 'IM',    half: 'right' }, 
        { label: 'IF/ID', half: 'left'  }, 
    ];

return (
    <>
      {targets.map((t, idx) => {
        const area = getAreaByLabel(t.label, allAreas);
        if (!area) return null;

        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.w}%`,
          height: `${area.h}%`,
          pointerEvents: 'none',
          zIndex: 30, 
        };

        const leftHalf = (
          <div
            key="left"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              background: bg,
              border: '1px solid rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          />
        );

        const rightHalf = (
          <div
            key="right"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '50%',
              height: '100%',
              background: bg,
              border: '1px solid rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          />
        );

        const halves =
          t.half === 'both'
            ? [leftHalf, rightHalf]
            : t.half === 'left'
            ? [leftHalf]
            : [rightHalf];

        return (
          <div key={`${t.label}-${idx}`} style={baseStyle}>
            {halves}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'black',
                textShadow: '0 1px 2px rgba(87, 77, 77, 0.7)',
                fontSize: 'clamp(10px, 1.2vw, 16px)',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </>
  );
}

function IDLoadOverlays({ allAreas }: { allAreas: AreaComponent[] }) {
  const { instructions, instructionStages, registerUsage } = useSimulationState();

  const i = 0;

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !usage.isLoad) return null;
  const stageIndex = instructionStages[i];
  if (stageIndex !== 1) return null;            // 1 = ID

  const label = letterForIndex(i);
  const bg = colorForIndex(i);

  const targets: Array<{ label: string; half: Half }> = [
    { label: 'IF/ID',    half: 'right' }, 
    { label: 'Registers', half: 'right' }, 
    { label: 'IG',        half: 'both'  }, 
    { label: 'ID/EX',     half: 'left'  }, 
  ];

  return (
    <>
      {targets.map((t, idx) => {
        const area = getAreaByLabel(t.label, allAreas);
        if (!area) return null;

        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.w}%`,
          height: `${area.h}%`,
          pointerEvents: 'none',
          zIndex: 31, 
        };

        const leftHalf = (
          <div
            key="left"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              background: bg,
              border: '1px solid rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          />
        );

        const rightHalf = (
          <div
            key="right"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '50%',
              height: '100%',
              background: bg,
              border: '1px solid rgba(0,0,0,0.25)',
              boxSizing: 'border-box',
            }}
          />
        );

        const halves =
          t.half === 'both' ? [leftHalf, rightHalf] :
          t.half === 'left' ? [leftHalf] : [rightHalf];

        return (
          <div key={`${t.label}-${idx}`} style={baseStyle}>
            {halves}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'black',
                textShadow: '0 1px 2px rgba(87, 77, 77, 0.7)',
                fontSize: 'clamp(10px, 1.2vw, 16px)',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </>
  );
}

function EXLoadOverlays() {
  const { instructions, instructionStages, registerUsage } = useSimulationState();
  const i = 0; 

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !usage.isLoad) return null; 
  const stageIndex = instructionStages[i];
  if (stageIndex !== 2) return null;         // 2 = EX

  const label = letterForIndex(i);
  const bg = colorForIndex(i);

  // Use EX_COMPONENTS directly to avoid ambiguity with other MUX areas
  const find = (arr: AreaComponent[], label: string) => arr.find(a => a.label === label);

  const targets = [
    { area: find(ID_COMPONENTS,  'ID/EX'),   half: 'right' as const }, 
    { area: find(EX_COMPONENTS,  'MUX'),     half: 'both'  as const }, 
    { area: find(EX_COMPONENTS,  'ALU'),     half: 'both'  as const }, 
    { area: find(EX_COMPONENTS,  'EX/MEM'),  half: 'left'  as const },
  ].filter(t => t.area);

  return (
    <>
      {targets.map((t, idx) => {
        const area = t.area!;
        const base: React.CSSProperties = {
          position: 'absolute',
          left: `${area.x}%`,
          top: `${area.y}%`,
          width: `${area.w}%`,
          height: `${area.h}%`,
          pointerEvents: 'none',
          zIndex: 32,
        };

        const leftHalf = (
          <div key="left" style={{
            position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
            background: bg, border: '1px solid rgba(0,0,0,0.25)', boxSizing: 'border-box'
          }}/>
        );
        const rightHalf = (
          <div key="right" style={{
            position: 'absolute', left: '50%', top: 0, width: '50%', height: '100%',
            background: bg, border: '1px solid rgba(0,0,0,0.25)', boxSizing: 'border-box'
          }}/>
        );

        const halves =
          t.half === 'both' ? [leftHalf, rightHalf] :
          t.half === 'left' ? [leftHalf] : [rightHalf];

        return (
          <div key={idx} style={base}>
            {halves}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, color: 'black',
              textShadow: '0 1px 2px rgba(87, 77, 77, 0.7)',
              fontSize: 'clamp(10px, 1.2vw, 16px)',
            }}>
              {label}
            </div>
          </div>
        );
      })}
    </>
  );
}




export default function GraphicPipelineVisualization({
    imageSrc = '/datapath.jpg',
    showGuides = true, 
    maxWidthPx = 1200,
    }: Props) {
    return (
        <div
        className="relative w-full mx-auto"
        style={{ maxWidth: maxWidthPx }}
        >
        <img
            src={imageSrc}
            alt="MIPS datapath"
            className="w-full h-auto block select-none"
            draggable={false}
        />
        {showGuides &&
        ALL_COMPONENTS.map((a, i) => (
            <div
            key={`ifc-${i}`}
            className="absolute border border-dashed border-rose-500/70 rounded-md"
            style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                width: `${a.w}%`,
                height: `${a.h}%`,
            }}
            title={a.label}
            >
            <div className="absolute -top-6 left-0 text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                {a.label}
            </div>
            </div>
        ))}
        <IFLoadOverlays allAreas={ALL_COMPONENTS} />
        <IDLoadOverlays allAreas={ALL_COMPONENTS} />
        <EXLoadOverlays />
    </div>
  );
}