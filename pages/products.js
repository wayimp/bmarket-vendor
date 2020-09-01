import React, { useState, useEffect } from 'react'
import ProductDisplay from '../components/ProductDisplay'
import Router from 'next/router'
import axios from 'axios'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { wrapper } from '../components/store'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import { getLangString } from '../components/Lang'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SendIcon from '@material-ui/icons/Send'
import numeral from 'numeral'
const priceFormat = '$0.00'
import OrderCard from '../components/OrderCard'
import { flatten } from 'lodash'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMMM DD'
import {
  Container,
  Card,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField
} from '@material-ui/core'
import {
  Map as GoogleMap,
  InfoWindow,
  Marker,
  GoogleApiWrapper
} from 'google-maps-react'
import { useSnackbar } from 'notistack'
import cookie from 'js-cookie'
import axiosClient from '../src/axiosClient'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  center: {
    textAlign: 'center'
  },
  content: {
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(7)
  },
  root: {
    flexGrow: 1
  },
  center: {
    textAlign: 'center',
    flexGrow: 1
  },
  lines: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1,
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
    '&:last-child': {
      borderBottom: '1px solid #ccc'
    }
  },
  nolines: {
    borderBottom: '2px solid white'
  },
  flexGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  day: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    margin: '5px',
    padding: '8px'
  },
  vendorLogo: {
    maxWidth: 250,
    maxHeight: 250,
    float: 'top',
    padding: 10
  }
}))

const Page = ({ dispatch, lang, token, bvendors }) => {
  const classes = useStyles()
  const theme = useTheme()
  const langSuffix = lang ? lang.substring(0, 2) : 'en'
  const [open, setOpen] = React.useState(false)
  const [bproducts, setBproducts] = React.useState([])
  const { enqueueSnackbar } = useSnackbar()

  const getData = () => {
    axiosClient({
      method: 'get',
      url: 'http://localhost:3033/bproducts',
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      setBproducts(Array.isArray(response.data) ? response.data : [])
    })
  }

  const onFocus = () => {
    getData()
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (token && token.length > 0) {
      dispatch({ type: 'SEGMENT', payload: 'products' })
      getData()
    } else {
      Router.push('/')
    }
  }, [token])

  const bproductsSorted = Array.isArray(bproducts)
    ? bproducts.sort(function (a, b) {
        return a.category_en > b.category_en
      })
    : []

  const bvendorsSet =
    bproductsSorted.length > 0
      ? [...new Set(bproductsSorted.map(bproduct => bproduct.bvendor))]
      : []

  const bvendorsFiltered =
    bvendors && Array.isArray(bvendors)
      ? bvendors.filter(bvendor => bvendorsSet.includes(bvendor.slug))
      : []

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          {bvendorsFiltered.map(bvendor => (
            <Card key={bvendor._id} className={classes.day}>
              <img className={classes.vendorLogo} src={bvendor.logo} />
              <Grid
                container
                spacing={2}
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
              >
                {bproductsSorted
                  .filter(bproduct => bproduct.bvendor === bvendor.slug)
                  .map(bproduct => (
                    <ProductDisplay bproduct={bproduct} key={bproduct._id} />
                  ))}
              </Grid>
            </Card>
          ))}
        </div>
      </main>
    </Container>
  )
}

export default connect(state => state)(Page)
