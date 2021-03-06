import {
  AppBar,
  Hidden,
  Divider,
  Grid,
} from '@material-ui/core';
import BookClub from '../components/eventdetail/bookclub';
import Cookies from 'js-cookie';
import CommonEvent from '../components/eventdetail/commonevent';
import Error from '../pages/error';
import EventThumbNail from '../components/eventdetail/eventthumbnail';
import {gql} from 'apollo-boost';
import PropTypes from 'prop-types';
import Ticket from '../components/eventdetail/ticket';
import {Query} from 'react-apollo';
import queryString from 'query-string'
import React, {Component} from 'react';
import {
  withRouter
} from 'react-router-dom'

class EventDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      eventId: '',
    }
  }
  componentWillMount() {
    if (Cookies.get('token')) {
      this.EVENT_DETAIL_REQUEST_QUERY = gql`
        query getEvent($eventId: ID!) {
          event(id: $eventId) {
            id,
            title,
            thumbnailUrl,
            description,
            price,
            tags {
              id,
              name
            },
            ... on EventBookClub {
              bookTitle,
              bookDescription,
              bookAuthor
            },
            schedule {
              id,
              startDateTime,
              endDateTime,
              address,
              latitude,
              longitude,
            },
            host {
              id,
              firstName,
              lastName,
              selfDescription,
              profileImgUrl
            },
            participants {
              id
            }
          },
          me {
            id
          }
        }`;
          } else {
            this.EVENT_DETAIL_REQUEST_QUERY = gql`
        query getEvent($eventId: ID!) {
          event(id: $eventId) {
            id,
            title,
            thumbnailUrl,
            description,
            price,
            tags {
              id,
              name
            },
            ... on EventBookClub {
              bookTitle,
              bookDescription,
              bookAuthor
            },
            schedule {
              id,
              startDateTime,
              endDateTime,
              address,
              latitude,
              longitude,
            },
            host {
              id,
              firstName,
              lastName,
              selfDescription,
              profileImgUrl
            }
          }
        }`;
    }
    const query = queryString.parse(this.props.location.search);
    this.setState({
      eventId: query.id
    })
  }
  Event = () => {
    return (<Query query={this.EVENT_DETAIL_REQUEST_QUERY} variables={{eventId:this.state.eventId}}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return <Error/>;
        if (data) {
          return (
            <Grid container>
              <Grid item sm={8} xs={12}>
                <EventThumbNail>
                  {data.event}
                </EventThumbNail>
              </Grid>
              <Grid item sm={4} xs={12}>
                {Cookies.get('token') ?
                  <CommonEvent userId={data.me.id}>
                    {data.event}
                  </CommonEvent> :
                  <CommonEvent>
                    {data.event}
                  </CommonEvent>}
              </Grid>
              <Grid item sm={8} xs={12}>
                <BookClub>
                  {data.event}
                </BookClub>
              </Grid>
              <Hidden smUp>
                <AppBar position='sticky' style={{top: 'auto',
                  bottom: 0, background: 'white'}}>
                  <Grid item xs={12}>
                    <Divider/>
                    {Cookies.get('token') ?
                        <Ticket userId={data.me.id}>
                          {data.event}
                        </Ticket> :
                        <Ticket>
                          {data.event}
                        </Ticket>}
                  </Grid>
                </AppBar>
              </Hidden>
            </Grid>
          );
        } else return <Error/>
      }}
    </Query>)
  }

  render() {
    return (
      <>
        {this.Event()}
      </>
    );
  }
}

EventDetail.propTypes = {
  userId: PropTypes.string,
}

export default withRouter(EventDetail);
