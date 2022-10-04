import { createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

export const getAllPosts = createAsyncThunk(
  'posts/getAllPosts',
  async () => {
    const response = await axios.get(POST_URL);
    return response.data;
  }
)

export const addNewPost = createAsyncThunk(
  'posts/AddNew',
  async (postData) => {
    const response = await axios.post(POST_URL, postData)
    return response.data
  }
)

export const updatePost = createAsyncThunk(
  'posts/UpdatePost',
  async (updatedPost) => {
    const { id } = updatedPost;
    try{
      const response = await axios.put(`${POST_URL}/${id}`)
      return response.data
    } catch(err) {
      return updatedPost; // only for testing redux
    }
  }
)

export const deletePost = createAsyncThunk(
  'posts/DeletePost',
  async (postToDelete) => {
    const { id } = postToDelete
    try {
      const response = await axios.delete(`${POST_URL}/${id}`)

      if(response?.status === 200) return postToDelete
      return `${response?.status}: ${response?.statusText}`
    } catch(err) {
      return err.message
    }
  }
)


const postSlice = createSlice({
  name: 'posts',
  initialState : {
    post: [],
    status: 'idle',
    error: null
  },
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.post.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toDateString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0
            }
          }
        }
      }
    },
    reactionAdded(state,action) {
      const { postId, reaction } = action.payload
      const existingPost = state.post.find(post => post.id === postId)
      if(existingPost) {
        existingPost.reactions[reaction]++
      }

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++}).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        })
        state.post = state.post.concat(loadedPosts);
      })
      .addCase(addNewPost.fulfilled, (state, action)=> {
        const sortedPosts = state.post.sort((a,b)=> {
          if(a.id > b.id) return 1
          if(a.id < b.id) return -1
          return 0
        })

        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;

        action.payload.userId = Number(action.payload.userId)
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        state.post.push(action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if(!action.payload?.id){
          console.log('Update could not be completed');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload
        const existingPost = state.post.filter(post => post.id !== id);
        state.post = [...existingPost, action.payload]
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if(!action.payload?.id) {
          console.log('Delete Post could not be completed')
          console.log(action.payload)
          return;
        }

        const { id } = action.payload
        const post = state.post.filter(post => post.id !== id)
        state.post= post
      }
      )

  }
})

export const selectAllPosts = (state) => state.posts.post
export const getPostStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostById = (state, postId) => state.posts.post.find(post => post.id === postId)

export const { postAdded, reactionAdded } = postSlice.actions

export default postSlice.reducer