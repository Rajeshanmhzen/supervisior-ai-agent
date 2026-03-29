const EMAIL_KEY = "fp_email";
const CODE_KEY = "fp_code";

const safeGet = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

const safeRemove = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const forgotFlowStorage = {
  getEmail: () => safeGet(EMAIL_KEY),
  setEmail: (email: string) => safeSet(EMAIL_KEY, email),
  getCode: () => safeGet(CODE_KEY),
  setCode: (code: string) => safeSet(CODE_KEY, code),
  clear: () => {
    safeRemove(EMAIL_KEY);
    safeRemove(CODE_KEY);
  },
};
