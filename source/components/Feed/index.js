//Core
import React, { Component } from 'react';
import moment from 'moment';

//Components
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';

//Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments';

export default class Feed extends Component {
    constructor () {
        super();
        this._createPost = this._createPost.bind(this);
        this._setPostsSpinnerState = this._setPostsSpinnerState.bind(this);
        this._likePost = this._likePost.bind(this);
    }

    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1526825076849, likes: [] },
            { id: '177', comment: 'Hello !', created: 1526825076849, likes: [] },
        ],
        // spinnerState: false,
        isSpinning: false,
    };

    _setPostsSpinnerState (state) {
        this.setState({
            isSpinning: state,
        });
    }

    async _createPost (comment) {
        this._setPostsSpinnerState(true);
        const post = {
            id:      getUniqueID(),
            created: moment().utc(),
            comment,
            likes:   [],
        };

        await delay(1200);

        this.setState(({ posts }) => ({
            posts:      [ post, ...posts ],
            isSpinning: false,
        }));
    }

    async _likePost (id) {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._setPostsSpinnerState(true);

        await delay(1200);

        const newPosts = this.setState.posts.map((post) => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: [
                        {
                            id:        getUniqueID(),
                            firstName: currentUserFirstName,
                            lastName:  currentUserLastName,
                        },
                    ],
                };
            }

            return post;
        });
        this.setState({
            posts:      newPosts,
            isSpinning: false,
        });
    }

    render() {
        const { posts, isSpinning } = this.state;

        const postsJSX = posts.map((post) => {
            // eslint-disable-next-line react/jsx-max-props-per-line
            return <Post key = { post.id } { ...post } _likePost = { this._likePost } />;
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Composer
                    _createPost = { this._createPost }
                />
                {postsJSX}
            </section>
        );
    }
}
