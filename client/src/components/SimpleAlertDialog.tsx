import { AlertDialog, Button, Text } from "native-base";
import { ColorSchemeType } from "native-base/lib/typescript/components/types";
import { useRef, useState } from "react";

type SimpleAlertDialogProps = {
  title: string;
  children: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  isAlertDialogOpen: boolean;
  setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmColor?: ColorSchemeType;
  isConfirmationRestricted?: boolean;
};

const SimpleAlertDialog = (props: SimpleAlertDialogProps) => {
  const {
    title,
    children,
    cancelText,
    confirmText,
    onConfirm,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    confirmColor,
    isConfirmationRestricted,
  } = props;
  const cancelRef = useRef(null);

  const onConfirmButtonPressed = () => {
    setIsAlertDialogOpen(false);
    onConfirm();
  };

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      onClose={() => setIsAlertDialogOpen(false)}
      isOpen={isAlertDialogOpen}
    >
      <AlertDialog.Content>
        <AlertDialog.Header>
          <Text fontWeight="semibold">{title}</Text>
          <AlertDialog.CloseButton />
        </AlertDialog.Header>
        <AlertDialog.Body>{children}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button
            variant="ghost"
            onPress={() => setIsAlertDialogOpen(false)}
            ref={cancelRef}
          >
            {cancelText !== undefined ? cancelText : "Cancel"}
          </Button>
          <Button
            onPress={onConfirmButtonPressed}
            colorScheme={confirmColor || "primary"}
            isDisabled={isConfirmationRestricted}
          >
            {confirmText !== undefined ? confirmText : "Confirm"}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default SimpleAlertDialog;
