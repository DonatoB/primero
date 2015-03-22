define([
    'handlebars',
    'text!templates/page-login.html',
    'jquery'
], function(Handlebars, html, $) {

    var template = Handlebars.compile(html);

    return function() {
        var $html = $(template());

        $html.on('click', '.login-button', function() {
            var $form = $(this).parent();

            var user = $form.find('.username').val();
            var pass = $form.find('.password').val();

            var data = {
                username : user,
                password : pass
            };

            $.post('http://127.0.0.1:3000/login', data, function() {
                console.log(arguments);
            });
        });

        $('#battleground').html($html);
    }
});
