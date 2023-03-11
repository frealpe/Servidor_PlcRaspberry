const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario,Laboratorios, Guia, Salas} = require('../models');


/////////////////////////////////////////////////////////////////
const cargarArchivo = async (req, res = response) => {

  //console.log(req.files);
  const carpeta = req.params.coleccion;
  
  try {
    //imagenes oppr defecto y el path es el mismo
    //const nombre= await subirArchivo(req.files,undefined,'componente');
    const nombre = await subirArchivo(req.files,undefined,`${carpeta}`);
    res.json({
      nombre
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////
const actualizarArchivo = async (req, res = response) => {
  
  const { id, coleccion } = req.params;

  let modelo;
  
  switch (coleccion) {
////////////////////////////////////////////////////////////////////////////////////////////    
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////    
    case 'salas':
      modelo = await Salas.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un guia con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////   
    case 'laboratorios':
      modelo= await Laboratorios.findById(id);
      if (!modelo) {
          return res.status(400).json({ msg: `No existe un laboratorio con el id ${id}` });
      }
      break;        
////////////////////////////////////////////////////////////////////////////////////////////   
    case 'guias':
      modelo = await Guia.findById(id);
      if (!modelo) {
          return res.status(400).json({ msg: `No existe un guia con el id ${id}` });
    }
    break;
    
    default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
    }
    
    if (modelo.ref) {
      //borrar 
      const pathGuia = path.join(__dirname, '../uploads',coleccion, modelo.ref);
      if (fs.existsSync(pathGuia)) {
      fs.unlinkSync(pathGuia);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.arch = nombre;
  await modelo.save();

  res.json(modelo);
}
////////////////////////////////////////////////////////////////////////////////////////////   
const actualizarImagen = async (req, res = response) => {
 
  const { id, coleccion } = req.params;
  let modelo;    
  switch (coleccion) {
////////////////////////////////////////////////////////////////////////////////////////////     
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////      
      case 'salas':
        modelo = await Salas.findById(id); 
        if (!modelo) {  
          return res.status(400).json({ msg: `No existe un guia con el id ${id}` });
        } 
        break;        
////////////////////////////////////////////////////////////////////////////////////////////   
    case 'guia':
      modelo = await Guia.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un componentes con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////   
      case 'laboratorios':
        modelo= await Laboratorios.findById(id); 
        if (!modelo) {
          return res.status(400).json({ msg: `No existe una guia con el id ${id}` });
        }        

    default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.img) {
    //borrar 
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }
  
  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();
    
  res.json(modelo);  
} 

//////////////////////////////////////////////////////////////////////////////////////////////
const mostrarArchivo = async(req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
////////////////////////////////////////////////////////////////////////////////////////////       
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////         
      case 'salas':
        modelo = await Salas.findById(id);
        if (!modelo) {
          return res.status(400).json({ msg: `No existe un guia con el id ${id}` });
        }
        break;        
////////////////////////////////////////////////////////////////////////////////////////////   
    case 'guias':
      modelo = await Guia.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un componentes con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////   
      case 'laboratorios':
        modelo= await Laboratorios.findById(id);
        if (!modelo) {
          return res.status(400).json({ msg: `No existe una guia con el id ${id}` });
        }        
      default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.ref) {
    //borrar 
    const pathArch = path.join(__dirname, '../uploads', coleccion, modelo.arch);
    if (fs.existsSync(pathArch)) {
      return res.sendFile(pathArch)
    }
  }
  
}
////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
const mostrarImagenes = async(req, res = response) => {

  const { id, coleccion } = req.params;

  let modelo;
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////         
      case 'salas':
        modelo = await Salas.findById(id);
        if (!modelo) {
          return res.status(400).json({ msg: `No existe un guia con el id ${id}` });
        }
        break;        
////////////////////////////////////////////////////////////////////////////////////////////   
    case 'guia':
      modelo = await Guia.findById(id);
      if (!modelo) {
        return res.status(400).json({ msg: `No existe un componentes con el id ${id}` });
      }
      break;
////////////////////////////////////////////////////////////////////////////////////////////   
      case 'laboratorios':
        modelo= await Laboratorios.findById(id);
        if (!modelo) {
          return res.status(400).json({ msg: `No existe una guia con el id ${id}` });
        }        
      default:
      return res.status(500).json({ msg: 'Se olvido validar esto' });
  }

  //Limpiar imágenes previas solo deja grabada una sola imagen 
  //Para mi catalogo no se hace necesario

  if (modelo.img) {
    //borrar 
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen)
    }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
  return res.sendFile(pathImagen);
  
}
////////////////////////////////////////////////////////////////

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  actualizarImagen,
  mostrarArchivo,
  mostrarImagenes,

}