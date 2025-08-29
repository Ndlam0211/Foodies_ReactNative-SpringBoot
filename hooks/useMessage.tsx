import {
  hideAllMessages,
  hideMessage,
  hideMessagesByType,
  MessageType,
  showMessage,
} from "@/states/reducers/messageSlice";
import { useAppDispatch } from "@/states/reduxHook";
import { useCallback } from "react";

export interface ShowMessageOptions {
  message: string;
  type?: MessageType;
  autoHide?: boolean;
  autoHideDuration?: number;
  position?: "top" | "center" | "bottom";
  showCloseButton?: boolean;
}

export const useMessage = () => {
  const dispatch = useAppDispatch();

  const show = useCallback(
    (options: ShowMessageOptions) => {
      dispatch(
        showMessage({
          type: "info",
          autoHide: true,
          autoHideDuration: 4000,
          position: "top",
          showCloseButton: true,
          ...options,
        })
      );
    },
    [dispatch]
  );

  const showSuccess = useCallback(
    (message: string, options?: Partial<ShowMessageOptions>) => {
      show({ ...options, message, type: "success" });
    },
    [show]
  );

  const showError = useCallback(
    (message: string, options?: Partial<ShowMessageOptions>) => {
      show({ ...options, message, type: "error" });
    },
    [show]
  );

  const showWarning = useCallback(
    (message: string, options?: Partial<ShowMessageOptions>) => {
      show({ ...options, message, type: "warning" });
    },
    [show]
  );

  const showInfo = useCallback(
    (message: string, options?: Partial<ShowMessageOptions>) => {
      show({ ...options, message, type: "info" });
    },
    [show]
  );

  const hide = useCallback(
    (messageId: string) => {
      dispatch(hideMessage(messageId));
    },
    [dispatch]
  );

  const hideAll = useCallback(() => {
    dispatch(hideAllMessages());
  }, [dispatch]);

  const hideByType = useCallback(
    (type: MessageType) => {
      dispatch(hideMessagesByType(type));
    },
    [dispatch]
  );

  return {
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
    hideAll,
    hideByType,
  };
};

export default useMessage;
