<?php
//应用程序助手
class woo_controller_ApplicationHelper{
	private static $instance;
	private $config = "/tmp/data/woo_options.xml";

	private function __construct(){}

	static function instance(){
		if(!self::$instance){
			self::$instance=new self();
		}
		return self::$instance;
	}

	function init(){
		//对全局注册对象进行检测，如果已经初始化过一次，则不再调用初始化操作了
		$dsn=woo_base_ApplicationRegistry::getDSN();
		if(!is_null($dsn)){
			return;
		}
		$this->getOptions();
	}

	private function getOptions(){
		$this->ensure(file_exists($this->config),"Could not find options file");
		$options=@simplexml_load_file($this->config);
		$this->ensure($options instanceof SimpleXMLElement,"Could not resolve options file");
		woo_base_ApplicationRegistry::setDSN($dsn);
		//设置其他的值
		$map=new woo_base_ControllerMap();

		//完成默认视图的配置
		foreach ($options->control->view as $default_view) {
			$stat_str=trim($default_view['status']);
			$status=woo_command_Command::statuses($stat_str);
			$map->addView('default',$status,(string)$default_view);
		}
		//...省略更多解析代码
		woo_base_ApplicationRegistry::setControllerMap($map);
	}


	private function ensure($expr,$message)
	{
		if(!$expr){
			throw new woo_base_AppException($message);
		}
	}
}

//前端控制器
class woo_controller_Controller{
	private $applicationHelper;

	private function __construct(){}

	static function run(){
		$instance=new woo_controller_Controller();
		//区分请求和初始化操作
		$instance->init();
		$instance->handleRequest();
	}

	function init(){
		$applicationHelper=woo_controller_ApplicationHelper::instance();
		$applicationHelper->init();
	}

	function handleRequest(){
		$requst = new woo_controller_Request();//?
		// $cmd_r=new woo_command_CommandResolver();
		// $cmd=$cmd_r->getCommand($requst);
		// $cmd->execute($request);

		$app_c=woo_base_ApplicationRegistry::appController();

		while($cmd=$app_c->getCommand($request)){
			print "executing ".get_class($cmd)."\n";
			$cmd->execute($request);
		}

		$this->invokeView($app_c->getView($request));
	}

	function invokeView($target){
		include("woo/view/$target");
		exit;
	}
}

//对命令模式的解析器进行修改
class woo_command_CommandResolver{	//用来查找业务命令对象
	private static $base_cmd;
	private static $default_cmd;

	function __construct(){
		if(!self::$base_cmd){
			self::$base_cmd=new ReflectionClass("woo_base_Command");
			self::$default_cmd=new woo_command_DefaultCommand()；
		}
	}

	function getCommand(woo_controller_Request $request){
		$cmd=$request->getPropety('cmd');
		$sep=DIRECTORY_SEPERATOR;
		if(!$cmd){
			return self::$default_cmd;
		}
		$cmd=str_replace(array('.',$sep),"",$cmd);
		$filepath="woo{$sep}command{$sep}{$cmd}.php";
		$classname="woo_command_$cmd";
		if(file_exists($filepath)){
			@require_once($filepath);
			if(class_exits($classname)){
				$cmd_class=new ReflectionClass($classname);
				if($cmd_class->isSubclassOf(self::$base_cmd)){
					return $cmd_class->newInstance();
				}else{
					$request->addFeedback("command '$cmd' is not a command");
				}
			}

			$request->addFeedback("command '$cmd' not found");
			return self::$default_cmd;
		}
	}
}

abstract class woo_command_Command{
	private static $STATUS_STRINGS=array(
		'CMD_DEFAULT'=>0,
		'CMD_OK'=>1,
		'CMD_ERROR'=>2,
		'CMD_INSUFFICIENT_DATA'=>3
	);

	private $stauts=0;


	final function __construct(){}

	function execute(woo_controller_Request $request){
		$this->doExecute($request);
		$request->setCommand($this);
	}

	function getStatus(){
		return $this->status;
	}

	static function statuses($str='CMD_DEFAULT'){
		if(empty($str)){$str='CMD_DEFAULT';}
		//将字符串转化为状态数
		return self::$STATUS_STRINGS[$str];
	}

	abstract function doExecute(woo_controller_Request $request);
}


//对比opencart的代码，视图和命令结合在一起，
//这种通过引入第三方的applicationHelper类，把视图和命令类分离，
//通过xml之类的外部文件控制视图和命令类之间的关系，提供更多的灵活性
//应对那种视图和命令类关系不明确，不好控制的的情况
class woo_command_DefaultCommand extends woo_command_Command{
	function doExecute(woo_controller_Request $request){
		$request->addFeedback("welcome to woo");
		include("woo/view/main.php");
	}
}

class woo_command_AddVenue extends woo_command_Command{
	function doExecute(woo_controller_Request $req){
		$name=$request->getProperty("venue_name");
		if(!$name){
			$request->addFeedback("no name provided");
			return self::statuses('CMD_INSUFFICIENT_DATA');
		}else{
			$venue_obj=new woo_domaain_Venue(null,$name);
			$request->setObjet('venue',$venue_obj);
			$request->addFeedback("'$name' added ({$venue_obj->getId()})");
			return self::statauses('CMD_OK');
		}
	}
}


