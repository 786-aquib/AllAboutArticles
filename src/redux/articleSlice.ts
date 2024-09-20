import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store'; 

export const useAppDispatch = () => useDispatch<AppDispatch>();

interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

interface ArticlesState {
  articles: Article[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  hasMore: boolean;
  offset: number;
  profile: Profile | null;
  profileStatus: 'idle' | 'loading' | 'failed';
  profileError: string | null;
}                                

const initialState: ArticlesState = {
  articles: [],                      
  status: 'idle',                    
  error: null,                       
  hasMore: true,                    
  offset: 0,
  profile: null,
  profileStatus: 'idle',
  profileError: null,
};

// Async thunk for fetching articles
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',                                          
  async (offset: number) => {
    const response = await fetch(`https://api.realworld.io/api/articles?offset=${offset}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
);                                     

// Async thunk for fetching an article related to the profile
export const fetchArticleRelatedToProfile = createAsyncThunk(
  'articles/fetchArticleRelatedToProfile',
  async (slug: string) => {
    const response = await fetch(`https://api.realworld.io/api/articles/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
);

// Async thunk for fetching a profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.realworld.io/api/profiles/${username}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Error fetching profile');
      }
      const data = await response.json();
      return data.profile;
    } catch {
      return rejectWithValue('Error fetching profile');
    }
  }
);

// Async thunk for favoriting an article
export const favoriteArticle = createAsyncThunk(
  'articles/favoriteArticle',
  async (slug: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    const response = await fetch(`https://api.realworld.io/api/articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()).article;
  }
);

// Async thunk for following a user
export const followUser = createAsyncThunk(
  'users/followUser',
  async (username: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    const response = await fetch(`https://api.realworld.io/api/profiles/${username}/follow`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Error following user');
    }

    return (await response.json()).profile;
  }
);

// Async thunk for unfollowing a user
export const UnfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (username: string, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    const response = await fetch(`https://api.realworld.io/api/profiles/${username}/follow`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Error unfollowing user');
    }

    return (await response.json()).profile;
  }
);                                                     

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle(state, action) {
      state.articles.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'idle';
        state.articles.push(...action.payload.articles);
        state.offset += action.payload.articles.length;
        state.hasMore = action.payload.articles.length > 0;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch articles';
      })

      .addCase(fetchArticleRelatedToProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticleRelatedToProfile.fulfilled, (state, action) => {
        state.status = 'idle';                                                        
        if (Array.isArray(action.payload.articles)) {
          state.articles.push(...action.payload.articles);
          state.offset += action.payload.articles.length;
          state.hasMore = action.payload.articles.length > 0;
        } else {
          console.error('Unexpected payload structure:', action.payload);
          state.error = 'Unexpected response format';
        }
      })
      .addCase(fetchArticleRelatedToProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch articles';
      })

      .addCase(fetchProfile.pending, (state) => {
        state.profileStatus = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.profileStatus = 'idle';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.profileError = action.payload as string;
      })                                                

      .addCase(favoriteArticle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(favoriteArticle.fulfilled, (state, action) => {
        const updatedArticle = action.payload;
        const index = state.articles.findIndex(article => article.slug === updatedArticle.slug);
        if (index !== -1) {
          state.articles[index] = updatedArticle;
        }
      })
      .addCase(favoriteArticle.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(followUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.profile && state.profile.username === action.payload.username) {
          state.profile.following = true;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(UnfollowUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(UnfollowUser.fulfilled, (state, action) => {
        if (state.profile && state.profile.username === action.payload.username) {
          state.profile.following = false;
        }
      })
      .addCase(UnfollowUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { addArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
