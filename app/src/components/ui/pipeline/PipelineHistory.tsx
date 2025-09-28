'use client';
import { ScrollArea } from '@/components/ui/scroll-area';

export type RegisterName = 'IF/ID' | 'ID/EX' | 'EX/MEM' | 'MEM/WB';
export type HistoryDict = Record<RegisterName, (string | null)[]>;

const stageDetails: Record<RegisterName, { name: string }> = {
  'IF/ID': { name: 'IF/ID Register' },
  'ID/EX': { name: 'ID/EX Register' },
  'EX/MEM': { name: 'EX/MEM Register' },
  'MEM/WB': { name: 'MEM/WB Register' },
};

const formatHex = (v: string | null) => {
  if (!v) return 'empty';
  const raw = v.startsWith('0x') ? v.slice(2) : v;
  if (raw.toLowerCase() === '00000000') return 'nop';
  return '0x' + raw.toLowerCase();
};

export function PipelineHistory({ history }: { history: HistoryDict }) {
  const registers = Object.keys(history) as RegisterName[];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {registers.map((reg) => (
        <div key={reg}>
          <h3 className="font-semibold text-center mb-2">{stageDetails[reg].name}</h3>
          <ScrollArea className="h-64 rounded-md border bg-muted/20">
            <div className="p-2 space-y-1">
              {history[reg].map((hex, index) => (
                <div key={index}>
                  <div className="font-mono text-xs p-1.5 rounded-sm text-center bg-background">
                    {formatHex(hex)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
