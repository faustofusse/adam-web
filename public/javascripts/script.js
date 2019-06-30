// $(function () {
// ------------------------- CHECKEAR PATHNAME

let pathname = window.location.pathname;
$('ul li a[href=\'' + pathname + '\']').addClass('activo');
if (pathname === '/registro') $('input[type=\'text\'], input[type=\'email\']').val('');

// ------------------------- INICIO

$(document).find('button#eliminar').click(eliminarItem);

$('div.archivo').each((index, element) => {
    let id = $(element).attr('id');
    $(element).find('p').load('/api/documentos/' + id);
    $(element).find('button#slide').click(slideFile)
});

// ------------------------- EVENTOS

$('button#subir-archivo').click(() => upload_div_visibility(true));
$('div.upload button#cerrar').click(() => upload_div_visibility(false));

$('form#usuario').submit((e) => {
    e.preventDefault();
    let data = {
        name: $('input#name').val(),
        lastName: $('input#lastName').val(),
        email: $('input#email').val(),
        password: $('input#password').val(),
        repeatPassword: $('input#repeatPassword').val()
    };
    for (d in data) if (data[d] === '') delete data[d];
    console.log(data);
    let method = pathname === '/registro' ? 'POST' : 'PUT';
    $.ajax({ url: '/api/usuarios', method, data })
        .fail((err) => console.error(err))
        .done((response) => {
            alert(JSON.stringify(response));
            if (data.errors) handleErrors(data.errors);
        });
});

$('form#archivo').submit((e) => {
    e.preventDefault();
    let form = document.getElementById("archivo");
    let formdata = new FormData(form);
    console.log('Loading....');
    upload_div_visibility(false);
    $.ajax({
        url: '/api/archivos',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST'
    }).fail((err) => console.error(err))
        .done((response) => {
            console.log(response);
            console.log('File uploaded.');
            if (response.errors) return handleErrors(response.errors);
            alert(response.msg);
            location.reload();
        });;
});

// ------------------------- FUNCIONES

function slideFile() {
    $(this).parent().parent().find('div.texto').slideToggle(400);
}

function upload_div_visibility(toVisible) {
    $('div.upload-container').css('display', toVisible ? 'flex' : 'none');
}

function eliminarItem(e) {
    let eliminar = confirm('Estas seguro de que quieres eliminar este archivo?');
    if (!eliminar) return;
    let parent = $(this).parent();
    if (!parent.attr('class') || parent.attr('class') !== 'imagen')
        parent = parent.parent();
    let id = parent.attr('id');
    $.ajax({
        url: '/api/archivos/' + id,
        type: 'DELETE'
    }).fail((err) => console.error(err))
        .done((response) => {
            console.log('File deleted.');
            if (response.errors) return handleErrors(response.errors);
            alert(response.msg);
            console.log(response);
            location.reload();
        });;
}

function handleErrors(errors) {
    alert(errors);
}
// });