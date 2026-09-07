export const SIN_INFORMACION = 'Sin información';

export const isMissingClinicalValue = (value?: string) => {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' || trimmed === 'N/A';
};

export const displayClinicalValue = (value?: string) =>
  isMissingClinicalValue(value) ? SIN_INFORMACION : value!.trim();
