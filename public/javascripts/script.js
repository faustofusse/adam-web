let pathname = window.location.pathname;
$('ul li a[href=\'' + pathname + '\']').addClass('activo');

if (pathname === '/registro') $('input[type=\'text\'], input[type=\'email\']').val('');

$('form').submit((e) => {
    e.preventDefault();
    let data = {
        name: $('input#name').val(),
        lastName: $('input#lastName').val(),
        email: $('input#email').val(),
        password: $('input#password').val(),
        repeatPassword: $('input#repeatPassword').val()
    };
    for (d in data) if (data[d]==='') delete data[d];
    console.log(data);
    let method = pathname === '/registro' ? 'POST' : 'PUT';
    $.ajax({ url: '/api/usuario', method, data })
        .fail((err) => console.error(err))
        .done((response) => {
            alert(JSON.stringify(response));
            // if (data.errors) handleErrors(data.errors);
        });
});

function handleErrors(errors){
    alert(errors);
}