import * as React from 'react';
import _ from 'lodash'
import { useQuery } from "@apollo/client";
import { useSnackbar } from 'notistack';

// Material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,

} from '@mui/material'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

// Custom
import { GET_TAGS, } from "../../app/queries";


const filter = createFilterOptions();

const FreeSoloCreateOptionDialog = props => {

  const { enqueueSnackbar } = useSnackbar();

  const [tags, setTags] = React.useState([]);
  const [open, toggleOpen] = React.useState(false);

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
  });

  const [search, setSearch] = React.useState(null)
  const [page, setPage] = React.useState(1);
  const [perpage, setPerpage] = React.useState(100)
  const { data, loading, error, refetch } = useQuery(GET_TAGS, {
    variables: {
      search,
      page: page,
      limit: perpage
    },
    //fetchPolicy: 'no-cache', //'cache-and-network', //'no-cache', //'cache-and-network', //
    onCompleted: ({ getTags }) => {
      //console.log('useQuery(GET_TAGS) onCompleted:', getTags.tags)
      setTags(getTags.tags)

    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  }
  )
  const handleClose = () => {
    setDialogValue({ title: '', });
    toggleOpen(false);
    //refetch()
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTags([...tags, { title: dialogValue.title }]);
    handleClose();
  };

  React.useEffect(() => {
    return () => {
      props.setTags([])
      //setTags([])
    }
  }, [])
  // MuiOutlinedInput-root MuiInputBase-root overflow-y: auto; max-height: 165px;
  return (
    <React.Fragment>

      <Autocomplete
        name="tags"
        sx={{
          p: 1,
          width: 300,
          overflowY: 'auto',
          //height:160, 
          '& .MuiOutlinedInput-root.MuiInputBase-root': {
            overflowY: 'auto',
            //height: 155,
          }
        }}

        multiple
        freeSolo
        limitTags={3}
        id="free-solo-dialog-demo"
        options={tags}
        getOptionLabel={(option) => {
          //console.log('getOptionLabel', option)
          if (option.inputValue) {
            //console.log('getOptionLabel', option.inputValue)
            return option.inputValue;
          }
          return option.title
        }}
        // getOptionLabel={(option) => {
        //   // e.g value selected with enter, right from the input
        //   if (typeof option === 'string') {
        //     return option;
        //   }
        //   if (option.inputValue) {
        //     return option.inputValue;
        //   }
        //   return option.title;
        // }}
        // defaultValue={null}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          //console.log('filterOptions params', params)
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }
          //console.log('filterOptions filtered', filtered)
          return filtered;
        }}
        //value={value}
        onChange={(event, newValue, reason, details) => {
          console.log('onChange #1_0', newValue, newValue.length, reason, details);
          let newTagList = []
          newValue.forEach((arrayItem) => {
            if (arrayItem.hasOwnProperty('inputValue')) {
              newTagList.push({ title: arrayItem.inputValue })
            } else newTagList.push(arrayItem)

          });
          console.log('onChange #1_3', newTagList)
          props.setTags(newTagList)

        }}


        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.title}</li>}
        renderInput={(params) => <TextField {...params} label="Taglist" />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new film</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any film in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  title: event.target.value,
                })
              }
              label="title"
              type="text"
              variant="standard"
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default FreeSoloCreateOptionDialog