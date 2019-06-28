
// ------------------------- CHECKEAR PATHNAME

let pathname = window.location.pathname;
$('ul li a[href=\'' + pathname + '\']').addClass('activo');
if (pathname === '/registro') $('input[type=\'text\'], input[type=\'email\']').val('');

// ------------------------- HOLA

$.get('/api/documentos/5d1198c51e85241a66382069', (data, status) => {
    // $('p').html(decodeURIComponent(escape(data)));
    $('p').html(data);
});

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

// $('p').load('/api/documentos/5d1198c51e85241a66382069');

// ------------------------- EVENTOS

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
            if (response.errors) handleErrors(response.errors);
        });;
});

function handleErrors(errors) {
    alert(errors);
}