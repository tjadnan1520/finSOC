import './Loader.css';

export default function Loader({ size = 'md', overlay = false }) {
  const classes = [
    'loader',
    `loader--${size}`,
    overlay ? 'loader--overlay' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loader__spinner" />
    </div>
  );
}
