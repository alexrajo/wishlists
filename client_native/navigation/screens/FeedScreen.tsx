import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import useFetch from "../../hooks/useFetch";

// const DATA = [
//     {
//         title: "Hello! 1"
//     },
//     {
//         title: "Hello! 2"
//     },
// ]

const FeedScreen = ({navigation}: any) => {

    const [url, setUrl] = useState("/");
    const {data, error, isPending} = useFetch(url);

    const dataRequestPressed = () => {
        setUrl("/");
    }

    return (
        <View>
            {error && <Text style={{color: '#a83232'}}>An error occurred: {error}</Text>}
            {isPending && <Text>Loading...</Text>}
            {/* {data &&
                <FlatList 
                    data={data}
                    renderItem={({item}) => (
                        <Text>{item.title}</Text>
                    )}
                    keyExtractor={(item) => item.title}
                />
            } */}
            <Text>{data}</Text>
            <Button title="Load" onPress={dataRequestPressed}></Button>
        </View>
    );
}

export default FeedScreen;