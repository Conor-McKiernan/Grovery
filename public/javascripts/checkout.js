Stripe.setPublishableKey('pk_test_pYVgEaYXYoeOubJWfkPj23Tn00mznutDys');

var $form = $('#checkout-form');

$form.submit(function (event) {
    $('#charge-error').addClass('d-none');
    $form.find('button').prop('disabled', true); // so user cannot submit form multiple times while validation is occuring
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#cvc-number').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripeResponseHandler);
    return false; // to make sure form submission is stopped so it doesnt send request to server yet as hasnt validated yet
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('d-none');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!
        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();
    }
}