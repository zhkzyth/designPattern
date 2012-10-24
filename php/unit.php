<?php
// abstract class Unit{
// 	abstract function addUnit();
// 	abstract function removeUnit();
// 	abstract function bombardStrength();
// }

// class Army extends Unit{
// 	private $units=array();

// 	function addUnit(Unit $unit){
// 		if(in_array($unit, $this->$units,true)){
// 			return ;
// 		}
// 		$this->units[]=$unit;
// 	}

// 	function removeUnit(Unit $rUit){
// 		$newArr=[];
// 		foreach ($this->units as $unit) {
// 			if($rUnit==$unit){
// 				continue;
// 			}
// 			$newArr[]=$units;
// 		}
// 		$this->units=$newArr;
// 	}

// 	function bombardStrength(){
// 		$strength=0;
// 		foreach ($this->units as $unit) {
// 			$strength+=$unit->bombardStrength();
// 		}
// 		return $strength;
// 	}
// }

abstract class Unit{
	function getComposite(){
		return null;
	}
	abstract function bombardStrength();
}

abstract class CompositeUnit extends Unit{
	private $units=array();

	function getComposite(){
		return $this;
	}

	function addUnit(Unit $unit){
		if(in_array($unit, $this->units,true)){
			return;
		}
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

// $army=new CompositeUnit();
// $army->addUnit(new SoliderUnit());
// print $army->bombardStrength();


class UnitScript{
	static function joinExisting(Unit $newUnit,Unit $occupyingUnit){
		$comp;

		if(!is_null($comp=$occupyingUnit->getComposite())){
			$comp->addUnit($newUnit);
		}else{
			$comp=new Army();
			$comp->addUnit($newUnit);
			$comp->addUnit($occupyingUnit);
		}

		return $comp;
	}
}
?>