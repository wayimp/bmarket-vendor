import React, { useState } from 'react'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Link from '../../src/Link'
import TopBar from '../../components/TopBar'
import OrderDisplay from '../../components/OrderDisplay'
import numeral from 'numeral'
const priceFormat = '$0.00'
import moment from 'moment'
//import 'moment/locale/es'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd MMM DD hh:mm a'
//const dateDisplay = 'YYYY-MM-DD hh:mm a'
import {
  Container,
  Grid,
  Checkbox,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button
} from '@material-ui/core'
import { getLangString } from '../../components/Lang'
import LocationOnIcon from '@material-ui/icons/LocationOn'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  formLabelRoot: {
    // must provide all of formLabelRoot && '&$formLabelFocused' && formLabelFocused
    '&$formLabelFocused': { color: theme.palette.primary.main }
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

const Order = ({ border, lang }) => {
  const classes = useStyles()
  const theme = useTheme()

  let locationUrl = 'https://www.google.com/maps/place/'
  if (border.lat && border.lng) {
    locationUrl += border.lat + ',' + border.lng
  }

  let cartTotal = Number(0)
  border.bproducts.map(bproduct => {
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
        <Typography style={{ margin: 12 }}>
          {getLangString('cart.dateSubmitted', lang) +
            moment(border.dateSubmitted, dateFormat)
              .locale(lang.substring(0, 2))
              .format(dateDisplay)}
        </Typography>
        <Grid container spacing={2} justify='space-between'>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              id='name'
              label={getLangString('cart.name', lang)}
              value={border && border.name ? border.name : ''}
              readOnly
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              label={getLangString('cart.whatsApp', lang)}
              id='whatsApp'
              value={border && border.whatsApp ? border.whatsApp : ''}
              readOnly
            />{' '}
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              label={getLangString('cart.email', lang)}
              id='email'
              value={border && border.email ? border.email : ''}
              readOnly
            />{' '}
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
              variant='outlined'
              label={getLangString('cart.notes', lang)}
              id='notes'
              value={border && border.notes ? border.notes : ''}
              readOnly
            />
          </Grid>
        </Grid>
        {border.lat && border.lng ? (
          <Button
            style={{ marginTop: 12 }}
            variant='outlined'
            target='_blank'
            color='primary'
            href={locationUrl}
            startIcon={<LocationOnIcon color='error' />}
          >
            {getLangString('cart.map', lang)}
          </Button>
        ) : (
          ''
        )}
        <List className={classes.root}>
          {border.bproducts.map((bproduct, index) => (
            <OrderDisplay key={index} index={index} bproduct={bproduct} />
          ))}
          <ListItem className={classes.lines}>
            {border.bproducts.length > 0 ? (
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
      </main>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const { id } = context.params

  const border = await fetch('http://localhost:3033/borders/' + id).then(
    result => result.json()
  )

  return {
    props: {
      border
    }
  }
}

export default connect(state => state)(Order)
