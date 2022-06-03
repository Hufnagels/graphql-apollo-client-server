import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useSubscription, } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { Stage, Layer, Rect } from 'react-konva'
//import { v4 as uuidv4 } from 'uuid';
import uuid from "react-uuid";
import _ from 'lodash'

// Material
import {
  Button,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material'

// Custom
import Rectangle from "./shapes/rectangle";
import Circ from "./shapes/circle";
import Freehand from "./shapes/line";
import Note from "./text/Note";
import Img from "./images/image";
import {
  ThicknessInput,
  drawtypeObject,
  linetypeObject,
  shapetypeObject,
  colorObject,
  fontsizeObject,
  DrawTypeButton,
  ColorButton,
  FontSizeButton,
  ThicknessSlider,
  ToolbarItem,
  SVGwrapper,
} from './Tools'
//import { ll, Il, rl, cl, nl } from './data'
import { calculateAspectRatioFit } from '../../app/functions/image'
import { formatBytes, getBase64ImageSize, getRandomInt } from '../../app/functions/math'
import useResizeObserver from '../../app/hooks/useResizeObserver.hook'

// GraphQL
import { SUBSCRIBE_TO_BOARD, POST_UPDATED_ELEMENT, GET_BOARD, UPDATE_BOARD, } from "../../app/queries";
import { loadBoard, updateBoard, clearBoard } from '../../app/reducers/boardSlice'

const ListItem2 = () => {
  // Common
  const { boardid } = useParams('boardid');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoggedIn, user, tokens } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  // console.log(boardid)

  // Canvas setup
  const KonvaRef = React.useRef(null)
  const dimensions = useResizeObserver(KonvaRef);
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)

  // Drawing preferences
  const [thickness, setThickness] = useState(10);
  const [drawtype, setDrawtype] = useState(drawtypeObject[0].name);
  const [color, setColor] = useState("#000000");
  const [fontsize, setFontsize] = useState(fontsizeObject[1].weight)
  const [shadowBlur, setShadowBlur] = React.useState(5);
  const isDrawing = React.useRef(false);
  const [selectedId, selectShape] = useState(null);

  const [lineTools, setLineTools] = useState(linetypeObject);
  const [shapeTools, setShapeTools] = useState(shapetypeObject);


  // Drawing shapes
  const [lines, setLines] = React.useState([]);
  const [shapes, setShapes] = React.useState([]);

  // Refs
  const [, updateState] = React.useState();
  const stageRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const imageUploadRef = React.useRef(null);

  // Apollo
  const [boardInfo, setBoardInfo] = React.useState({})
  let isLoading = true
  const { data, loading, error } = useQuery(GET_BOARD, {
    variables: { id: boardid }
  });
  const [updateBoard] = useMutation(UPDATE_BOARD, {
    onCompleted: ({ getBoard }) => {
      const variant = 'success'
      enqueueSnackbar('Board updated successfully', { variant })
    },
    onError: (error) => {
      // console.log(error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });
  const [postUpdatedElement, { error: postUpdatedElementError }] = useMutation(POST_UPDATED_ELEMENT, {
    onCompleted: ({ postUpdatedElement }) => {
      // console.log('postUpdatedElement id', postUpdatedElement)
    },
    onError: (error) => {
      // console.log('CREATE_USER error', error)
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });
  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(SUBSCRIBE_TO_BOARD, {
    onSubscriptionData: (e) => {
      // console.log('onSubscriptionData', e.subscriptionData.data.elements)
      const elements = e.subscriptionData.data.elements
      // console.log('elements.length', elements.length)
      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1]
        // console.log('onSubscriptionData lastElement', lastElement)
        if(lastElement.boardid !== boardid) return
        const idx = lastElement.elementid
        const updatedElement = JSON.parse(lastElement.params)
        // console.log('lastElement updatedElement', lastElement, updatedElement)
        if (lastElement.action === 'update') {
          if (!isExist(idx)) {
            // console.log('not exist, so adding new shape via subscription')
            setShapes([
              ...shapes,
              updatedElement
            ])
          } else {
            // console.log('exist, so updating shape via subscription')
            updateItem(idx, updatedElement, shapes, setShapes, false)
          }
        }
        if (lastElement.action === 'add') {
          if (!isExist(idx)) { //(lastID !== idx) {//(!isExist(idx)) {
            console.log('adding new shape via subscription')
            setShapes([
              ...shapes,
              updatedElement
            ])
          }
        }
        if (lastElement.action === 'remove') {
          if (isExist(idx)) { //(lastID !== idx) {//(!isExist(idx)) {
            console.log('remove shape via subscription')
            const newShapes = shapes.filter((s) => s.id !== idx);
            setShapes(newShapes);
            // setShapes([
            //   ...shapes,
            //   updatedElement
            // ])
          }
        }
      }
    },
    onError: (error) => {
      const variant = 'error'
      enqueueSnackbar(error.message, { variant })
    }
  });


  React.useEffect(() => {
    //  console.log('PostsListIndex --> data useEffect')
    if (!data) return
    setBoardInfo(data.getBoard)
    dispatch(loadBoard(data.getBoard))
    setShapes(JSON.parse(data.getBoard.board))
    // console.log('DATA:', data.getBoard)

  }, [data])
  React.useEffect(() => {
    if (!dimensions) return;
    setWidth(dimensions.width)
    setHeight(dimensions.height)
  }, [dimensions])


  React.useEffect(() => {
    //   console.log('useEffect: shapes', shapes)
    //   console.log('useEffect: rectangles', rectangles)
    //   console.log('useEffect: circles', circles)
    // console.log('useEffect: lines', lines)
    //   console.log('useEffect: images', images)
    //   console.log('useEffect: notes', notes)
  }, [lines]);
  React.useEffect(() => {
    // console.log('useEffect: shapes', shapes)
    //   console.log('useEffect: rectangles', rectangles)
    //   console.log('useEffect: circles', circles)
    // console.log('useEffect: lines', lines)
    //   console.log('useEffect: images', images)
    //   console.log('useEffect: notes', notes)
    if (!data) return

    const bd = JSON.parse(data.getBoard.board)
    // console.log('useEffect data.getBoard.board', data.getBoard)
    // console.log('useEffect bd.length', bd.length)
    // console.log('useEffect shapes.length', shapes.length)
    if (bd.length <= shapes.length) isLoading = false
    // console.log('useEffect isLoading', isLoading)
  }, [shapes]);

  // React.useEffect(() => {
  //   console.log('UseEffect drawtype', drawtype);
  // }, [drawtype])
  // React.useEffect(() => {
  //   console.log('useEffect add eventlistener to stage')

  //   stageRef.current.addEventListener('keydown', ev => {

  //     console.log('Transformers', stageRef.current)
  //     console.log('delete selectedId', selectedId)
  //     ev.preventDefault()
  //     return
  //     if (ev.code === "Delete" || ev.code === 'Backspace') {

  //       let index = shapes.findIndex(c => c.id === selectedId);
  //       console.log('delete selectedId #2', selectedId)
  //       console.log('delete shapes', shapes)
  //       console.log('delete index', index)
  //       console.log('delete shapes[index]', shapes[index])
  //       /* 

  //       if (index !== -1) {
  //         shapes.splice(index, 1);
  //         setShapes(shapes);
  //       }
  //       // index = rectangles.findIndex(r => r.id === selectedId);
  //       // if (index !== -1) {
  //       //   rectangles.splice(index, 1);
  //       //   setRectangles(rectangles);
  //       // }
  //       // index = images.findIndex(r => r.id === selectedId);
  //       // if (index !== -1) {
  //       //   images.splice(index, 1);
  //       //   setImages(images);
  //       // }
  //       forceUpdate(); */
  //     }
  //   }, false);

  //   return () => {
  //     dispatch(clearBoard())
  //   }
  // }, [stageRef.current])

  const addRectangle = (posx, posy) => {
    const rect = {
      id: uuid(),
      type: drawtype,
      tool: drawtype,
      x: posx,
      y: posy,
      width: 100,
      height: 100,
      fill: drawtype === 'FilledRect' ? color : 'transparent',
      stroke: color,
      strokeWidth: thickness,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      //shadowBlur: drawtype === 'FilledRect' ? shadowBlur : 0,
    };
    //lastID = rect.id
    //const rects = rectangles.concat([rect]);
    //setRectangles(rects);
    //shapes.concat([rect]);
    if (!isExist(rect.id)) {
      //setShapes([...shapes, rect]);
      console.log('adding new rect to shape')
      postUpdatedElement({
        variables: {
          boardid,
          elementid: rect.id,
          type: rect.type,
          action: 'add',
          params: JSON.stringify(rect),
        }
      })
    }

    isDrawing.current = false
    //console.log('addRectangle shapes', shapes)
    //console.log('addRectangle isDrawing.current', isDrawing.current)

  };
  const addCircle = (posx, posy) => {
    const circ = {
      id: uuid(),
      type: drawtype,
      tool: drawtype,
      x: posx,
      y: posy,
      width: 100,
      height: 100,
      fill: drawtype === 'FilledCircle' ? color : 'transparent',
      stroke: color,
      strokeWidth: thickness,
      rotation: 0,
      //shadowBlur,
    };
    //const circs = circles.concat([circ]);
    //setCircles(circs);
    if (!isExist(circ.id)) {
      //setShapes([...shapes, circ]);
      postUpdatedElement({
        variables: {
          boardid,
          elementid: circ.id,
          type: circ.type,
          action: 'add',
          params: JSON.stringify(circ),
        }
      })
    }

    console.log(isDrawing.current)
  };
  const eraseLine = () => {
    // addLine(stageRef.current.getStage(), layerRef.current, true, "erase");
    // isDrawing.current = false
  };
  const addText = (posx, posy) => {
    const newNote = {
      id: uuid(),
      type: 'Text',
      tool: 'Text',
      x: posx,
      y: posy,
      width: 200,
      height: 70,
      text: "Add text",
      fill: color,
      fontSize: fontsize,
      rotation: 0,
    }

    if (!isExist(newNote.id)) {
      postUpdatedElement({
        variables: {
          boardid,
          elementid: newNote.id,
          type: newNote.type,
          action: 'add',
          params: JSON.stringify(newNote),
        }
      })
    }

    // const id = addTextNode(stageRef.current.getStage(), layerRef.current, fontsize, color);
    // const shs = shapes.concat([id]);
    // setShapes(shs);
  };
  const handleMouseDown = (e) => {
    // console.log('handleMouseDown drawtype', e.target, drawtype, e.target.attrs)
    // console.log('handleMouseDown lines', lines)
    //if (!e.target.pointerPos) setDrawtype(null)
    if (!e.target.pointerPos) isDrawing.current = false
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }

    if ((drawtype === 'Brush' || drawtype === 'Eraser') && e.target.pointerPos) {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      // console.log('MouseDown', pos)
      setLines([
        // ...lines,
        {
          id: uuid(),
          type: drawtype,
          tool: drawtype,
          stroke: color,
          strokeWidth: thickness,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          points: [pos.x, pos.y],
          rotation: 0,
          //shadowBlur,
        }
      ]);
    }
    if ((drawtype === 'Rect' || drawtype === 'FilledRect') && e.target.pointerPos) {
      // console.log('MouseDown Rect')
      const { x, y } = e.target.pointerPos
      addRectangle(x, y)
    }
    if ((drawtype === 'Circle' || drawtype === 'FilledCircle') && e.target.pointerPos) {
      // console.log('MouseDown Circle')
      const { x, y } = e.target.pointerPos
      addCircle(x, y)
    }
    if ((drawtype === 'Text') && e.target.pointerPos) {
      // console.log('MouseDown Text, fontsize', fontsize)
      // console.log('e.target.pointerPos', e.target.pointerPos)
      const { x, y } = e.target.pointerPos
      addText(x, y)
    }
    if ((drawtype === 'Image') && e.target.pointerPos) {
      const { x, y } = e.target.pointerPos
      addImageFromFile()
    }
  };
  const handleMouseMove = (e) => {
    if (!e.target.pointerPos) {
      //       const mousePos = e.target.getPointerPosition();
      //       const es = e.target.getIntersection(mousePos)
      // console.log(e.target.getClientRect({ relativeTo: e.target.getStage() }));
      //console.log('handleMouseMove', e.target)
    }
    // no drawing - skipping
    //console.log('handleMouseMove', e.target)
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };
  const handleMouseUp = () => {
    if (isDrawing.current) {
      const newLine = lines[lines.length - 1]
      setShapes([
        ...shapes,
        newLine
      ])
      postUpdatedElement({
        variables: {
          boardid,
          elementid: newLine.id,
          type: newLine.type,
          action: 'add',
          params: JSON.stringify(newLine),
        }
      })
      setLines([])
    }
    // console.log('MouseUp lines', lines)
    forceUpdate()
    isDrawing.current = false;
  };
  const addImageFromFile = () => {
    imageUploadRef.current.click();
  };
  const uploadImage = ev => {
    const file = ev.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        //console.log('reader.result', reader.result)
        const img = new window.Image()
        img.src = reader.result
        img.addEventListener('load', () => {
          //console.log('hallo')
          var canvas = document.createElement('canvas')
          //console.log('canvas', canvas)
          const { width, height } = calculateAspectRatioFit(img.width, img.height, 300, 300)
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const resizedImage = canvas.toDataURL('image/jpeg');
          //console.log('resizedImage', resizedImage)
          const newImage = {
            id: uuid(),
            x: 10,
            y: 10,
            type: drawtype,
            tool: drawtype,
            width: width,
            height: height,
            scaleX: 1,
            scaleY: 1,
            content: resizedImage,
            rotation: 0,
          }
          if (!isExist(newImage.id)) {
            postUpdatedElement({
              variables: {
                boardid,
                elementid: newImage.id,
                type: newImage.type,
                action: 'add',
                params: JSON.stringify(newImage),
              }
            })
          }

          //console.log('imageUploadRef.current.value', imageUploadRef.current)
          imageUploadRef.current.value = null;
          forceUpdate();
          canvas.remove()
        }, false)

      }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const undo = () => {
    if (shapes.length === 0) return
    const lastId = shapes[shapes.length - 1];
    let index = shapes.findIndex(s => s.id === lastId.id);
    console.log('undo shapes', shapes)
    console.log('undo lastId', lastId.id)
    console.log('undo index', index)
    console.log('undo shapes[index]', shapes[index])
    return
    if (index !== -1) {
      shapes.splice(index, 1);
      setShapes(shapes);
    }
    // console.log('undo shapes', shapes)
    // index = circles.findIndex(c => c.id === lastId.id);
    // if (index !== -1) {
    //   circles.splice(index, 1);
    //   setCircles(circles);
    // }
    // index = rectangles.findIndex(r => r.id === lastId.id);
    // if (index !== -1) {
    //   rectangles.splice(index, 1);
    //   setRectangles(rectangles);
    // }
    // index = images.findIndex(r => r.id === lastId.id);
    // if (index !== Image - 1) {
    //   images.splice(index, 1);
    //   setImages(images);
    // }
    // index = lines.findIndex(c => c.id === lastId.id);
    // if (index !== -1) {
    //   lines.splice(index, 1);
    //   setLines(lines);
    // }
    // shapes.pop();
    // setShapes(shapes);
    // postUpdatedElement({
    //   variables: {
    //     id:lastId,
    //     type: updatedItem.type,
    //     action: 'remove',
    //     params: JSON.stringify(updatedItem),
    //   }
    // })
    forceUpdate();
  };
  const redo = () => { }

  const downloadURI = (uri, name) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const save = event => {
    event.preventDefault();
    const dataURL = stageRef.current.toDataURL({
      mimeType: 'image/png',
      quality: 0,
      pixelRadio: 2,
    })
    //downloadURI(dataURL, "test");
    const fileSizeInByte = formatBytes(getBase64ImageSize(dataURL), 1)
    // console.log("save boardInfo", fileSizeInByte, boardInfo)

    updateBoard({
      variables: {
        id: boardid,
        input: {
          owner: boardInfo.owner,
          title: boardInfo.title,
          description: boardInfo.description,
          boardimage: dataURL,
          board: JSON.stringify(shapes),
          editinghistory: "",
        }
      }
    })
  }

  // const handleRemove = (updatedItem, state, setState) => {
  //   const newTodos = state.filter((t) => t !== updatedItem);
  //   setState(newTodos);
  // }
  // const handleUpdate = (updatedItem, state, setState) => {
  //   const newTodos = [...state];
  //   const res = state.filter((t, i) => t.id === updatedItem.id)
  //   console.log('handleUpdate res', res)
  //   newTodos[res.id] = updatedItem;
  //   setState(newTodos);
  // }
  const isExist = (idx) => {
    const index = shapes.findIndex(x => x.id === idx);
    if (index === -1) return false
    return true
  }
  const updateItem = (id, updatedItem, state, setState, sendPostUpdste = true) => {
    var index = state.findIndex(x => x.id === id);
    // console.log('updated index, state', index, state)
    if (index === -1) {
      // console.log('updateItem Not in list', id, updatedItem)
    } else {
      console.log('updateItem find in list', updatedItem)
      //dispatch(updateBoard(updatedItem))
      const newState = [...state]
      newState[index] = updatedItem
      setState(newState);
      if (sendPostUpdste) postUpdatedElement({
        variables: {
          boardid,
          elementid: updatedItem.id,
          type: updatedItem.type,
          action: 'update',
          params: JSON.stringify(updatedItem),
        }
      })

    }
  }

  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <React.Fragment>
      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
        justifyContent="center"
        alignItems="center"
        spacing='1'
        divider={<Divider orientation="vertical" flexItem />}
        style={{
          //border: '1px dashed green',
          width: '100%',
        }}
      >
        <ToolbarItem>
          <DrawTypeButton
            onClick={setDrawtype}
            drawtypeObject={drawtypeObject}
            active={drawtype}
          />

        </ToolbarItem>
        <ToolbarItem>
          <FontSizeButton
            onClick={setFontsize}
            fontsizeObject={fontsizeObject}
            active={fontsize}
          />
        </ToolbarItem>
        <ToolbarItem>
          <ColorButton
            onClick={setColor}
            active={color}
            colorObject={colorObject}
          />

        </ToolbarItem>
        <ToolbarItem>
          <ThicknessSlider
            onClick={setThickness}
            value={thickness}
            active={thickness}
          />
        </ToolbarItem>
        <input
          style={{ display: "none" }}
          type="file"
          ref={imageUploadRef}
          onChange={e => uploadImage(e)}
        />
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
        justifyContent="center"
        alignItems="center"
        spacing='1'
        divider={<Divider orientation="vertical" flexItem />}
        style={{
          //border: '1px dashed green',
          width: '100%',
        }}
      >
        <Button variant="secondary" onClick={addRectangle}>Rectangle</Button>
        <Button variant="secondary" onClick={addCircle}>Circle</Button>
        <Button variant="secondary" onClick={() => setDrawtype('Brush')}>Line</Button>
        <Button variant="secondary" onClick={eraseLine}>Erase</Button>
        <Button variant="secondary" onClick={addText}>Text</Button>
        <Button variant="secondary" onClick={addImageFromFile}>Image</Button>
        <Button variant="secondary" onClick={undo}>Undo</Button>
        <Button variant="secondary" onClick={save}>Save</Button>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
        justifyContent="center"
        alignItems="center"
        spacing='1'
        ref={KonvaRef}
        style={{
          border: '1px dashed green',
          width: '100%',
          height: 'calc(100vh - 190px',
        }}
      >
        <Stage
          width={width}
          height={height}
          ref={stageRef}

          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          style={{
            border: '1px dashed red',
            width: '100%',
            height: '100%',
          }}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#fff"
              listening={false}
            />
          </Layer>
          <Layer
            ref={layerRef}
            onAdd={(e) => {
              //console.log('onAdd', e)
              const type = e.child.constructor.name
              const newElement = e.child.attrs

              console.log('onAdd type', type)
              // console.log('onAdd newElement', newElement)
              // console.log('onAdd isExist', isExist(newElement.id))
              console.log('onAdd isLoading', isLoading)
              if (!isLoading) {
                if (!isExist(newElement.id)) {
                  setShapes([
                    ...shapes,
                    newElement
                  ])
                }
              }
              //console.log('onAdd shapes', shapes)

              return


              if (!isExist(newElement.id)) {
                postUpdatedElement({
                  variables: {
                    boardid,
                    elementid: newElement.id,
                    type: newElement.type,
                    action: 'add',
                    params: JSON.stringify(newElement),
                    boardid,
                  }
                })
              }
            }
            }
            onChange={(e) => {
              console.log('onChange', e)
            }}
          >

            {shapes && shapes.map((image, i) => {
              if (image.type === 'Image')
                return (
                  <Img
                    key={i}
                    shapeProps={image}
                    imageUrl={image.content}
                    /* x={image.x}
                    y={image.y}
                    width={image.width}
                    height={image.height}
                    imageUrl={image.content}
                    scaleX={image.scaleX}
                    scaleY={image.scaleY} */

                    isSelected={image.id === selectedId}
                    onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(image.id);
                    }}
                    onChange={(newAttrs) => {
                      // console.log('newAttrs', newAttrs);
                      // console.log('image', image);
                      // image.x = newAttrs.x
                      // image.y = newAttrs.y
                      // console.log('image2', image);

                      updateItem(image.id, newAttrs, shapes, setShapes);
                      //handleUpdate(newAttrs, shapes, setShapes)
                      // console.log('imgs', newAttrs);
                      //setImages(imgs);
                    }}
                  />
                );
            })}
            {lines && lines.map((line, i) => {
              if (line.type === 'Brush' || line.type === 'Eraser')
                return (
                  <Freehand
                    key={i}

                    shapeProps={line}
                    isSelected={line.id === selectedId}
                    /* onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(line.id);
                    }} */
                    /* x={line.x}
                    y={line.y}
                    points={line.points}
                    stroke={line.stroke}
                    fill={line.stroke}
                    strokeWidth={line.strokeWidth} 
                    tension={0.5}
                    
                    draggable*/
                    globalCompositeOperation={
                      line.tool === "Eraser" ? "destination-out" : "source-over"
                    }
                    /* onDragEnd={(e) => {
                      let vs = []
                      const points = e.target.attrs.points
                      console.log('points', e.target)
                      console.log('x,y', e.target.x(), e.target.y())
                      line.x = e.target.x()
                      line.y = e.target.y()
                      // for (var i = 0; i < points.length; i += 2) {
                      //   vs.push(points[i] + e.target.x(),points[i + 1] + e.target.y())
                      // }
                      // line.points = vs
                      // console.log('vs,', vs, line)
                      updateItem(line.id, line, lines, setLines)
                      updateItem(line.id, line, shapes, setShapes)
                      // handleUpdate(line, shapes, setShapes)
                      // handleUpdate(line, lines, setLines)
                    }} */
                    onChange={newAttrs => {
                      // console.log('line new attribute', newAttrs)
                      const ls = lines.slice();
                      ls[i] = newAttrs;
                      //updateItem(line.id, newAttrs, shapes, setShapes);
                      //handleUpdate(newAttrs, shapes, setShapes)
                      // console.log('lines', ls);
                      setLines(ls);
                    }}
                  />
                )
            })}
            {shapes && shapes.map((line, i) => {
              if (line.type === 'Brush' || line.type === 'Eraser')
                return (
                  <Freehand
                    key={i}

                    shapeProps={line}
                    isSelected={line.id === selectedId}
                    onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(line.id);
                    }}
                    /* x={line.x}
                    y={line.y}
                    points={line.points}
                    stroke={line.stroke}
                    fill={line.stroke}
                    strokeWidth={line.strokeWidth} 
                    tension={0.5}
                    
                    draggable*/
                    globalCompositeOperation={
                      line.tool === "Eraser" ? "destination-out" : "source-over"
                    }
                    /* onDragEnd={(e) => {
                      let vs = []
                      const points = e.target.attrs.points
                      console.log('points', e.target)
                      console.log('x,y', e.target.x(), e.target.y())
                      line.x = e.target.x()
                      line.y = e.target.y()
                      // for (var i = 0; i < points.length; i += 2) {
                      //   vs.push(points[i] + e.target.x(),points[i + 1] + e.target.y())
                      // }
                      // line.points = vs
                      // console.log('vs,', vs, line)
                      updateItem(line.id, line, lines, setLines)
                      updateItem(line.id, line, shapes, setShapes)
                      // handleUpdate(line, shapes, setShapes)
                      // handleUpdate(line, lines, setLines)
                    }} */
                    onChange={newAttrs => {
                      // console.log('line new attribute', newAttrs)
                      // const ls = lines.slice();
                      // ls[i] = newAttrs;
                      updateItem(line.id, newAttrs, shapes, setShapes);
                      //handleUpdate(newAttrs, shapes, setShapes)
                      // console.log('lines', ls);
                      //setLines(ls);
                    }}
                  />
                )
            })}
            {shapes && shapes.map((rect, i) => {
              if (rect.type === 'Rect' || rect.type === 'FilledRect')
                return (
                  <Rectangle
                    key={i}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(rect.id);
                      // console.log('Rect OnSelect')
                    }}

                    updateItem={updateItem}
                    shapes={shapes}
                    setShapes={setShapes}
                    isExist={isExist}

                    onChange={newAttrs => {
                      // console.log('Rect newAttrs', newAttrs)
                      // const rects = rectangles.slice();
                      // rects[i] = newAttrs;
                      updateItem(rect.id, newAttrs, shapes, setShapes);
                      //handleUpdate(newAttrs, shapes, setShapes)
                      //console.log('rects', rects);
                      //setRectangles(rects);
                    }}
                  />
                );
            })}
            {shapes && shapes.map((circle, i) => {
              if (circle.type === 'Circle' || circle.type === 'FilledCircle')
                return (
                  <Circ
                    key={i}
                    shapeProps={circle}
                    isSelected={circle.id === selectedId}
                    onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(circle.id);
                      console.log('selectShape', circle.id)
                    }}
                    onChange={newAttrs => {
                      // const circs = circles.slice();
                      // circs[i] = newAttrs;
                      updateItem(circle.id, newAttrs, shapes, setShapes);
                      //setCircles(circs);
                    }}
                  />
                );
            })}
            {shapes && shapes.map((note, i) => {
              if (note.type === 'Text')
                return (
                  <Note
                    key={i}
                    shapeProps={note}
                    isSelected={note.id === selectedId}
                    // selected={true}
                    stage={stageRef}
                    onSelect={(e) => {
                      e.target.moveToTop()
                      selectShape(note.id);
                      // console.log('Note onSelect', note.id);
                    }}
                    onResize={newAttrs => {
                      // const oldNotes = notes.slice();
                      // oldNotes[i] = newAttrs;
                      updateItem(note.id, newAttrs, shapes, setShapes);
                      //setNotes(oldNotes);
                    }}
                    onTextChange={(value) => console.log('Note onTextChange', value)}
                  />
                );
            })}
          </Layer>
        </Stage>
      </Stack>
    </React.Fragment>
  );
}

export default ListItem2