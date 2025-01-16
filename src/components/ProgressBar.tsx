import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => (
  <div className="relative mb-6">
    <p className="text-sm text-right text-gray-500 mb-2">
      <span className="text-blue-500">Paso {step} </span> de {totalSteps}
    </p>
    <div className="h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 rounded-full bg-blue-500"
        style={{ width: `${(step / totalSteps) * 100}%` }}
      ></div>
    </div>
  </div>
);

export default ProgressBar;