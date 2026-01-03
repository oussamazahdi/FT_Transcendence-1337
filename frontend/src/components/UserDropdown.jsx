import React from "react";
import { useAuth } from "@/contexts/authContext";
import ProfileDropDown from "./ProfileDropDown";
import NotificationDropDown from "./NotificationDropDown";

const UserDropdown = () => {
	const { user } = useAuth();

	return (
		<div>
			<div className="flex items-center md:gap-3">
				<NotificationDropDown/>
				<ProfileDropDown user={user} />
			</div>
		</div>
	);
};

export default UserDropdown;
