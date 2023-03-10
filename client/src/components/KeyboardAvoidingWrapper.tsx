import { KeyboardAvoidingView } from "native-base";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

type KeyboardAvoidingWrapperProps = {
  children: React.ReactNode;
};

const KeyboardAvoidingWrapper = (props: KeyboardAvoidingWrapperProps) => {
  const { children } = props;

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
