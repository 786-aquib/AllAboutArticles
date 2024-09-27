import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Stack, Avatar, CardContent, CardActions, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProfile } from '../redux/articleSlice'; 
import AvatarDemo2 from './Avatar2';
import WebsiteName from './WebsiteName';
import ArticleCard from './ArticleCard';

const My_Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, profileStatus, profileError } = useSelector((state: RootState) => state.articles);
  
  const [articles, setArticles] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // Fetch the profile when the component mounts
  useEffect(() => {
    const fetchFavoritedArticles = async () => {
      const username = localStorage.getItem('username');
      console.log(username);
      setStatus('loading');
      
      try {
        const response = await fetch(`https://api.realworld.io/api/articles?author=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles); // Adjust according to your API response structure
        setStatus('idle');
      } catch (err) {
        setError('err');
        setStatus('failed');
      }
    };

    fetchFavoritedArticles();
  }, []);
  console.log(articles);
  // Conditional rendering based on the status of profile fetching
  if (profileStatus === 'loading' || loadingArticles) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (profileStatus === 'failed') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{profileError}</Typography>
      </Box>                                         
    );
  }

  if (articlesError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{articlesError}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0.5,
          overflow: 'hidden',
          width: '100%',
          bgcolor: 'aliceblue',
        }}
      >
        <WebsiteName />
        <AvatarDemo2 />
      </Box>
      <Box
        sx={{
          bgcolor: 'aliceblue',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          paddingBottom: '80px',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 1.5,
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
            <Avatar alt={profile?.username} src={profile?.image || 'default-img URL'} sx={{ width: 50, height: 50 }} />
            <Box>
              <Typography
                sx={{
                  cursor: 'pointer',
                  fontSize: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.2,
                  marginTop: 0.5,
                  marginLeft: 1,
                }}
              >
                {profile?.username}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  marginLeft: 1,
                }}
              >
                {profile?.bio}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: 1,
          }}
        >
          {/* Add additional profile details here if needed */}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 1,
          }}
        >
          {/* Add actions if needed */}
        </CardActions>

        {/* Render articles created by the user */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="h6">My Articles</Typography>
          <Grid container spacing={4} sx={{ maxWidth: { xs: '100%', sm: 1200, md: 1400 } }}>
            {articles.length > 0 ? (
              articles.map((article) => (
                <Grid item xs={12} sm={6} key={article.slug}>
                  <ArticleCard
                    slug={article.slug}
                    image={article.author.image}
                    title={article.title}
                    author={article.author.username}
                    description={article.description}
                    favorited={article.favorited}
                    favoritesCount={article.favoritesCount}
                    createdAt={article.createdAt}
                    taglist={article.tagList}
                    follow={article.author.following}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No articles available</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default My_Profile;
