<?php



$format = 'The %2$s contains %1$d monkeys';
printf($format,"","");
exit;

interface Observable{
	function attach(Observer $observer);
	function detach(Observer $observer);
	function notify();
}

interface Observer{
	function update(Observable $observable);
}

class login implements Observable{
	const LOGIN_USER_UNKNOWN=1;
	const LOGIN_WRONG_PASS=2;
	const LOGIN_ACCESS=3;
	private $status=array();
	private $observers;

	function handleLogin($user,$pass,$ip){
		switch('2'){
			case '1':
				$this->setStatus(self::LOGIN_ACCESS,$user,$ip);
				$ret=true;
				break;
			case '2':
				$this->setStatus(self::LOGIN_WRONG_PASS,$user,$ip);
				$ret=false;
				break;
			case '3':
				$this->setStatus(self::LOGIN_USER_UNKNOWN,$user,$ip);
				$ret=false;
				break;
		}
		$this->notify();
		return $ret;
	}

	private function setStatus($status,$user,$ip){
		$this->status=array($status,$user,$ip);
	}

	function getStatus(){
		return $this->status;
	}

	//实现接口的方法
	function attach(Observer $observer){
		$this->observers[]=$observer;
	}

	function detach(Observer $observer){
		$newobservers=array();
		foreach ($this->observers as $obs) {
			if(($obs!==$observer))
				$newobservers[]=$obs;
		}
		$this->observers=$newobservers;
	}

	function notify(){
		// var_dump($this->observers);exit;
		foreach ( $this->observers as $obs) {
			$obs->update($this);
		}
	}
}


// //实现一------------观察者并不能保证主体类一定支持getstatus方法
// class SecurityMonitor extends Observer{
// 	function update(Observable $observable){
// 		//特定观察者的操作
// 		$status=$observable->getStatus();
// 		if($status[0]==LOGIN_WRONG_PASS){
// 			//someone try to break in , tell the admin...
// 		}
// 	}
// }

// //客户端代码
// $login =new Login();
// login->attach(new SecurityMonitor());

//实现二------------由观察者自己负责该主体类是否是某个特殊的类别
abstract class LoginObserver implements Observer{
	private $login;
	function __construct(Login $login){
		$this->login=$login;
		$login->attach($this);//?
	}

	//模板方法模式
	function update(Observable $observable){
		if($observable==$this->login){
			$this->doUpdate($observable);
		}
		//throw error?
	}

	abstract function doUpdate(Observable $observable);
}

class SecurityMonitor extends LoginObserver{
	function doUpdate(Observable $observable){
		//特定观察者的操作
		$status=$observable->getStatus();
		if($status[0]==$observable::LOGIN_WRONG_PASS){
			//someone try to break in , tell the admin...
			print "terrifing attack!";
		}
	}
}
// class SecurityMonitor extends Observer{
// 	function update(Observable $observable){
// 		//特定观察者的操作
// 		$status=$observable->getStatus();
// 		if($status[0]==LOGIN_WRONG_PASS){
// 			//someone try to break in , tell the admin...
// 		}
// 	}
// }

//客户端代码
$login =new Login();
// $login->attach(new SecurityMonitor());
new SecurityMonitor($login);

$login->handleLogin("peter","121212","asdsad");


?>