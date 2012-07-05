<?php

abstract class Tile
{
    abstract function getWealthFactor();
}

//被装饰的实体类
class Plains extends Tile{
    private $wealthfactor=2;
    function getWealthFactor(){
        return $this->wealthfactor;
    }

}

//装饰者的基类,没有实现tile基类的方法，所以还是abstract
abstract class TileDecorator extends Tile
{
    protected $title;
    
    function __construct(Tile $tile)//传入一个被装饰的对象...
    {
        $this->tile=$tile;
    }
}

class DiamondDecorator extends TileDecorator{
    function getWealthFactor(){
        return $this->tile->getWealthFactor()+2;
    }
}

class PollutionDecorator extends TileDecorator{
    function getWealthFactor(){
        return $this->tile->getWealthFactor()-4;
    }
}


$tile=new PollutionDecorator(new DiamondDecorator(new plains));//
echo $tile->getWealthFactor();

?>