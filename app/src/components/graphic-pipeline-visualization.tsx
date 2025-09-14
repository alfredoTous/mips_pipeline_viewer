'use client';
import React from 'react';

const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB'] as const;

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
    { x: 30.8, y: 11, w: 2.6, h: 83.5, label: 'IF/ID' },
    ];


const ID_COMPONENTS: AreaComponent[] = [
    // Registers
    { x: 37.5, y: 44,  w: 11.5,  h: 25, label: 'Registers' },

    // Imm Gen (Bit extender)
    { x: 44.5, y: 74,  w: 4, h: 14.3, label: 'IG' },

    // ID/EX pipeline 
    { x: 52.5, y: 11,  w: 2.6, h: 83.5, label: 'ID/EX' },
];

const EX_COMPONENTS: AreaComponent[] = [
    // MUX
    { x: 58.8, y: 56,  w: 2.3, h: 14, label: 'MUX' },

    // ALU 
    { x: 63.5, y: 46,  w: 6, h: 17.5, label: 'ALU' },

    // EX/MEM  pipeline
    { x: 72.4, y: 11,  w: 2.6, h: 83.5, label: 'EX/MEM' },
];


const MEM_COMPONENTS: AreaComponent[] = [
  // Data memory
  { x: 77.8, y: 51,  w: 11.2, h: 25.5, label: 'Memory' },

  // MEM/WB  pipeline
  { x: 90.8, y: 11,  w: 2.6,  h: 83.5,   label: 'MEM/WB' },
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



    type Props = {
    imageSrc?: string;
    showGuides?: boolean;
    maxWidthPx?: number;
    };

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

    </div>
  );
}