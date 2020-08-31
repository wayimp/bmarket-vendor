import React, { useState } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { getLangString } from './Lang'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core'
import numeral from 'numeral'
const priceFormat = '$0.00'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { flatten } from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles(theme => ({
  paper: {
    padding: 20,
    textAlign: 'center'
  },
  thumbnail: {
    border: '1px solid black',
    boxShadow: '5px 5px 10px #ccc',
    maxHeight: 150
  },
  lines: {
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
  }
}))

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const CartDisplay = ({ index, bproduct, dispatch, lang }) => {
  {
    const deleteItem = () => {
      dispatch({ type: 'CART_REMOVE', payload: index })
    }

    const classes = useStyles()
    const langSuffix = lang ? lang.substring(0, 2) : 'en'
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

    const variants = bproduct.selectedVariant
      ? Array.isArray(bproduct.selectedVariant)
        ? bproduct.selectedVariant
            .map(option => (option && option.value ? option.value : ''))
            .join(', ')
        : ''
      : bproduct.selectedVariant && bproduct.selectedVariant.value
      ? bproduct.selectedVariant.value
      : ''

    return (
      <ListItem className={classes.lines}>
        <Grid container justify='flex-end'>
          <IconButton onClick={deleteItem} aria-label='delete'>
            <DeleteIcon />
          </IconButton>
          <Grid item xs>
            <img className={classes.thumbnail} src={bproduct.image} />
          </Grid>
          <Grid item xs style={{paddingLeft:6}}>
            <p />
            {bproduct[`name_${langSuffix}`]}
            <br />
            {variants ? getLangString('cart.options', lang) + variants : ''}
          </Grid>
          <Grid item xs>
            <Table className={classes.flexGrid}>
              <TableBody>
                <TableRow className={classes.nolines}>
                  <TableCell align='right'>
                    {getLangString('cart.price', lang)}
                  </TableCell>
                  <TableCell align='right'>
                    {numeral(basePrice).format(priceFormat)}
                  </TableCell>
                </TableRow>
                {selectedVariantTotal > 0 ? (
                  <TableRow className={classes.nolines}>
                    <TableCell align='right'>
                      {getLangString('cart.extras', lang)}
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(selectedVariantTotal).format(priceFormat)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
                {taxTotal > 0 ? (
                  <TableRow className={classes.nolines}>
                    <TableCell align='right'>
                      {getLangString('cart.tax', lang)}
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(taxTotal).format(priceFormat)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
                {lineTotal > basePrice ? (
                  <TableRow className={classes.nolines}>
                    <TableCell align='right'>
                      {getLangString('cart.total', lang)}
                    </TableCell>
                    <TableCell align='right'>
                      {numeral(lineTotal).format(priceFormat)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </ListItem>
    )
  }
}

export default connect(state => state)(CartDisplay)
