const normalizeErrors = (errors) =>
  errors.reduce((acc, item) => {
    if (item.path in acc) {
      acc[item.path].push(item.message);
    } else {
      acc[item.path] = [item.message];
    }
    return acc;
  }, {});
export default normalizeErrors;
