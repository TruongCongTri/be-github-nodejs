import * as yup from "yup";

export const searchGithubUsersSchema = yup.object({
  q: yup.string().required("Search query is required"),
  page: yup.number().min(1).default(1),
  per_page: yup
    .number()
    .transform((value) => {
      // Ensure per_page is a number and cap it at 100
      if (typeof value !== "number" || isNaN(value)) return undefined;
      return value > 100 ? 100 : value;
    })
    .min(1)
    .default(10),
});


export const findGitHubUserProfileSchema = yup.object({
  github_user_id: yup.number().required("GitHub user ID is required"),
});
