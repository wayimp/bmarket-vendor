import React, { useState } from 'react'
import axiosClient from '../src/axiosClient'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { connect } from 'react-redux'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import numeral from 'numeral'
import { flatten } from 'lodash'
import { LabelDivider } from 'mui-label-divider'
import { getLangString } from './Lang'
import {
  Grid,
  Collapse,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Typography,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  FormControlLabel,
  TextField,
  Switch
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
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
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  field: {
    padding: theme.spacing(1)
  },
  thumb: {
    maxWidth: 200,
    maxHeight: 200
  }
}))

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const ProductDisplay = ({
  bproduct,
  categories_en,
  categories_es,
  updateBproduct,
  dispatch,
  lang,
  token
}) => {
  {
    const classes = useStyles()
    const langSuffix = lang ? lang.substring(0, 2) : 'en'
    const [selectedVariant, setSelectedVariant] = useState([])
    const [expanded, setExpanded] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = React.useState(false)
    const [bproductEdit, setBproductEdit] = useState(
      JSON.parse(JSON.stringify(bproduct))
    )

    const categories_en_options = categories_en.map(category => {
      return Object.fromEntries([
        ['value', category],
        ['label', category],
        ['isSelected', bproductEdit.category_en === category ? true : false]
      ])
    })

    const categories_es_options = categories_es.map(category => {
      return Object.fromEntries([
        ['value', category],
        ['label', category],
        ['isSelected', bproductEdit.category_es === category ? true : false]
      ])
    })

    const changeField = (name, value) => {
      const updated = {
        ...bproductEdit,
        [name]: value
      }
      setBproductEdit(updated)
    }

    const handleSwitchChange = event => {
      changeField(event.target.name, event.target.checked)
    }

    const categoryChangeEn = (newValue, actionMeta) => {
      changeField('category_en', newValue.value)
    }

    const categoryChangeEs = (newValue, actionMeta) => {
      changeField('category_es', newValue.value)
    }

    const handleOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const handleSubmit = async () => {
      // If it has an ID aleady, then post it, or else update it.
      await axiosClient({
        method: bproductEdit._id ? 'patch' : 'post',
        url: '/bproducts',
        data: bproductEdit,
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          enqueueSnackbar(getLangString('products.updated', lang), {
            variant: 'success'
          })
          handleClose()
          updateBproduct(bproductEdit)
        })
        .catch(error => {
          enqueueSnackbar(getLangString('products.notUpdated', lang) + error, {
            variant: 'error'
          })
        })
    }

    const handleExpandClick = () => {
      setExpanded(!expanded)
    }

    const handleVariantChange = (index, selected) => {
      const sv = selectedVariant.slice()
      sv[index] = selected
      setSelectedVariant(sv)
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
            <br />
            <Typography>
              {getLangString('products.price', lang) +
                ': ' +
                numeral(
                  bproduct.price / 100 + flatten(variants).sum('price') / 100
                ).format('$0.00')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant='contained'
              color='primary'
              onClick={handleOpen}
              startIcon={<EditIcon />}
            >
              {getLangString('common.edit', lang)}
            </Button>
          </CardActions>
        </Card>
        <Modal
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
            <div className={classes.paper}>
              <Grid container spacing={2} justify='space-between'>
                <Grid item xs={9}>
                  <Grid item xs={12}>
                    <FormControl>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='slug'
                        label={getLangString('products.slug', lang)}
                        defaultValue={
                          bproductEdit.slug ? bproductEdit.slug : ''
                        }
                        onChange={event =>
                          changeField('slug', event.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='price'
                        label={getLangString('products.price', lang)}
                        defaultValue={
                          bproductEdit.price ? bproductEdit.price : '0'
                        }
                        onChange={event =>
                          changeField('price', event.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='taxRate'
                        label={getLangString('products.taxRate', lang)}
                        defaultValue={
                          bproductEdit.taxRate ? bproductEdit.taxRate : '0'
                        }
                        onChange={event =>
                          changeField('taxRate', event.target.value)
                        }
                      />
                    </FormControl>
                    <FormControlLabel
                      labelPlacement='top'
                      control={
                        <Switch
                          className={classes.switch}
                          checked={bproductEdit.active}
                          onChange={handleSwitchChange}
                          name='active'
                          color='primary'
                        />
                      }
                      label={getLangString('products.active', lang)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='image'
                        label={getLangString('products.image', lang)}
                        defaultValue={
                          bproductEdit.image ? bproductEdit.image : ''
                        }
                        onChange={event =>
                          changeField('image', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <TextField
                        className={classes.field}
                        variant='outlined'
                        id='options'
                        label={getLangString('products.options', lang)}
                        defaultValue={
                          bproductEdit.variantsAvailable
                            ? JSON.stringify(bproductEdit.variantsAvailable)
                            : '{}'
                        }
                        onChange={event =>
                          changeField(
                            'variantsAvailable',
                            JSON.parse(event.target.value)
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <img
                    src={bproductEdit.image || ''}
                    className={classes.thumb}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='name_en'
                      label={getLangString('products.name', 'enUS')}
                      defaultValue={
                        bproductEdit.name_en ? bproductEdit.name_en : ''
                      }
                      onChange={event =>
                        changeField('name_en', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='name_es'
                      label={getLangString('products.name', 'esES')}
                      defaultValue={
                        bproductEdit.name_es ? bproductEdit.name_es : ''
                      }
                      onChange={event =>
                        changeField('name_es', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='description_en'
                      label={getLangString('products.description', 'enUS')}
                      defaultValue={
                        bproductEdit.description_en
                          ? bproductEdit.description_en
                          : ''
                      }
                      onChange={event =>
                        changeField('description_en', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      className={classes.field}
                      variant='outlined'
                      id='description_es'
                      label={getLangString('products.description', 'esES')}
                      defaultValue={
                        bproductEdit.description_es
                          ? bproductEdit.description_es
                          : ''
                      }
                      onChange={event =>
                        changeField('description_es', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <LabelDivider
                    label={getLangString('products.categoryPrompt', lang)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CreatableSelect
                    className={classes.field}
                    placeholder={getLangString('products.category', 'enUS')}
                    className={classes.creatableSelect}
                    id='category_en'
                    options={categories_en_options}
                    onChange={categoryChangeEn}
                    defaultValue={categories_en_options.filter(
                      option => option.isSelected
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CreatableSelect
                    className={classes.field}
                    placeholder={getLangString('products.category', 'esES')}
                    className={classes.creatableSelect}
                    id='category_es'
                    options={categories_es_options}
                    onChange={categoryChangeEs}
                    defaultValue={categories_es_options.filter(
                      option => option.isSelected
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LabelDivider />
                </Grid>
                <Grid
                  container
                  direction='row'
                  justify='flex-end'
                  alignItems='flex-start'
                >
                  <Button
                    variant='contained'
                    color='secondary'
                    style={{ margin: 20 }}
                    onClick={handleClose}
                    startIcon={<CancelIcon />}
                  >
                    {getLangString('common.cancel', lang)}
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ margin: 20 }}
                    onClick={handleSubmit}
                    startIcon={<SaveIcon />}
                  >
                    {getLangString('common.save', lang)}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Fade>
        </Modal>
      </Grid>
    )
  }
}

export default connect(state => state)(ProductDisplay)
