import React, { useEffect, useState } from 'react';
import './App.css';
import VideoDisplay from './components/VideoDisplay';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings, { EProtocol } from './components/Settings';

function getFromLS<T>(key: string): T | null {
  if (!window.localStorage) return null;
  const value = window.localStorage.getItem(key);
  if (!value) return null;
  return value as T;
}

function App() {
  const [selectedItem, setSelectedItem] = useState<string>('live');
  const [protocol, setProtocol] = useState<EProtocol>(getFromLS('apiProtocol') || EProtocol.HTTPS);
  const [path, setPath] = useState<string>(getFromLS('apiUrl') || '');
  const [port, setPort] = useState<string>(getFromLS('apiPort') || '80');
  const [checkInterval, setCheckInterval] = useState<number>(Number(getFromLS('checkInterval')) || 1000);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    window.localStorage.setItem('apiProtocol', protocol);
    window.localStorage.setItem('apiUrl', path);
    window.localStorage.setItem('apiPort', port);
    window.localStorage.setItem('checkInterval', `${checkInterval}`);
  }, [protocol, path, port, checkInterval])

  useEffect(() => {
    setApiUrl(`${protocol === EProtocol.HTTP ? 'http://' : 'https://'}${path}${port === '80' ? '' : `:${port}`}`);
  }, [protocol, path, port]);

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
          </List>
        </Drawer>
      </Box>
      {selectedItem === 'live' && (
        <VideoDisplay
          apiUrl={apiUrl}
          checkInterval={checkInterval}
        />
      )}
      {selectedItem === 'settings' && (
        <Settings
          path={path}
          port={port}
          protocol={protocol}
          checkInterval={checkInterval}
          onChange={(protocol, path, port, checkInterval) => {
            setProtocol(protocol);
            setPath(path);
            setPort(port);
            setCheckInterval(checkInterval);
          }}
        />
      )}
    </Box>
  );
}

export default App;
