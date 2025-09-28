import { PipelineStage } from "./PipelineStage";

export type RegisterName = 'IF/ID' | 'ID/EX' | 'EX/MEM' | 'MEM/WB';

export interface PipelineCell {
  name: RegisterName;
  hex: string | null;
}

const STAGES = [
  { name: 'Instruction', description: 'Memory' },
  { name: 'Register', description: 'Unit' },
  { name: 'ALU', description: '' },
  { name: 'Memory', description: '' },
];

export function PipelineDisplay({ pipeline }: { pipeline: PipelineCell[] }) {
  return (
    <div className="relative overflow-x-auto pb-2 pt-2">
      <div className="flex items-center justify-between gap-1 md:gap-2 p-1 relative">
        <div className="flex flex-col items-center text-center w-20 shrink-0">
          <p className="font-bold">{STAGES[0].name}</p>
          <p className="text-xs text-muted-foreground">{STAGES[0].description}</p>
        </div>

        {pipeline.map((cell, index) => (
          <div key={cell.name} className="flex grow items-center min-w-[5rem] md:min-w-0">
            <div className="flex-1">
              <PipelineStage
                stageName={cell.name}
                instruction={cell.hex ?? '---'}
                fullInstruction={cell.hex ?? 'empty'}
                isActive={cell.hex !== null}
              />
            </div>
            {index < pipeline.length - 1 && (
              <div className="flex flex-col items-center text-center w-20 shrink-0 mx-1 md:mx-2">
                <p className="font-bold">{STAGES[index + 1]?.name}</p>
                <p className="text-xs text-muted-foreground">{STAGES[index + 1]?.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
