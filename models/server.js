const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    /////////////////////////////////////////////////
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:           '/api/auth',
            usuarios:       '/api/usuarios',
            buscar:         '/api/buscar',
            operador:       '/api/operador',
            proyecto:       '/api/proyecto',            
            tipomedidor:    '/api/tipomedidor', 
            clasemedidor:   '/api/clasemedidor',                        
            medidor:        '/api/medidor',
            ciudad:         '/api/ciudad',
            cliente:        '/api/cliente',
            dispositivo:    '/api/dispositivo',  //Se 
            medicion:       '/api/medicion',
            medicionz:      '/api/medicionz',
            control:        '/api/control',   
            /*             
            inventario:     '/api/inventario',           
 */
        }
        //Conectar la base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de aplicación
        this.routes();
    }
    /////////////////////////////////////////////////
    async conectarDB() {

        await dbConnection();

    }
    /////////////////////////////////////////////////
    middlewares() {
        //CORS
        this.app.use(cors());
        //Parseo del body
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));
        //Carpeta para guardar archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));  

    }
    /////////////////////////////////////////////////
    routes() {
        this.app.use(this.paths.auth, require('../routers/auth'));
        this.app.use(this.paths.usuarios, require('../routers/usuarios'));
        this.app.use(this.paths.buscar, require('../routers/buscar'));
        this.app.use(this.paths.operador, require('../routers/operador'));
        this.app.use(this.paths.ciudad, require('../routers/ciudad')); 
        this.app.use(this.paths.proyecto, require('../routers/proyecto'));
        this.app.use(this.paths.tipomedidor, require('../routers/tipomedidor'));
        this.app.use(this.paths.clasemedidor, require('../routers/clasemedidor'));        
        this.app.use(this.paths.medidor, require('../routers/medidor'));
        this.app.use(this.paths.cliente, require('../routers/cliente'));
        this.app.use(this.paths.dispositivo, require('../routers/dispositivo'));   
        this.app.use(this.paths.medicion, require('../routers/medicion'));        
        this.app.use(this.paths.medicionz, require('../routers/medicionz'));                
        this.app.use(this.paths.control, require('../routers/control'));  
        
        /*         
        this.app.use(this.paths.inventario, require('../routers/inventario'));           
 */


    }
    //////////////////////////////////////////////////
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor Corriendo', this.port);
        });
    }
}
/////////////////////////////////////////////////
module.exports = Server;