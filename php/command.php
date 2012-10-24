<?php
//命令模式，统一入口
abstract class Command{
	abstract function execute(CommandContext $context);
}

//业务类命令
class LoginCommand extends Command{
	function execute (CommandContext $context){
		$manager=Registry::getAccessManager();
		$user=$context->get('username');
		$pass=$context->get('pass');
		$user_obj=$manager->login($user,$pass);
		if(is_null($user_obj)){
			$context->setError($manager->getError());
			return false;
		}
		$context->addParam("user",$user_obj);
		return true;
	}
}

class FeedbackCommand extends Command{
	function execute(CommandContext $context){
		$msgSystem=ReceiveFactory::getMessageSystem();
		$email=$context->get('mail');
		$msg=$context->get('topic');
		$result = $msgSystem->send($email,$msg,$topic);

		if(!$result){
			$context->setError($msgSystem->getError);
			return false;
		}
		return true;
	}
}

//环境数据
class ComamndContext{
	private $params=array();
	private $error="";

	function __construct(){
		$this->params=$_REQUEST;
	}

	function addParam($key,$val){
		$this->params[$key]=$val;
	}

	function get($key){
		return $this->params[$key];
	}

	function setError($error){
		$this->error=$error;
	}

	function getError(){
		return $this->error;
	}
}

class CommandNotFoundException extends Exception{}

class CommandFactory{
	private static $dir='commands';

	static function getCommand($action='Default'){
		if(preg_match('/\w/',$action)){
			throw new Exception("illegal characters in action");
		}

		$class=ucfirst(strtolower($action))."Command";
		$file=self::$dir.DIRECTORY_SEPARATOR."{$class}.php";
		if(!file_exists($file)){
			throw new CommandNotFoundException("no '$class' class located");
		}
		$cmd=new $class();
		return $cmd;
	}
}

class Controller {
	private $context;
	function __construct(){
		$this->context=new CommandContext();
	}

	function getContext(){
		return $this->context;
	}

	function process(){
		$cmd=CommandFactory::getCommand($this->context->get('action'));
		if(!$cmd->execute($this->context)){
			//处理失败
		}else{
			//成功
			//分发视图
		}
	}
}

$controller = new Controller();
//伪造用户请求
$context=$controller->getContext();
$context->addParam('action','login');
$context->addParam('username','zhkzyth');
$context->addParam('pass','zhc709394');	
$controller->process();
?>