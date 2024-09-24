import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, Stack, Card, Avatar, CardContent, CardActions, Grid } from '@mui/material';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProfile } from '../redux/articleSlice'; 
import AvatarDemo2 from './Avatar2';
import WebsiteName from './WebsiteName';
import ArticleCard from './ArticleCard';

const My_Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, profileStatus, profileError, articles } = useSelector((state: RootState) => state.articles);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      if (username) {
        dispatch(fetchProfile(username));
      }
    }
  }, [dispatch]);

  if (profileStatus === 'loading') {
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
        <Card             
          sx={{
            width: '100%',
            maxWidth: 600,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #ddd',
            bgcolor: 'whitesmoke',                                       
            mx: 'auto',
            minHeight: 200,
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
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 1 }} />
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }} />
        </Card>
        
        {/* Articles Section */}
        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            My Articles
          </Typography>
          <Grid container spacing={2}>
            {articles.map(article => (
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
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default My_Profile;
