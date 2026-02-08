import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export type ActiveTabValue = {
  activeTab: string | null;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
};

export type SelectedFriend = {
  id: number | string;
  userid?: number | string;
  avatar?: string | null | import("next/image").StaticImageData;
  firstname?: string;
  lastname?: string;
  username?: string;
  status?: boolean;
};

export type SelectedFriendContextValue = {
  selectedFriend: SelectedFriend | null;
  setSelectedFriend: Dispatch<SetStateAction<SelectedFriend | null>>;
};

export const SelectedFriendContext =
  createContext<SelectedFriendContextValue | undefined>(undefined);
export const ActiveTabContext = createContext<ActiveTabValue | undefined>(undefined);

export function useSelectedFriend() {
  const context = useContext(SelectedFriendContext);
  if (!context) {
    throw new Error(
      "useSelectedFriend must be used within a SelectedFriendContext.Provider"
    );
  }
  return context;
}

export function useActiveTab() {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error(
      "useActiveTab must be used within an ActiveTabContext.Provider"
    );
  }
  return context;
}
