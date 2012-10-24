<?php 
abstract class woo_base_Registry{
	abstract protected function get($key);
	abstract protected function set($key,$val);
}

//会话请求级别的生命周期
class woo_base_RequestRegistry extends woo_base_Registry{
	private $values=array();
	private static $instance;

	private function __construct(){
		static funtion instance(){
			if(!isset(self::$instance)){
				self::instance=new self();
			}
			return self::instance;
		}
	}

	protected function get($key){
		if(isset($this->values[$key])){
			return $this->values[$key];
		}
		return null;
	}

	protected function set($key,$val){
		$this->values[$key]=$val;
	}

	static function getRequest(){
		return self::instance()->get('request');
	}

	static function setRequest(woo_controller_RequestRegistry $request){
		return self::instance()->set('request',$request);
	}
}

//会话级别
class woo_base_SessionRegistry extends woo_base_Registry{
	private static $instance;
	private function __construct(){
		session_start();
	}

	static function instance(){
		if(!isset(self::instance)){
			self::instance=new self();
		}
		return self::instance;
	}

	protected function get($key){
		if(isset($_SESSION[__CLASS__][$key])){
			return $_SESSION[__CLASS__][$key];
		}
		return null;
	}

	protected function set($key,$val){
		$_SESSION[__CLASS__][$key]=$val;
	}

	function setComplex(Complex $complex){
		self::isntance()->set('complex',$complex);
	}

	function getComplex(){
		return self::instance()->get('complex');
	}
}

//应用程序之间交流数据
class woo_base_ApplicationRegistry extends woo_base_Registry{
	private static $instance;
	private $freezedir="data";
	private $values=array();
	private $mtimes=array();

	private function __construct(){}

	static function instance(){
		if(!isset(self::$instance)){self::$isntance=new self();}
		return self::$isntance;
	}

	protected function get($key){
		$path=$this->freezedir.DIRECTORY_SEPERATOR.$key;
		if(file_exists($path)){
			clearstatcache();
			$mtimes=filemtime($path);
			if(!isset($this->mtimes[$key])){$this->mtimes[$key]=0;}
			if($mtimes>this->mtimes[$key]){
				$data=file_get_contents($path);
				$this->mtimes[$key]=$mtimes;
				return 	($this->values[$key]=unserialize($data));
			}
		}
		if(isset($this->values[$key])){
			return $this->values[$key;
		}
		return null;

	}

	protected function set($key,$val){
		$this->values[$key]=$val;
		$path=$this->freezedir.DIRECTORY_SEPERATOR.$key;
		file_put_contents($path, $val);
		$this->mtimes[$key]=time();
	}

	static function getDSN(){
		return self::instance()->get('dsn');
	}

	static function setDSN($val){
		return self::instance->set("dsn",$val);
	}
}

//使用PHP的shm扩展
class woo_base_MemApplicationRegistry extends woo_base_Registry{
	private static $instance;
	private $vaues=array();
	private $id;
	const DSN=1;

	private function __construct(){
		$this->id=@shm_attach(55,10000,0660);
		if(!$this->id){
			throw new Exception("could not access shared memory");
		}
	}

	static function instance(){
		if(!isset(self::$isntance)){self::$instance=new self()}
			return self::$instance;
	}

	protected function get($key){
		return shm_get_var($this->id, $key);
	}

	protected function set($key,$val)
	{
		return shm_put_var($this->id, $key, $val);
	}

	static function getDSN(){
		return self::instance()->get("dsn");
	}

	static function setDSN($val){
		return self::instance()->set("dns",$val);
	}
}
?>
