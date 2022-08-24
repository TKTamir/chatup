import React from 'react';
import { View, Text, Button, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
    this._isMounted = false;
    this.state = {
      name: '',
      bgColor: '#090C08',
      messages: [],
      uid: '0',
      isConnected: false,
      image: null,
      location: null,
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
    //Assign the state of name to a variable through props from Start.js
    let name = this.props.route.params.name;
    //Set the title of the screen to the state of name via setOptions method.
    this.props.navigation.setOptions({ title: name });

    //Check if user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });

        // Reference used to load messages from FireStore
        this.referenceChatMessagesUser = firebase.firestore().collection('messages');

        //Manage anonymous authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            try {
              console.log('inside');
              firebase.auth().signInAnonymously();
            } catch ({ error }) {
              alert(error);
            }
          }
          console.log('setting state');
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
            },
            messages: [],
          });
          // Creating reference to messages collection
          this.referenceChatMessages = firebase.firestore().collection('messages');
          this.unsubscribe = this.referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });
        //Retrieve chat messages from asyncStorage
        this.getMessages();
      }
    });

    //Assign the state of bgColor to a variable through props from Start.js
    const { bgColor } = this.props.route.params;
    //Update the state of bgColor to the state received from Start.js
    this.setState({ bgColor });
  }
  componentWillUnmount() {
    this._isMounted = false;
    //Unsubsrice from collection when component unmounts
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }
  //Method to add messages to the database
  addMessages(messages) {
    const message = messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
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
        image: data.image || null,
        location: data.location || null,
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

  // Render custom actions buttons
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // Don't render inputToolbar if user is offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
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
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.bgColor }]}>
        {/* Render the chat element */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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
