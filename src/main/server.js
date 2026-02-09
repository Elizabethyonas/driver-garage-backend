import 'dotenv/config';
import app from './app.js';
import { getEnv } from '../config/env.js';

const PORT = getEnv('PORT', 3000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
