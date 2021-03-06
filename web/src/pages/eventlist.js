import EventCardsQuery from '../components/event-cards-query';
import EventlistFilters from '../components/eventlist-filters';
import {gql} from 'apollo-boost';
import Grid from '@material-ui/core/Grid';
import {Query} from 'react-apollo';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class EventList extends Component {

  constructor(props) {
    super(props);
    this.currentCursor = 0;
    this.eventListPageSize = 6;
    this.state = {
      isTagNames: false,
      allTags: [],
      selectedTagIds: [],
    };
  }

  // Query that bring Tag Names
  TAGNAMES_REQUEST_QUERY = gql`
      query($after: Int, $pageSize: Int){
          tagNames(after: $after, pageSize: $pageSize){
              tags{
                  id
                  name
                  events{
                      id
                  }
              }
          }
      }`;

  /**
   * Check Number of Event including each tag
   * Change tag array alignment
   */
  ChangeTagArrayAlignment = () => {
    const alignTags = this.state.allTags.filter(
      (tag) => tag.events.length !== 0).concat(this.state.allTags.filter(
      (tag) => tag.events.length === 0));
    console.log(alignTags);
  };

  /**
   * Set selectedTagIds state using selectedTags parameter
   * @param {Array<boolean>} selectedTags: selected tag array
   */
  HandlerTagName = (selectedTags) => {
    // Initialize cursor
    this.currentCursor = 0;
    const selectedTagIds = [];
    // Put selected tag id in selctedTagIds array
    for (let tagIndex = 0; tagIndex < this.state.allTags.length; ++tagIndex) {
      if (selectedTags[tagIndex]) {
        selectedTagIds.push(this.state.allTags[tagIndex].id);
      }
    }
    this.setState({selectedTagIds: selectedTagIds});
  };

  // Render of Eventlist Filter Component and Event Card Component
  render() {
    return (
      <div>
        {
          // Only Frist time, Bring All tag names from server
          !this.state.isTagNames
            ? (<Query query={this.TAGNAMES_REQUEST_QUERY}
                      onCompleted={data => {
                        const alignTags = data.tagNames.tags.sort(
                          function(a, b) {
                            return b.events.length - a.events.length;
                          });
                        this.setState({
                          isTagNames: true,
                          allTags: alignTags,
                        });
                      }}>
              {({loading, error, data}) => {
                if (loading) return 'Loading...';
                if (error) return  this.props.history.push('/error');
                return <div/>;
              }}
            </Query>)
            : (<Grid container justify="space-between"
                     style={{padding: '2% 5% 0 5%'}}>
              <Grid item xs={12}>
                <EventlistFilters filterNames={this.state.allTags}
                                  onCreate={this.HandlerTagName}/>
              </Grid>
              <Grid item xs={12}>
                <EventCardsQuery pageSize={this.eventListPageSize}
                                 isRecommended={false}
                                 selectedTagIds={this.state.selectedTagIds}
                />
              </Grid>
            </Grid>)
        }
      </div>
    );
  }
}

EventList.propTypes = {};

export default withRouter(EventList);
