import { ValidationError } from "yup";

export const formatYupError = (err: ValidationError) => {
    const errors: Array<{ path: string, message: string }> = [];

    err.inner.forEach(item => {
        errors.push({ path: item.path, message: item.message });
    });
    return errors;
}