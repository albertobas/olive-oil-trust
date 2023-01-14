export function handleStringValidation(value: string, subject: string): string | null {
  if (value.length == 0) {
    return `A ${subject} is required`;
  }
  return null;
}

export function handleAmountValidation(value: string): string | null {
  if (!/^\d+$/i.test(value)) {
    return 'A numeric amount is required';
  }
  return null;
}
