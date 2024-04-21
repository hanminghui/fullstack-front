import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScreensForm() {
  const [screens, setScreens] = useState([]);
  const [formData, setFormData] = useState({
    width: '',
    height: '',
    size: '',
    note: ''
  });

  const baseUrl = 'http://localhost:3001/api/screens';

  useEffect(() => {
    // 页面加载时获取屏幕信息
    const fetchScreens = async () => {
      const response = await axios.get(baseUrl);
      setScreens(response.data);
    };
    fetchScreens();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl, formData);
      setScreens([...screens, response.data]);
      setFormData({ width: '', height: '', size: '', note: '' }); // 重置表单
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setScreens(screens.filter(screen => screen.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    const screen = screens.find(screen => screen.id === id);
    const width = prompt("Enter new width", screen.width);
    const height = prompt("Enter new height", screen.height);
    const size = prompt("Enter new size (in inches)", screen.size);
    if (width && height && size) {
      try {
        const response = await axios.put(`${baseUrl}/${id}`, { ...screen, width, height, size });
        setScreens(screens.map(screen => screen.id === id ? response.data : screen));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="width"
          value={formData.width}
          onChange={handleChange}
          placeholder="Width"
        />
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Height"
        />
        <input
          type="number"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Size (inches)"
        />
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Note"
        />
        <button type="submit">Add</button>
      </form>
      <h2>Screens Info</h2>
      <ul>
        {screens.map((screen) => (
          <li key={screen.id}>
            {screen.note} - {screen.width}x{screen.height}, {screen.size} inches, PPI: {screen.ppi}, Size: {screen.sizeWidth}x{screen.sizeHeight}, Area: {screen.area}
            <button onClick={() => handleDelete(screen.id)}>Delete</button>
            <button onClick={() => handleUpdate(screen.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScreensForm;
