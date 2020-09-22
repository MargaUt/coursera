import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { LEADERS } from '../shared/leaders';
import { FlatList, View } from 'react-native';
import { ListItem } from 'react-native-elements';



function History(props) {
    return (
        <View style={{fontWeight: 'bold'}}>
            <Text style={styles.title} > Our History </Text>
            <Text style={styles.text}>
                Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong.
                With its unique brand of world fusion cuisine that can be found nowhere else,
                it enjoys patronage from the A-list clientele in Hong Kong.
                Featuring four of the best three-star Michelin chefs in the world,
                you never know what will arrive on your plate the next time you visit us.
                </Text>
            <Text style={styles.text}>
                The restaurant traces its humble beginnings to The Frying Pan,
                a successful chain started by our CEO, Mr. Peter Pan,
                that featured for the first time the world's best cuisines in a pan.
                </Text>
        </View>
    );

}
class AboutUs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaders: LEADERS,
            title: "Corporate Leadership"
        };
    }
    static navigationOptions = {
        title: 'About Us'
    };
    render() {
        const renderAboutUs = ({ item, index }) => {
            return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: require('./images/alberto.png') }}
                    data={this.state.leaders}
                />

            );
        }
        return (
            <ScrollView>
                <Card>
                    <History />
                </Card>
                <Card>
                    <Text style={styles.title} > {this.state.title}</Text>
                    <FlatList
                        data={this.state.leaders}
                        renderItem={renderAboutUs}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>
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
        textAlign: 'left',
        fontWeight: 'bold' 
    }
  });

export default AboutUs;