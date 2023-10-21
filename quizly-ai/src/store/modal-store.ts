import { ReactElement } from "react";
import { create } from "zustand";

interface IModalStore {
  open: boolean;
  mode?: "correct" | "incorrect" | "custom";
  content:
    | {
        mode?: IModalStore["mode"];
        image?: string;
        title?: string;
        message: string;
        buttonText?: string;
        onPress: () => void;
      }
    | undefined;
  showModal: (options: IModalStore["content"]) => void;
  hideModal: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
  open: false,
  content: undefined,
  showModal: (options: IModalStore["content"]) => {
    set({ open: true, content: options });
  },
  hideModal: () => {
    set({ open: false });
  },
}));
