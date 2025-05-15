// Variable global para encontrar la carpeta en la que el archivo es ejecutado
global.__basedir = __dirname

// Llamada a archivo
const app = require('./src/app')
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT} `)
})
