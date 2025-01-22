import React, { ReactNode } from "react";
import ProgressBar from "./ProgressBar";

interface WizardProps {
  step: number;
  totalSteps: number;
  headerText: string;
  onPrevious?: () => void;
  onNext?: (e: React.MouseEvent<HTMLButtonElement> ) => Promise<void> | void;
  onCancel?: () => void;
  children: ReactNode;
}

const Wizard: React.FC<WizardProps> = ({ step, totalSteps, onPrevious, onNext, onCancel, headerText, children }) => (
  <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
    {/* Header */}
    <header>
      <h2 className="text-xl font-semibold">{headerText}</h2>
      <ProgressBar step={step} totalSteps={totalSteps} />
    </header>

    {/* Body */}
    <div className="mb-4">{children}</div>

    {/* Footer */}
    <footer className="flex justify-center">
      <div className="flex gap-2">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Volver
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {step === totalSteps ? "Finalizar" : "Continuar"}
          </button>
        )}
      </div>
    </footer>
  </div>
);

export default Wizard;