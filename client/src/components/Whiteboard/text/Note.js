import React, { useState, useEffect, useRef } from "react";
//import EditableText from "./_EditableText";
import { Text, Transformer } from "react-konva";

const Note = ({
  shapeProps, isSelected, onSelect, onResize, stage,

  onClick,
  onTextResize,
  onTextChange,
  onTextClick
}) => {
  // console.log('Note shapeProps', 
  // shapeProps,
  //   onClick,
  //   onTextResize,
  //   onTextChange,

  //   onTextClick
  // )

  const textRef = useRef(null);
  const trRef = useRef(null);

  const [selected, setSelected] = useState(isSelected);
  const [isEditing, setIsEditing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const MIN_WIDTH = 50;

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(textRef.current);
      trRef.current.getLayer().batchDraw();
      trRef.current.moveToTop()
      trRef.current.enabledAnchors(['middle-left', 'middle-right'])

      // console.log('trRef', trRef.current)
    }
  }, [isSelected]);

  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    } else if (!selected && isTransforming) {
      setIsTransforming(false);
    }
  }, [selected, isEditing, isTransforming]);

  // function toggleEdit() {
  //   setIsEditing(!isEditing);
  //   // onTextClick(!isEditing);
  // }

  // function toggleTransforming() {
  //   setIsTransforming(!isTransforming);
  //   // onTextClick(!isTransforming);
  // }

  const textchange = (e) => {
    // hide text node and transformer:
    const textNode = textRef.current //e.target
    const tr = trRef.current
    textNode.hide();
    tr.hide();

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    var textPosition = textNode.absolutePosition();

    // so position of textarea will be the sum of positions above:
    var areaPosition = {
      x: stage.current.container().offsetLeft + textPosition.x,
      y: stage.current.container().offsetTop + textPosition.y,
    };

    // create textarea and style it
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = areaPosition.y + 'px';
    textarea.style.left = areaPosition.x + 'px';
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
    textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
    textarea.style.fontSize = textNode.fontSize() + 'px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = 'left top';
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();
    let rotation = textNode.rotation();
    var transform = '';
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)';
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += 'translateY(-' + px + 'px)';

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = 'auto';
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px';

    textarea.focus();

    function removeTextarea() {
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener('click', handleOutsideClick);
      textNode.show();
      tr.show();
      tr.forceUpdate();
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      var isEdge =
        document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + 'px';
    }

    textarea.addEventListener('keydown', function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        textNode.text(textarea.value);
        onResize({
          ...shapeProps,
          text: textarea.value,
        });
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener('keydown', function (e) {
      let scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = 'auto';
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + 'px';
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        textNode.text(textarea.value);
        //removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener('click', handleOutsideClick);
    });
  }

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        {...shapeProps}
        draggable
        perfectDrawEnabled={false}

        // onTap={onClick}
        // onTransform={handleResize}
        // onDblClick={onDoubleClick}
        onDblTap={textchange}
        onDblClick={textchange}
        onTextChanged={onTextChange}

        onDragEnd={e => {
          onResize({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={e => {
          // const node = textRef.current;
          // const scaleX = node.scaleX();
          // const scaleY = node.scaleY();
          // const rotation = node.rotation()
          // const fs = node.fontSize()
          // console.log('fs',fs)
          // console.log('node shapeProps',shapeProps)
          // console.log('e', e)
          e.target.setAttrs({
            ...shapeProps,
            width: Math.max(e.target.width() * e.target.scaleX(), MIN_WIDTH),
            scaleX: 1,
            scaleY: 1,
          });
          // onResize({
          //   ...shapeProps,
          //   scaleX: 1,
          //   scaleY: 1,
          //   fontSize:fs,
          // })
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const node = textRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          const rotation = node.rotation()

          node.scaleX(1);
          node.scaleY(1);
          onResize({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            //height: node.height() * scaleY,
            // scaleX: 1,
            // scaleY: 1,
            // scaleX,
            // scaleY,
            rotation
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
}

export default Note


/* 
<EditableText
      shapeProps={shapeProps}
      onClick={onSelect}
      onChange={onChange}


      onResize={onTextResize}
      isEditing={isEditing}
      isTransforming={isTransforming}
      onToggleEdit={toggleEdit}
      onToggleTransform={toggleTransforming}
      onTextChange={onTextChange}
      
      onTextClick={(newSelected) => {
        console.log('newSelected',newSelected);
      }}
    />


<EditableText
      shapeProps={shapeProps}
      onResize={onTextResize}
      isEditing={isEditing}
      isTransforming={isTransforming}
      onToggleEdit={toggleEdit}
      onToggleTransform={toggleTransforming}
      onChange={onTextChange}
    /> */