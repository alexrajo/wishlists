import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Button } from "react-native";
import {View, Text} from "native-base";

const DateInput = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState(undefined);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setShow(false);

    if (selectedDate !== undefined) {
        setDate(currentDate!);
    }
  };

  const showMode = (currentMode: any) => {
    if (Platform.OS === "android") {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      <Text>selected: {date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateInput;
