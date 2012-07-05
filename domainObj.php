<?php
//领域模型模式，专注于业务的类
class woo_domain_Venue extends woo_domain_DomainObject{
	private $name;
	private $spaces;

	function __construct($id=null,$name=null){
		$this->name=$name;
		$this->space=self::getCollection("woo_domain_Space");
		parent::__construct($id);
	}

	function setSpaces(woo_domain_Space $spaces){
		$this->spaces=$spaces;
	}

	function getSpaces(){
		return $this->spaces;
	}

	function addSpace(woo_domain_Space $space){
		$this->spaces->add($space);
		$space->setVenue($this);
	}

	function setName($name_s){
		$this->name=$name_s;
		$this->markDirty();//12章会讲到
	}

	function getName(){
		return $this->name;
	}
}
?>