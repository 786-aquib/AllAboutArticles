import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Grid, Button } from '@mui/material';
import ArticleCard from './ArticleCardforWishlist';              
import WebsiteName from './WebsiteName';              
import AvatarDemo2 from './Avatar2';
import ArticleCardforWishlist from './ArticleCardforWishlist';


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
  createdAt: string;
  following: boolean;
}

const Wishlisted: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoritedArticles = async () => {
      const username = localStorage.getItem('username');
      setStatus('loading');
      
      try {
        const response = await fetch(`https://api.realworld.io/api/articles?favorited=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.articles);
        setStatus('idle');
      } catch (err) {
        setError('err.message');
        setStatus('failed');
      }
    };

    fetchFavoritedArticles();
  }, []);

  const handleUnfavorite = (slug: string) => {
    setArticles((prevArticles) => prevArticles.filter(article => article.slug !== slug));
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0.5, bgcolor: 'aliceblue' }}>
        <WebsiteName />
        <div style={{ backgroundColor: 'blanchedalmond', fontVariant: 'traditional', fontSize: 20 }}>
          Wishlisted Items
        </div>
        <AvatarDemo2 />
      </Box>
      <Box sx={{ bgcolor: 'aliceblue', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingBottom: '80px', px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4} sx={{ maxWidth: { xs: '100%', sm: 1200, md: 1400 } }}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Grid item xs={12} sm={6} key={article.slug}>
                <ArticleCardforWishlist
                  slug={article.slug}
                  image={article.author.image}
                  title={article.title}
                  author={article.author.username}
                  description={article.description}
                  favorited={!article.favorited}
                  favoritesCount={article.favoritesCount}
                  createdAt={article.createdAt}
                  taglist={article.tagList}
                  follow={article.following}
                  onUnfavorite={handleUnfavorite} // Pass the unfavorite handler
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
    </div>
  );
};

export default Wishlisted;
