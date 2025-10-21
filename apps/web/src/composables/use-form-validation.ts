import { ref } from 'vue';
import { type z } from 'zod';

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const errors = ref<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        if (field) {
          fieldErrors[field] = issue.message;
        }
      });

      errors.value = fieldErrors;
      return false;
    }

    errors.value = {};
    return true;
  };

  const getError = (field: string): string | undefined => {
    return errors.value[field];
  };

  const hasError = (field: string): boolean => {
    return Boolean(errors.value[field]);
  };

  return {
    errors,
    validate,
    getError,
    hasError,
  };
}
