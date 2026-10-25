export type FormDataValue = string | number | boolean | Blob | File | null | undefined

export const appendFormDataValue = (formData: FormData, key: string, value: FormDataValue) => {
  if (value === undefined || value === null) {
    return
  }

  if (value instanceof Blob) {
    formData.append(key, value)
    return
  }

  formData.append(key, String(value))
}

export const appendFormDataValues = (
  formData: FormData,
  key: string,
  values: readonly FormDataValue[]
) => {
  for (const value of values) {
    appendFormDataValue(formData, key, value)
  }
}
