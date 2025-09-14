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
    { x: 63.5, y: 46,  w: 6, h: 18, label: 'ALU' },

    // EX/MEM  pipeline
    { x: 72.3, y: 11.3,  w: 2.6, h: 83, label: 'EX/MEM' },

    // Store Bus (for store instructions)
    { x: 56, y: 73.4,  w: 16,  h: 0.5,  label: 'Store Bus' },
    { x: 55.8, y: 59,  w: 0.3,  h: 14.7,  label: 'Store Bus Head' },
];

const MEM_COMPONENTS: AreaComponent[] = [
  // Data memory
  { x: 77.8, y: 51.2,  w: 11.2, h: 25.5, label: 'Memory' },

  // MEM/WB  pipeline
  { x: 90.7, y: 11.3,  w: 2.6,  h: 83,   label: 'MEM/WB' },
];

const WB_COMPONENTS: AreaComponent[] = [
    // MUX 
    { x: 96, y: 55,  w: 2.5, h: 14, label: 'MUX' },
];


const ALL_COMPONENTS: AreaComponent[] = [
    ...IF_COMPONENTS,
    ...ID_COMPONENTS,
    ...EX_COMPONENTS,
    ...MEM_COMPONENTS,
    ...WB_COMPONENTS,
];

const GUIDE_COMPONENTS: AreaComponent[] =
  ALL_COMPONENTS.filter(c => c.label !== 'Store Bus' && c.label !== 'Store Bus Head');

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


const isStore = (opcode: number) => opcode >= 40 && opcode <= 43;

// IF stage for LOAD instructions
function IfOverlays({
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
    if (!usage || !(usage.isLoad || isStore(usage.opcode))) return null;    // Load or Store
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

function IdOverlays({ allAreas }: { allAreas: AreaComponent[] }) {
  const { instructions, instructionStages, registerUsage } = useSimulationState();

  const i = 0;

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !(usage.isLoad || isStore(usage.opcode))) return null; // Load or Store
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
  if (!usage || !(usage.isLoad || isStore(usage.opcode))) return null;
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

  let busOverlays: React.ReactNode = null;
  if (isStore(usage.opcode)) {
  const busLabels = ['Store Bus', 'Store Bus Head'];
  busOverlays = (
    <>
      {busLabels.map((lbl) => {
        const b = EX_COMPONENTS.find(a => a.label === lbl);
        if (!b) return null;
        return (
          <div
            key={lbl}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: 'hsl(0 85% 50% / 0.6)',
              boxShadow: '0 0 4px rgba(137, 16, 16, 0.59)',
              pointerEvents: 'none',
              zIndex: 43,
            }}
          />
        );
      })}
    </>
  );
}
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
      {busOverlays}
    </>
  );
}

function MEMLoadOverlays({ allAreas }: { allAreas: AreaComponent[] }) {
  const { instructions, instructionStages, registerUsage } = useSimulationState();
  const i = 0; 

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !usage.isLoad) return null;  
  const stageIndex = instructionStages[i];
  if (stageIndex !== 3) return null;         // 3 = MEM

  const label = letterForIndex(i);
  const bg = colorForIndex(i);

  const get = (label: string) => ALL_COMPONENTS.find(a => a.label === label);

  const targets: Array<{ area: AreaComponent | undefined; half: Half }> = [
    { area: get('EX/MEM'),  half: 'right' },
    { area: get('Memory'),  half: 'right' },
    { area: get('MEM/WB'),  half: 'left'  },
  ];

  return (
    <>
      {targets.map((t, idx) => {
        if (!t.area) return null;
        const a = t.area;

        const base: React.CSSProperties = {
          position: 'absolute',
          left: `${a.x}%`,
          top: `${a.y}%`,
          width: `${a.w}%`,
          height: `${a.h}%`,
          pointerEvents: 'none',
          zIndex: 33,
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


function MEMStoreOverlays({ allAreas }: { allAreas: AreaComponent[] }) {
  const { instructions, instructionStages, registerUsage } = useSimulationState();
  const i = 0;

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !isStore(usage.opcode)) return null; // only Store
  if (instructionStages[i] !== 3) return null;        // 3 = MEM

  const label = letterForIndex(i);
  const bg = colorForIndex(i);
  const get = (label: string) => allAreas.find(a => a.label === label);

  const targets: Array<{ area: AreaComponent | undefined; half: Half }> = [
    { area: get('EX/MEM'), half: 'right' }, 
    { area: get('Memory'), half: 'left'  },
  ];

  return (
    <>
      {targets.map((t, idx) => {
        if (!t.area) return null;
        const a = t.area;

        const base: React.CSSProperties = {
          position: 'absolute', left: `${a.x}%`, top: `${a.y}%`,
          width: `${a.w}%`, height: `${a.h}%`, pointerEvents: 'none', zIndex: 43,
        };

        const leftHalf = <div key="l" style={{position:'absolute',left:0,top:0,width:'50%',height:'100%',background:bg,border:'1px solid rgba(0,0,0,0.25)',boxSizing:'border-box'}} />;
        const rightHalf= <div key="r" style={{position:'absolute',left:'50%',top:0,width:'50%',height:'100%',background:bg,border:'1px solid rgba(0,0,0,0.25)',boxSizing:'border-box'}} />;

        const halves = t.half === 'both' ? [leftHalf, rightHalf] : t.half === 'left' ? [leftHalf] : [rightHalf];

        return (
          <div key={idx} style={base}>
            {halves}
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'black',textShadow:'0 1px 2px rgba(255,255,255,0.7)',fontSize:'clamp(10px,1.2vw,16px)'}}>
              {label}
            </div>
          </div>
        );
      })}
    </>
  );
}


function WBLoadOverlays({ allAreas }: { allAreas: AreaComponent[] }) {
  const { instructions, instructionStages, registerUsage } = useSimulationState();
  const i = 0; 

  if (!instructions[i]) return null;
  const usage = registerUsage[i];
  if (!usage || !usage.isLoad) return null;     
  const stageIndex = instructionStages[i];
  if (stageIndex !== 4) return null;            // 4 = WB

  const label = letterForIndex(i);
  const bg = colorForIndex(i);

  const get = (label: string) => allAreas.find(a => a.label === label);
  const wbMux = WB_COMPONENTS.find(a => a.label === 'MUX');

  const targets: Array<{ area: AreaComponent | undefined; half: Half }> = [
    { area: get('Registers'), half: 'left'  }, 
    { area: get('MEM/WB'),    half: 'right' },
    { area: wbMux,            half: 'both'  },
  ];

  return (
    <>
      {targets.map((t, idx) => {
        if (!t.area) return null;
        const a = t.area;

        const base: React.CSSProperties = {
          position: 'absolute',
          left: `${a.x}%`,
          top: `${a.y}%`,
          width: `${a.w}%`,
          height: `${a.h}%`,
          pointerEvents: 'none',
          zIndex: 34,
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
        GUIDE_COMPONENTS.map((a, i) => (
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
        <IfOverlays allAreas={ALL_COMPONENTS} />
        <IdOverlays allAreas={ALL_COMPONENTS} />
        <EXLoadOverlays />
        <MEMLoadOverlays allAreas={ALL_COMPONENTS} />
        <WBLoadOverlays allAreas={ALL_COMPONENTS} />
        <MEMStoreOverlays allAreas={ALL_COMPONENTS} />
    </div>
  );
}