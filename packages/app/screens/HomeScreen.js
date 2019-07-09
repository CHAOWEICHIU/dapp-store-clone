import React from 'react'
import {
  View,
  Button,
} from 'react-native'
import {
  SCREEN_GOOGLE_MAP_EXPLORER,
} from '../constants/screens'


const HomeScreen = (props) => {
  const { navigation } = props
  return (
    <View>
      <Button
        title="Google Map"
        onPress={() => navigation.push(SCREEN_GOOGLE_MAP_EXPLORER)}
      />
    </View>
  )
}

export default HomeScreen
