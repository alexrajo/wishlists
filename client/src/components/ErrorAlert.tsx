import { Alert, HStack, Text } from "native-base";
import { useEffect, useRef, useState } from "react";

const ErrorAlert = ({error}: {error: string}) => {
    const [errorNum, setErrorNum] = useState(0);
    const [visible, setVisible] = useState(false);
    const mounted = useRef(false);

    useEffect(() => {
        setErrorNum(errorNum + 1);
        setVisible(true);

        const tempErrorNum = errorNum;
        setTimeout(() => {
            if (tempErrorNum !== errorNum || !mounted.current) return;
            setVisible(false);
        }, 2000);
    }, [error]);

    useEffect(() => {
        mounted.current = true;
        setVisible(true);

        return () => {
            mounted.current = false;
        };
    }, []);

    return (
    <>{ visible &&
        <Alert status="error" style={{position: "absolute", bottom: 50, zIndex: 10}}>
        <HStack space={2}>
            <Alert.Icon mt={1}/>
            <Text>{error}</Text>
        </HStack>
        </Alert>
    }</>
    );
}

export default ErrorAlert;