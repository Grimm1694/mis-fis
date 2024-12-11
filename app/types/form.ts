export interface Step {
  id: String;
  name: string;
  fields: string[];
}

export interface FormProgressProps {
  steps: Step[];
  currentStep: number;
}
