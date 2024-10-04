import express from 'express';
import traineeRouter from './Routes/traineeRouter';
import trainerRouter from './Routes/trainerRouter';

const app = express();
app.use(express.json());
app.use('/api/trainee', traineeRouter);
app.use('/api/trainer', trainerRouter);
app.listen(3000, () => {
  console.log('server is running on port 3000');
});