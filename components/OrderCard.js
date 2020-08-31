import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { red } from '@material-ui/core/colors'
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Container,
  Grid,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import LaunchIcon from '@material-ui/icons/Launch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DDTHH:mm:SS'
const dateDisplay = 'dddd h:mm a'
import { getLangString } from '../components/Lang'
import numeral from 'numeral'
const priceFormat = '$0.00'

Array.prototype.sum = function (prop) {
  let total = Number(0)
  for (let i = 0, _len = this.length; i < _len; i++) {
    total += Number(this && this[i] && this[i][prop] ? this[i][prop] : 0)
  }
  return total
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
    margin: 6
  },
  grid: {
    marginTop: -30,
    paddingBottom: 20
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

const OrderCard = ({ border, lang }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)
  const langSuffix = lang ? lang.substring(0, 2) : 'en'

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const bvendors = Array.isArray(border.bproducts)
    ? [...new Set(border.bproducts.map(bproduct => bproduct.bvendor))]
    : []

  let whatsAppScrubbed = border.whatsApp.replace(/[^0-9.]/g, '')
  if (whatsAppScrubbed.startsWith('6')) {
    whatsAppScrubbed = '507' + whatsAppScrubbed
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton aria-label={getLangString('orders.detail', lang)}>
            <Link
              href={`http://localhost:3034/order/${border._id}`}
              target={border._id}
            >
              <LaunchIcon />
            </Link>
          </IconButton>
        }
        title={border.name}
        subheader={moment(border.timeline[0].timestamp, dateFormat)
          .locale(lang.substring(0, 2))
          .format(dateDisplay)}
      />
      <CardContent>
        <Grid
          className={classes.grid}
          container
          spacing={2}
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
        >
          {bvendors.map(bvendor => {
            return (
              <figure key={bvendor}>
                <img
                  src={`https://boqueteeats.s3.us-east-2.amazonaws.com/${bvendor}/logo.png`}
                  style={{ height: 48 }}
                />
                <figcaption>
                  {numeral(
                    border.bproducts
                      .filter(bproduct => bproduct.bvendor === bvendor)
                      .sum('lineTotal')
                  ).format(priceFormat)}
                </figcaption>
              </figure>
            )
          })}
        </Grid>
        <Link href={'https://wa.me/' + whatsAppScrubbed} target='_new'>
          {'WhatsApp: ' + whatsAppScrubbed}
        </Link>
        <Typography variant='body2' color='textSecondary' component='p'>
          {border.timeline.length > 1
            ? border.timeline[border.timeline.length - 1][
                `description_${langSuffix}`
              ]
            : ''}
        </Typography>
      </CardContent>

      {/*
      <CardActions disableSpacing>
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
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
        
          {bvendors.map(bvendor => {
            return (
              
              <figure key={bvendor}>
                <figcaption>
                  {currencyFormat(
                    border.bproducts
                      .filter(bproduct => bproduct.bvendor === bvendor)
                      .sum('price')
                  )}
                </figcaption>
              </figure>
            )
          })}
        </CardContent>
      </Collapse>
      */}
    </Card>
  )
}

export default connect(state => state)(OrderCard)
