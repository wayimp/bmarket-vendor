import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Collapse from '@material-ui/core/Collapse'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'
import Select from 'react-select'
import numeral from 'numeral'
import { flatten } from 'lodash'
import { getLangString } from './Lang'
import { Grid } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 400,
    margin: 10,
    overflow: 'visible'
  },
  media: {
    height: 300
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}))

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const ProductDisplay = ({ bproduct, dispatch, lang }) => {
  {
    const classes = useStyles()
    const langSuffix = lang ? lang.substring(0, 2) : 'en'
    const [selectedVariant, setSelectedVariant] = useState([])
    const [expanded, setExpanded] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const handleExpandClick = () => {
      setExpanded(!expanded)
    }

    const handleVariantChange = (index, selected) => {
      const sv = selectedVariant.slice()
      sv[index] = selected
      setSelectedVariant(sv)
    }

    const cartAdd = bproduct => {
      bproduct.selectedVariant = selectedVariant
      dispatch({ type: 'CART_ADD', payload: bproduct })
      const message = bproduct[`name_${langSuffix}`]
      enqueueSnackbar(message, {
        variant: 'success'
      })
    }

    let variants = []
    if (
      bproduct.variantsAvailable &&
      Array.isArray(bproduct.variantsAvailable) &&
      bproduct.variantsAvailable.length > 0
    ) {
      bproduct.variantsAvailable.map((variantSelect, index) => {
        if (
          variantSelect[`options_${langSuffix}`] &&
          variantSelect[`options_${langSuffix}`].length > 0
        ) {
          if (selectedVariant[index] === undefined) {
            variants[index] = variantSelect[`options_${langSuffix}`].filter(
              option => option.isSelected
            )
          } else {
            variants[index] = selectedVariant[index]
          }
        }
      })
    }

    return (
      <Grid item lg={3} md={4} sm={5} xs={12} key={bproduct._id}>
        <Card className={classes.root}>
          <CardMedia
            className={classes.media}
            image={bproduct.image || ''}
            title={bproduct[`name_${langSuffix}`]}
          />
          <CardContent>
            <Typography variant='h6' component='h3'>
              {bproduct[`name_${langSuffix}`]}
            </Typography>
            {bproduct[`description_${langSuffix}`] &&
            bproduct[`description_${langSuffix}`].length > 0 ? (
              <>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label='show more'
                >
                  <ExpandMoreIcon />
                </IconButton>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                  <Typography
                    gutterBottom
                    variant='body2'
                    color='textSecondary'
                    component='p'
                  >
                    {bproduct[`description_${langSuffix}`]}
                  </Typography>
                </Collapse>
              </>
            ) : (
              ''
            )}
            {bproduct.variantsAvailable &&
            Array.isArray(bproduct.variantsAvailable) &&
            bproduct.variantsAvailable.length > 0
              ? bproduct.variantsAvailable.map((variantSelect, index) =>
                  variantSelect[`options_${langSuffix}`] &&
                  variantSelect[`options_${langSuffix}`].length > 0 ? (
                    <Select
                      id={index.toString()}
                      instanceId={index.toString()}
                      inputId={index.toString()}
                      key={index}
                      placeholder={variantSelect[`placeholder_${langSuffix}`]}
                      isMulti={variantSelect.isMulti}
                      value={variants[index]}
                      onChange={selected =>
                        handleVariantChange(index, selected)
                      }
                      options={variantSelect[`options_${langSuffix}`]}
                    />
                  ) : (
                    ''
                  )
                )
              : ''}
          </CardContent>
          <CardActions>
            <Button
              size='medium'
              color='primary'
              onClick={e => {
                e.preventDefault
                cartAdd(bproduct)
              }}
            >
              {numeral(
                bproduct.price / 100 + flatten(variants).sum('price') / 100
              ).format('$0.00')}{' '}
              - {getLangString('common.addToCart', lang)}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default connect(state => state)(ProductDisplay)
