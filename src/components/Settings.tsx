import { Box, Button, Card, CardActions, CardContent, CardHeader, MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react';

export enum EProtocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS'
};

type SettingsProps = {
  protocol: EProtocol;
  path: string;
  port: string;
  checkInterval: number;
  onChange: (protocol: EProtocol, path: string, port: string, checkInterval: number) => void;
};

const Settings: React.FC<SettingsProps> = ({ protocol: initialProtocol, path: initialPath, port: initialPort, checkInterval: initialCheckInterval, onChange }) => {
  const [protocol, setProtocol] = useState(initialProtocol);
  const [path, setPath] = useState(initialPath);
  const [port, setPort] = useState(initialPort);
  const [checkInterval, setCheckInterval] = useState(initialCheckInterval);

  return (
    <Box sx={{ padding: '16px', marginLeft: '120px'}}>
      <Card>
        <CardHeader title='Backend-Settings' />
        <CardContent sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <TextField
              sx={{ minWidth: '100px' }}
              select
              label="Protocol"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as EProtocol)}
            >
              <MenuItem value={EProtocol.HTTP}>
                http://
              </MenuItem>
              <MenuItem value={EProtocol.HTTPS}>
                https://
              </MenuItem>
            </TextField>
            <TextField
              label="URL"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
            <TextField
              label="Port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <TextField
              label="Refresh Interval (ms)"
              value={checkInterval}
              onChange={(e) => setCheckInterval(Number(e.target.value))}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button onClick={() => onChange(protocol, path, port, checkInterval)}>Apply changes</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Settings;
