import { useSelector } from 'react-redux';
import { selectWinner, selectPhase } from '../gameSlice';

const PhaseMessage = () => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementPhaseMessage />;
    case 'started':
      return <StartPhaseMessage />;
    case 'ended':
      return <EndPhaseMessage />;
    default:
      return <p>Current phase: {phase}</p>;
  }
};

const PlacementPhaseMessage = () => {
  return (
    <p>
      To place your ship, hover over your board and click on a coordinate.
      <br />
      Press r to rotate your ship or click on the rotate button.
      <br />
      Press tab on desktop to cycle over any valid placements.
    </p>
  );
};

const StartPhaseMessage = () => {
  return (
    <p>
      Start sinking ships by clicking on coordinates on your opponent's board.
      <br />
      Press tab on desktop to cycle over each valid coordinate.
      <br />
      Sink all 5 ships before your opponent to win!
    </p>
  );
};

const EndPhaseMessage = () => {
  const winner = useSelector(selectWinner);

  if (winner.computer) {
    return <p>The computer won. Try again?</p>;
  } else {
    return <p>You won! Play another round?</p>;
  }
};

export default PhaseMessage;
