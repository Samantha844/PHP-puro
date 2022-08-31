$(document).ready(function() {

    $(document).on('click', '#btn_agregar_contacto', function() {
        Empleado.mostrar_form_seccion();
    });

    $(document).on('click', '#btn_actualizar_empleado', function() {
        Empleado.actualizar();
    });

    $(document).on('click', '#btn_cancelar_empleado_seccion', function() {
        Empleado.mostrar_resultados_seccion();
    });
    
    $(document).on('click', '#btn_guardar_contacto_seccion', function() {
        Empleado.guardar_contacto();
    });

    

    $(document).on('click', '#btn_guardar_empleado_seccion', function() {
        if (Empleado.validar_formulario()) {
            var actualizar = $('#campo_id_empleado').length != 0 ? true : false;
            Empleado.guardar_nuevo(actualizar);
        }
    });

    $(document).on('click', '#btn_buscar_empleado_seccion', function() {
        Empleado.buscar_usuario();
    });

    $(document).on('click', '.btn_eliminar_contacto', function() {
        var id_empleado = $(this).data('id_empleado');
        console.log(id_empleado);
        var confirmacion = confirm('¿Esta seguro de eliminar el empleado?');
        if (confirmacion) {
            Empleado.eliminar(id_empleado);
        }
    });

    $(document).on('click', '.btn_modificar_empleado', function() {
        //obtener el empleado codificador y convertirlo a un objeto json
        var empleado = JSON.parse(atob($(this).data('str_empleado')));
        //setear los datos del empleado al formulario de registro
        var input_id_empleado = '<input type="hidden" id="campo_id_empleado" name="id_empleado" value="' + empleado.id_empleado + '">';
        $('#form_registro_contacto').append(input_id_empleado);
        $('#nombre_form').val(empleado.nombre);
        $('#paterno_form').val(empleado.paterno);
        $('#materno_form').val(empleado.materno);
        $('#nacimiento_form').val(empleado.direccion);
        $('#domicilio_form').val(empleado.fecha_nacimiento);
        empleado.genero == 'h' ? $('#campo_genero_h').attr('checked', true) : $('#campo_genero_m').attr('checked', true);
        //actualizar el tablero de los datos de contacto


        Empleado.mostrar_form_seccion();
    });
    Empleado.listado();

});

