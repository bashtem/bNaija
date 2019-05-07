$(document).ready(function(){
    $('#pix').change(function(){previewPix(this,'regAvatar')});

    $('.sidebar-menu > li > a').click(function(){
        $('.sidebar-menu > li').removeClass('active');
        $(this).parent().addClass('active');
    })

})


function previewPix(input, des){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#'+des).attr('src', e.target.result);
        }
        var fileType = input.files[0]['type'];
        if (fileType.split('/')[0] === 'image') {
             reader.readAsDataURL(input.files[0]);
        }
    }
}