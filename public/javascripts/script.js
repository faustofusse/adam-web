
// ------------------------- CHECKEAR PATHNAME

let pathname = window.location.pathname;
$('ul li a[href=\'' + pathname + '\']').addClass('activo');
if (pathname === '/registro') $('input[type=\'text\'], input[type=\'email\']').val('');

// ------------------------- HOLA

$('p').load('/api/documentos/5d1198c51e85241a66382069');

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

// $('form#archivo').submit((e) => {
//     e.preventDefault();
//     var formData = new FormData();
//     formData.append('description', 'Imagen de la puta madre');
//     formData.append('keywords', ['Hola', 'Homass2', 'sadasd', 'asdjksdn']);
//     formData.append('file', $('input#file').val())
//     console.log('Loading....');
//     $.ajax({
//         url: '/api/archivos',
//         data: formData,
//         processData: false,
//         contentType: false,
//         type: 'POST'
//     }).fail((err) => console.error(err))
//         .done((response) => {
//             console.log(response);
//             console.log('File uploaded.');
//             if (response.errors) handleErrors(response.errors);
//         });;
// });

function handleErrors(errors) {
    alert(errors);
}