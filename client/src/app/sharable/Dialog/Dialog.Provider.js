import { useState } from "react";
import DialogContext from "./Dialog.Context";

function DialogProvider({ children, ...props }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    text: "",
    handler: null,
    noBtnText: "",
    yesBtnText: ""
  });

  return (
    <DialogContext.Provider value={{ dialog, setDialog }} {...props}>
      {children}
    </DialogContext.Provider>
  );
}

export default DialogProvider;