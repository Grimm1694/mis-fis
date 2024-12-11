import React, { createContext, useContext } from "react";

// Create a FormContext
const FormContext = createContext<any>(null);

interface FormProviderProps {
  register: any;
  errors: any;
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  register,
  errors,
  children,
}) => {
  return (
    <FormContext.Provider value={{ register, errors }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form context
export const useFormContext = () => useContext(FormContext);
