import React, { useEffect, memo } from "react";
import { Outlet } from "react-router-dom";

// Material
import {
  Box,
  Grid,
} from '@mui/material'

const Main = () => {

  useEffect(() => {
    //console.log("Main.js->useEffect");
  }, []);

  return (
   <React.Fragment>
    <Grid container sx={{margin: '0',padding: '1rem', }}>
      <Grid item xs>
        <Box sx={{ minHeight:'calc(100vh - 193px)',}}>
          <Outlet />
        </Box>      
      </Grid>
    </Grid>
   </React.Fragment>
  );
};

export default memo(Main);

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}