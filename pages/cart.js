import React, { useState } from 'react'
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
import CartDisplay from '../components/CartDisplay'
import { flatten } from 'lodash'
import {
  Container,
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
  }
}))

const Page = ({ dispatch, lang, cart, google, orderInfo }) => {
  const classes = useStyles()
  const theme = useTheme()
  const langSuffix = lang ? lang.substring(0, 2) : 'en'
  const [open, setOpen] = React.useState(false)
  const [location, setLocation] = React.useState({})
  const [info, setInfo] = React.useState(orderInfo)
  const [orderId, setOrderId] = React.useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onMapClicked = (mapProps, map, clickEvent) => {
    const latLng = JSON.parse(JSON.stringify(clickEvent.latLng))

    setLocation(latLng)

    const updated = {
      ...info,
      lat: latLng.lat,
      lng: latLng.lng
    }

    setInfo(updated)

    dispatch({ type: 'INFO_UPDATE', payload: updated })

    setOpen(false)
  }

  const updateInfo = (name, value) => {
    const updated = {
      ...info,
      [name]: value
    }

    setInfo(updated)

    dispatch({ type: 'INFO_UPDATE', payload: updated })
  }

  const handleSubmit = async () => {
    if (!info.whatsApp) {
      return false
    }
    const order = Object.assign({}, info)
    order.bproducts = cart
    await axios
      .post('http://localhost:3033/borders/', order)
      .then(res => {
        dispatch({ type: 'CART_CLEAR', payload: '' })
        enqueueSnackbar(getLangString('cart.submitted', lang), {
          variant: 'success'
        })
        updateInfo('notes', '')
        Router.push('/order/' + res.data.ops[0]._id)
      })
      .catch(err => {
        enqueueSnackbar(getLangString('cart.submissionError', lang), {
          variant: 'error'
        })
      })
  }

  let cartTotal = Number(0)

  cart.map(bproduct => {
    const basePrice = bproduct.price / 100

    const selectedVariantTotal =
      bproduct.selectedVariant && bproduct.selectedVariant.length > 0
        ? flatten(bproduct.selectedVariant).sum('price') / 100
        : 0

    const taxTotal =
      bproduct.taxRate && bproduct.taxRate > 0
        ? (bproduct.taxRate / 1000) * (basePrice + selectedVariantTotal)
        : 0

    const lineTotal = basePrice + selectedVariantTotal + taxTotal

    cartTotal += lineTotal
  })

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className={classes.root}>
          <Typography>{orderId}</Typography>
          <List className={classes.root}>
            {cart.map((bproduct, index) => (
              <CartDisplay key={index} index={index} bproduct={bproduct} />
            ))}
            <ListItem className={classes.lines}>
              {cart.length > 0 ? (
                <Table className={classes.flexGrid}>
                  <TableBody>
                    <TableRow className={classes.nolines}>
                      <TableCell align='right'>
                        {getLangString('cart.cartTotal', lang)}
                      </TableCell>
                      <TableCell align='right'>
                        {numeral(cartTotal).format(priceFormat)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <Typography className={classes.center}>
                  {getLangString('cart.empty', lang)}
                </Typography>
              )}
            </ListItem>
          </List>
          <br />
          <Grid container spacing={2} justify='space-between'>
            <Grid item>
              <FormControl>
                <TextField
                  variant='outlined'
                  id='name'
                  label={getLangString('cart.name', lang)}
                  defaultValue={info && info.name ? info.name : ''}
                  onChange={event => updateInfo('name', event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={info && !info.whatsApp}
                  variant='outlined'
                  label={getLangString('cart.whatsApp', lang)}
                  id='whatsApp'
                  defaultValue={info && info.whatsApp ? info.whatsApp : ''}
                  onChange={event => updateInfo('whatsApp', event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant='outlined'
                  label={getLangString('cart.email', lang)}
                  id='email'
                  defaultValue={info && info.email ? info.email : ''}
                  onChange={event => updateInfo('email', event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant='outlined'
                  label={getLangString('cart.notes', lang)}
                  id='notes'
                  defaultValue={info && info.notes ? info.notes : ''}
                  onChange={event => updateInfo('notes', event.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
          {location && location.lat && location.lng ? (
            <Typography style={{ marginTop: 20 }}>
              <LocationOnIcon color='error' />
              {getLangString('cart.locationSelected', lang)}
              {numeral(location.lat).format('0.000000') +
                ',' +
                numeral(location.lng).format('-00.000000')}
            </Typography>
          ) : (
            <></>
          )}
          <Button
            variant='contained'
            color='primary'
            style={{ margin: 20 }}
            onClick={handleOpen}
            startIcon={<AddLocationIcon />}
          >
            {getLangString('cart.selectLocation', lang)}
          </Button>
          <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={open}>
              <GoogleMap
                google={google}
                style={{
                  position: 'relative',
                  marginTop: '5%',
                  marginLeft: '5%',
                  width: '90%',
                  height: '90%'
                }}
                initialCenter={{
                  lat: 8.776421,
                  lng: -82.432507
                }}
                zoom={15}
                onClick={onMapClicked}
              >
                <Marker name={'Location'} position={location} />
              </GoogleMap>
            </Fade>
          </Modal>
          <Button
            variant='contained'
            color='primary'
            disabled={!cart || cart.length === 0}
            style={{ margin: 20 }}
            onClick={handleSubmit}
            startIcon={<SendIcon />}
          >
            {getLangString('cart.submit', lang)}
          </Button>
        </div>
      </main>
    </Container>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  ({ store, req, res, ...etc }) => {
    //store.dispatch({type: 'TICK', payload: 'was set in other page'});
  }
)

export default compose(
  connect(state => state),
  GoogleApiWrapper({
    apiKey: 'AIzaSyCqMUr4nf-Ypg37c8QdpMHs2YA9JcRLWzY'
  })
)(Page)
