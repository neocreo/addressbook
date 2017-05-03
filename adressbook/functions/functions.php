<?php 
# FileName="Connection_php_mysql.htm" 
# Type="MYSQL" 
# HTTP="true" 
//configure the database paramaters 
$hostname_addressbook = "127.0.0.1"; 
$database_addressbook = "adressbook"; 
$username_addressbook = "root"; 
$password_addressbook = ""; 
//connect to the database server 
$packpub_addressbook = mysql_pconnect($hostname_addressbook, $username_addressbook,
                       $password_addressbook) or trigger_error(mysql_error(),E_USER_ERROR); 
//select the database 
mysql_select_db($database_addressbook); 

//function to save new contact  
function saveContacttoDb($firstname,$lastname,$org,$url,$email,$phone,$street,$postcode,$city,$country){ 

              $sql="INSERT INTO contacts (firstname,lastname,email,phone,url,org,street,postcode,city,country ) VALUES ('".$firstname."','".$lastname."','".$email."','".$phone."','".$url."','".$org."','".$street."','".$postcode."','".$city."','".$country."');"; 
              $result=mysql_query($sql)or die(mysql_error()); 
} 
//function to update contact
function updateContacttoDb($id,$firstname,$lastname,$org,$url,$email,$phone,$street,$postcode,$city,$country){ 

              $sql="UPDATE contacts SET firstname='".$firstname."',lastname='".$lastname."',email='".$email."',phone='".$phone."',url='".$url."',org='".$org."',street='".$street."',postcode='".$postcode."',city='".$city."',country='".$country."'  WHERE id = $id ;"; 
              $result=mysql_query($sql)or die(mysql_error()); 
} 
//lets write a function to delete contact 
function deleteContactfromDb($id){ 
              $sql = "DELETE FROM contacts WHERE id=".$id; 
	
              $result=mysql_query($sql); 
              //return 'deleted';
} 
  
//lets get all the contacts 
function getContacts(){ 
              //execute the sql to get all the contacts in db 
              $sql="SELECT * FROM contacts ORDER BY lastname ASC"; 
              $result=mysql_query($sql); 
              //store the contacts in an array of objects 
              $contacts=array(); 
              while($record=mysql_fetch_object($result)){ 
                            array_push($contacts,$record); 
              } 
              //return the contacts 
              return $contacts; 
}
//Get a single contact
function getContact($id){ 
              $sql="SELECT * FROM contacts where id=".$id; 
              $result=mysql_query($sql); 
              $contacts=array(); 
              while($record=mysql_fetch_object($result)){ 
                            array_push($contacts,$record); 
              } 
              //return the contacts 
              return $contacts; 
} 
//lets search the contacts 
function searchContacts($term){ 
              //execute the sql to get all the contacts in db 
			$decodedterm = urldecode($term);
			$cleanterm = "'%$decodedterm%'";
              $sql="SELECT * FROM contacts WHERE firstname  LIKE $cleanterm OR lastname  LIKE $cleanterm OR email  LIKE $cleanterm OR phone LIKE $cleanterm  ORDER BY lastname ASC"; 
			
              $result=mysql_query($sql); 
              
              //store the contacts in an array of objects 
              $contacts=array(); 
              while($record=mysql_fetch_assoc($result)){ 
                            array_push($contacts,$record); 
              } 
              //return the contacts 
              return $contacts; 
}  

//lets handle the Ajax calls now 

$action= isset($_POST['action']) ? $_POST['action'] : 'display'; 
//the action for now is either add or delete 
switch ($action) {
	case 'add':
		//get the post variables for the new contact 
		$firstname 	= $_POST['firstname']; 
		$lastname 	= $_POST['lastname'];
		$org 		= $_POST['org'];
		$url 		= $_POST['url'];
		$email 		= $_POST['email'];
		$phone 		= $_POST['phone'];
		$street 	= $_POST['street'];
		$postcode 	= $_POST['postcode'];
		$city 		= $_POST['city'];
		$country 	= $_POST['country'];
		//save the new contact 
		saveContacttoDb($firstname,$lastname,$org,$url,$email,$phone,$street,$postcode,$city,$country); 
		$output['msg']="The contact called".$firstname." has been saved successfully"; 
		//reload the contacts 
		$output['contacts']=getContacts(); 
		echo json_encode($output); 
	break;
	case 'save':
		//get the post variables for the new contact 
		$firstname 	= $_POST['firstname']; 
		$lastname 	= $_POST['lastname'];
		$org 		= $_POST['org'];
		$url 		= $_POST['url'];
		$email 		= $_POST['email'];
		$phone 		= $_POST['phone'];
		$street 	= $_POST['street'];
		$postcode 	= $_POST['postcode'];
		$city 		= $_POST['city'];
		$country 	= $_POST['country'];
		$oldid 	= $_POST['oldid'];
		//save the new contact 
		updateContacttoDb($oldid,$firstname,$lastname,$org,$url,$email,$phone,$street,$postcode,$city,$country); 
		$output['msg']="The contact called".$firstname." has been updated successfully"; 
		//reload the contacts 
		$output['contacts']=getContacts(); 
		echo json_encode($output); 
	break;
	case 'delete':
		//collect the id we wish to delete 
		$id=$_POST['id']; 
		//delete the contact with that id 
		deleteContactfromDb($id); 
		$output['msg']="One contact has been removed successfully"; 
		//reload the contacts 
		$output['contacts']=getContacts(); 
		echo json_encode($output); 
	break;
	case 'edit':
		//collect the id we wish to delete 
		$id=$_POST['id']; 
		
		$output['msg']="One contact fetched"; 
		//reload the contacts 
		$output['contacts']=getContact($id); 
		echo json_encode($output); 
	break;
	case 'search':
		//collect the search term 
		$term=$_POST['term'];

		$output['contacts'] = searchContacts($term); 
		$output['msg'] = "Search Results";
		echo json_encode($output);
	break;
	
	default:
		//$output['contacts'] = searchContacts('abbot'); 
		$output['contacts'] = getContacts(); 
		$output['msg'] = "All Contacts"; 
		echo json_encode($output); 
	break;
}

 ?>