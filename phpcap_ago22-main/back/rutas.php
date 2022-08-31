<?php

include_once "controlador/CatalogosControlador.php";
include_once "controlador/EmpleadoControlador.php";

/**
 * el archivo de rutas es el que va a controlar las peticiones que llegan al back
 * el permitir el acceso va a ser desde los parametros GET de la ruta y que existan los campos: peticion y funcion
 * y este va a responder en un JSON (status: t/f, [msg], opcionalmente: data) y el codigo: 200,201, 404, 500
 * control paramentros GET, datos de formulario: paramentros POST
 */

$respuesta_back = array(
    'status' => false,
    'msg' => array()
);

$parametrosGet = $_GET;
$parametros_get = $_GET;
$respuesta_backend = array(
    'success' => false,
    'msg' => array(
        'Error, no encontre la peticion solicitada'
    )
);

$parametrosPost = $_POST;

//var_dump($parametrosGet,$parametrosPost);exit;

$rutas = new Rutas();
//var_dump($parametrosGet);exit;

$pasa_url = true;
if(!isset($parametrosGet['peticion']) || $parametrosGet['peticion'] == ''){
    $pasa_url = false;
    $respuesta_back['msg'][] = 'Error, el campo GET - peticion es requerido';
}if(!isset($parametrosGet['funcion']) || $parametrosGet['funcion'] == ''){
    $pasa_url = false;
    $respuesta_back['msg'][] = 'Error, el campo GET - funcion es requerido';
}

if($pasa_url){
    //se recibio el parametro peticion y podemos avanzar
    switch ($parametrosGet['peticion']){ //es el que controla el grupo de peticiones
        case 'catalogos':
            //se crea instancia de la clase para poder usar sus funciones y atributos
            $catControlador = new CatalogosControlador();
            //var_dump($catControlador->codigoRespuesta);exit;
            switch ($parametrosGet['funcion']){ //el que controla las funciones
                case 'cat_contacto':
                    $respuestaCtrl = $catControlador->obtenerCatContacto();
                    //realizar una terna para saber el codigo de respuesta condicional ? valor_v : valor_f
                    /**
                     * if(condional){
                        //codigo aqui o algo
                     * }else{
                        //codigo aqui o algo
                     * }
                     */
                    //$rutas->peticion($respuestaCtrl['status'] ? 200 : 500,$respuestaCtrl);
                    $rutas->peticion($catControlador->getCodigoRespuesta(),$respuestaCtrl);
                    break;
                default:
                    $respuesta_back['status'] = false;
                    $respuesta_back['msg'] = array(
                        'No se encontro la funcion del catalogo solicitado'
                    );
                    $rutas->peticion(404,$respuesta_back);
                    break;
            }
            break;
        case 'empleado':
            $empleadoControlador = new EmpleadoControlador();
            /**
             * preparar todas las funciones posibles del API rest: consultar registro, agregar registro, modificar y eliminar
             */
            switch ($parametrosGet['funcion']){
                case 'listado':
                    $respuestaEmpCtrl = $empleadoControlador->obtenerEmpleados();
                    $rutas->peticion($empleadoControlador->getCodigoRespuesta(),$respuestaEmpCtrl);
                    break;
                case 'nuevo':
                    $respuestaEmpCtrl = $empleadoControlador->insertarNuevo($parametrosPost);
                    $rutas->peticion($empleadoControlador->getCodigoRespuesta(),$respuestaEmpCtrl);
                    break;
                case 'actualizar':
                    $respuestaEmpCtrl = $empleadoControlador->actualizar($parametrosPost);
                    $rutas->peticion($empleadoControlador->getCodigoRespuesta(),$respuestaEmpCtrl);
                    break;
                case 'eliminar':
                    $respuestaEmpCtrl = $empleadoControlador->eliminar($parametrosPost);
                    //var_dump($parametrosPost);
                    $rutas->peticion($empleadoControlador->getCodigoRespuesta(),$respuestaEmpCtrl);
                    break;
                case 'buscar':
                    $respuestaEmpCtrl = $empleadoControlador->buscar($parametrosPost);
                    $rutas->peticion($empleadoControlador->getCodigoRespuesta(),$respuestaEmpCtrl);
                    break;
                default: 
                    $respuesta_back['status'] = false;
                    $respuesta_back['msg'] = array(
                        'No se encontro la funcion del contacto solicitado'
                    );
                    $rutas->peticion(404,$respuesta_back);
                    break;
            }
            break;
            break;
        default:
            $respuesta_back['status'] = false;
            $respuesta_back['msg'] = array(
                'No se encontro la peticion o la funcion solicitada en el GET'
            );
            $rutas->peticion(404,$respuesta_back);
            break;
    }

}else{
    $rutas->peticion(400,$respuesta_back);
}

class Rutas{

    public function peticion($codigoRespuesta,$respuesta){
        http_response_code($codigoRespuesta);
        echo json_encode($respuesta);
    }

}