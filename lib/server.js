const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// const { mqttClient } = require('../mqtt/conectMqtt'); 
const { IA } = require('../ia/Ia');
const { initOpcClient } = require('../opc/initOpc');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Middlewares
        this.middlewares();
        //Rutas de aplicación
        this.routes();
        //Broker MQTT
        // this.BrokerMqtt();
        //IA
        this.conectarIA();
        //Iniciar cliente OPC
        this.iniciarClienteOpc();
        //Datos Opc
    
        
    }

    /////////////////////////////////////////////////
    async iniciarClienteOpc() {
        try {
            this.opcClient = await initOpcClient();
            console.log("Cliente OPC en RaspberryPLC listo");
        } catch (err) {
            console.error("Error conectando cliente OPC:", err);
        }
    }
    /////////////////////////////////////////////////
    // datosOpc() {
    //     DatosOpc();
    // }
    ///////////////////////////////////////////////////
    conectarIA() {
        IA();
    }
    /////////////////////////////////////////////////
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

    /////////////////////////////////////////////////
    routes() {
        // Aquí tus rutas
    }

    //////////////////////////////////////////////////
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor Corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
