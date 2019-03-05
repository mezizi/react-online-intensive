//Core
import React, { Component } from 'react';
import { Transition,
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';
import { fromTo } from 'gsap';

// import moment from 'moment';

//Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';
import Postman from 'components/Postman';

//Instruments
import Styles from './styles.m.css';
// import { getUniqueID, delay } from 'instruments';
import { api, TOKEN, GROUP_ID } from 'config/api';
import { socket } from 'socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts:      [],
        isSpinning: false,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserLastName } = this.props;

        this._fetchPosts();

        socket.emit('join', GROUP_ID);

        socket.on('creat', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: [ createdPost, ...posts ],
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data: likedPost } = JSON.parse(postJSON);

            console.log('-> like', likedPost);

            this.setState(({ posts }) => ({
                posts: posts.map(
                    (post) => post.id === likedPost.id ? likedPost : post,
                ),
            }));
        });
    }

    componentWillUnmount () {
        socket.removeListner('create');
        socket.removeListner('remove');
        socket.removeListner('like');
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

        console.log('-> fetch posts', posts);

        this.setState({
            posts,
            isSpinning: false,
        });
    };

    _createPost = async (comment) =>{
        this._setPostsSpinnerState(true);

        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ comment }),
        });

        const { data: post } = await response.json();

        this.setState(({ posts }) => ({
            posts:      [ post, ...posts ],
            isSpinning: false,
        }));
    };

    _likePost = async (id) => {
        this._setPostsSpinnerState(true);

        const response = await fetch(`${api}/${id}`, {
            method:  'PUT',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likedPost } = await response.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likedPost.id ? likedPost : post,
            ),
        }));

        this._setPostsSpinnerState(false);
    };

    _removePost = async (id) => {
        this._setPostsSpinnerState(true);

        await fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState(({ posts }) => ({
            posts:      posts.filter((post) => post.id !== id),
            isSpinning: false,
        }));
    };

    _animateComposerEnter = (composer) => {
        fromTo(
            composer,
            1,
            {opacity: 0, rotationX: 50 },
            {opacity: 1, rotationX: 0 },
        );
    }

    render() {
        const { posts, isSpinning } = this.state;

        console.log('this.state', this.state);

        const postsJSX = posts.map((post) => {
            return (
                <CSSTransition
                    classNames = {{
                        enter:       Styles.postInStart,
                        enterActive: Styles.postInEnd,
                    }}
                    key = { post.id }
                    timeout = {{
                        enter: 500,
                        exit:  400,
                    }}>
                    <Catcher>
                        <Post
                            { ...post }
                            _likePost = { this._likePost }
                            _removePost = { this._removePost }
                        />
                    </Catcher>
                </CSSTransition>
            );
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Transition
                    appear
                    in
                    timeout = { 4000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost }/>
                </Transition>
                <Postman/>
                <TransitionGroup>{postsJSX}</TransitionGroup>
            </section>
        );
    }
}

