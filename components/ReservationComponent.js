import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Switch, Button, Alert, Modal } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from 'react-native-animatable';







class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            time: new Date(),
            show: false,
            mode: "date",
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }


    okPress = () => {
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
            date: new Date(),
            time: new Date(),
            show: false,
            mode: "date",
            date: '',
            showModal: false
        });
    }

    render() {
        const showDatepicker = () => {
            this.setState({ show: true });
        };
        return (
            <Animatable.View animation="zoomInUp" style={{ flex: 1, marginBottom: 300 }} >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ guests: itemValue })
                        }
                    >
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        trackColor="#512DA8"
                        onValueChange={(value) => this.setState({ smoking: value })}
                    ></Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <Text style={styles.formItem} onPress={showDatepicker}>
                        {this.state.date.toDateString()} {this.state.time.toTimeString()}
                    </Text>
                    {this.state.show && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={this.state.mode}
                            display="default"
                            minimumDate={new Date()}
                            onChange={(selected, value) => {
                                if (value !== undefined) {
                                    this.setState({
                                        show: this.state.mode === "time" ? false : true,
                                        mode: "time",
                                        date: new Date(selected.nativeEvent.timestamp),
                                        time: new Date(selected.nativeEvent.timestamp),
                                    });
                                } else {
                                    this.setState({ show: false });
                                }
                            }}
                        />
                    )}
                </View>
                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Your Reservation</Text>
                        <Text style={styles.modalText}>
                            Number of Guests: {this.state.guests}
                        </Text>
                        <Text style={styles.modalText}>
                            Smoking?: {this.state.smoking ? "Yes" : "No"}
                        </Text>
                        <Text style={styles.modalText}>
                            Date: {this.state.date.toDateString()}
                        </Text>
                        <Text style={styles.modalText}>
                            Time: {this.state.time.toTimeString()}
                        </Text>

                        <Button
                            onPress={() => {
                                this.toggleModal();
                                this.resetForm();
                            }}
                            color="#512DA8"
                            title="Close"
                        />
                    </View>
                </Modal>
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
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
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