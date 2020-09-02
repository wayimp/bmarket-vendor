import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '../src/Link'
import TopBar from '../components/TopBar'
import ProductDisplay from './ProductDisplay'
import { Grid } from '@material-ui/core'
import {
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  vendorLogo: {
    maxWidth: 250,
    maxHeight: 250,
    float: 'top',
    padding: 10
  },
  section: {
    backgroundColor: '#EEF',
    border: '1px solid #AAA',
    marginBottom: 10
  }
}))

const VendorDisplay = ({ bvendor, bproductsProp, lang }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [bproducts, setBproducts] = useState(bproductsProp)

  const categories_en =
    bproducts && Array.isArray(bproducts) && bproducts.length > 0
      ? [...new Set(bproducts.map(bproduct => bproduct.category_en))]
      : []

  const categories_es =
    bproducts && Array.isArray(bproducts) && bproducts.length > 0
      ? [...new Set(bproducts.map(bproduct => bproduct.category_es))]
      : []

  const categories = lang === 'esES' ? categories_es : categories_en

  const handleCategoryChange = index => {
    let updated = selectedCategories.slice()
    if (updated.includes(index)) {
      updated = updated.filter(item => item !== index)
    } else {
      updated = updated.concat(index)
    }
    updated = [...new Set(updated)].sort()
    setSelectedCategories(updated)
  }

  const categoryNames = categories.filter((category, index) =>
    selectedCategories.includes(index)
  )

  const updateBproduct = bproductUpdated => {
    if (bproductUpdated) {
      setBproducts(
        bproducts.map(bproduct =>
          bproduct._id !== bproductUpdated._id ? bproduct : bproductUpdated
        )
      )
    }
  }

  const filtered =
    selectedCategories.length > 0
      ? bproducts.filter(bproduct =>
          categoryNames.includes(bproduct[`category_${lang.substring(0, 2)}`])
        )
      : bproducts

  return (
    <Card className={classes.section}>
      <Grid container direction='column' justify='center' alignItems='center'>
        <img className={classes.vendorLogo} src={bvendor.logo} />
        <Typography>
          {bvendor[`description_${lang.substring(0, 2)}`]}
        </Typography>
        <Grid container justify='center'>
          <FormGroup row>
            {categories.map((category, index) => (
              <FormControlLabel
                key={index}
                checked={selectedCategories.includes(index)}
                onChange={() => handleCategoryChange(index)}
                control={<Checkbox color='primary' />}
                label={category}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
      <div className={classes.root}>
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='stretch'
        >
          {filtered.map(bproduct => {
            return (
              <ProductDisplay
                key={bproduct._id}
                bproduct={bproduct}
                categories_en={categories_en}
                categories_es={categories_es}
                updateBproduct={updateBproduct}
              />
            )
          })}
        </Grid>
      </div>
    </Card>
  )
}

export default connect(state => state)(VendorDisplay)
