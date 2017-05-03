// JavaScript Document 
//global variable to hold client copy of the addresses in the database 
addresslist = "";

//reload the address list using ajax 
function displayAddressList(items) {
    //empty the contacts lists 
    var list = $('#list ul');
    //save a client copy of the items array for validation whenever its refreshed from server 
    addresslist = items;
    //loop thru all the items and add to the list 
    var lh = "";
    for (var i = 0; i < items.length; i++) {
    	lh += '<li id="hcard-'+items[i].firstname+'-'+items[i].lastname+'" class="vcard row middle-xs vert-space-1">';
		lh += '			<div class="col-xs-6 col-sm-8">';
		lh += '				 <strong class=" fn" href="'+items[i].url+'">'+items[i].firstname+' '+items[i].lastname+'</strong>';
		if (items[i].org != '') {
			lh += '				 <em class="org">'+items[i].org+'</em>';
		}
		
		if (items[i].street != '') {
			lh += '				 <div class="adr">';
			lh += '				  <span class="street-address">'+items[i].street+'</span>';
			lh += '				, ';
			lh += '				  <span class="postal-code">'+items[i].postcode+'</span> ';
			lh += '				  <span class="locality">'+items[i].city+'</span>';
			lh += '				, ';
			lh += '				  <span class="country-name">'+items[i].country+'</span>';
			lh += '				 </div>';
			
		}
		if (items[i].phone != '') {
			lh += '				 <span class="tel">'+items[i].phone+'</span> | ';
			
		}
		if (items[i].url != '') {
			lh += '				 <a class="url" href="http://'+items[i].url+'">'+items[i].url+'</a> | ';
		}
		if (items[i].email != '') {
			lh += '				 <a class="email" href="mailto:'+items[i].email+'">'+items[i].email+'</a>';
			
		}
		lh += '			</div>';
		lh += '			<div class="col-xs-6 col-sm-4 ">';
		lh += '				<a href="#" data-contactid="' + items[i].id + '" class="icon icon-right icon-delete delete-contact">Delete</a>';
        lh += '             <a href="#" data-contactid="' + items[i].id + '" class="icon icon-right icon-edit edit-contact">Edit</a>    ';
        if (items[i].email != '') {
            lh += '              <a class="email icon icon-right icon-email" href="mailto:'+items[i].email+'">'+items[i].email+'</a>';
            
        }
        if (items[i].url != '') {
            lh += '              <a class="url icon icon-right icon-url" href="http://'+items[i].url+'">'+items[i].url+'</a>';
        }
		lh += 		'</div>';
		lh += 	'</li>'
       

    }

    list.html(lh);
    //set the delete button event after every reload 
    //deleteContact()
}
//function to set the add form with data from database
function setAddForm(items) {
    //empty the contacts lists 
    var addForm = $('#add_contact');
    //save a client copy of the items array for validation whenever its refreshed from server 
    addresslist = items;
    //loop thru all the items and add to the list 
    var lh = "";
    for (var i = 0; i < items.length; i++) {
    	$('#new_first_name').val(items[i].firstname);
    	$('#new_last_name').val(items[i].lastname);
    	$('#new_org').val(items[i].org);
    	$('#new_email').val(items[i].email);
    	$('#new_url').val(items[i].url);
    	$('#new_phone').val(items[i].phone);
    	$('#new_street').val(items[i].street);
    	$('#new_postcode').val(items[i].postcode);
    	$('#new_city').val(items[i].city);
    	$('#new_country').val(items[i].country);
    	addForm.append('<input type="hidden" name="old_id" id="old_id" value="'+items[i].id+'">');
    }
    //Set some text
    addForm.find('h1').text('Update Contact');
    $('#create_contact').text('Save');
    addForm.attr('action', 'save');
}
//function to set the save contact button event 
function saveContact() {
        //hide notice 
        $('#modal').hide();
        //remove warnings
        $('#add_contact input.warning').removeClass('warning');
        //get form action
        var addFormAction = $('#add_contact').attr('action');
        //get the contact data 
        var firstname = $('#new_first_name').val();
        var lastname = $('#new_last_name').val();
        var org = $('#new_org').val();
        var email = $('#new_email').val();
        var url = $('#new_url').val();
        var phone = $('#new_phone').val();
        var street = $('#new_street').val();
        var postcode = $('#new_postcode').val();
        var city = $('#new_city').val();
        var country = $('#new_country').val();
        var oldid = $('#old_id').val();
        if (oldid != null) {
        	var editid = '&oldid=' + oldid;
        } else{
        	var editid = '';
        }
            //call the ajax save function 
            //Yes, there would be some validation here, but that would be stage 2.
            $.ajax({
                url: 'functions/functions.php',
                data: 'action='+addFormAction+'&firstname=' + firstname + '&lastname=' + lastname + '&org=' + org + '&email=' + email + '&url=' + url + '&phone=' + phone+'&street=' + street + '&postcode=' + postcode + '&city=' + city + '&country=' + country + editid,
                dataType: 'json',
                type: 'post',
                success: function(j) {
                    //show the notice   
                    $('#modal').empty().html(j.msg);
                    //empty the input fields 
                    $('#add_contact input').val('');
                    //hide contact form
                    $('#add_contact').hide('slow');
                    
                    //refresh the address list 
                    displayAddressList(j.contacts);

                    //reset the form action and texts

    				$('#add_contact').find('h1').text('Add Contact');
                    $('#add_contact').attr('action','add');
                    $('#create_contact').text('Create');
                }
            });
       
    
}
//function to set all delete button events 
function deleteContact(el) {
        //set the delete event on each delete button 
            //confirm 
            var answer = confirm("Do you want to remove this contact?");
            if (!answer) {
                return;
            }
            //hide the form if its there 
            $('#add_contact').hide();
            //set the delete notice 
            $('#modal').empty().html('Removing...').show();
            //get the contactid of the current delete btn 
            var deleteId = el.attr('data-contactid');
            
            //call the ajax delete function 
            $.ajax({
                url: 'functions/functions.php',
                data: 'action=delete&id=' + deleteId,
                dataType: 'json',
                method: 'post',
                success: function(j) {
                    $('#modal').empty().html(j.msg);
                    //refresh the address list 
                    displayAddressList(j.contacts);
                }
            });
        
    
}
//function to edit a contact
function editContact(el){
	var editId = el.attr('data-contactid');
    
    //call the ajax delete function 
    $.ajax({
        url: 'functions/functions.php',
        data: 'action=edit&id=' + editId,
        dataType: 'json',
        method: 'post',
        success: function(j) {
            //$('#modal').empty().html(j.msg);
            $('#list_title').text('All contacts');
            //refresh the address list 
            setAddForm(j.contacts);
			//Show the edit form
			$('#add_contact').show('slow');
        }
    });
}
//function to search for contacts
function performSearch(searchterm){
	cleansearchterm = encodeURIComponent(searchterm);
	console.log(cleansearchterm);

	$.ajax({
        url: 'functions/functions.php',
        data: 'action=search&term=' + cleansearchterm,
        dataType: 'json',
        method: 'post',
        success: function(j) {
            $('#modal').empty().html(j.msg);
            $('#list_title').html(j.msg+'<span class="reset_list icon icon-reset icon-right"></span>');
            //refresh the address list 
            displayAddressList(j.contacts);
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(jqXHR);

        }
    });
}
//initilize the javascript when the page is fully loaded 
$(document).ready(function() {
    //hide the add contact form 
    $('#add_contact').hide();
    //hide the notice  
    $('#modal').hide();
    //set the add contact form button event 
    $('header').on('click', '#add-contact-btn', function(event) {
    	event.preventDefault();
    	
        //hide the notice if its still there 
        $('#modal').hide();
        //show the add contact form slowly when button is clicked 
        $('#add_contact').show('slow');
    });

    //set the search contact form button event 
    $('header').on('click', '#search-contact-btn', function(event) {
    	event.preventDefault();
    	
        //hide the notice if its still there 
        $('#modal').hide();
        //hide the add contact form  
        $('#add_contact').hide();
        //get the search term
        var plainterm = $('#search').val();
        
        //Make sure it is not empty
        if (plainterm != '' ) {

       		performSearch(plainterm);
        	
        }

    });
    //set the cancel button event 
    $('#main').on('click', '.btn-abort', function(event) {
    	event.preventDefault();
    	
        $('#add_contact').hide('slow');
        $('#modal').hide();
        //empty the input fields 
        $('#add_contact input').val('');
    });
   
    //set all the delete button events 
    $('#main').on('click', '.delete-contact', function(event) {
    	event.preventDefault();
    	deleteContact($(this));
    	/* Act on the event */
    });
    //set all the delete button events 
    $('#main').on('click', '.edit-contact', function(event) {
    	event.preventDefault();
    	editContact($(this));
    	
    });
    //set the save button event 
    $('html').on('click', '#create_contact', function(event) {
    	event.preventDefault();
    	
    	saveContact();
    });
    $('#main').on('click', '.reset_list', function(event) {
        event.preventDefault();
         $.ajax({
        url: 'functions/functions.php',
        data: '',
        dataType: 'json',
        type: 'post',
        success: function(j) {
            $('#list_title').text('All contacts');
            //refresh the address list 
            displayAddressList(j.contacts);
        },
    });
    });
    //load the address list now 
    //call the ajax save function 
    $.ajax({
        url: 'functions/functions.php',
        data: '',
        dataType: 'json',
        type: 'post',
        success: function(j) {
            //refresh the address list 
            displayAddressList(j.contacts);
        },
    });
});