class woo_controller_Request{
	private $properties;
	private $feedback=array();

	function __construct(){
		$this->init();
		woo_base_RequestRegistry::setRequest($this);
	}

	function init(){
		if(isset($_SERVER['REQUEST_METHOD'])){//?
			$this->properties=$_REQUEST;
			return ;
		}

		foreach ($_SERVER['argv'] as $arg) {
			if(strpos($arg,'=')){
				list($key,$val)=explode("=",$arg);
				$this->setProperty($key,$val);
			}
		}
	}

	function getProperty($key){
		if(isset($this->properties[$key])){
			return $this->properties[$key];
		}
	}

	function setProperty($key,$val){
		$this->properties[$key]=$val;
	}

	function setFeedback($msg){
		array_push($this->feedback,$msg);
	}

	function getFeedbck(){
		return $this->feedback;
	}

	function getFeedbackString($seperator="\n"){
		return implode($seperator,$this->feedback);
	}
}


//把xml配置文件的关系映射到一个类里面，方便操作
class woo_controller_ControllerMap{
	private $viewMap=array();
	private $forwardMap=array();
	private $classrootMap=array();

	function addClassroot($command,$classroot){
		$this->addrootMap[$command]=$classroot;
	}

	function getClassroot($command){
		if(isset($this->classrootMap[$command])){
			return $this->classrootMap[$command];
		}
		return $command;
	}

	function addView($command='default',$status=0,$view){
		$this->viewMap[$command][$status]=$view;
	}

	function getView($command,$status)
	{
		if(isset($this->viewMap[$command][$status])){
			return $this->viewMap[$command][$status];
		}
		return null;
	}

	function addForward($command,$status=0,$newCommand){
		$this->forwardMap[$command][$status];
	}

	function getForward($commannd,$status){
		if(isset(($this->forwardMap[$command][$stauts])){
			return $this->forwardMap[$command][$status];
		}
		return null;
	}

}

//应用控制器
class woo_controller_AppController{
	private static $base_cmd;
	private static $default_cmd;
	private $controlerMap;
	private $invoked=array();

	function __construct(woo_controller_Controller $map){
		$this->controllerMap=$map;
		if(!self::$base_cmd){
			self::$base_cmd=new ReflectionClass("woo_command_Command");
			self::$default_cmd=new woo_command_DefaultCommand();
		}
	}

	function getView(woo_controller_Request $req){
		$view=$this->getResource($req,'View');
		return $view;
	}

	function getForward(woo_controller_Request $req){
		$forward=$this->getResource($req,"Forward");
		if($forward){
			$req->setProperty('cmd',$forward);
		}
		return $forward;
	}

	private function getResource(woo_controller_Request $req,$res){
		//得到前一个命令及其执行状态
		$cmd_str=$req->getProperty('cmd');
		$previous=$req->getLastCommand();
		$status=$previous->getStatus();

		if(!$status){
			$status=0;
		}

		$acquire="get$res";

		//得到前一个命令的资源及其状态
		$resource=$this->controllerMap->$acquire($cmd_str,$status);

		//查找命令并且状态为0的资源
		if(!$resource){
			$resource=$this->controllerMap->$acquire($cmd_str,0);
		}

		if(!$resource){
			$resource=$this->controllerMap->$acquire('default',$status);
		}

		//其他情况获取'default'失败，状态为0
		if(!$resource){
			$resource=$this->controllerMap->$acquire('default',0);
		}		

		return $resource;
	}

	function getCommand(woo_controller_Request $req){
		$previous=$req->getLastCommand();
		if(!$previous){
			//本次请求调用的第一个命令
			$cmd=$req->getProperty('cmd');
			if(!$cmd){
				$req->setProperty('cmd','default');
				return self::$default_cmd;
			}
		}else{
			//之前已执行过一个命令
			$cmd=$this->getForward($req);
			if(!$cmd){
				return null;
			}
		}

		//在$cmd变量中保存着命令名称，并将其解析为Command对象
		$cmd_obj=$this->resolveCommand($cmd);
		if(!$cmd_obj){
			throw new woo_base_AppException("couldn't resolve '$cmd'");
		}

		$cmd_class=get_class($cmd_obj);
		$this->invoked[$cmd_class]++;
		if($this->invoked[$cmd_class]>1){ //防止循环引用
			throw new woo_base_AppException("circular forwarding");
		}

		//返回Command对象
		return $cmd_obj;
	}

	function resolveCommand($cmd){
		$cmd=str_replace(array('.','/'),"",$cmd);
		$classroot=$this->controllerMap->getClassroot[$cmd];
		$filepath="woo/command/$classroot";
		$classname="woo_command_$classroot";
		if(file_exists($filepath)){
			require_once("$filepath");
			if(class_exists($classname)){
				$cmd_class=new ReflectionClass($classname);
				if($cmd_class->isSubclassOf(self::$base_cmd)){
					return $cmd_class->newInstance();
				}

			}
		}
		return null;
	}

}

//客户端调用代码
// require("woo/controller/Controller.php");
// woo_controller_Controller::run();


//下面是配置文件
//include <frontController.xml>
?>