<?php
//viewHelper.php
//减少视图过多的业务逻辑，关注数据的实现
class VH{
	static function getRequest(){
		return woo_base_RequestRegistry::getRequest();
	}
}
?>

<?php
require_once("woo/view/ViewHelper.php");
$request=VH::getRequest();
$venue=$request->getObject("venue");
?>

<?php 
//---------------addVenue.php
require_once("woo/base/Registry.php");
$request=woo_base_RequestRegistry::getRequest();
?>
<html>
<head>
<title>Add a Space for venue<?php echo $venue->getName(); ?></title>
</head>
<body>
	<h1>Add a Space for venue '<?php print $venue->getName(); ?>' </h1>
	<table>
		<tr>
			<td>
				<?php
					print $request->getFeedbackString("</td></tr><tr><td>");
				?>
			</td>
		</tr>
	</table>
	<form method="post">
		<input type="hidden" name="submitted" value="yes" />
		<input type="text" name="venue_name" />
		<input type="submit" name="submit" />
	</form>

</body>
</html>