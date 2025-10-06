const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { IA } = require('../ia/Ia');
const { initOpcClient } = require('../opc/initOpc');
const { dbConnection } = require('../database/config');
// const socketClient = require('./socket'); // Importa el cliente

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();

        // IA
        this.conectarIA();

        // Cliente OPC
        this.iniciarClienteOpc();

        // Base de datos
        this.conectarDB();

        // Conexión socket cliente
        this.conectarSocketCliente();
    }

    async iniciarClienteOpc() {
        try {
            this.opcClient = await initOpcClient();
            console.log("Cliente OPC en RaspberryPLC listo");
        } catch (err) {
            console.error("Error conectando cliente OPC:", err);
        }
    }

    conectarSocketCliente() {
        // Ya el cliente está inicializado en la importación
        console.log('🔗 Intentando conectar cliente Socket.IO...');
    }

    conectarIA() {
        IA();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));  
    }

    routes() {
        // Aquí tus rutas
    }

    async conectarDB() {
        await dbConnection();
        console.log('Base de datos conectada');
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
