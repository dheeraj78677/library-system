import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './ManageUsersModal.css';

Modal.setAppElement('#root');

const ManageUsersModal = ({ isOpen, onRequestClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://rmit-library-management.com/users'); // Adjust URL as needed
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleDeleteUsers = async () => {
    try {
      const response = await axios.post('https://rmit-library-management.com/deleteUsers', { userIds: selectedUsers }); // Adjust URL as needed
      if (response.status === 200) {
        setSelectedUsers([]);
        fetchUsers(); // Fetch updated list of users after deletion
      } else {
        console.error('Failed to delete users');
      }
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal" overlayClassName="overlay">
      <h2>Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="modal-buttons">
        <button onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>Delete Selected Users</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};

export default ManageUsersModal;
