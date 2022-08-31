<?php

include_once "ModeloBase.php";

class EmpleadoModelo extends ModeloBase
{

    function __construct()
    {
        parent::__construct('empleado');
    }

//    public function obtenerListado(){
//        $db = new BaseDeDatos();
//        return $db->obtenerRegistros('empleado');
//    }
public function obtenerListado($condiciones = array())
{
    $condionesSQL = $this->obtenerCondicionalesWhereAnd($condiciones);
    $consulta = "select * from contacto_empleado ce
            inner join catalogo_tipo_contacto ctc on ctc.id = ce.catalogo_tipo_contacto_id
             $condionesSQL";
    return $this->obtenerResultadosQuery($consulta);
}
}