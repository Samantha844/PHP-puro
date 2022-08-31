switch (location.hostname) {
    //*? Loocalizacion del web host
    case 'nombre_proyecto.000webhostapp.com':
        var URL_BACKEND = 'https://nombre_proyecto.000webhostapp.com/php_feb22/backend/rutas.php?';
        break;
    default:
        var URL_BACKEND = 'http://localhost/phpcap_ago22-main/back/rutas.php?';
        break;

}