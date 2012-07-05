<?php
abstract class Question{
	protected $prompt;
	protected $marker;

	function __construct($prompt,Marker $marker){
		$this->marker=$marker;
		$this->prompt=$prompt;
	}

	function mark($response){
		return $this->marker->mark($response);
	}
}

class TextQuestion extends Question{
	//
}

class AVQuestion extends Question{
	//
}


abstract class Marker{
	protected $test;

	function __construct($test){
		$this->test=$test;
	}

	abstract function mark($response);
}

class MarkLogicMarker extends Marker{
	private $engine;

	function __construct($test){
		parent::__construct($test);
		//this->engine=new MarkEngine($test);
	}

	function mark($response){
		//return $this->engine->evaluate($response);
		//模拟返回值
		return true;
	}
}


class MatchMarker extends Marker{
	function mark($response){
		return ($this->test==$response);
	}
}

class RegexpMarker extends Marker{
	function mark($response){
		return (preg_match($this->test, $response));
	}
}

//客户端代码
$markers=array(
		new RegexpMarker("/five/"),
		new MatchMarker("five"),
		new MarkLogicMarker('$input equals "five" ')
	);

foreach ($markers as $marker) {
	print get_class($marker)."\n";
	$question=new TextQuestion("how many beans make five",$marker);
	foreach (array("five","four") as $response) {
		print "\tresponse:$response: ";
		if($question->mark($response)){
			print("well done<br>");
		}else{
			print("dont's give up<br>");
		}
	}
}
?>