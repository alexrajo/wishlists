import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import useFetch from "../../hooks/useFetch";

const FeedScreen = ({navigation}: any) => {

    const [url, setUrl] = useState("/api/");
    const {data, error, isPending} = useFetch(url);

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
            <Text>{data && data.message}</Text>
        </View>
    );
}

export default FeedScreen;