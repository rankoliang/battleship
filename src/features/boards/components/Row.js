import styled from 'styled-components';
import Element from './Element';

const StyledRow = styled.div`
  display: flex;
  margin: 0;
  padding: 0;
`;

const Row = ({ row, yIndex }) => {
  return (
    <StyledRow>
      {row.map((element, xIndex) => (
        <Element
          xIndex={xIndex}
          yIndex={yIndex}
          element={element}
          key={xIndex}
        />
      ))}
    </StyledRow>
  );
};

export default Row;
