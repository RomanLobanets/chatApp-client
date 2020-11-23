const errorSwitch = (
  errors,
  setUsernameError,
  setEmailError,
  setPasswordError,
  setNameError
) => {
  errors.forEach(({ path, message }) => {
    switch (path) {
      case 'username':
        setUsernameError(message);
        break;
      case 'email':
        setEmailError(message);
        break;
      case 'password':
        setPasswordError(message);
        break;
      case 'name':
        setNameError(message);
        break;
      default:
        break;
    }
  });
};
export default errorSwitch;
