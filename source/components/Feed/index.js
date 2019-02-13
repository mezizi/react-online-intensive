//Core
import React, { Component } from 'react';
import moment from 'moment';

//Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';

//Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments';
import { api } from 'config/api';

@withProfile
export default class Feed extends Component {
    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1526825076849, likes: [] },
            { id: '177', comment: 'Hello !', created: 1526825076849, likes: [] },
        ],
        isSpinning: false,
    };

    componentDidMount () {
        this._fetchPosts();
    }

    _setPostsSpinnerState = (state) => {
        this.setState({
            isSpinning: state,
        });
    };

    _fetchPosts = async () => {
        this._setPostsSpinnerState(true);

        const reponse = await fetch(api, {
            method: 'GET',
        });

        const { data: posts } = await reponse.json();

        this.setState({
            posts,
            isSpinning: false,
        });
    };

    _createPost = async (comment) =>{
        this._setPostsSpinnerState(true);
        const post = {
            id:      getUniqueID(),
            created: moment().utc()
                .unix(),
            comment,
            likes: [],
        };

        await delay(1200);

        this.setState(({ posts }) => ({
            posts:      [ post, ...posts ],
            isSpinning: false,
        }));
    };

    _removePost = async (id) =>{
        this._setPostsSpinnerState(true);

        await delay(1200);

        this.setState(({ posts }) => ({
            posts:      posts.filter((post) => post.id !== id),
            isSpinning: false,
        }));
    };

    _likePost = async (id) => {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._setPostsSpinnerState(true);

        await delay(1200);

        // eslint-disable-next-line react/no-access-state-in-setstate
        const newPosts = this.state.posts.map((post) => {
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
    };

    render() {
        const { posts, isSpinning } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        { ...post }
                        _likePost = { this._likePost }
                        _removePost = { this._removePost }
                    />
                </Catcher>
            );
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
