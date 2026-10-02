import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
}

export default function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </label>
      {children}
      {error && (
        <span className="field-error" role="alert">
          {error.message}
        </span>
      )}
    </div>
  );
}
