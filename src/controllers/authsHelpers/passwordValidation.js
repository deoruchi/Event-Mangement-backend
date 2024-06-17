//a file for the validation for the password, before saving the file
export function validate_password(password) {
  return password.length > 8;
}

export function validate_password_strength(password) {
  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}
