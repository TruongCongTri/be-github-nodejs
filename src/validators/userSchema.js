import * as yup from "yup";

export const likeGitHubUserSchema = yup.object({
  phone_number: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in international format"
    )
    .required(),
  github_user_id: yup.number().required(),
});

export const getUserProfileSchema = yup.object({
  phone_number: yup
    .string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in international format"
    )
    .required(),
});
