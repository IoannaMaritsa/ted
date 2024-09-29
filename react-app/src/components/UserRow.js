import React from 'react';

const UserRow = ({ user, onProfileClick, onCheckboxChange }) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={user.isSelected || false}
          onChange={() => onCheckboxChange(user.id)}
        />
      </td>
      <td>
        <div className="custom-link" onClick={() => onProfileClick(user)}>
          <img src={user.profilepic} alt={`${user.name}'s profile`} className="profile-pic" />
        </div>
      </td>
      <td>
        <div className="custom-link" onClick={() => onProfileClick(user)}>
          <span className="user-name">{user.name}</span>
        </div>
      </td>
      <td>
        <div className="custom-link" onClick={() => onProfileClick(user)}>
          {user.email}
        </div>
      </td>
      <td>
        <div className="custom-link" onClick={() => onProfileClick(user)}>
          {user.profession}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
