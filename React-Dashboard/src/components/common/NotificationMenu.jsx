import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import {
  Bell,
  CheckCheck,
  Trash2,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { initialNotifications } from '../../data/mockNotifications';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return <ShoppingBag size={16} color="#6366f1" />;
    case 'payment':
      return <CreditCard size={16} color="#10b981" />;
    case 'inventory':
      return <AlertTriangle size={16} color="#f59e0b" />;
    case 'refund':
      return <RotateCcw size={16} color="#ef4444" />;
    case 'customer':
      return <UserCheck size={16} color="#0ea5e9" />;
    default:
      return <Bell size={16} color="#6366f1" />;
  }
};

export const NotificationMenu = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [notifications, setNotifications] = useState(initialNotifications);
  const [anchorEl, setAnchorEl] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleItemClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'text.secondary',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          '&:hover': {
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            color: 'text.primary',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error" overlap="circular">
          <Bell size={18} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: '9999px',
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {unreadCount} new
              </Box>
            )}
          </Box>

          {notifications.length > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              startIcon={<CheckCheck size={14} />}
              sx={{ fontSize: '0.75rem', p: '2px 8px' }}
            >
              Mark read
            </Button>
          )}
        </Box>

        {/* List */}
        <List sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Bell size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                No notifications right now
              </Typography>
            </Box>
          ) : (
            notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem
                  button
                  onClick={() => handleItemClick(notif.id)}
                  sx={{
                    p: 1.75,
                    bgcolor: !notif.read
                      ? isDark
                        ? 'rgba(99, 102, 241, 0.08)'
                        : 'rgba(99, 102, 241, 0.04)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: isDark ? '#1f2937' : '#f1f5f9',
                      }}
                    >
                      {getNotificationIcon(notif.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notif.read ? 600 : 700,
                            color: notif.read ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {notif.title}
                        </Typography>
                        {!notif.read && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              ml: 1,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: 'text.secondary',
                            mt: 0.25,
                          }}
                        >
                          {notif.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            fontSize: '0.7rem',
                            color: 'text.disabled',
                          }}
                        >
                          {notif.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box
            sx={{
              p: 1.25,
              borderTop: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              size="small"
              color="inherit"
              onClick={handleClearAll}
              startIcon={<Trash2 size={13} />}
              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
            >
              Clear all notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationMenu;

