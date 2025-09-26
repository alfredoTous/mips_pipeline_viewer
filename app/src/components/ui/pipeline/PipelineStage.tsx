export function PipelineStage({
  stageName,
  instructionHex,
  isActive,
}: {
  stageName: 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';
  instructionHex: string | null; 
  isActive: boolean;
}) {
  return (
    <div
      className={[
        'rounded-md border p-3 h-full',
        isActive ? 'bg-accent/40' : 'bg-background',
      ].join(' ')}
    >
      <div className="text-xs text-muted-foreground mb-1">{stageName}</div>
      <div className="font-mono text-sm">
        {instructionHex ? (instructionHex === '0x00000000' ? 'nop' : instructionHex) : '---'}
      </div>
    </div>
  );
}
