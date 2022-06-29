import { AlertDialog, Button, Text } from "native-base";
import { useRef, useState } from "react";

const SimpleAlertDialog = ({title, bodyText, cancelText, confirmText, onConfirm, isAlertDialogOpen, setIsAlertDialogOpen}: {title: string, bodyText: string, cancelText: string, confirmText: string, onConfirm: () => void, isAlertDialogOpen: boolean, setIsAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    
    const cancelRef = useRef(null);

    const onConfirmButtonPressed = () => {
        setIsAlertDialogOpen(false);
        onConfirm();
    }

    return (
        <AlertDialog leastDestructiveRef={cancelRef} onClose={() => setIsAlertDialogOpen(false)} isOpen={isAlertDialogOpen}>
            <AlertDialog.Content>
            <AlertDialog.Header>
                <Text fontWeight="semibold">{title}</Text>
                <AlertDialog.CloseButton/>
            </AlertDialog.Header>
            <AlertDialog.Body>
                <Text>{bodyText}</Text>
            </AlertDialog.Body>
            <AlertDialog.Footer>
                <Button variant="ghost" onPress={() => setIsAlertDialogOpen(false)} ref={cancelRef}>{cancelText}</Button>
                <Button onPress={onConfirmButtonPressed} colorScheme="rose">{confirmText}</Button>
            </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}

export default SimpleAlertDialog;