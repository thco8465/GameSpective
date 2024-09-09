import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Card, Typography } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ReviewFormData {
  gameId: number | null;
  gameName: string;
  review: string;
  timeSpent: string;
  rating: number;
  date: dayjs.Dayjs | null; // Changed to Dayjs type
}

const ReviewForm: React.FC = () => {
  const [formData, setFormData] = useState<ReviewFormData>({
    gameId: null,
    gameName: '',
    review: '',
    timeSpent: '',
    rating: 1,
    date: dayjs(), // Initialize with current date using dayjs
  });

  const [games, setGames] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://gamespective.loca.lt/api/games/games',
          {
            headers: {
              'bypass-tunnel-reminder': 'true', // Bypass tunnel reminder
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const handleChange = (changedValues: any) => {
    setFormData(prevState => ({
      ...prevState,
      ...changedValues,
    }));
  };

  const handleSubmit = (values: ReviewFormData) => {
    if (values.rating < 1 || values.rating > 10) {
      alert('Rating must be between 1 and 10');
      return;
    }
    console.log('Form data submitted:', values);
    // Send values to the backend
    setFormData({
      gameId: null,
      gameName: '',
      review: '',
      timeSpent: '',
      rating: 1,
      date: dayjs(),
    });
  };

  return (
    <Card style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Typography.Title level={3}>Add Your Review</Typography.Title>
      <Form
        initialValues={formData}
        onValuesChange={handleChange}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item name="gameName" label="Search Game" rules={[{ required: true, message: 'Please select a game!' }]}>
          <Select
            showSearch
            placeholder="Select a game"
            onChange={(value) => {
              const selectedGame = games.find(game => game.id === value);
              setFormData(prevState => ({
                ...prevState,
                gameId: selectedGame ? selectedGame.id : null,
                gameName: selectedGame ? selectedGame.name : '',
              }));
            }}
          >
            {games.map(game => (
              <Option key={game.id} value={game.id}>{game.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="review" label="Your Review" rules={[{ required: true, message: 'Please enter your review!' }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="timeSpent" label="Time Spent (hours)" rules={[{ required: true, message: 'Please enter time spent!' }]}>
          <Input type="number" min="0" step="0.1" />
        </Form.Item>
        <Form.Item name="rating" label="Rating (1-10)" rules={[{ required: true, message: 'Please enter your rating!' }]}>
          <Input type="number" min="1" max="10" />
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker format="YYYY-MM-DD" value={formData.date} disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ReviewForm;
