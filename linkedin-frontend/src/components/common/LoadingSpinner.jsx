import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#0a66c2' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div 
        className="spinner" 
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;