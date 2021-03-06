import {clientId} from './utils.js';
import {GoogleLogin} from 'react-google-login';
import {gql} from 'apollo-boost';
import {Mutation} from 'react-apollo';
import React, {Component} from 'react';
import 'typeface-roboto';
import {withRouter} from 'react-router-dom';

/* Query sending user Information to server */
const SIGNIN_QUERY = gql`
        mutation ($googleId: String!){
          signInWithGoogle(googleId: $googleId){
            success
            message
            token
          }
        }`;

// Todo(Myoung-hee): Redirect to error page when error occured.
class LoginFormGoogle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMember: false,
      googleId: '',
    };
  }

  // Google login fail callback function
  responseFail = (err) => {
    this.props.history.push('/error');
  };

  /**
   * After check member from server, setState and Reaction
   * @param {boolean} isSuccess
   * @param {string} token
   */
  changeIsMember(isSuccess, token) {
    if (isSuccess) {
      this.setState({isMember: true});
      // Store user token to cookie.
      document.cookie = 'token=' + token;
    }
    this.redirect();
  }

  // After authenticated from server, redirect even if success or not.
  redirect = () => {
    if (this.state.isMember)
      return this.props.history.push({pathname: '/'});
    else {
      // No user informaton in our db.
      const {handleLogin} = this.props;
      handleLogin(false);
    }
  };

  // Social login button and send googleId received from google to server using mutation component.
  render() {
    return (
        <div>
          <Mutation mutation={SIGNIN_QUERY}
                    variables={{googleId: this.state.googleId}}
                    onCompleted={
                      (data) => {
                        this.changeIsMember(
                            /* isSucess= */ data.signInWithGoogle.success,
                            /* token= */ data.signInWithGoogle.token);
                      }}
                    onError={
                      (error) => {
                        // Implement query error processing
                      }
                    }>
            {(execute_mutation) => {
              // Google Login Button
              return (
                  <GoogleLogin
                      onSuccess={(res) => {
                        this.setState({
                          googleId: res.profileObj.googleId,
                        }, execute_mutation);
                      }}
                      onFailure={this.responseFail}
                      clientId={clientId} // Our client ID
                  >
                    <p style={{
                      width: '228px', height: '28px',
                      fontWeight: 'bold', fontStretch: 'normal',
                      lineHeight: '30px',
                      color: '#4a4a4a', fontFamily: 'Roboto', marginBottom: '0',
                    }}>
                      Sign in with Google
                    </p>
                  </GoogleLogin>
              );
            }
            }
          </Mutation>
        </div>);
  }
}

LoginFormGoogle.propTypes = {};

export default withRouter(LoginFormGoogle);
