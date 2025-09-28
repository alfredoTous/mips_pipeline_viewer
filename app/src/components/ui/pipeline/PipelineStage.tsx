'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type RegisterName = 'IF/ID' | 'ID/EX' | 'EX/MEM' | 'MEM/WB';

interface PipelineStageProps {
  stageName: RegisterName;
  instruction: string;      // hex or '---'
  fullInstruction: string;  // used in tooltip
  isActive: boolean;
  instructionIndex?: number | null; // tag index
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

export function PipelineStage({ stageName, instruction, fullInstruction, isActive, instructionIndex }: PipelineStageProps) {
  const shortText = instruction && instruction !== '---' ? fmtHex(instruction) : '---';
  const longText = fullInstruction && fullInstruction !== 'empty' ? fmtHex(fullInstruction) : 'empty';
  const tag = instructionIndex != null ? `[${instructionIndex + 1}] ` : '';

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
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{registerDetails[stageName].name} Register</p>
          <p className="font-mono text-sm">{longText === 'empty' ? 'empty' : `${tag}${longText}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
