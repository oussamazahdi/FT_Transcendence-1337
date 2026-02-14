import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs:any[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_ERRORS:Record<string, string> = {
  USER_NOT_FOUND: "Invalid email or password.",
  INVALID_PASSWORD: "Invalid email or password.",
  USER_IS_ALREADY_EXIST:"An account with this user already exists. Try login instead.",
  USERNAME_ALREADY_TAKEN:"That username is already in use. Please try another one.",
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
  EXPIRED_OTP: "The verification code has expired. Please request a new one.",
  INCORRECT: "The verification code is incorrect.",
  default: "An unexpected error occurred. Please try again.",
};

export const USER_ERROR:Record<string, string> = {
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

export const CHAT_ERROR:Record<string, string> = {
  NOT_ALLOWED_TO_CONTACT_USER:"You can no longer send messages to this user.",
  MESSAGE_TOO_LONG:"Message exceeds the allowed length. Please shorten it and try again.",
  default: "An unexpected error occurred. Please try again.",
}

export const SEARCH_USERS_ERROR: Record<string, string> = {
  INVALID_QUERY: "Please enter 2 to 20 characters to search users.",
  UNAUTHORIZED_NO_ACCESS_TOKEN: "Please sign in to search users.",
  TOKEN_REVOKED: "Your session was closed. Please sign in again.",
  EXPIRED_TOKEN: "Your session expired. Please sign in again.",
  INVALID_TOKEN: "Your session is invalid. Please sign in again.",
  DATABASE_BUSY: "The server is busy right now. Please try again in a moment.",
  INTERNAL_SERVER_ERROR: "Something went wrong on our side. Please try again later.",
  DATABASE_ERROR: "We couldn't load users right now. Please try again.",
  default: "Search failed. Please try again.",
};

class componentUtils{
	
	isExpired(notif:any) {
		if (!notif || notif.is_expired === 1) return true;
		if (!notif.expires_at) return false;
		const t = new Date(notif.expires_at).getTime();
		return Number.isFinite(t) ? Date.now() > t : false;
	}

}

export const ComponentUtils = new componentUtils();

export const parseTime = (timeString: string) => {
  const date = new Date(timeString);
  const now = new Date();

  if (isNaN(date.getTime())) 
    return timeString;

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}
