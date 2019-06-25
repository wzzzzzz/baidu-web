function dish(n,c,p,ct,et,g){
    this.name=n;
    this.cost=c;
    this.price=p;
    this.cooktime=ct;
    this.eattime=et;
    this.state=0;//0表示正在做，1表示正在吃，2表示吃完了
    this.guest=g;
}

//这样写是不对的，后面的引用全都是直接用了这个实例，任何修改都会影响到这个实例。
// var porridge =new dish("杂粮粥",2,5,1,3);
// var vegnoddle=new dish("卤面",13,22,2,5);
// var mashi=new dish("麻食",12,20,5,6);
// var oilnoddle=new dish("油泼面",8,13,3,5);
// var potato=new dish("洋芋擦擦",10,15,4,5);
// var menu=new Array(porridge,vegnoddle,mashi,oilnoddle,potato);
//应该把这几种菜都写成类，作为dish的子类
var porridge = function(g){
    dish.call(this,"杂粮粥",1,5,10,13,g);
    this.prototype=Object.create(dish.prototype);
    this.prototype.constructor = porridge;
};
var vegnoddle = function(g){
    dish.call(this,"卤面",10,22,12,15,g);
    this.prototype=Object.create(dish.prototype);
    this.prototype.constructor = vegnoddle;
};
var mashi = function(g){
    dish.call(this,"麻食",9,20,14,16,g);
    this.prototype=Object.create(dish.prototype);
    this.prototype.constructor = mashi;
};
var oilnoddle = function(g){
    dish.call(this,"油泼面",5,13,12,15,g);
    this.prototype=Object.create(dish.prototype);
    this.prototype.constructor = oilnoddle;
};
var potato = function(g){
    dish.call(this,"洋芋擦擦",8,15,13,15,g);
    this.prototype=Object.create(dish.prototype);
    this.prototype.constructor = potato;
};