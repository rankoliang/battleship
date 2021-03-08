import Coordinate from './Coordinate';
import { AspectRatio } from 'react-aspect-ratio';
import 'react-aspect-ratio/aspect-ratio.css';

const Row = ({ row, yIndex }) => {
  return (
    <>
      {row.map((states, xIndex) => (
        <AspectRatio ratio="1" key={xIndex}>
          <Coordinate coordinate={[xIndex, yIndex]} states={states} />
        </AspectRatio>
      ))}
    </>
  );
};

export default Row;
