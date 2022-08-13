import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#090C08',
    };
  }

  changeBgColor = (newBgColor) => {
    this.setState({ bgColor: newBgColor });
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground source={require('../assets/backgroundimage.png')} style={styles.image}>
          <Text style={styles.title}>ChatUp</Text>
          <View style={styles.box}>
            <TextInput
              style={styles.textInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
            <View style={styles.colorContainer}>
              <Text style={styles.colorTitle}>Choose Background Color:</Text>
              <View style={styles.bgColors}>
                {/* TouchableOpacity changes the opacity to give feedback onPress */}
                <TouchableOpacity
                  style={[styles.color1, styles.colorPicker]}
                  onPress={() => this.changeBgColor({ bgColor: '#090C08' })}
                />
                <TouchableOpacity
                  style={[styles.color2, styles.colorPicker]}
                  onPress={() => this.changeBgColor({ bgColor: '#474056' })}
                />
                <TouchableOpacity
                  onPress={() => this.changeBgColor({ bgColor: '#8A95A5' })}
                  style={[styles.color3, styles.colorPicker]}
                />
                <TouchableOpacity
                  onPress={() => this.changeBgColor({ bgColor: '#8A95A5' })}
                  style={[styles.color4, styles.colorPicker]}
                />
              </View>
            </View>
            <View style={styles.chatBtnContainer}>
              <Button
                style={styles.chatBtn}
                title="Start Chatting"
                onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
//Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    padding: '30%',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    width: '88%',
    padding: '2%',
    borderWidth: 1,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    marginTop: '5%',
  },
  colorContainer: {
    width: '88%',
    height: '65%',
    justifyContent: 'center',
    marginLeft: '30%',
  },
  bgColors: {
    flex: 1,
    flexDirection: 'row',
  },
  colorPicker: {
    height: 30,
    width: 30,
    margin: 10,
    borderRadius: 15,
  },
  color1: {
    backgroundColor: '#090C08',
    borderRadius: 0.5,
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  chatBtnContainer: {
    width: '88%',
    justifyContent: 'flex-end',
  },
  chatBtn: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    resizeMode: 'cover',
    width: '100%',
  },
  box: {
    flex: 1,
    width: '88%',
    height: '44%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    margin: '5%',
    padding: '5%',
  },
});
