import React, { useState } from 'react';
import './App.css';
import VideoDisplay from './components/VideoDisplay';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import process from 'process';

function App() {
  const [selectedItem, setSelectedItem] = useState<string>('live');

  return (
    <Box sx={{ height: '100%', display: 'flex', flex: 1 }}>
      <Box component="nav">
        <Drawer open={true} variant="permanent" sx={{ display: 'block' }}>
          <List>
            <ListItem sx={{
                  '& .MuiListItemButton-root': { flexDirection: 'column' },
                  '& .MuiListItemIcon-root': { justifyContent: 'center' }
                }}>
              <ListItemButton selected={selectedItem === 'live'} onClick={() => setSelectedItem('live') }>
                <ListItemIcon>
                  <VideocamIcon />
                </ListItemIcon>
                <ListItemText primary="Live" />
              </ListItemButton>
            </ListItem>
            <ListItem sx={{
                  '& .MuiListItemButton-root': { flexDirection: 'column' },
                  '& .MuiListItemIcon-root': { justifyContent: 'center' }
                }}>
              <ListItemButton selected={selectedItem === 'upload'} onClick={() => setSelectedItem('upload') }>
                <ListItemIcon>
                  <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="Upload" />
              </ListItemButton>
            </ListItem>
            {process.env.NODE_ENV !== 'production' && (
              <ListItem sx={{
                    '& .MuiListItemButton-root': { flexDirection: 'column' },
                    '& .MuiListItemIcon-root': { justifyContent: 'center' }
                  }}>
                <ListItemButton selected={selectedItem === 'settings'} onClick={() => setSelectedItem('settings') }>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Drawer>
      </Box>
      <VideoDisplay />
    </Box>
  );
}

export default App;
