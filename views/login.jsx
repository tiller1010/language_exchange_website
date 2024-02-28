import React from 'react';
import DefaultLayout from './layouts/default';
import SSRView from './components/SSRView';

class Login extends React.Component {

  render(){

    return (
      <DefaultLayout>
          <div id="login" errors={JSON.stringify(this.props.errors)}>
          <SSRView/>
          </div>
      </DefaultLayout>
    );
  }
}

export default Login;
