'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulationState } from '@/context/SimulationContext';
import { PipelineDisplay, PipelineCell } from './PipelineDisplay';
import { PipelineHistory, HistoryDict, type StageName } from './PipelineHistory';

const STAGES: StageName[] = ['IF', 'ID', 'EX', 'MEM', 'WB'];

export default function NewPipelineVisualization() {
  // Consumes simulation state
  const {
    instructions,
    instructionStages,
    currentCycle, 
    isFinished,
  } = useSimulationState();

  // useState for History dictionary (UI)
  const [history, setHistory] = useState<HistoryDict>({
    IF: [], ID: [], EX: [], MEM: [], WB: [],
  });

  const lastCycleLoggedRef = useRef(0);

  // Builds Pipeline from currect cycle from instructionStages 
  const pipelineNow: PipelineCell[] = useMemo(() => {
    const byStage: Record<number, string | null> = { 0:null,1:null,2:null,3:null,4:null };

    // For each instruction that is currently on an active stage (0 to 4) sets hex on that stage
    Object.entries(instructionStages).forEach(([iStr, sIdx]) => {
      const i = Number(iStr);
      if (sIdx !== null && sIdx >= 0 && sIdx < STAGES.length) {
        byStage[sIdx] = instructions[i] ?? null;
      }
    });

    return STAGES.map((name, idx) => ({
      stage: name,
      hex: byStage[idx] ?? null,
    }));
  }, [instructionStages, instructions]);

  // For each cycle step, added new row to history with snapshot of current pipeline
  useEffect(() => {
    if (currentCycle <= 0) return;
    if (currentCycle === lastCycleLoggedRef.current) return;

    setHistory(prev => {
      const next: HistoryDict = { IF:[...prev.IF], ID:[...prev.ID], EX:[...prev.EX], MEM:[...prev.MEM], WB:[...prev.WB] };
      // Save hex (snapshot)
      pipelineNow.forEach(cell => {
        next[cell.stage].push(cell.hex);
      });
      return next;
    });

    lastCycleLoggedRef.current = currentCycle;
  }, [currentCycle, pipelineNow]);

  const finished =
    isFinished ||
    (currentCycle > 0 && pipelineNow.every(s => s.hex === null) && currentCycle > instructions.length + 4);

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold font-headline">Pipeline Stages</h2>
            <div className="text-right">
              <div className="font-mono text-lg">Clock Cycle: {currentCycle}</div>
              {finished && <p className="text-primary font-semibold">Simulation Finished!</p>}
            </div>
          </div>
          <PipelineDisplay pipeline={pipelineNow} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold font-headline mb-4">Pipeline History</h2>
          <PipelineHistory history={history} />
        </CardContent>
      </Card>
    </div>
  );
}
