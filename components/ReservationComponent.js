import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, Alert, Platform, ToastAndroid } from 'react-native';
import DatePicker from 'react-native-datepicker'
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo'
import * as Calendar from 'expo-calendar';
import * as Localization from 'expo-localization';

// import * as Notifications from 'expo-notifications';



class Reservation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    okPress = () => {
        // this.presentLocalNotification(this.state.date);       
        this.addReservationToCalendar();
        this.resetForm();
    }

    async addReservationToCalendar() {

        const startDate = new Date(Date.parse(this.state.date))
        const endDate = new Date(Date.parse(this.state.date) + 2 * 60 * 60 * 1000)

        // console.log("State :", this.state.date);
        // console.log("Start date : ",startDate);
        // console.log("End Date", endDate)
        // console.log(Localization.timezone);

        if (Platform.OS === 'android') {
            const defaultCalendar = await Calendar.getCalendarsAsync();
            // console.log("Default : ",defaultCalendar);
            Calendar.createEventAsync(defaultCalendar[0].id, {
                title: 'Confusion Restaurant',
                startDate: startDate,
                endDate: endDate,
                timeZone: Localization.timezone,
                location: '121 Clear Water Bay Road'
            })
        }
        else if (Platform.OS === 'ios') {
            const defaultCalendar = await Calendar.getDefaultCalendarAsync();
            Calendar.createEventAsync(defaultCalendar.id, {
                title: 'Confusion Restaurant',
                startDate: startDate,
                endDate: endDate,
                timeZone: Localization.timezone,
                location: '121 Clear Water Bay Road'
            })
                .catch(err => console.log(err))
            Calendar.createReminderAsync(null, {
                title: 'Confusion Restaurant',
                startDate: startDate,
                endDate: endDate,
                timeZone: Localization.timezone,
                location: '121 Clear Water Bay Road'
            })
                .catch(err => console.log(err))

        }
    }

    handleReservation() {
        // console.log(JSON.stringify(this.state));
        // this.toggleModal();
        Alert.alert(
            "Confirm Details",
            `Number of Guests : ${this.state.guests}\n Somking : ${this.state.smoking ? "Yes" : "No"}\n Date and Time : ${this.state.date}\n`,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm()
                },
                {
                    text: 'Ok',
                    onPress: () => this.okPress()
                }
            ],
            { cancelable: false }
        )


    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;

    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({

            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                "channelId": "notify",
                color: '#512DA8'
            }
        });
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const calendar = Permissions.askAsync(Permissions.CALENDAR);
        }
        else if (Platform.OS === 'ios') {
            const Reminder = await Permissions.askAsync(Permissions.REMINDERS);
            const Calendar = await Permissions.askAsync(Permissions.CALENDAR);
        }
        // const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        // console.log(defaultCalendar.id);
    }




    render() {
        return (
            <Animatable.View animation="zoomInUp" style={{ flex: 1, marginBottom: 300 }} >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        trackColor={{ true: "#512DA8" }}
                        onValueChange={(value) => this.setState({ smoking: value })}>
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <DatePicker
                        style={{ flex: 2, marginRight: 20 }}
                        date={this.state.date}
                        format=''
                        mode="datetime"
                        placeholder="select date and Time"
                        minDate="2017-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => { this.setState({ date: date }) }}
                    />
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                {/* <Modal
                        animationType={'slide'}
                        transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => {this.toggleModal; this.resetForm}}
                        onRequestClose = {() => {this.toggleModal; this.resetForm}}
                    >
                        <View style = {styles.modal}>
                            <Text style = {styles.modalTitle}>Your Reservation</Text>
                            <Text style = {styles.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style = {styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style = {styles.modalText}>Date and Time: {this.state.date}</Text>
                            <Button 
                                onPress = {() =>{this.toggleModal()}}
                                color="red"
                                title="Edit" 
                            />
                            <Button 
                                onPress = {() =>{this.toggleModal(); this.resetForm();}}
                                color="#512DA8"
                                title="Close" 
                            />
                        </View>
                    </Modal> */}
            </Animatable.View>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 1
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 50
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});



export default Reservation;
