<?php
//访问者模式，基于组合模式的修改版
abstract class Unit{
	public $depth;

	function getComposite(){
		return null;
	}

	function accept(ArmyVisitor $visitor){
		$method="visit".get_class($this);
		$visitor->$method($this);
	}

	protected function setDepth($depth){
		$this->depth=$depth;
	}

	function getDepth(){
		return $this->depth;
	}

	abstract function bombardStrength();
}

abstract class CompositeUnit extends Unit{
	public $units=array();

	function getComposite(){
		return $this;
	}

	function addUnit(Unit $unit){
		if(in_array($unit, $this->units,true)){
			return;
		}
		$this->setDepth($this->depth+1);
		$this->units[]=$unit;
	}

	function removeUnit(Unit $rUit){
		$newArr=array();
		foreach ($this->units as $unit) {
			if($rUnit==$unit){
				continue;
			}
			$newArr[]=$units;
		}
		$this->units=$newArr;
	}

	function accept(ArmyVisitor $visitor){
		parent::accept($visitor);
		foreach ($this->units as $thisunit) {
			$thisunit->accept($visitor);
		}
	}

	// function bombardStrength(){
	// 	$strength=0;
	// 	foreach ($this->units as $unit) {
	// 		$strength+=$unit->bombardStrength();
	// 	}
	// 	return $strength;
	// }
}

class Army extends CompositeUnit{
	function bombardStrength(){
		$strength=0;
		foreach ($this->units as $unit) {
			$strength+=$unit->bombardStrength();
		}
		return $strength;
	}	
}

class SoliderUnit extends Unit{
	function bombardStrength(){
		return 4;
	}
}

class Archer extends Unit{
	function bombardStrength(){
		return 4;
	}
}

class LaserCanonUnit extends Unit{
	function bombardStrength(){
		return 4;
	}
}

class Cavalry extends Unit{
	function bombardStrength(){
		return 4;
	}
}

abstract class ArmyVisitor{

	abstract function visit(Unit $node);

	function visitArcher(Archer $node){
		$this->visit($node);
	}

	function visitCavalry(Cavalry $node){
		$this->visit($node);
	}

	function visitLaserCanonUnit(LaserCanonUnit $node){
		$this->visit($node);
	}

	function visitArmy(Army $node){
		$this->visit($node);
	}
}

class TextDumpArmyVisitor extends ArmyVisitor{
	private $text="";

	function visit(Unit $node){
		$ret="";
		$pad=4*$node->getDepth();
		$ret.=sprintf("%{$pad}s","");
		$ret.=get_class($node).": ";
		$ret.="bombard: ".$node->bombardStrength();
		$this->text.=$ret;
	}

	function getText(){
		return $this->text;
	}
}

$main_army=new Army();
$main_army->addUnit(new Archer());
$main_army->addUnit(new LaserCanonUnit());
$main_army->addUnit(new Cavalry());

$textdump=new TextDumpArmyVisitor();
$main_army->accept($textdump);
print $textdump->getText();


// $army=new CompositeUnit();
// $army->addUnit(new SoliderUnit());
// print $army->bombardStrength();

?>