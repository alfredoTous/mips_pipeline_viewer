'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type RegisterName = 'IF/ID' | 'ID/EX' | 'EX/MEM' | 'MEM/WB';

interface PipelineStageProps {
  stageName: RegisterName;
  instruction: string;      // hex or '---'
  fullInstruction: string;  // used in tooltip
  isActive: boolean;
}

const registerDetails: Record<RegisterName, { name: string }> = {
  'IF/ID': { name: 'Instruction Fetch / Decode' },
  'ID/EX': { name: 'Instruction Decode / Execute' },
  'EX/MEM': { name: 'Execute / Memory Access' },
  'MEM/WB': { name: 'Memory Access / Write Back' },
};

export function PipelineStage({ stageName, instruction, fullInstruction, isActive }: PipelineStageProps) {
  const shortText = instruction === '0x00000000' ? 'nop' : instruction;
  const longText = fullInstruction === '0x00000000' ? 'nop' : fullInstruction;

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
                {shortText || '---'}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-semibold">{registerDetails[stageName].name} Register</p>
          <p className="font-mono text-sm">{longText || 'empty'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
