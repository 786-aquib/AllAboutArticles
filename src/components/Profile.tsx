import { Avatar, Box } from '@mui/material';
import WebsiteName from './WebsiteName';
import ArticleList from './ArticleList';
import { request } from 'http';
import CreateNewArticle from './CreateNewArticle';
import AvatarDemo from './Avatar';


function Profile() {        
  return (
    <div style={{ overflow: 'hidden', margin: 0, padding: 0 }}>
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
        
        <Box 
        sx={ {
             display: 'flex',
             marginRight: 2,
             
        }}
        >
            <CreateNewArticle />
            <AvatarDemo />
            
        </Box>
        </Box>
      <ArticleList />
    </div>
  );
}
             
export default Profile;                   
                                                