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
      {row.map((states, xIndex) => (
        <Element coordinate={[xIndex, yIndex]} states={states} key={xIndex} />
      ))}
    </StyledRow>
  );
};

export default Row;
