/*
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
(function($) {

    $(document).ready(function() {
        initAddButtons();
        initRemoveButtons();
        initFileButtons();
        //enable the validation


        $('#aspect_authorprofile_administrative_EditAuthorProfileForm_div_author-profile-form').validate({
            showErrors: function(errorMap, errorList) {
                $.each( errorMap, function(key, value){
                    var row =  $('[name="' + key + '"]')
                    $(row).closest('.control-group').addClass('has-error');
                    if($(row).closest('.ds-form-item').prev().is('label')){
                        $(row).closest('.ds-form-item').prev().css('color','#a94442');
                        $(row).closest('.ds-form-item').find('button').css('border-color','#a94442');
                    }
                });
            }
        });

        $.validator.addMethod("regex",regexChck,provideMessage);

    });

    function provideMessage(e,k){
        return $(k).siblings('.invalid').text();
    }

    function regexChck(value,element){

        var exp;

        if($(element).parent().hasClass('ds-composite-component')){

            exp=$($(element).parent().parent().find('.ds-composite-component >  input[name*=regex]')[0]).attr('value');
        } else {
            exp=$($(element).siblings('.ds-hidden-field')[0]).attr('value');
        }

        var patt=new RegExp(exp);

        var testResult = patt.test(value);

        return testResult;
    }

    function initAddButtons() {
        $('button.author-profile-add').click(function(e){
            e.preventDefault();
            var $this = $(this);
            var parentRow = $this.closest('.row');
            var lastInput = parentRow.find('input:last');
            var lastIdentifier = lastInput.attr('id');
//            var lastDivision = lastInput.parents('row');

            var oldIndex = parseInt(lastIdentifier.substr(lastIdentifier.lastIndexOf('_')+1, lastIdentifier.length));
            //Add one to the index !
            var newIndex = oldIndex + 1;

            var newDivision = parentRow.clone(true);
            newDivision.find('input').each(function()
            {
                var $this = $(this);
                //Update the index of the name (if present)
                $this.attr('name', $this.attr('name').replace('_' + oldIndex, '_' + newIndex));
                $this.attr('id', $this.attr('id').replace('_' + oldIndex, '_' + newIndex));

            });
            //Clear the values
            newDivision.find('input[type=text]').val('');

            newDivision.find('label').remove();

            newDivision.insertAfter(parentRow);
        });
    }

    function initRemoveButtons() {
        $('button.author-profile-remove').click(function(e){
            e.preventDefault();
            var $this = $(this);
            //Check if we are the last of the rows !
            var divToRemove = $this.closest('.row');
            if(divToRemove.parent().find('.row').length == 1)
            {
                //Only one left, clear the values
                divToRemove.find('input[type="text"]').val('');
            }else{
                divToRemove.remove();
            }

        });
    }

    function initFileButtons(){
        var alterButtons = $('button[name^="submit_alter_file_"]');
        alterButtons.click(function(){
            var $this = $(this);
            showUploadFileBox($this.attr('id').substr($this.attr('id').lastIndexOf('_')+1, $this.attr('id').length));

            return false;
        });
        var removeButtons = $('button[name^="submit_remove_file_"]');
        removeButtons.click(function(){
            var $this = $(this);
            var fileId = $this.attr('id').substr($this.attr('id').lastIndexOf('_')+1, $this.attr('id').length);
            $('.author-pic').hide();
            $('button[name^="submit_alter_file_' + fileId + '"]').hide();
            $this.hide();
            showUploadFileBox(fileId);
            //Set a hidden button to remove the current file
            $('input[type="hidden"][name="remove_file_' + fileId + '"]').val('true');

            return false;
        });
    }

    function showUploadFileBox(name)
    {
        $('input[name="' + name + '"][type="file"]').attr("style", "display: inline !important; visibility: visible !important ");
    }

})(jQuery);
