// Core
import React, { Component } from 'react';
// import { hot } from 'react-hot-loader';

//  @hot(module);

//Components
import Feed from 'components/Feed';
import { Provider } from 'components/HOC/withProfile';

//Instruments
import avatar from 'theme/assets/lisa';

const options = {
    currentUserFirstName: 'Lisa',
    currentUserLastName:  'Simpson',
    avatar,
};

export default class App extends Component {
    render() {
        return (
            <Provider value = { options }>
                <Feed/>;
            </Provider>
        );
    }
}
