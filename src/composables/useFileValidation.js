export const useFileValidation = () => {
  const validateFile = (file, acceptedTypes, maxSize) => {
    if (!file) {
      return { valid: false, message: 'File is required.' };
    }

    const isValidType = acceptedTypes.includes(file.type);
    const isValidSize = file.size <= maxSize;

    if (!isValidType) {
      return { valid: false, message: `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}` };
    }

    if (!isValidSize) {
      return { valid: false, message: `File size exceeds the limit of ${maxSize / 1024 / 1024}MB.` };
    }

    return { valid: true, message: '' };
  };

  return { validateFile };
};