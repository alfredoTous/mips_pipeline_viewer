import { ChevronRight } from "lucide-react";
import { PipelineStage } from "./PipelineStage";

export type StageName = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';

export interface PipelineCell {
    stage: StageName;
    hex: string | null;
}

export function PipelineDisplay({ pipeline }: { pipeline: PipelineCell[] }) {
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex items-stretch justify-between gap-1 md:gap-2 p-1">
        {pipeline.map((cell, index) => (
          <div key={cell.stage} className="flex grow items-center min-w-[5rem] md:min-w-0">
            <div className="flex-1">
              <PipelineStage
                stageName={cell.stage}
                instructionHex={cell.hex}
                isActive={!!cell.hex}
              />
            </div>
            {index < pipeline.length - 1 && (
              <ChevronRight className="h-8 w-8 text-muted-foreground mx-1 md:mx-2 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}