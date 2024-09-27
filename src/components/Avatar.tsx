import React from 'react';                                                                                             
import { Avatar, Button, Popover, List, ListItem, ListItemButton, ListItemText, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import Person2Icon from '@mui/icons-material/Person2';   
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
                
         



const AvatarDemo = () => {
  const firstletterofusername: string | null = localStorage.getItem('username');
  const firstLetter = (firstletterofusername ? firstletterofusername[0] : 'A').toUpperCase();
  
  const navigate = useNavigate();            
                                                                                             
  const [avatarEl, setAvatarEl] = React.useState<HTMLButtonElement | null>(null);                   

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarEl(e.currentTarget);
  };
                                                                                        
  const handleAvatarClose = () => {                                      
    setAvatarEl(null);
  };                                                                     

  const open = Boolean(avatarEl);                                                                                                          
  const id = open ? "simple-popover" : undefined;

  const navigateToProfile = () => {
    navigate("/My_Profile");
  }                                            

  const navigateToSignin = () => {
    navigate("/SignIn");
  }                                                                      
                                                                                                                      
  const navigateToWishlist = () => {
     navigate("/Wishlisted");
  }

  return (
    <div>                                                                 
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button aria-describedby={id} onClick={handleAvatarClick}>
          <Avatar
           sx={{ bgcolor : deepPurple[500]}}
          >{firstLetter}</Avatar>
        </Button>                                                               
      </Stack>
                 
      <Popover          
        id={id}       
        open={open}
        anchorEl={avatarEl}
        onClose={handleAvatarClose}             
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right', // Aligns the Popover with the right edge of the Avatar
        }}
        transformOrigin={{               
          vertical: 'top',
          horizontal: 'right', // Aligns the top of the Popover with the bottom of the Avatar
        }}                
        PaperProps={{
          style: {
            transform: 'translateY(-8)', // Fine-tune the vertical positioning
          },
        }}
      >   
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={navigateToProfile}>        
            <Person2Icon color="action" fontSize="medium"
            sx={{
              marginRight:1           
            }}
            />
              <ListItemText 
              primary="Profile" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={navigateToWishlist}>
              <FavoriteTwoToneIcon color='action' fontSize='medium' 
               sx={{
                marginRight:1                                                                                                                         
              }}
              />
              <ListItemText primary="Wishlist" />                
            </ListItemButton>                                                                                             
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={navigateToSignin}>
            <LogoutIcon color="action" fontSize="medium" 
            sx={{
              marginRight:1
            }}                        
            />
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>                                                                                                             
        </List>
      </Popover>  
    </div>
  );
};
                        
export default AvatarDemo;
                                                                       