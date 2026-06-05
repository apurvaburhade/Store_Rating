const express = require('express');
const cors = require('cors');
const app = express();

app.listen(4000, 'localhost', () => {
    console.log('Server started at port 4000');
});