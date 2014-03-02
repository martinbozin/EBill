$(function () {
    $(document).on('mousedown', '.password-toggle-1', function () {
        $(this).addClass('icon-eye-close').removeClass('icon-eye-open');
        $('.password-1').prop('type', 'text');
    });
    $(document).on('mouseup mouseout', '.password-toggle-1', function () {
        $(this).addClass('icon-eye-open').removeClass('icon-eye-close');
        $('.password-1').prop('type', 'password');
    });
});
$(function () {
    $(document).on('mousedown', '.password-toggle-2', function () {
        $(this).addClass('icon-eye-close').removeClass('icon-eye-open');
        $('.password-2').prop('type', 'text');
    });
    $(document).on('mouseup mouseout', '.password-toggle-2', function () {
        $(this).addClass('icon-eye-open').removeClass('icon-eye-close');
        $('.password-2').prop('type', 'password');
    });
});