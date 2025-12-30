import { useState, useCallback } from 'react';
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
  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    Object.keys(rules).forEach(key => {
      const fieldKey = key as keyof T;
      const value = values[fieldKey];
      const rule = rules[fieldKey];
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
      if (rule.matches && values[rule.matches] !== value) {
        newErrors[fieldKey] = rule.message || 'Fields do not match';
        isValid = false;
        return;
      }
      if (rule.custom && !rule.custom(value, values)) {
        newErrors[fieldKey] = rule.message || 'Invalid value';
        isValid = false;
        return;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [values, rules]);
  const handleChange = (field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  const handleSubmit = async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    if (validate()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error', error);
      }
    }
    setIsSubmitting(false);
  };
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