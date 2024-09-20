import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Avatar, Stack, Chip, CardActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddComment from './AddComment';
import { grey } from '@mui/material/colors';
import { favoriteArticle, followUser, UnfollowUser } from '../redux/articleSlice';
import { AppDispatch } from '../redux/store';

// Define the Article interface
interface Article {
  author: {
    username: string;
    image: string;
  };
  title: string;
  description: string;
  slug: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
}

function AllArticleData() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`https://api.realworld.io/api/articles/${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError("Error fetching article");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleFollow = () => {
    if (article) {
      dispatch(followUser(article.author.username) as any);
      setIsFollowed(true);
    }
  };

  const handleUnfollow = () => {
    if (article) {
      dispatch(UnfollowUser(article.author.username) as any);
      setIsFollowed(false);
    }
  };

  const handleFavorite = () => {
    if (article) {
      dispatch(favoriteArticle(article.slug) as any);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>No article found</div>;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'center', 
        padding: 2, 
        marginTop: 20,
        bgcolor: 'aliceblue' 
      }}
    >
      {/* Article Section */}
      <Card 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          margin: 2, 
          bgcolor: 'aliceblue', 
          width: { xs: '90%', md: '50%' }, 
          minWidth: 300, 
          padding: 3 
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
          <Avatar src={article.author.image} sx={{ width: 120, height: 120, marginBottom: 2 }} />
          <Typography variant="h6" component="div" sx={{ textAlign: 'center', mb: 1 }}>
            {article.author.username}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', mb: 3 }}>
          {isFollowed ? (
            <Typography sx={{ fontSize: '1.2rem', color: '#670a8e' }} onClick={handleUnfollow}>
              Following
            </Typography>
          ) : (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AddIcon color='success' fontSize="small" onClick={handleFollow} />
              <Typography sx={{ fontSize: '1.2rem', color: 'green' }}>Follow</Typography>
            </Stack>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 2 }} color={grey[600]}>
            {article.title}
          </Typography>
          <Typography sx={{ mb: 2 }}>{article.description}</Typography>
          <Typography color="text.secondary">{article.slug}</Typography>
        </Box>

        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: 1.5, marginTop: 4 }}>
          <Stack direction="row" spacing={2}>
            {article.tagList.map((tag: string) => (
              <Chip key={tag} label={tag} variant="outlined" />
            ))}
          </Stack>
          <Box onClick={handleFavorite} sx={{ cursor: 'pointer' }}>
            {article.favorited ? (
              <FavoriteIcon color="warning" fontSize='large' />
            ) : (
              <FavoriteBorderIcon color="disabled" fontSize='large' />
            )}
          </Box>
        </CardActions>
      </Card>

      {/* Comment Section */}
      <Box 
        sx={{ 
          marginTop: 10, 
          marginLeft: { md: 2 }, 
          minWidth: 100, 
          maxWidth: '50%', // Adjust the width for the comment section
          padding: 2,
          bgcolor: 'white', // Add a background color for better visibility
          borderRadius: 1, // Optional: to give it rounded corners
          boxShadow: 2 // Optional: to give it a slight shadow
        }}
      >
        <AddComment slug={article.slug} />
      </Box>
    </Box>
  );
}

export default AllArticleData;
