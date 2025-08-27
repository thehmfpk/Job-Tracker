export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateRequired(value) {
  return value && value.toString().trim().length > 0;
}

export function validateApplicationForm(data) {
  const errors = {};
  
  if (!validateRequired(data.company)) {
    errors.company = 'Company name is required';
  }
  
  if (!validateRequired(data.title)) {
    errors.title = 'Job title is required';
  }
  
  if (!validateRequired(data.status)) {
    errors.status = 'Status is required';
  }
  
  if (!validateRequired(data.appliedDate)) {
    errors.appliedDate = 'Application date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateJobForm(data) {
  const errors = {};
  
  if (!validateRequired(data.title)) {
    errors.title = 'Job title is required';
  }
  
  if (!validateRequired(data.company)) {
    errors.company = 'Company name is required';
  }
  
  if (!validateRequired(data.employmentType)) {
    errors.employmentType = 'Employment type is required';
  }
  
  if (!validateRequired(data.description)) {
    errors.description = 'Job description is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}