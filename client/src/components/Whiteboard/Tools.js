import React from "react";

// Material
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
} from '@mui/material';
import MuiInput from '@mui/material/Input';

import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CircleIcon from '@mui/icons-material/Circle'
import ShortTextIcon from '@mui/icons-material/ShortText'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AutoFixNormalOutlinedIcon from '@mui/icons-material/AutoFixNormalOutlined';
import RollerShadesClosedIcon from '@mui/icons-material/RollerShadesClosed';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';

export const ThicknessInput = styled(MuiInput)`
  width: 40px;
`;

export const linetypeObject = ["Brush", "Eraser"]
export const shapetypeObject = ["Rect", "FilledRect", "Circle", "FilledCircle", "Text", "Image"]
export const drawtypeObject = [
  { name: "Pointer", icon: <PanToolOutlinedIcon /> },
  { name: "Brush", icon: <BrushOutlinedIcon /> },
  { name: "Eraser", icon: <AutoFixNormalOutlinedIcon /> },
  { name: "Rect", icon: <ChatBubbleOutlineOutlinedIcon /> },
  { name: "FilledRect", icon: <ChatBubbleIcon /> },
  { name: "Circle", icon: <CircleOutlinedIcon /> },
  { name: "FilledCircle", icon: <CircleIcon /> },
  { name: "Text", icon: <ShortTextIcon /> },
  { name: "Image", icon: <AddPhotoAlternateOutlinedIcon /> },
];

export const colorObject = [
  "#000000",
  "#FFFFFF",
  "#4287f5",
  "#f542f5",
  "#357a38",
  "#00695f",
  "#df4b26",
  "#f5e042",
  "#f59342",
  "#f54242"
];

export const fontsizeObject = [
  { weight: 15, size: 'small' },
  { weight: 30, size: 'medium' },
  { weight: 45, size: 'large' },
];

export const DrawTypeButton = ({ onClick, drawtypeObject, active }) => {
  const [alignment, setAlignment] = React.useState(active);
  //console.log('DrawTypeButton', active)
  const handleAlignment = (event, newAlignment) => {
    onClick(newAlignment);
    setAlignment(newAlignment);
  };
  React.useEffect(() => {
    handleAlignment(null, active)
  },[active])
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="Drawtype buttons"
    >
      {drawtypeObject.map((obj, i) => (
        <ToggleButton
          value={obj.name}
          key={i}
          aria-label="left aligned"
        /* sx={{ '& svg': {fontSize:'1rem'} }} */
        >
          {obj.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
  //return <button onClick={() => onClick(value)}>{value}</button>;
};

export const ColorButton = ({ onClick, colorObject, active }) => {
  const [alignment, setAlignment] = React.useState(active);
  const handleAlignment = (event, newAlignment) => {
    onClick(newAlignment);
    setAlignment(newAlignment);
  };
  const hexToRgb = (hex) =>
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => "#" + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));
  //console.log(hexToRgb(colorObject[3]))
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      {colorObject.map((i) => (
        <ToggleButton
          value={i}
          key={i}
          aria-label="left aligned"
          sx={{
            margin: ' 4px 2px 2px 2px !important',
            lineHeight: '0.43',
            width: '1.8rem',
            height: '1.8rem',
            background: i,
            backgroundColor: i,

            "&:hover": {
              backgroundColor: `rgba(${hexToRgb(i)},0.7) !important`
            },
            "&.Mui-selected": {
              backgroundColor: `rgba(${hexToRgb(i)},1)`,
              boxShadow: "grey 0 0px 14px 1px"
            }
          }}
        >
          {/* <CheckBoxOutlineBlankOutlinedIcon /> */}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
  //return <button onClick={() => onClick(value)}>{value}</button>;
};

export const FontSizeButton = ({ onClick, fontsizeObject, active }) => {
  const [alignment, setAlignment] = React.useState(active);
  const handleAlignment = (event, newAlignment) => {
    onClick(newAlignment);
    setAlignment(newAlignment);
    console.log('newAlignment', newAlignment)
  };
  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      {fontsizeObject.map((obj, i) => (
        <ToggleButton
          value={obj.weight}
          key={i}
          aria-label="left aligned"
          size="small"
        >
          <FormatSizeIcon fontSize={obj.size} />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
  //return <button onClick={() => onClick(value)}>{value}</button>;
};

export const ThicknessSlider = ({ onClick, value, active }) => {
  const min = 1
  const max = 30
  const [valuet, setValuet] = React.useState(value || 10);

  const handleSliderChange = (event, newValue) => {
    setValuet(newValue);
    onClick(newValue);
  };

  const handleInputChange = (event) => {
    setValuet(event.target.value === '' ? '' : Number(event.target.value));
    onClick(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (valuet < min) {
      setValuet(min);
      onClick(min);
    } else if (valuet > max) {
      setValuet(max);
      onClick(max);
    }
  };

  return (
    <Box sx={{ width: 200 }}>
      <Grid container spacing={2} alignItems="center" style={{ marginTop: '-12px', marginLeft: '-10px' }}>
        <Grid item xs>
          <Slider
            value={typeof valuet === 'number' ? valuet : min}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            step={1}
            min={min}
            max={max}
          />
        </Grid>
        <Grid item>
          <ThicknessInput
            value={valuet}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min: min,
              max: max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export const ToolbarItem = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  margin: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:last-child': {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  }
}));

export const SVGwrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  padding: theme.spacing(0),

}))