import useAppStore from '../../store/useAppStore.js';

function InfoBanner() {
  const infoMessage = useAppStore((state) => state.infoMessage);
  const setInfoMessage = useAppStore((state) => state.setInfoMessage);

  if (!infoMessage) {
    return null;
  }

  return (
    <div className="info-banner" role="status">
      <p>{infoMessage}</p>
      <button
        type="button"
        className="info-banner-close"
        onClick={() => setInfoMessage(null)}
        aria-label="Close info"
      >
        ✕
      </button>
    </div>
  );
}

export default InfoBanner;
