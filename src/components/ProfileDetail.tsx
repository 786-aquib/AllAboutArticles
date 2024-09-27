import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Stack, Avatar, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import AvatarDemo2 from './Avatar2';
import WebsiteName from './WebsiteName';
import ArticleCard from './ArticleCard';
import { followUser, UnfollowUser } from '../redux/articleSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';

const Profiledetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        try {
          const profileResponse = await fetch(`https://api.realworld.io/api/profiles/${username}`);
          if (!profileResponse.ok) {
            throw new Error('Failed to fetch profile');
          }
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);

          const articlesResponse = await fetch(`https://api.realworld.io/api/articles?author=${username}`);
          if (!articlesResponse.ok) {
            throw new Error('Failed to fetch articles');
          }
          const articlesData = await articlesResponse.json();
          setArticles(articlesData.articles);
        } catch (err) {
          setError("Error");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [username]);

  const handleFollow = () => {
    if (username) {
      // dispatch(followUser(username));
      setIsFollow(true);
    }
  };

  const handleUnfollow = () => { 
    if (username) {
      // dispatch(UnfollowUser(username));
      setIsFollow(false);
    }
  };

  if (loading) {
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

  if (error) {
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
        <Typography color="error">{error}</Typography>
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
        {/* Profile Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            alt={profile?.username}
            src={profile?.image || 'default-img URL'}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          <Stack spacing={1} alignItems="center">
            <Typography variant="h6">{profile?.username}</Typography>
            <Typography variant="body2" color="text.secondary">{profile?.bio}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {isFollow ? (
                <Typography sx={{ fontSize: '1rem', color: '#670a8e' }} onClick={handleUnfollow}>
                  Following
                </Typography>
              ) : (
                <Stack direction="row" spacing={0.2} alignItems="center">
                  <AddIcon color="success" fontSize="small" />
                  <Typography sx={{ marginLeft: 3, fontSize: '1rem', color: 'green' }} onClick={handleFollow}>
                    Follow
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
        
        {/* Articles Section */}
        <Box sx={{ mt: 3, width: '100%' }}>
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

export default Profiledetail;
