import React from 'react'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Link from '../src/Link'
import StorefrontIcon from '@material-ui/icons/Storefront'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import RedeemIcon from '@material-ui/icons/Redeem'
import PersonIcon from '@material-ui/icons/Person'
import LangSwitcher, { Lang, getLangString } from './Lang'
import cookie from 'js-cookie'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  topButton: {
    marginTop: theme.spacing(6)
  },
  menuButton: {
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}))

const SearchAppBar = ({ dispatch, lang, segment, cart }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [selectedSegment, setSelectedSegment] = React.useState(segment)

  const marketIsSelected = selectedSegment === 'market' ? true : false
  const gardenIsSelected = selectedSegment === 'garden' ? true : false
  const craftsIsSelected = selectedSegment === 'crafts' ? true : false
  const servicesIsSelected = selectedSegment === 'services' ? true : false

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const selectSegment = segmentName => {
    setSelectedSegment(segmentName)
    dispatch({ type: 'SEGMENT', payload: segmentName })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='fixed'
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          {/*
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            <MenuIcon />
          </IconButton>
          */}
          <Link href='/' className={classes.title} onClick={cookie.remove('token')}>
            <img
              src='/images/bmarket-logo-small.png'
              alt='Boquete Market'
              style={{ marginTop: 6 }}
            />
          </Link>
          {/*
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={getLangString('common.search', lang)}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          */}
          <LangSwitcher />
        </Toolbar>
      </AppBar>
      {/*
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            selected={marketIsSelected}
            key={'market'}
            className={classes.topButton}
            onClick={() => selectSegment('market')}
          >
            <ListItemIcon>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText primary={getLangString('menu.market', lang)} />
          </ListItem>
          <ListItem
            button
            selected={gardenIsSelected}
            key={'garden'}
            onClick={() => selectSegment('garden')}
          >
            <ListItemIcon>
              <LocalFloristIcon />
            </ListItemIcon>
            <ListItemText primary={getLangString('menu.garden', lang)} />
          </ListItem>
          <ListItem
            button
            selected={craftsIsSelected}
            key={'crafts'}
            onClick={() => selectSegment('crafts')}
          >
            <ListItemIcon>
              <RedeemIcon />
            </ListItemIcon>
            <ListItemText primary={getLangString('menu.crafts', lang)} />
          </ListItem>
          <ListItem
            button
            selected={servicesIsSelected}
            key={'services'}
            onClick={() => selectSegment('services')}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={getLangString('menu.services', lang)} />
          </ListItem>
        </List>
      </Drawer>
      */}
    </div>
  )
}

export default connect(state => state)(SearchAppBar)
