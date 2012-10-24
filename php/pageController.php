<?php

//venues.php文件...

abstract class woo_controller_PageController{
	private $request;
	function __contruct(){
		$request=woo_base_RequestRegistry::getRequest();
		if(is_null($request)){$request=new woo_controller_Request();}
		$this->request=$request;
	}

	abstract function process();

	function forward($resource){
		include($resource);
		exit(0);
	}

	function getRequest(){
		return $this->request;
	}
}

class woo_controller_AddVenueController extends woo_controller_PageController{
	function process(){
		try{
			$request=$this->getRequest();
			$name=$request->getProperty('venue_name');

			if(is_null($request->getProperty('submitted'))){
				$request->addFeedback("choose a name for the venue");
				$this->forward('add_venue.php');
			}else if(is_null($name)){
				$request->addFeedback("name is a required file");
				$this->forward('add_venue.php');
			}

			$venue=new woo_domain_Venue(null,$name);
			$this->forward("ListVenues.php");
		}catch(Exception $e){
			$this->forward('error.php');
		}
	}
}

class woo_controller_AddVenueController extends woo_controller_PageController{
	function process(){
		//do something...
	}
}

$controller=new woo_controller_AddVenueController();
$controller->process();
?>

<?php 
//---------------addVenue.php
require_once("woo/base/Registry.php");
$request=woo_base_RequestRegistry::getRequest();
?>
<html>
<head>
<title>Add Venue</title>
</head>
<body>
	<h1>Add Venue</h1>
	<table>
		<tr>
			<td>
				<?php
					print $request->getFeedbackString("</td></tr><tr><td>");
				?>
			</td>
		</tr>
	</table>
	<form action="AddVenue.php" method="get">
		<input type="hidden" name="submitted" value="yes" />
		<input type="text" name="venue_name" />
	</form>

</body>
</html>


<?php //---------------error.php
//........
?>

<?php
//------------------ListVenues.php
?>

