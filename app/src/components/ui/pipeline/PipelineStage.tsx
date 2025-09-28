'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { HazardInfo, ForwardingInfo, RegisterName } from './PipelineDisplay';

interface PipelineStageProps {
  stageName: RegisterName;
  instruction: string;      // hex or '---'
  fullInstruction: string;  // used in tooltip
  isActive: boolean;
  instructionIndex?: number | null; // tag index
  hazard?: HazardInfo;
  forwardings?: ForwardingInfo[];
  stallCount?: number;
}

const registerDetails: Record<RegisterName, { name: string }> = {
  'IF/ID': { name: 'Instruction Fetch / Decode' },
  'ID/EX': { name: 'Instruction Decode / Execute' },
  'EX/MEM': { name: 'Execute / Memory Access' },
  'MEM/WB': { name: 'Memory Access / Write Back' },
};

const fmtHex = (v: string) => {
  const raw = v.startsWith('0x') ? v.slice(2) : v;
  if (raw.toLowerCase() === '00000000') return 'nop';
  return '0x' + raw.toLowerCase();
};

const Chip = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${className}`}>{children}</span>
);

export function PipelineStage({
  stageName,
  instruction,
  fullInstruction,
  isActive,
  instructionIndex,
  hazard,
  forwardings = [],
  stallCount = 0,
}: PipelineStageProps) {
  const shortText = instruction && instruction !== '---' ? fmtHex(instruction) : '---';
  const longText = fullInstruction && fullInstruction !== 'empty' ? fmtHex(fullInstruction) : 'empty';
  const tag = instructionIndex != null ? `[${instructionIndex + 1}] ` : '';

  const hazardType = hazard?.type ?? 'NONE';
  const hasFwd = forwardings.length > 0;
  const chips = (
    <div className="flex flex-wrap gap-1 justify-center mt-2">
      {hazardType === 'RAW' && <Chip className="bg-red-100 text-red-700 border-red-200">RAW</Chip>}
      {hazardType === 'WAW' && <Chip className="bg-amber-100 text-amber-700 border-amber-200">WAW</Chip>}
      {stallCount > 0 && <Chip className="bg-blue-100 text-blue-700 border-blue-200">stall ×{stallCount}</Chip>}
      {hasFwd && <Chip className="bg-green-100 text-green-700 border-green-200">fwd</Chip>}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={[
            'text-center transition-all duration-300 w-full h-full',
            isActive ? 'border-accent shadow-lg shadow-accent/20' : 'border-border',
          ].join(' ')}>
            <CardHeader className="p-2 md:p-4">
              <CardTitle className={[
                'text-sm md:text-base font-bold',
                isActive ? 'text-accent' : 'text-muted-foreground',
              ].join(' ')}>
                {stageName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4 pt-0">
              <p className="font-mono text-xs md:text-sm truncate bg-muted/50 rounded-md p-2 h-9 flex items-center justify-center">
                {shortText === '---' ? '---' : `${tag}${shortText}`}
              </p>
              {(hazardType !== 'NONE' || stallCount > 0 || hasFwd) && chips}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p className="font-semibold">{registerDetails[stageName].name} Register</p>
          <p className="font-mono text-sm mb-2">{longText === 'empty' ? 'empty' : `${tag}${longText}`}</p>
          {hazard && hazard.type !== 'NONE' && (
            <div className="text-xs">
              <p className="font-semibold mb-1">Hazard</p>
              <p className="mb-1">{hazard.description}</p>
              {hazard.stallCycles > 0 && <p>Stalls required: {hazard.stallCycles}</p>}
              <p>Can forward: {hazard.canForward ? 'Yes' : 'No'}</p>
            </div>
          )}
          {forwardings.length > 0 && (
            <div className="text-xs mt-2">
              <p className="font-semibold mb-1">Forwarding Paths</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {forwardings.map((f, i) => (
                  <li key={i}>
                    from [{f.from + 1}] {f.fromStage} → to [{f.to + 1}] {f.toStage} ({f.register})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