var Empleado = {

    mostrar_form_seccion: function() {
        $('#seccion_filtro_tablero').hide();
        $('#seccion_formulario').show();
    },

    mostrar_resultados_seccion: function() {
        $('#seccion_filtro_tablero').show();
        $('#seccion_formulario').hide();
    },

    listado: function() {
        $('#tbodyResultadosEmpleado').html('<tr><td colspan="5" class="centrado"><span class="spinner-border"></span> Procesando datos</td></tr>');
        $.ajax({
            type: 'get',
            url: URL_BACKEND + 'peticion=empleado&funcion=listado',
            data: {},
            dataType: 'json',
            success: function(respuestaAjax) {
                //console.log(respuestaAjax);
                if (respuestaAjax.status) {
                    //procesar los datos obtenidos del backend en json y convertirlos a un formato de html
                    var html_listado_empleados = '';
                    respuestaAjax.data.empleado.forEach(function(empleado) {
                        var stringEmpleado = btoa(JSON.stringify(empleado));
                        html_listado_empleados += '<tr>' +
                            '<td>' + empleado.id_empleado + '</td>' +
                            '<td>' + empleado.nombre + ' ' + empleado.paterno + ' ' + empleado.materno + '</td>' +
                            '<td>' + empleado.nacimiento + '</td>' +
                            '<td></td>' +
                            '<td>' +
                            '<button type="button" data-str_empleado="' + stringEmpleado + '"  class="btn_modificar_empleado btn btn-sm btn-outline-warning" data-bs-toggle="modal">Editar</button>\n' +
                            '<button type="button" data-id_empleado="' + empleado.id_empleado + '" class="btn_eliminar_contacto btn btn-sm btn-outline-danger">Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#tbodyResultadosEmpleado').html(html_listado_empleados);
                } else {
                    var html_errores = '';
                    //iterar los mensajes de la respuesta del ajax/json y convertirlos a formato HTML
                    respuestaAjax.msg.forEach(function(elemento) {
                        html_errores += '<li>' + elemento + '</li>'
                    });
                    $('#div_mensasjes_sistema').html(html_errores);
                    $('#seccion_mensajes_sistema').show();
                    //ocultar mensajes del sistema despues de 5 segundos
                    setTimeout(function() {
                        $('#seccion_mensajes_sistema').hide();
                        $('#div_mensasjes_sistema').html('');
                    }, 5000);
                }
            },
            error: function(error) {
                console.log(error);
                alert('Hubo un error en el AJAX');
            }
        });
    },

    validar_formulario: function() {
        var validacion = {
            status: true,
            msg: ''
        };
        if ($('#nombre_form').val() == '') {
            validacion.status = false;
            validacion.msg += '<li>El campo nombre es requerido</li>';
        }
        if ($('#paterno_form').val() == '') {
            validacion.status = false;
            validacion.msg += '<li>El campo apellido paterno es requerido</li>';
        }
        return validacion;
    },

    guardar_nuevo: function(actualizar = false) {
        var url = actualizar ? URL_BACKEND + 'peticion=empleado&funcion=actualizar' : URL_BACKEND + 'peticion=empleado&funcion=nuevo';
        var validacion = Empleado.validar_formulario();
        if (validacion.status) {
            $.ajax({
                type: 'post',
                url: url,
                data: $('#form_registro_contacto').serialize(),
                /**
                 * data: {
                 *     nombre : $('#nombre_form').val(),
                 *     ...
                 *     ...
                 *
                 * }
                 */
                dataType: 'json',
                success: function(respuestaAjax) {
                    if (respuestaAjax.status) {
                        Empleado.mostrar_resultados_seccion();
                        Empleado.listado();
                    } else {
                        var html_errores = '';
                        //iterar los mensajes de la respuesta del ajax/json y convertirlos a formato HTML
                        respuestaAjax.msg.forEach(function(elemento) {
                            html_errores += '<li>' + elemento + '</li>'
                        });
                        $('#div_mensasjes_sistema').html(html_errores);
                        $('#seccion_mensajes_sistema').show();
                        //ocultar mensajes del sistema despues de 5 segundos
                        setTimeout(function() {
                            $('#seccion_mensajes_sistema').hide();
                            $('#div_mensasjes_sistema').html('');
                        }, 5000);
                    }
                },
                error(error) {
                    console.log(error);
                    alert('Hubo un error en el AJAX');
                }
            });
        } else {
            $('#div_mensasjes_sistema').html(validacion.msg);
            $('#seccion_mensajes_sistema').show();
            //ocultar mensajes del sistema despues de 5 segundos
            setTimeout(function() {
                $('#seccion_mensajes_sistema').hide();
                $('#div_mensasjes_sistema').html('');
            }, 5000);
        }
    },

    buscar_usuario: function() {
        $.ajax({
            type: 'post',
            url: URL_BACKEND + 'peticion=empleado&funcion=buscar',
            data: $('#form_busqueda_contacto').serialize(),
            dataType: 'json',
            success: function(respuestaAjax) {
                if (respuestaAjax.status) {
                    var html_listado_empleados = '';
                    respuestaAjax.data.empleado.forEach(function(empleado) {
                        html_listado_empleados += '<tr>' +
                            '<td>' + empleado.id_empleado + '</td>' +
                            '<td>' + empleado.nombre + ' ' + empleado.paterno + ' ' + empleado.materno + '</td>' +
                            '<td>' + empleado.nacimiento + '</td>' +
                            '<td></td>' +
                            '<td>' +
                            '<button type="button" data-bs-toggle="modal" data-bs-target="#modal_registro_contacto"\n' +
                            '   class="btn_modificar_contacto btn btn-sm btn-outline-warning">Editar</button>\n' +
                            '<button type="button" data-id_empleado="' + empleado.id_empleado + '" class="btn_eliminar_contacto btn btn-sm btn-outline-danger">Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                    });
                    $('#tbodyResultadosEmpleado').html(html_listado_empleados);
                } else {
                    var html_errores = '';
                    respuestaAjax.msg.forEach(function(elemento) {
                        html_errores += '<li>' + elemento + '</li>'
                    });
                    $('#div_mensasjes_sistema').html(html_errores);
                    $('#seccion_mensajes_sistema').show();
                    setTimeout(function() {
                        $('#seccion_mensajes_sistema').hide();
                        $('#div_mensasjes_sistema').html('');
                    }, 5000);
                }
            },
            error: function(error) {
                console.log(error);
                alert('Hubo un error en el AJAX');
            }
        });

    },

    eliminar: function(id_empleado) {
        $.ajax({
            type: 'post',
            url: URL_BACKEND + 'peticion=empleado&funcion=eliminar',
            data: {
                id_empleado: id_empleado
            },
            dataType: 'json',
            success: function(respuestaAjax) {
                if (respuestaAjax.status) {
                    Empleado.listado();
                }
                var html_msg_error = '<div class="alert alert-warning">';
                respuestaAjax.msg.forEach(function(elemento) {
                    html_msg_error += '<li>' + elemento + '</li>';
                });
                html_msg_error += '</div>';
                $('#mensajes_sistema').html(html_msg_error);
                setTimeout(function() {
                    $('#mensajes_sistema').html('');
                }, 5000);
            },
            error: function(error) {
                console.log(error)
                alert('Ocurrio un error en la peticion');
                Empleado.mostrar_resultados_seccion();
                Empleado.listado();
            }
        });
    },

    actualizar: function(actualizar = true) {
        var url = actualizar ? URL_BACKEND + 'peticion=empleado&funcion=actualizar' : URL_BACKEND + 'peticion=empleado&funcion=nuevo';
        var validacion = Empleado.validar_formulario();
        if (validacion.status) {
            $.ajax({
                type: 'update',
                url: url,
                data: $('#form_registro_contacto').serialize(),
                /**
                 * data: {
                 *     nombre : $('#nombre_form').val(),
                 *     ...
                 *     ...
                 *
                 * }
                 */
                dataType: 'json',
                success: function(respuestaAjax) {
                    if (respuestaAjax.status) {
                        Empleado.mostrar_resultados_seccion();
                        Empleado.listado();
                    } else {
                        var html_errores = '';
                        //iterar los mensajes de la respuesta del ajax/json y convertirlos a formato HTML
                        respuestaAjax.msg.forEach(function(elemento) {
                            html_errores += '<li>' + elemento + '</li>'
                        });
                        $('#div_mensasjes_sistema').html(html_errores);
                        $('#seccion_mensajes_sistema').show();
                        //ocultar mensajes del sistema despues de 5 segundos
                        setTimeout(function() {
                            $('#seccion_mensajes_sistema').hide();
                            $('#div_mensasjes_sistema').html('');
                        }, 5000);
                    }
                },
                error(error) {
                    console.log(error);
                    alert('Hubo un error en el AJAX');
                }
            });
        } else {
            $('#div_mensasjes_sistema').html(validacion.msg);
            $('#seccion_mensajes_sistema').show();
            //ocultar mensajes del sistema despues de 5 segundos
            setTimeout(function() {
                $('#seccion_mensajes_sistema').hide();
                $('#div_mensasjes_sistema').html('');
            }, 5000);
        }
    },

    guardar_contacto: function(actualizar = false) {
        var url = actualizar ? URL_BACKEND + 'peticion=empleado&funcion=datcontacto' : URL_BACKEND + 'peticion=empleado&funcion=nuevo';
        var validacion = Empleado.validar_formulario();
        if (validacion.status) {
            $.ajax({
                type: 'post',
                url: url,
                data: $('#form_registro_datos').serialize(),
                /**
                 * data: {
                 *     nombre : $('#nombre_form').val(),
                 *     ...
                 *     ...
                 *
                 * }
                 */
                dataType: 'json',
                success: function(respuestaAjax) {
                    if (respuestaAjax.status) {
                        Empleado.guardar_contacto();
                        Empleado.listado();
                    } else {
                        var html_errores = '';
                        //iterar los mensajes de la respuesta del ajax/json y convertirlos a formato HTML
                        respuestaAjax.msg.forEach(function(elemento) {
                            html_errores += '<li>' + elemento + '</li>'
                        });
                        $('#div_mensasjes_sistema').html(html_errores);
                        $('#seccion_mensajes_sistema').show();
                        //ocultar mensajes del sistema despues de 5 segundos
                        setTimeout(function() {
                            $('#seccion_mensajes_sistema').hide();
                            $('#div_mensasjes_sistema').html('');
                        }, 5000);
                    }
                },
                error(error) {
                    console.log(error);
                    alert('Hubo un error en el AJAX');
                }
            });
        } else {
            $('#div_mensasjes_sistema').html(validacion.msg);
            $('#seccion_mensajes_sistema').show();
            //ocultar mensajes del sistema despues de 5 segundos
            setTimeout(function() {
                $('#seccion_mensajes_sistema').hide();
                $('#div_mensasjes_sistema').html('');
            }, 5000);
        }
    }

}