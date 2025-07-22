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
            adminproyecto:  '/api/adminproyecto',
            buscar:         '/api/buscar',
            operador:       '/api/operador',
            proyecto:       '/api/proyecto',            
            municipio:      '/api/municipio',
            departamento:   '/api/departamento',
            cliente:        '/api/cliente',
            dispositivo:    '/api/dispositivo',
            laboresdiarias: '/api/laboresdiarias',
            siembra:        '/api/siembra',            
            riego:          '/api/riego',    
            plagas:         '/api/plagas',    
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
        this.app.use(this.paths.adminproyecto,require("../routers/adminproyecto.js"));
        this.app.use(this.paths.buscar, require('../routers/buscar'));
        this.app.use(this.paths.operador, require('../routers/operador'));
        this.app.use(this.paths.municipio, require('../routers/municipio')); 
        this.app.use(this.paths.departamento, require('../routers/departamento')); 
        this.app.use(this.paths.proyecto, require('../routers/proyecto'));
        this.app.use(this.paths.cliente, require('../routers/cliente'));
        this.app.use(this.paths.laboresdiarias, require('../routers/laboresdiarias'));
        this.app.use(this.paths.siembra, require('../routers/siembra'));
        this.app.use(this.paths.riego, require('../routers/riego'));
        this.app.use(this.paths.plagas, require('../routers/plagas'));

          
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