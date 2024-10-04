import express from 'express';
import traineeRouter from './Routes/traineeRouter';
import trainerRouter from './Routes/trainerRouter';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());
// app.route('/api/trainee)
app.use('/api/trainee', traineeRouter);
app.use('/api/trainer', trainerRouter);
app.listen(3000, () => {
  console.log('server is running on port 3000');
});