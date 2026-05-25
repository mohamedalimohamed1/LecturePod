import useAppStore from '../../store/useAppStore.js';

function StreakPopup() {
  const streakPopup = useAppStore((state) => state.streakPopup);

  return (
    <div
      className={`streak-popup-top ${streakPopup ? 'active' : ''} ${
        streakPopup?.isFailure ? 'failure' : ''
      }`}
    >
      <div className="streak-box-square">
        <span className="streak-emoji-large">{streakPopup?.emoji ?? ''}</span>
        <span className="streak-text-bold">{streakPopup?.message ?? ''}</span>
      </div>
    </div>
  );
}

export default StreakPopup;
