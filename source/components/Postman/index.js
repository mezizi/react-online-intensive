//Core
import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import TweenMax from 'gsap';

//Components
import { withProfile } from 'components/HOC/withProfile';

//Instruments
import Styles from './styles.m.css';

@withProfile
export default class Postman extends Component {
    state = {
        isAnimatePostman: true,
    };

    _animatePostmanState = () => {
        this.setState(({ isAnimatePostman }) => ({
            isAnimatePostman: !isAnimatePostman,
        }));
    };

    _animatePostmanEnter = (postman) => {
        TweenMax.fromTo(postman, 1, { x: 2000 }, { x: 0 });
        setTimeout(() => this.setState({
            isAnimatePostman: false,
        }), 4000);
        console.log('__this.state', this.state);
    };

    _animatePostmanExit = (postman) => {
        TweenMax.fromTo(postman, 4, { x: 0 }, { x: 2000 });
    };

    render() {
        const { avatar, currentUserFirstName } = this.props;

        const { isAnimatePostman } = this.state;

        return (
            <Transition
                appear
                in = { isAnimatePostman }
                timeout = { 1000 }
                onEnter = { this._animatePostmanEnter }
                onExit = { this._animatePostmanExit }>
                <section className = { Styles.postman }>
                    <img src = { avatar } />
                    <span>Welcome online, {currentUserFirstName}</span>
                </section>
            </Transition>
        );
    }
}

