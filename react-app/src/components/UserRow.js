import React from 'react';
import { Link } from 'react-router-dom';

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
        <Link to='/admin_user' className="custom-link" onClick={() => onProfileClick(user)}>
          <img src={user.profilePic} alt={`${user.name}'s profile`} className="profile-pic" />
        </Link>
      </td>
      <td>
        <Link to='/admin_user' className="custom-link" onClick={() => onProfileClick(user)}>
          <span className="user-name">{user.name}</span>
        </Link>
      </td>
      <td>
        <Link to='/admin_user' className="custom-link" onClick={() => onProfileClick(user)}>
          {user.email}
        </Link>
      </td>
      <td>
        <Link to='/admin_user' className="custom-link" onClick={() => onProfileClick(user)}>
          {user.registrationDate}
        </Link>
      </td>
    </tr>
  );
};

export default UserRow;
