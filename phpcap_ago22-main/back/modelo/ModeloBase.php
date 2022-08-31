<?php

include_once "BaseDeDatos.php";

class ModeloBase extends BaseDeDatos
{

    private $tabla;

    function __construct($nombreTabla)
    {
        parent::__construct();
        $this->tabla = $nombreTabla;
    }

    public function obtenerListado(){
        return $this->obtenerRegistros($this->tabla);
    }

    public function insertar($campos){
        return $this->insertarRegistro($this->tabla,$campos);
    }

    public function actualizar($valores_update,$condicionales){
        return $this->actualizarRegistro($this->tabla,$valores_update,$condicionales);
    }

    public function eliminar($condicionalesDelete){
        return $this->eliminarRegistro($this->tabla,$condicionalesDelete);
    }

    public function buscar($condicionlesBuscar){
        return $this->buscarRegistro($this->tabla,$condicionlesBuscar);
    }
}