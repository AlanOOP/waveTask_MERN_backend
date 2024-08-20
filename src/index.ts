import server from './server';

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
})