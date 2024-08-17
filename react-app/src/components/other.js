export const ProfileButton = ({ onClick, label, style }) => {
    return (
      <button onClick={onClick} style={style}>
        {label}
      </button>
    );
  };