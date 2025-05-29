import * as yup from "yup";

export const createCodeSchema = yup.object({
  phone_number: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in international format"
    )
    .required(),
});

export const validateCodeSchema = yup.object({
  phone_number: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in international format"
    )
    .required(),
  access_code: yup.string().length(6).required(),
});
