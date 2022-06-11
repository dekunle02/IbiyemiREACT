import React, { useState, useContext } from "react";

type PopupProviderProps = {
  children: React.ReactNode;
};

type PopupContextType = {
  show: (
    component: JSX.Element,
    onShow?: () => {},
    onDismiss?: () => {}
  ) => void;
  dismiss: () => void;
};

const PopupContext = React.createContext<PopupContextType | null>(null);

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [content, setContent] = useState<JSX.Element>(<></>);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [onDismissCallback, setOnDismissCallback] = useState(() => () => {});

  /* optional arguments to send with show
   * an optional object that receives 2 optional keys ->
   * onShow: a callback for injecting an action that can be completed after the pop is shown
   * onDismiss: a callback for injecting an action that can be completed after the pop is dismissed
   * popup.show(component, {onShow:()=>{}, onDelete:()=>{}})
   */
  const show = (
    component: JSX.Element,
    onShow?: () => {},
    onDismiss?: () => {}
  ) => {
    setContent(component);
    setShowPopup(true);
    if (onShow) {
      onShow();
    }
    if (onDismiss) {
      setOnDismissCallback(() => onDismiss());
    }
  };

  const dismiss = () => {
    setContent(<></>);
    setShowPopup(false);
    onDismissCallback();
    setOnDismissCallback(() => () => {});
  };

  const propObject = {
    show: show,
    dismiss: dismiss,
  };

  return (
    <PopupContext.Provider value={propObject}>
      {showPopup && (
        <div
          className="w-screen h-screen z-[24] fixed top-0 right-0 bg-colorBlack/50 flex flex-col justify-center items-center"
          onClick={dismiss}
        >
          <div
            className="mx-auto my-auto animate-slideup"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
      {children}
    </PopupContext.Provider>
  );
}
