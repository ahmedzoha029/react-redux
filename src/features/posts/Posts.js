import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addNewPost,
  deletePost,
  selectAllPosts,
  selectPostById,
  getPostStatus,
  updatePost,
  postAdded
} from './postSlice'
import styles from './Post.module.css';

export function Post() {
  const posts= useSelector(selectAllPosts);
  const postStatus = useSelector(getPostStatus);
  const postById = useSelector((state)=> selectPostById(state,1));

  if (postStatus === 'succeeded') {
    console.log(posts)
    console.log(postById)
  }


  const dispatch = useDispatch();

  const savePostReducer = () => {
      dispatch(postAdded("Zoha Post", "Test by Zoha",1))
  }

  const savePost = () => {
    try {
      dispatch(addNewPost({
        title: "Zoha Post",
        body: "Test by Zoha",
        userId: 1
      }))
    } catch(err) {
      console.error('Failed to save the post', err)
    }
  }

  const updatePostClick = () => {
    try {
      dispatch(updatePost({
        id: 101,
        title: "Zoha Post - Updated",
        content: "Test by zoha - Updated",
        userId: 2
      }))
    } catch(err){
      console.error('Failed to update the post', err)
    }
  }

  const deletePostClick = () => {
    try {
      dispatch(deletePost({
        id: 101,
        title: "Zoha Post - Updated",
        content: "Test by zoha - Updated",
        userId: 2
      }))
    } catch(err){
      console.error('Failed to delete the post', err)
    }
  }

  return (
    <div>
      <div className={styles.row}>
      <button
          className={styles.button}
          onClick={savePostReducer}
        >
          Add Post - Reducer
        </button>
        <button
          className={styles.button}
          onClick={savePost}
        >
          Add Post
        </button>
        <button
          className={styles.button}
          onClick={updatePostClick}
        >
          Update Post
        </button>
        <button
          className={styles.button}
          onClick={deletePostClick}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
