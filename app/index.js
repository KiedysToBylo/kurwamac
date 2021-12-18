import app from './app.js';
import {port} from './config.js'
app.listen(port, () => {
  console.log(`Serwer uruchomiony na porcie ${port}`)
})