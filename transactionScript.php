<?php

//模式介绍：
//事务脚本，通过添加几个助手方法到基类中，
//继承的类就可以关注应用逻辑，而不太需要花太多时间在数据库的
//存储上面.....


//SQL 
//CREATE TABLE 'venue'{
// 	'id' int(11) NOT NULL auto_increment,
// 	'name' text,
// 	PRIMARY KEY('id')
// }
// CREATE TABLE 'space'{
// 	'id' int(11) NOT NULL auto_increment,
// 	'venue' int(11) default NULL,
// 	'name' text,
// 	PRIMARY KEY ('id')
// }
// CREATE TABLE 'event'{
// 	'id' int(11) NOT NULL auto_increment,
// 	'space' int(11) default NULL,
// 	'start' mediumtext,
// 	'duration' int(11) default NULL,
// 	'name' text,
// 	PRIMARY KEY('id')
// }

abstract class woo_process_Base{
	static $DB;
	static $stmts=array();

	function __construct(){
		$dsn=woo_base_ApplicationRegistry::getDsn();
		if(is_null($dsn)){
			throw new woo_base_AppException();
		}
		self::$DB=new PDO($dsn);
		self::$DB->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
	}

	function prepareStatement($stmt_s){
		if(isset(self::$stmts[$stmt_s])){
			return self::$stmts[$stmt_s];
		}
		$stmt_handle=self::$DB->prepareStatement($stmt_s);
		self::$stmts[$stmt_s]=$stmt_handle;
		return $stmt_handle;
	}

	protected function doStatement($stmt_s,$values_a)
	{
		$sth=$this->prepareStatement($stmt_s);
		$sth->closeCursor();//?
		$db_result=$sth->execute($values_a);
		return $sth;

	}
}

class woo_process_VenueManager extends woo_process_Base{
	//事物script
	static $add_venue="INSERT INTO venue(name) values(?)";
	static $add_space="INSERT INTO space(name,venue) values(?,?)";
	static $check_slot="SELECT id,name FROM event WHERE space=? AND (start+duration)>? AND start<?";
	static $add_event="INSERT INTO event(name,space,start,duration) value(?,?,?,?)";
	//....

	function addVenue($name,$space_array){
		$ret=array();
		$ret['venue']=array($name);
		$this->doStatement(self::$add_venue,$ret['venue']);
		$v_id=self::$DB->lastInsertId();
		$ret['spaces']=array();
		foreach ($space_array as $space_name) {
			$values=array($space_name,$v_id);
			$this->doStatement(self::$add_space,$values);
			$s_id=self::$DB->lastInsertId();
			array_unshift($values, $s_id);
			$ret['spaces'][]=$values;
		}
		return $ret;
	}

	function bookEvent($space_id,$name,$time,$duration){
		$values=array($space_id,$time,($time+$duration));
		$stmt=$this->doStatement(self::$check_slot,$values,false);
		if($result=$stmt->fetch()){throw new woo_base_AppException();}
		$this->doStatement(self::$add_event,array($name,$space_id,$time,$duration));
	}
}

?>