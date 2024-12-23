import React, { useEffect, useState } from 'react';
import './App.css';
import VideoDisplay from './components/VideoDisplay';
import VideocamIcon from '@mui/icons-material/Videocam';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings, { EProtocol } from './components/Settings';
import SideNav, { MenuItem } from './ui/sidenav/SideNav';

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
  const menuItems: MenuItem[] = [
    {
      icon: React.createElement(VideocamIcon, {}),
      key: 'live',
      title: 'Live'
    },
    {
      icon: React.createElement(UploadIcon, {}),
      key: 'upload',
      title: 'Upload'
    },
    {
      icon: React.createElement(SettingsIcon, {}),
      key: 'settings',
      title: 'Settings'
    }
  ]

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
    <div className="app-main-container">
      <SideNav items={menuItems} onChange={(key) => setSelectedItem(key)} />
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
    </div>
  );
}

export default App;
