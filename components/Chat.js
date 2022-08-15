import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#090C08',
      messages: [],
    };
  }
  componentDidMount() {
    //Set name according to the state through props
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    //Set Background color accroding to the state through props
    const { bgColor } = this.props.route.params;
    this.setState({ bgColor });
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello Developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.bgColor }]}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        <Button title="Go to Start" onPress={() => this.props.navigation.navigate('Start')} />
      </View>
    );
  }
}
//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
