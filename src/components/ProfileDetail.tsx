import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { Box, CircularProgress, Typography, Grid, Stack } from '@mui/material';
import { AppDispatch } from '../redux/store';
import ArticleCard from './ArticleCard';
import Header from './Header';
import { followUser, UnfollowUser } from '../redux/articleSlice'; 
import AddIcon from '@mui/icons-material/Add'; 

interface Article {
  author: {
    username: string;
    image: string;
    following: boolean;
  };
  description: string;
  title: string;
  slug: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  createdAt: string;
}

interface Profile {
  username: string;
  image: string;
  bio?: string; 
  following: boolean;
}

const ProfileDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    const fetchProfileAndArticles = async () => {
      try {
        const profileResponse = await fetch(`https://api.realworld.io/api/profiles/${username}`);
        if (!profileResponse.ok) {
          throw new Error(`HTTP error! status: ${profileResponse.status}`);
        }
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
        setIsFollow(profileData.profile.following);

        const articlesResponse = await fetch(`https://api.realworld.io/api/articles?author=${username}`);
        if (!articlesResponse.ok) {
          throw new Error(`HTTP error! status: ${articlesResponse.status}`);
        }
        const articlesData = await articlesResponse.json();
        setArticles(articlesData.articles);
      } catch (err) {
        console.error(err);
        setError("Error fetching profile or articles");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileAndArticles();
    }
  }, [username]);

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

  const handleFollow = () => {
    if (profile?.username) {
      dispatch(followUser(profile.username));
      setIsFollow(true);
    }
  };

  const handleUnfollow = () => {
    if (profile?.username) {
      dispatch(UnfollowUser(profile.username));
      setIsFollow(false);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Header />
      {profile && (
        <Box
          sx={{
            backgroundColor: 'oldlace',
            // height: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 2,
          }}
        >
          <img
            style={{ borderRadius: '50%', width: 70, height: 70 }}
            src={profile.image}
            alt={profile.username}
          />
          <Typography variant="h5" sx={{ marginBottom: 1 }}>{profile.username}</Typography>
          {profile.bio && <Typography sx={{ textAlign: 'center' }}>{profile.bio}</Typography>}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ marginTop: 1 }}>
  {isFollow ? (
    <Typography 
      sx={{ 
        fontSize: '1rem', 
        color: '#670a8e', 
        cursor: 'pointer', 
        '&:hover': { textDecoration: 'underline' } 
      }} 
      onClick={handleUnfollow}
    >
      Following
    </Typography>
  ) : (
    <>
      <AddIcon color="success" fontSize="medium" />
      <Typography 
        sx={{ 
          fontSize: '1rem', 
          color: 'green', 
          cursor: 'pointer', 
          '&:hover': { textDecoration: 'underline' } 
        }} 
        onClick={handleFollow}
      >
        Follow
      </Typography>
    </>
  )}
</Stack>

        </Box>
      )}
      {articles.map(article => (
        <Box key={article.slug} mt={2}>
          <Grid item xs={12} sm={6}>
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
        </Box>
      ))}
    </Box>
  );
};

export default ProfileDetail;
