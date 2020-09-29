import React, { Component, useRef } from 'react';
import {
    Text, View, ScrollView, FlatList, Modal, StyleSheet,
    Button, Alert, PanResponder
} from 'react-native';
import { Card, Icon, AirbnbRating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
})



function RenderDish(props) {


    const dish = props.dish;

    const viewRef = useRef(null); 

    const toggleFav = () => {
        if (props.fav) {
            // props.removeFav();
        }
        else {
            this.markFavorite();
        }
    }

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return "add";
        else if (dx > 200) {
            return "comment";
        }
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },

        onPanResponderGrant: () => {
            viewRef.current.rubberBand(1000).then(endState =>
                console.log(endState.finished ?
                    'finished' : 'cancelled'));
        },

        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })



    if (dish != null) {
        return (
            <Animatable.View
                animation="fadeInDown" duration={2000} delay={1000}
                ref={viewRef}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={
                        {
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }>
                        <Icon
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.toggleModal()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}



function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000} style={{ flexGrow: 1 }}>
            <Card title='Comments'>
                <FlatList data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={(item, index) => item.key}
                    style={{ flexGrow: 1 }}
                />
            </Card>
        </Animatable.View>
    );
}




class DishDetail extends Component {


    constructor(props) {
        super(props);
        this.state = {
            favorite: [],
            showModal: false,
            author: String,
            rating: 5,
            comment: String
        }
    }

    submitComment = (dishId) => {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment)
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    toggleFav = () => {
        this.setState({
            favorite: !this.state.favorite
        })
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
        this.toggleFav();
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {

        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish
                    dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={this.toggleModal}
                    markFav={this.markFav}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={{ marginTop: 45, marginLeft: 10 }}>
                        <Text style={{ textAlign: 'center', fontSize: 25 }}>
                            Please rate the dish and post your comment
                        </Text>
                        <AirbnbRating
                            count={5}
                            reviews={["1", "2", "3", "4", "5"]}
                            size={40}
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                            defaultRating={5}
                        />
                        <Text style={{ marginTop: 15, marginBottom: 20, fontSize: 20 }}>
                            Please type your comment below
                        </Text>

                        <Input
                            placeholder='Your name'
                            leftIcon={
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={(text) => this.setState({ author: text })}
                        />
                        <Input
                            placeholder='Your comment'
                            leftIcon={
                                <Icon
                                    name='comment'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                />
                            }
                            onChangeText={(text) => this.setState({ comment: text })}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                            <Button
                                onPress={() => this.submitComment(dishId)}
                                color="#512DA8"
                                title="Post"
                            />
                            <Button
                                onPress={() => this.toggleModal()}
                                color="red"
                                title="Close"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);