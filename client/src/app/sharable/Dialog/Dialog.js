import React, { useCallback, useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

// Material
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

// Custom
import DialogContext from "./Dialog.Context";
/**
 * 
 * @param { isOpen, title, text, handler, noBtnText, yesBtnText } handler is the yesButton handler
 * @returns Sharable dialog
 * @usage
 * <DialogProvider>
      <Dialog />
    </DialogProvider>
 */
const SharableDialog = ({ children, ...rest }) => {
  const { dialog, setDialog } = useContext(DialogContext);
  const { isOpen, title, text, handler, noBtnText, yesBtnText } = dialog;
  const btnRef = useRef(null);

  const resetDialog = useCallback(() => {
    setDialog({ isOpen: false, text: "", handler: null });
  }, [setDialog]);

  const handleYesClick = () => {
    handler();
    resetDialog();
  };

  const handleNoClick = () => {
    resetDialog();
  };

  useEffect(() => {
    const { current } = btnRef;
    if (current) current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape") resetDialog();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [resetDialog]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleNoClick();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="dialog"
        {...rest}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleYesClick} autoFocus>{yesBtnText}</Button>
          <Button ref={btnRef} onClick={handleNoClick} >{noBtnText}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>,
    document.getElementById("portal")
  );
}

export default SharableDialog;