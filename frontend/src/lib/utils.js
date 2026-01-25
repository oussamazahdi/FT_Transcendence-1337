import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const AUTH_ERRORS = {
  USER_NOT_FOUND: "Invalid email or password.",
  INVALID_PASSWORD: "Invalid email or password.",
  USER_IS_ALREADY_EXIST:"An account with this user already exists. Try login instead.",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists. Try login instead.",
  MISSING_FIELD: "Please complete all required fields.",
  UNAUTHORIZED_NO_TOKEN: "You must be logged in to view this page.",
  INVALID_TOKEN: "Your session has expired. Please log in again.",
  TOKEN_REVOKED: "Your session has been logged out. Please log in again.",
  NO_TOKEN_PROVIDED: "Authentication required. Please log in.",
  INVALID_AVATAR:"The uploaded image format is not supported. Please use JPG or PNG.",
  EMAIL_IS_ALREADY_VERIFIED:"This email is already verified. You can proceed to login.",
  INVALID_2FA_TOKEN:"The code you entered is incorrect or expired. Please try again.",
  UNAUTHORIZED_NO_ACCESS_TOKEN: "Access denied. Please log in to continue.",
  INVALID_NAME_LENGTH:"First name, last name, and username must be at least 3 characters long.",
  EMAIL_IS_ALREADY_VERIFIED:"This email is already verified. You can proceed to login.",
  EXPIRED_OTP: "The verification code has expired. Please request a new one.",
  INCORRECT: "The verification code is incorrect.",
  default: "An unexpected error occurred. Please try again.",
};

export const USER_ERROR = {
  USER_NOT_FOUND: "We couldn't find a user with that information.",
  NEW_PASSWORDS_DO_NOT_MATCH:"The new passwords do not match. Please try again.",
  NEW_PASSWORD_MATCHS_OLD_PASSWORD:"Your new password must be different from your current password.",
  CURRENT_PASSWORD_IS_INCORRECT:"The current password you entered is incorrect.",
  USER_IS_BLOCKED: "You cannot perform this action because this user is blocked.",
  FRIENDSHIP_ALREADY_EXISTS: "You are already friends with this user!",
  REQUEST_ALREADY_SENT: "You've already sent a friend request to this person.",
  REQUEST_SENT_SUCCESSFULLY: "Friend request sent successfully!",
  REQUEST_NOT_FOUND: "This friend request no longer exists or has already been handled.",
  USER_ALREADY_BLOCKED: "This user is already in your blocked list.",
  USER_ALREADY_UNBLOCKED: "This user is not currently blocked.",
  REQUEST_ALREADY_CANCELED: "This request has already been canceled.",
  USER_ALREADY_UNFRIENDED: "You are no longer friends with this user.",
  default: "An unexpected error occurred. Please try again.",
};

export const SEARCH_ERROR = {
  QUERY_PARAMETER_REQUERED: "Please enter a keyword to search.",
  QUERY_TOO_SHORT:
    "Search term is too short. Please use at least 3 characters.",
  QUERY_TOO_LONG: "Search term is too long. Please shorten your query.",
  default: "Search failed. Please try again.",
};
