'use client';
import { ScrollArea } from '@/components/ui/scroll-area';

export type StageName = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
export type HistoryDict = Record<StageName, (string | null)[]>; // Dict for StageName: instructions(string)[] 

const stageCompleteName: Record<StageName, string> = {
  IF: 'Instruction Fetch',
  ID: 'Instruction Decode',
  EX: 'Execute',
  MEM: 'Memory Access',
  WB: 'Write Back',
};

// Draw pipeline history
export function PipelineHistory({ history }: { history: HistoryDict }) {
  const stages = Object.keys(history) as StageName[];
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stages.map((stage) => (
        <div key={stage}>
          <h3 className="font-semibold text-center mb-2">
            {stageCompleteName[stage]} ({stage})
          </h3>
          <ScrollArea className="h-64 rounded-md border bg-muted/20">
            <div className="p-2 space-y-1">
              {history[stage].map((hex, idx) => (
                <div key={idx} className="font-mono text-xs p-1.5 rounded-sm text-center bg-background">
                  {hex ? (hex === '00000000' ? 'nop' : hex) : 'empty'} 
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
