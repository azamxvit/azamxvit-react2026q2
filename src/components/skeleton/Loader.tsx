interface Props {
  label?: string;
}

export function Loader({ label = 'Loading data... Please wait.' }: Props) {
  return (
    <div className="loader" role="status" aria-label={label}>
      {label}
    </div>
  );
}
