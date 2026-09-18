export function validateFields<T extends object>(
  data: T,
  requiredFields: readonly (keyof T)[]
): boolean {
  return requiredFields.every(field => {
    const value = data[field];

    return value !== null &&
      value !== undefined &&
      String(value).trim() !== '';
  });
}