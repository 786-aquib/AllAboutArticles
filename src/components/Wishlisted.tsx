
import WebsiteName from './WebsiteName';              
import AvatarDemo from './Avatar';

import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import ArticleCard from './ArticleCard';              
import { RootState, AppDispatch } from '../redux/store';
import { fetchArticles } from '../redux/articleSlice';
import AvatarDemo2 from './Avatar2';
                 
const Wishlisted: React.FC = () => {
  const { articles, status, error, hasMore } = useSelector((state: RootState) => state.articles);
  const currentStatus = status as 'idle' | 'loading' | 'failed';                                         

  if (currentStatus === 'loading' && articles.length === 0) {
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

  if (currentStatus === 'failed') {
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
          padding: 0.5, // Optional: Add padding for spacing                   
          overflow: 'hidden', // Ensure no overflow
          width: '100%', // Ensure Box takes full width     
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
        px: { xs: 2, sm: 3, md: 4 }, // Responsive padding
      }}
    >                                                              
      <Grid
        container
        spacing={4} // Space between grid items
        sx={{
          maxWidth: { xs: '100%', sm: 1200, md: 1400 }, // Max width of the container
        }}             
      >
        {articles.length > 0 ? (
         articles.filter(article => article.favorited)  // Filter articles to include only those with favorited true
            .map((article) => (                
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

      {/* Loader positioned at the bottom */}
      {currentStatus === 'loading' && hasMore && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',         
            padding: 2,
            backgroundColor: '#f5f5f5',
          }}            
        >
          <CircularProgress />         
        </Box>
      )}          
    </Box>
    </div> 
  );
};          

export default Wishlisted;
