import React from 'react';
import ExecutiveKpiSimulator from './ExecutiveKpiSimulator';

export interface IndustriesSimulatorProps {
  onAddToCanvas?: (solutionId: string) => void;
}

export default function IndustriesSimulator({ onAddToCanvas }: IndustriesSimulatorProps) {
  return (
    <div id="industries-showcase-root" className="flex flex-col flex-1 h-full min-h-0 w-full text-neutral-100 animate-fade-in">
      <ExecutiveKpiSimulator
        initialIndustryId="oil-gas"
        onSelectUseCase={(useCaseTitle) => {
          if (onAddToCanvas) {
            onAddToCanvas('node-databridge');
          }
        }}
      />
    </div>
  );
}
