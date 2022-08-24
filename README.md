# Chatup
ChatUp is a React Native app for mobile devices. The app provides users with a chat interface and options to share images and their location.
## Screenshot
<img src="https://user-images.githubusercontent.com/104828119/186432024-e25725bd-5d3b-4449-9b9c-d3d69743b053.png" width="400" height="800">


## Tech Tools
● HTML, CSS, Javascript  

● React Native  

● Firebase/Firestore  

● Expo  

● Gifted Chat  


## User Stories  

● As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.  

● As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.  

● As a user, I want to send images to my friends to show them what I’m currently doing.  

● As a user, I want to share my location with my friends to show them where I am.  

● As a user, I want to be able to read my messages offline so I can reread conversations at any
time.  

● As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.  


## Key Features  

● A page where users can enter their name and choose a background color for the chat screen
before joining the chat.  

● A page displaying the conversation, as well as an input field and submit button.  

● The chat must provide users with two additional communication features: sending images
and location data.  

● Data gets stored online and offline.  


## Technical Requirements  

● The app must be written in React Native.  

● The app must be developed using Expo.  

● The app must be styled according to the given screen design.  

● Chat conversations must be stored in Google Firestore Database.  

● The app must authenticate users anonymously via Google Firebase authentication.  

● Chat conversations must be stored locally.  

● The app must let users pick and send images from the phone’s image library.  

● The app must let users take pictures with the device’s camera app, and send them.  

● The app must store images in Firebase Cloud Storage.  

● The app must be able to read the user’s location data.  


## Development Process

### Setting Up the Development Environment  

1. Install Expo CLI  

    npm install expo-cli --global  

2. Initilliaze a new expo project  

    expo init [projectname]  
    
3. Navigate to the root directory  

    cd [path]  

4. Start expo prject  

    expo start  

### Setting up Firestore Database

1. Sign-in to <a href="https://console.firebase.google.com/u/0/">Google Firebase</a> and select 'Create a Project'

2. Select Firestore Database from the sidebar on the left

3. Click on "Start Collcetion", choose the option 'Start in Test Mode', choose a region and then create a collection called 'messages'  

4. Set-up authentication by going to Project Settings on the sidebar and then select the </> icon from the options.

5. Click Register to generate the configuration code, the code received will allow your app to connect to the Firestore.

### Setting up Firebase Storage for images

1. Sign-in to <a href="https://console.firebase.google.com/u/0/">Google Firebase</a>

2. Click on "Storage" on the sidebar

3. Click on "Get Started" to set up the Firebase storage, keep the default options and approve.

To connect your app to the Firestore make sure you have imported it via-
const firebase = require('firebase');
require('firebase/firestore');

Then initiallize your app using the code below, Make sure to replace it with the code you received  in Step 5. of setting up the Firestore Database. 

### Installing dependencies-

Please install the following dependencies-  

    npm install react-native-gifted-chat --save  
    npm install --save firebase@7.9.0  
    expo install @react-native-async-storage/async-storage   
    expo install @react-native-community/netinfo  
    expo install expo-permissions  
    expo install expo-image-picker  
    expo install expo-location  
    expo install react-native-maps  




