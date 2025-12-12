import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const AUTH_ERRORS = {
  USER_NOT_FOUND: "Invalid email or password.",
  INVALID_PASSWORD: "Invalid email or password.",
  USER_IS_ALREADY_EXIST:
    "An account with this email already exists. Try logging in instead.",
  MISSING_FIELD: "Please complete all required fields.",
  UNAUTHORIZED_NO_TOKEN: "You must be logged in to view this page.",
  INVALID_TOKEN: "Your session has expired. Please log in again.",
  default: "An unexpected error occurred. Please try again.",
};

export const SEARCH_ERROR = {
  QUERY_PARAMETER_REQUERED: "Please enter a keyword to search.",
  QUERY_TOO_SHORT:
    "Search term is too short. Please use at least 3 characters.",
  QUERY_TOO_LONG: "Search term is too long. Please shorten your query.",
  default: "Search failed. Please try again.",
};
