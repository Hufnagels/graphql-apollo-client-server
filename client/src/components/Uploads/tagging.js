import * as React from 'react';
import _ from 'lodash'

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

const filter = createFilterOptions();

const FreeSoloCreateOptionDialog = props => {
  const [tags, setTags] = React.useState(null);
  const [open, toggleOpen] = React.useState(false);

  const [dialogValue, setDialogValue] = React.useState({
    title: '',
  });

  const handleClose = () => {
    setDialogValue({ title: '', });
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTags([...tags, { title: dialogValue.title }]);
    handleClose();
  };

  React.useEffect(() => {
    return () => {
      props.setTags([])
      setTags([])
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
        options={top100Films}
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
          console.log('filterOptions params', params)
          if (params.inputValue !== '') {
            filtered.push({
              // title: params.inputValue,
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`,
            });
          }
          console.log('filterOptions filtered', filtered)
          return filtered;
        }}
        //value={value}
        onChange={(event, newValue, reason, details) => {
          console.log('onChange #1_0', newValue, newValue.length, reason, details);
          if (newValue.some(obj => obj.hasOwnProperty('inputValue'))) {
            const newTag = _.last(newValue);
            const originTags = _.dropRight(newValue)
            console.log('onChange #1_1', newValue, newValue.length, originTags, newTag);
            // newTag gql action
            const newTagTitle = newTag.inputValue
            originTags.push({ title: newTagTitle })
            console.log('onChange #1_2', originTags)
            newValue = originTags
          }
          console.log('onChange #1_3', newValue)
          props.setTags(newValue)


          return
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            console.log('onChange #1.1', newValue)
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                title: newValue,
              });
            });
          } else if (newValue && newValue.inputValue) {
            console.log('onChange #1.2', newValue)
            toggleOpen(true);
            setDialogValue({
              title: newValue.inputValue,
            });
          } else {
            console.log('onChange #1.3', newValue.length)
            toggleOpen(true);
            setDialogValue({
              title: newValue.inputValue,
            });
            setTags(newValue);
          }
          console.log('onChange #2', newValue)
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: 'The Shawshank Redemption' },
  { title: 'The Godfather' },
  { title: 'The Godfather: Part II' },
  { title: 'The Dark Knight' },
  { title: '12 Angry Men' },
  { title: "Schindler's List" },
  { title: 'Pulp Fiction' },
  { title: 'The Lord of the Rings: The Return of the King' },
  { title: 'The Good, the Bad and the Ugly' },
  { title: 'Fight Club' },
  { title: 'The Lord of the Rings: The Fellowship of the Ring' },
  { title: 'Star Wars: Episode V - The Empire Strikes Back' },
  { title: 'Forrest Gump' },
  { title: 'Inception' },
  { title: 'The Lord of the Rings: The Two Towers' },
  { title: "One Flew Over the Cuckoo's Nest" },
  { title: 'Goodfellas' },
  { title: 'The Matrix' },
  { title: 'Seven Samurai' },
  { title: 'Star Wars: Episode IV - A New Hope' },
  { title: 'City of God' },
  { title: 'Se7en' },
  { title: 'The Silence of the Lambs' },
  { title: "It's a Wonderful Life" },
  { title: 'Life Is Beautiful' },
  { title: 'The Usual Suspects' },
  { title: 'Léon: The Professional' },
  { title: 'Spirited Away' },
  { title: 'Saving Private Ryan' },
  { title: 'Once Upon a Time in the West' },
  { title: 'American History X' },
  { title: 'Interstellar' },
  { title: 'Casablanca' },
  { title: 'City Lights' },
  { title: 'Psycho' },
  { title: 'The Green Mile' },
  { title: 'The Intouchables' },
  { title: 'Modern Times' },
  { title: 'Raiders of the Lost Ark' },
  { title: 'Rear Window' },
  { title: 'The Pianist' },
  { title: 'The Departed' },
  { title: 'Terminator 2: Judgment Day' },
  { title: 'Back to the Future' },
  { title: 'Whiplash' },
  { title: 'Gladiator' },
  { title: 'Memento' },
  { title: 'The Prestige' },
  { title: 'The Lion King' },
  { title: 'Apocalypse Now' },
  { title: 'Alien' },
  { title: 'Sunset Boulevard' },
];

const top100Films2 = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Godfather: Part II',
  'The Dark Knight',
  '12 Angry Men',
  "Schindler's List",
  'Pulp Fiction',
  'The Lord of the Rings: The Return of the King',
  'The Good, the Bad and the Ugly',
  'Fight Club',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Star Wars: Episode V - The Empire Strikes Back',
  'Forrest Gump',
  'Inception',
  'The Lord of the Rings: The Two Towers',
  "One Flew Over the Cuckoo's Nest",
  'Goodfellas',
  'The Matrix',
  'Seven Samurai',
  'Star Wars: Episode IV - A New Hope',
  'City of God',
  'Se7en',
  'The Silence of the Lambs',
  "It's a Wonderful Life",
  'Life Is Beautiful',
  'The Usual Suspects',
  'Léon: The Professional',
  'Spirited Away',
  'Saving Private Ryan',
  'Once Upon a Time in the West',
  'American History X',
  'Interstellar',
  'Casablanca',
  'City Lights',
  'Psycho',
  'The Green Mile',
  'The Intouchables',
  'Modern Times',
  'Raiders of the Lost Ark',
  'Rear Window',
  'The Pianist',
  'The Departed',
  'Terminator 2: Judgment Day',
  'Back to the Future',
  'Whiplash',
  'Gladiator',
  'Memento',
  'The Prestige',
  'The Lion King',
  'Apocalypse Now',
  'Alien',
  'Sunset Boulevard',
];
export default FreeSoloCreateOptionDialog