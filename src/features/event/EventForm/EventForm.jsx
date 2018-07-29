/*global google*/
import React, { Component } from "react";
import { connect } from 'react-redux'
import  moment  from "moment";
import {geocodeByAddress, getLatLng} from 'react-places-autocomplete'
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import {updateEvent, createEvent} from '../eventActions'
import { reduxForm, Field } from 'redux-form'
import Script from 'react-load-script'
import cuid from 'cuid'
import {combineValidators, composeValidators, isRequired, hasLengthGreaterThan} from 'revalidate'
import TextInput from '../../../app/common/form/TextInput'
import TextArea from '../../../app/common/form/TextArea'
import SelectInput from '../../../app/common/form/SelectInput'
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";

const mapState = (state, ownProps) => {
    const eventId = ownProps.match.params.id;

    let event = {}

    if(eventId && state.events.length > 0) {
        event = state.events.filter(event => event.id === eventId)[0]
    }
    return {initialValues: event};
}

const actions = {
    createEvent,
    updateEvent
}

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Please provide a category'}),
    description: composeValidators(
        isRequired({message: 'Pleas enter description'}),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('city'),
    venue: isRequired('venue'),
    date: isRequired('date')
})

class EventForm extends Component {
    state = {
        cityLatLng : {},
        venueLatLng: {},
        scriptLoaded: false
    }
    handleScriptLoad = () => this.setState({ scriptLoaded: true });

    handleCitySelect = (selectedCity) => {
        geocodeByAddress(selectedCity)
        .then(results =>
          getLatLng(results[0])
        ).then(latlng => {
            this.setState({ cityLatLng: latlng });
        }).then(() => {
            this.props.change('city', selectedCity)
        })
    }
    onFormSubmit = values => {
        values.date = moment(values.date).format();
        if(this.props.initialValues.id) {
            this.props.updateEvent(values);
            this.props.history.goBack();
        } else {
            const newEvent = { 
                ...values,
                id: cuid(),
                hostPhotoURL: 'assets/user.png',
                hostedBy: 'Bob'
            }
            this.props.createEvent(newEvent);
            this.props.history.push('/events')
        }
    };

    render() {
        const {invalid, submitting, pristine} = this.props;
        return (
            <Grid>
                <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCWojxsqP2Uke0Uj42WWgo74XccU_Hurns&libraries=places" onLoad={this.handleScriptLoad} />
                <Grid.Column width={10}>
                    <Segment>
                        <Header sub color='teal' content='Event Details' />
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                        <Field name='title' type='text' component={TextInput} placeholder='Give your event a name' />
                        <Field name='category' type='text' options={category} component={SelectInput} placeholder='What is your event about' />
                        <Field name='description' type='text' component={TextArea} rows={3} placeholder='Tell as about your event' />
                        <Header sub color='teal' content='Event Location Details' />
                        <Field  name='city'
                                onSelect={this.handleCitySelect} 
                                type='text' 
                                component={PlaceInput} 
                                options={{types: ['(cities)']}} 
                                placeholder='Event city' 
                        />
                        {this.state.scriptLoaded &&
                        <Field  name='venue' 
                                type='text' 
                                component={PlaceInput} 
                                options={{
                                    location: new google.maps.LatLng(this.state.cityLatLng),
                                    radius: 1000,
                                    types: ['establishment']
                                }} 
                                placeholder='Event venue' 
                        />}
                        <Field name='date'
                            type='text' 
                            component={DateInput} 
                            placeholder='Date and Time of event' 
                            dateFormat='YYYY-MM-DD HH:mm' 
                            timeFormat='HH:mm'
                            showTimeSelect />
                        <Button disabled={invalid || submitting || pristine} positive type="submit">
                            Submit
                        </Button>
                        <Button onClick={this.props.history.goBack} type="button">
                            Cancel
                        </Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(mapState, actions)(reduxForm({form: 'eventForm', enableReinitialize: true, validate})(EventForm));
