import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#090C08',
    };
  }
  componentDidMount() {
    //Set name according to the state through props
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    //Set Background color accroding to the state through props
    const { bgColor } = this.props.route.params;
    this.setState({ bgColor });
  }
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.bgColor }]}>
        <Button title="Go to Start" onPress={() => this.props.navigation.navigate('Start')} />
      </View>
    );
  }
}
//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
