import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import Sidebar from '../Pages/Sidebar';
import { useNavigate } from 'react-router-dom';
import Topbar from '../Pages/Topbar';
 
const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
 
  const [name, setName] = useState(user.name || 'John Doe');
  const [photo, setPhoto] = useState(user.photo || 'https://i.pravatar.cc/100');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPhoto(localUrl);
    }
  }, [file]);
 
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
 
  const handleSave = () => {
    if (!name.trim() ) {
      alert('Name are required');
      return;
    }
 
    updateUser({
      name,
      photo: file ? URL.createObjectURL(file) : photo,
    });
 
    alert('Profile updated!');
    navigate('/dashboard');
  };
 
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex-1 ml-20 md:ml-64">
        <Topbar />
 
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6 mt-10">
          <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
 
          <div className="flex flex-col items-center mb-4">
            <p className="text-lg font-medium text-gray-700 mb-2">{name}</p>
            <img
              src={photo || 'https://i.pravatar.cc/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 text-sm"
            />
          </div>
 
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
 
         
 
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Profile;