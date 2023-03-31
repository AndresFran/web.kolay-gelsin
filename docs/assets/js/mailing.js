$(document).ready(function () {
    $('form#contact').on('submit', function (e) {
        e.preventDefault();

        blockForm();

        const data =
            {
                name: $('input[name="name"]').val(),
                email: $('input[name="email"]').val(),
                nationality: $('input[name="nationality"]').val(),
                phone: $('input[name="phone"]').val(),
                living: $('input[name="living"]').val(),
                know: $('input[name="know"]').val(),
                message: $('textarea[name="message"]').val(),
            };
        const jQuery = $;

        jQuery
            .ajax('/mailing.php', {
                method: 'post',
                data: data,
            })
            .done(response => {
                unBlockForm();
                showSuccessMessage();
                resetForm();
                setTimeout(() => removeMessage(), 5000)
            })
            .fail(error => {
                unBlockForm();
                showErrorMessage();
                setTimeout(() => removeMessage(), 5000)

            })
    })


    function blockForm() {
        $('input, textarea').prop("disabled", true);
        $('button#form-submit').html('Sending...')

    }

    function unBlockForm() {
        $('input, textarea').prop("disabled", false);
        $('button#form-submit').html('SEND MESSAGE NOW')
    }

    function showSuccessMessage() {
        $('button#form-submit').parent().append(`<span class="mail-message">Message delivered.</span>`);
    }

    function showErrorMessage() {
        $('button#form-submit').parent().append(`<span class="mail-message">Message could not be delivered, try again later.</span>`);
    }

    function resetForm() {
        $('input, textarea').val('');
    }

    function removeMessage() {
        $('.mail-message').remove();

    }
});
