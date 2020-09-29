import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, StyleSheet, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';



class ContactDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = {
        title: 'Contact Information'
    };


    render() {
        return (
            <ScrollView>
                <Animatable.View animation="fadeInDown"
                    duration={2000} delay={1000}>
                    <Card title='Contact Information'>
                        <Text style={styles.title}> Contact information</Text>
                        <Text style={styles.text}> 121, Clear Water Bay Road</Text>
                        <Text style={styles.text}>Clear Water Bay, Kowloon </Text>
                        <Text style={styles.text}>Tel: +852 1234 5678 </Text>
                        <Text style={styles.text}> Fax: +852 8765 4321 </Text>
                        <Text style={styles.text}>Email:confusion@food.net</Text>
                    </Card>
                </Animatable.View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    title: {
        margin: 10,
        borderBottomColor: '#d0d1d5',
        borderBottomWidth: 1,
        paddingBottom: 10,
        textAlign: 'center',
        fontWeight: 'bold'

    },
    text: {
        margin: 10,
        textAlign: 'left'
    }
});

export default ContactDetail;