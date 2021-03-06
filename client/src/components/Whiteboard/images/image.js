import React from "react";
import { Image, Transformer } from "react-konva";
import useImage from "use-image";

const Img = ({ shapeProps, isSelected, onSelect, onChange, imageUrl }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [image] = useImage(imageUrl);
  // console.log('shapeProps image', shapeProps, isSelected, imageUrl)
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
      trRef.current.moveToTop()
    }
  }, [isSelected]);
  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        image={image}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const rotation = node.rotation()
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            rotation
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </React.Fragment>
  );
};
export default Img;