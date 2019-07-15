import React, { useState } from "react";
import styled from "styled-components/native";
import { Text } from "react-native";
import { Button } from "@ant-design/react-native";

const CenteredView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const HomeScreen = () => {
  const [count, setCount] = useState(0);
  return (
    <CenteredView>
      <Text>{count}</Text>
      <Button size="large" onPress={() => setCount(count + 1)}>
        Increase By 1
      </Button>
    </CenteredView>
  );
};

export default HomeScreen;
