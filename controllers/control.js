const { response } = require("express");

//Obtener Ciudades-Proyecto
const controlValvula = async (req, res = response) => {
    //const {nombre} = req.params;
    console.log(req.body);
    console.log(req.params);
    console.log("Entre");
     
}



module.exports = {
    controlValvula
}