import * as React from 'react'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'

export default function BasicRating({ value = 0 }) {

    return(
        <Box sx={{ '& > legend': { mt: 2 } }}>
      <Typography component="legend">Rating</Typography>
      <Rating name="read-only" value={value} readOnly />
    </Box>
    )
}