export const validators = {
  required: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },
  email: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  phone: (phone: string) => {
    // Basic Nigerian phone validation or international format
    const re = /^(\+?234|0)?[789][01]\d{8}$/;
    return re.test(phone.replace(/\s/g, ''));
  },
  minLength: (length: number) => (value: string) => {
    return value.length >= length;
  },
  matches: (target: string) => (value: string) => {
    return value === target;
  },
  passwordStrength: (password: string) => {
    // At least 8 chars, 1 number, 1 special char
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasNumber && hasSpecial && isLongEnough;
  }
};
export const formatPhone = (phone: string) => {
  // Format to +234...
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  }
  return '+' + cleaned;
};