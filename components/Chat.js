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
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

//Import firestore
const firebase = require('firebase');
require('firebase/firestore');
//Initialize FireBase app.
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

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#090C08',
      messages: [],
      uid: '0',
    };
  }
  //Get messages from asyncStorage or set an empty array if no messages found
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Save messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //Delete messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //Retrieve chat messages from asyncStorage
    this.getMessages();
    // Creating reference to messages collection
    this.referenceChatMessages = firebase.firestore().collection('messages');

    //Manage anonymous authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        try {
          firebase.auth().signInAnonymously();
        } catch ({ error }) {
          alert(error);
        }
      }
      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
        },
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
    this.referenceChatMessagesUser = firebase
      .firestore()
      .collection('messages')
      .where('uid', '==', this.state.uid);

    // Listen for collection changes for current user
    this.unsubscribeChatUser = this.referenceChatMessagesUser.onSnapshot(this.onCollectionUpdate);

    //Assign the state of name to a variable through props from Start.js
    let name = this.props.route.params.name;
    //Set the title of the screen to the state of name via setOptions method.
    this.props.navigation.setOptions({ title: name });

    //Assign the state of bgColor to a variable through props from Start.js
    const { bgColor } = this.props.route.params;
    //Update the state of bgColor to the state received from Start.js
    this.setState({ bgColor });
  }
  componentWillUnmount() {
    //Unsubsrice from collection when component unmounts
    this.authUnsubscribe();
  }
  //Method to add messages to the database
  addMessages(messages) {
    const message = messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
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

  //Method to add the previous state of meesages to the current state so messages aren't deleted
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        //Save messages to local storage when a message is sent
        this.saveMessages();
        //Add messages to the state when a message is sent
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
