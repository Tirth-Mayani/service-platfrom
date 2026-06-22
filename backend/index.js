const express = require('express');
const cors = require('cors');
const authroutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({limit: '15mb'}));
app.use(express.urlencoded({limit: '15mb', extended: true}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authroutes);

app.get('/', (req, res) => {
  res.send('API running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});