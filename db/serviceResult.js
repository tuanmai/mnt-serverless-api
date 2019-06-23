const successResult = data => ({ success: true, data });
const failureResult = error => ({ success: false, error });

export { successResult, failureResult };
