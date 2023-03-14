import { View, Text, FlatList, Button, Center } from "native-base";
import React, { useEffect, useState } from "react";
import { GestureResponderEvent, ListRenderItemInfo, RefreshControl, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { HOST } from "../config/variables";
import { RefreshableListProps } from "../config/types";
import useAuthorizedRequest from "../hooks/useAuthorizedRequest";

type ListData<T> = T[];

const RefreshableList = <T,>({
  children,
  endpoint,
  placeholder,
  refreshSignal,
  keyExtractor,
  itemRenderer,
}: RefreshableListProps) => {
  const { authToken } = useAuth();

  const { getRequestObject } = useAuthorizedRequest({
    endpoint: endpoint,
    method: "GET",
  });

  const [request, setRequest] = useState(getRequestObject());
  const { data, error: fetchError, isPending, refresh } = useFetch<ListData<T>>(request);

  useEffect(() => {
    setRequest(getRequestObject()); // A little bit unsure about how getRequestObject() reacts to authToken changes
  }, [authToken, endpoint]);

  useEffect(() => {
    if (refreshSignal === undefined) return;
    refresh();
  }, [refreshSignal]);

  return (
    <View>
      <Center>
        {fetchError && <Text color={"red.500"}>{fetchError}</Text>}
        {data && data.length < 1 && placeholder}

        {!fetchError ? (
          <>
            <FlatList
              style={styles.list}
              data={data}
              renderItem={itemRenderer}
              keyExtractor={keyExtractor}
              refreshControl={<RefreshControl refreshing={isPending} onRefresh={refresh} />}
              height="100%"
            />
            {children}
          </>
        ) : (
          <Button onPress={refresh}>Try again</Button>
        )}
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
});

export default RefreshableList;
