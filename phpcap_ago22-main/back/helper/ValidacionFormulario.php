<?php

class ValidacionFormulario
{

    public static function empleadoNuevo($datosFormulario){
        $validacion['status'] = true;
        $validacion['msg'] = array();
        if(!isset($datosFormulario['nombre']) || $datosFormulario['nombre'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo nombre es requerido';
        }if(!isset($datosFormulario['paterno']) || $datosFormulario['paterno'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo paterno es requerido';
        }if(!isset($datosFormulario['materno']) || $datosFormulario['materno'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo materno es requerido';
        }if(!isset($datosFormulario['nacimiento']) || $datosFormulario['nacimiento'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo fecha de nacimiento es requerido';
        }if(!isset($datosFormulario['genero']) || $datosFormulario['genero'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo genero es requerido';
        }
        return $validacion;
    }

    public static function actualizarEmpleado($datosFormulario){
        $validacion = self::empleadoNuevo($datosFormulario);
        if(!isset($datosFormulario['id']) || $datosFormulario['id'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo identificador es requerido';
        }
        return $validacion;
    }

    public static function eliminarEmpleado($datoseliminar){
        $validacion['status'] = true;
        $validacion['msg'] = array ();
        if(!isset($datoseliminar['id']) || $datoseliminar['id'] == ''){
            $validacion['status'] = false;
            $validacion['msg'][] = 'El campo nombre es requerido';
        }
        return $validacion;
    }
}