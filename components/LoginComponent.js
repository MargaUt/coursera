import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, ToastAndroid, Platform } from 'react-native';
import { Card, Button, Input, CheckBox, Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from "expo-image-manipulator";
import baseUrl from '../shared/baseUrl';
import { NavigationContainer } from '@react-navigation/native';



class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true })
                }
            })
    }

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if (this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch((error) => console.log('Could not save user info', error));
        }
        else {
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error));
        }
        if (Platform.OS !== 'ios') {
            ToastAndroid.show("LOGGED In", ToastAndroid.LONG);
        }
        // this.props.navigation.navigate('Register');
        // this.props.navigation.navigate('Register')
        // console.log(this.props.navigation.navigate('MainNavigatorScreen',{},Navigation));
        this.props.navigation.navigate('Menu');


    }

    render() {
        return (
                <View style={styles.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        secureTextEntry
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => { this.handleLogin() }}
                            title="Login"
                            type='solid'
                        />
                    </View>
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.props.navigation.navigate('Register')}
                            title="Register"
                            clear
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    size={24}
                                    color='blue'
                                    style={{ marginRight: 10 }}
                                />
                            }
                            titleStyle={{
                                color: "blue"
                            }}
                        />
                    </View>
                </View>
        );
    }

}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        }
    }

    saveAsPng = async (image) => {
        const newImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [
                { resize: { width: 400 } }
            ],
            { format: 'png' }
        );
        this.setState({ imageUrl: newImage.uri });
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                this.saveAsPng(capturedImage);

            }
        }
    }

    getImageFromGallery = async () => {
        const galleryPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (galleryPermission.status === 'granted') {
            const selectedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if (!selectedImage.cancelled) {
                console.log('Image picked');
                this.saveAsPng(selectedImage);
                // this.setState({
                //     imageUrl : selectedImage.uri
                // })
            }
        }
    }

    handleRegister() {
        // console.log(JSON.stringify(this.state));
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch((error) => console.log('Could not save user info', error));

        if (Platform.OS !== 'ios') {
            ToastAndroid.show("Success", ToastAndroid.LONG);
        }
    }

    render() {
        return (

            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={require('./images/logo.png')}
                            style={styles.image}
                        />
                        <View style={{ marginRight: 5 }}>
                            <Button
                                title="Camera"
                                onPress={this.getImageFromCamera}
                            />
                        </View>
                        <Button
                            title="Gallery"
                            onPress={this.getImageFromGallery}
                        />
                    </View>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title="Register"
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    size={24}
                                    color='white'
                                    style={{ marginRight: 10 }}
                                />
                            }
                            buttonStyle={{
                                backgroundColor: "#512DA8"
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }



}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 50,
    },
    formInput: {
        margin: 0
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: "transparent",
        borderColor: "transparent"
    },
    formButton: {
        margin: 60
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    }
});

const Login = () => {

    const tabNavigator = createBottomTabNavigator();

    // const toMenu = this.props.navigation.navigate('Menu');

    return (
        <NavigationContainer independent={true}>
            <tabNavigator.Navigator
                initialRouteName='Login'
                tabBarOptions={{
                    activeBackgroundColor: '#9575CD',
                    inactiveBackgroundColor: '#D1C4E9',
                    activeTintColor: '#ffffff',
                    inactiveTintColor: 'gray'
                }}>
                <tabNavigator.Screen
                    name='Login'
                    component={LoginTab}
                    options={{
                        title: 'Login',
                        tabBarIcon: ({ tintColor }) => (
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ color: tintColor }}
                            />
                        )
                    }}
                />
                <tabNavigator.Screen
                    name='Register'
                    component={RegisterTab}
                    options={{
                        title: 'Register',
                        tabBarIcon: ({ tintColor }) => (
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ color: tintColor }}
                            />
                        )
                    }}
                />
            </tabNavigator.Navigator>
        </NavigationContainer>
    );
}


export default Login;