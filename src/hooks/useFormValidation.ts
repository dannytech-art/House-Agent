import { useState, useCallback, useRef } from 'react';
import { validators } from '../utils/validation';

type ValidationRules<T> = { [K in keyof T]?: {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  matches?: keyof T;
  custom?: (value: T[K], values: T) => boolean;
  message?: string;
} };

export function useFormValidation<T extends Record<string, any>>(initialValues: T, rules: ValidationRules<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use refs to avoid recreating callbacks
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  
  const valuesRef = useRef(values);
  valuesRef.current = values;
  
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  const validate = useCallback(() => {
    const currentRules = rulesRef.current;
    const currentValues = valuesRef.current;
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.keys(currentRules).forEach(key => {
      const fieldKey = key as keyof T;
      const value = currentValues[fieldKey];
      const rule = currentRules[fieldKey];
      if (!rule) return;
      
      if (rule.required && !validators.required(value)) {
        newErrors[fieldKey] = rule.message || 'This field is required';
        isValid = false;
        return;
      }
      if (value && rule.email && !validators.email(value as string)) {
        newErrors[fieldKey] = rule.message || 'Invalid email address';
        isValid = false;
        return;
      }
      if (value && rule.phone && !validators.phone(value as string)) {
        newErrors[fieldKey] = rule.message || 'Invalid phone number';
        isValid = false;
        return;
      }
      if (value && rule.minLength && !validators.minLength(rule.minLength)(value as string)) {
        newErrors[fieldKey] = rule.message || `Must be at least ${rule.minLength} characters`;
        isValid = false;
        return;
      }
      if (rule.matches && currentValues[rule.matches] !== value) {
        newErrors[fieldKey] = rule.message || 'Fields do not match';
        isValid = false;
        return;
      }
      if (rule.custom && !rule.custom(value, currentValues)) {
        newErrors[fieldKey] = rule.message || 'Invalid value';
        isValid = false;
        return;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, []);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errorsRef.current[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, []);

  // Return a function that creates an event handler - prevents calling during render
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      setIsSubmitting(true);
      if (validate()) {
        try {
          await onSubmit(valuesRef.current);
        } catch (error) {
          console.error('Form submission error', error);
        }
      }
      setIsSubmitting(false);
    };
  }, [validate]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    validate
  };
}