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

//Import firestore
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#090C08',
      messages: [],
    };
    //Not sure about the placement of the code below, maybe move out of the Class Component later
    const firebaseConfig = {
      apiKey: 'AIzaSyBF7Rt7YJY9IHWY5uanaYUti9LypNJiDmw',
      authDomain: 'chatup-83ba6.firebaseapp.com',
      projectId: 'chatup-83ba6',
      storageBucket: 'chatup-83ba6.appspot.com',
      messagingSenderId: '95269935264',
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceMessagesUser = null;
  }

  componentDidMount() {
    // Creating reference to messages collection
    this.referenceMessagesUser = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);

    //Assign the state of name to a variable through props from Start.js
    let name = this.props.route.params.name;
    //Set the title of the screen to the state of name via setOptions method.
    this.props.navigation.setOptions({ title: name });

    //Assign the state of bgColor to a variable through props from Start.js
    const { bgColor } = this.props.route.params;
    //Update the state of bgColor to the state received from Start.js
    this.setState({ bgColor });

    //Set messages through setState
    this.setState({
      messages: [
        //Opening message
        {
          _id: 2,
          text: name + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
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
        //System Message
        {
          _id: 3,
          text: 'Hi, this is a normal message',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 4,
          text: 'Hi! are you enjoying using ChatUp?',
          createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
          user: {
            _id: 3,
            name: 'Tamir Kahalany',
            avatar: 'https://placeimg.com/140/140/any',
          },
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: 'Definetly Yes',
                value: 'yes_picture',
              },
              {
                title: 'Most Definetly',
                value: 'no',
              },
            ],
          },
        },
      ],
    });
  }
  componentWillUnmount() {
    //Unsubsrice from collection when component unmounts
    // this.authUnsubscribe();
    // this.unsubscribeMessagesUser();
  }
  //Retreive current data in collection and store it in the state of messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };
  //Method to add messages to the database
  addMessages() {
    this.referenceMessagesUser.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt.toDate(),
      user: messages.user,
    });
  }
  //Method to add the previous state of meesages to the current state so messages aren't deleted
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages(this.state.messages);
      }
    );
  }

  //RenderBubble customizes the chat bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0000FF',
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
        {/* Check if the OS is android, if true adjust the keyboard height to prevent overlap, if false do nothing. */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        {/* Return to start screen button */}
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
