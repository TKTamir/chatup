import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {} from 'react-native';

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
    //Set the state of messages to show a system message, avatar buble, date, etc..
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
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }
  //Method to add the previous state of meesages to the current state so messages aren't deleted
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //RenderBubble customizes the chat bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
        }}
      />
    );
  }
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.bgColor }]}>
        {/* Render the chat element */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        <Button
          accessible={true}
          accessibilityLabel="Back to start screen."
          accessibilityHint="Lets you move back to the start screen."
          accessibilityRole="button"
          title="Go to Start"
          onPress={() => this.props.navigation.navigate('Start')}
        />
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
