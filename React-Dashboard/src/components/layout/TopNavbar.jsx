import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Search,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useAppTheme } from '../../context/ThemeContext';
import { useOrderFilters } from '../../context/FilterContext';
import NotificationMenu from '../common/NotificationMenu';

export const TopNavbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { toggleTheme } = useAppTheme();
  const { filters, setSearchTerm } = useOrderFilters();

  const [profileAnchor, setProfileAnchor] = useState(null);

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'}`,
        color: 'text.primary',
        zIndex: (th) => th.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: 64, gap: 2 }}>
        {/* Mobile/Tablet Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{
            display: { md: 'none' },
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <MenuIcon size={20} />
        </IconButton>

        {/* Global Quick Search Bar */}
        <Box sx={{ flex: 1, maxWidth: 420 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search orders, customers, products..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color={isDark ? '#9ca3af' : '#64748b'} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <Box
                    sx={{
                      px: 0.75,
                      py: 0.2,
                      borderRadius: '4px',
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                      color: 'text.secondary',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                    }}
                  >
                    ⌘K
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                fontSize: '0.85rem',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(226, 232, 240, 0.9)'}`,
                '& fieldset': { border: 'none' },
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
                },
              },
            }}
          />
        </Box>

        {/* Live Store Status Indicator */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'inline-flex' },
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: '9999px',
            bgcolor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)'}`,
          }}
        >
          <Box
            component="span"
            className="pulse-live"
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#10b981',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: isDark ? '#34d399' : '#059669',
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
            }}
          >
            Store Online
          </Typography>
        </Box>

        {/* Right Nav Utilities */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Theme Toggle (Dark / Light) */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.secondary',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                  color: 'text.primary',
                },
              }}
            >
              {isDark ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
            </IconButton>
          </Tooltip>

          {/* Notifications Popover */}
          <NotificationMenu />

          {/* User Profile Avatar & Menu */}
          <Box
            onClick={handleProfileOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              },
            }}
          >
            <Avatar
              alt="Alex Mercer"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              sx={{ width: 34, height: 34, border: '2px solid #6366f1' }}
            >
              AM
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Alex Mercer
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Store Admin
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                width: 210,
                borderRadius: 2.5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Alex Mercer
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                alex.mercer@orderly.io
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClose}>
              <User size={15} style={{ marginRight: 10 }} />
              Profile Details
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <Settings size={15} style={{ marginRight: 10 }} />
              Preferences
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <HelpCircle size={15} style={{ marginRight: 10 }} />
              Support & Docs
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileClose} sx={{ color: 'error.main' }}>
              <LogOut size={15} style={{ marginRight: 10 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;

