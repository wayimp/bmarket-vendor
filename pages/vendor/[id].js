import React, { useState } from 'react'
import { connect } from 'react-redux'
import { fade, makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '../../src/Link'
import TopBar from '../../components/TopBar'
import ProductDisplay from '../../components/ProductDisplay'
import { Grid } from '@material-ui/core'
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'stretch'
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
    textAlign: 'center',
    flexGrow: 1,
    padding: theme.spacing(7)
  },
  vendorLogo: {
    maxWidth: 250,
    maxHeight: 250,
    float: 'top',
    padding: 10
  }
}))

const Vendor = ({ bvendor, bproducts, categories_en, categories_es, lang }) => {
  const classes = useStyles()
  const theme = useTheme()
  const categories = lang === 'esES' ? categories_es : categories_en
  const [selectedCategories, setSelectedCategories] = useState([])

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

  const categoryFiltered =
    selectedCategories.length > 0
      ? bproducts.filter(bproduct =>
          categoryNames.includes(bproduct[`category_${lang.substring(0, 2)}`])
        )
      : bproducts

  return (
    <Container>
      <TopBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
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
            {categoryFiltered.map(bproduct => {
              return <ProductDisplay bproduct={bproduct} key={bproduct._id} />
            })}
          </Grid>
        </div>
      </main>
    </Container>
  )
}

export async function getServerSideProps (context) {
  const { id } = context.params

  const bvendors = await fetch('http://localhost:3033/bvendors/' + id).then(
    result => result.json()
  )

  const results = await fetch('http://localhost:3033/bproducts/' + id).then(
    result => result.json()
  )

  let bproducts = []
  let categories_en = []
  let categories_es = []

  if (results && Array.isArray(results) && results.length > 0) {
    bproducts = results.sort(function (a, b) {
      const sortA = a.sortOrder ? a.sortOrder : 100,
        sortB = b.sortOrder ? b.sortOrder : 100
      return sortA - sortB
    })

    categories_en = [...new Set(results.map(product => product.category_en))]

    categories_es = [...new Set(results.map(product => product.category_es))]
  }

  return {
    props: {
      bvendor: bvendors[0],
      bproducts,
      categories_en,
      categories_es
    }
  }
}

export default connect(state => state)(Vendor)
