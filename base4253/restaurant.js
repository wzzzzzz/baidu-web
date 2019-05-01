function restaurant(m,s,c){
    this.money=m;
    this.seat=s;
    this.clerk=c;//记录id
}
restaurant.prototype.hireclerk=function(c){
    var newclerk= new clerk(c.id,c.name,c.salary);
    this.clerk.push(newclerk.id);
}
restaurant.prototype.fireclerk=function(c){
    for(var i=0;i<this.clerk.length;i++){
        if(this.clerk[i]==c.id){
            this.clerk.splice(i,1);
        }
    }
}

function clerk(i,n,s){
    this.id=i;
    this.name=n;
    this.salary=s;
}
clerk.prototype.work=function(){
}

function waiter(i,n,s){
    clerk.call(this,i,n,s);
}
waiter.prototype=Object.create(clerk.prototype);
waiter.prototype.constructor =waiter;
waiter.prototype.work=function(w){
    if(w instanceof Array){
        //点菜
        w.forEach(ww => {
            dishtodo.push(ww);
        });
    }
    else{
        //上菜
        guest0.dishtoeat.push(w);
        if(guest0.eating==false){
            guest0.eat();
        }
    }
}
//接待下一位客人
waiter.prototype.nextguest=function(s){
    //delete(g);???????????????????
    if(guests.length!=0){
        var guest0=guests.shift();
        //分配座位
        guest0.seat=s;
        this.work();
    }
}

function chef(i,n,s){
    clerk.call(this,i,n,s);
    this.cooking=false;
}
chef.prototype=Object.create(clerk.prototype);
chef.prototype.constructor =chef;
chef.prototype.work=function(){
    //做菜
    while(dishtodo.length!=0){
        var cookingdish=dishtodo.shift();
        var startCookTime=time;
        switch (cookingdish.name) {
            case "杂粮粥": while(time-startCookTime<1){} waiter.work(cookingdish); break; 
            case "卤面":  while(time-startCookTime<2){} waiter.work(cookingdish); break;
            case "麻食":  while(time-startCookTime<4){} waiter.work(cookingdish); break;
            case "油泼面": while(time-startCookTime<8){} waiter.work(cookingdish); break;
            case "洋芋擦擦": while(time-startCookTime<5){} waiter.work(cookingdish); break;
        }
    }
    if(dishtodo.length==0)
        this.cooking=false;
}

function guest(s){
    this.dishtoeat=new Array();
    this.eating=false;
    this.dishcount=0;
    this.seat=s;
}
//点菜
guest.prototype.order=function(){
    var amount=Math.floor((Math.random()*10+1)/2);
    var order=new Array();
    for(var i=0;i<amount;i++){
        var ind=Math.floor((Math.random()*10)/2);
        order.push(menu[i-1]);
    }
    waiter0.work(order);
}
//吃菜
guest.prototype.eat=function(){
    while(this.dishtoeat.length!=0){
        var startEatTime=time;
        this.eating=true;
        var eatingdish=this.dishtoeat.shift();
        switch (eatingdish.name) {
            case "杂粮粥": while(time-startEatTime<3){} break; 
            case "卤面": while(time-startEatTime<5){} break;
            case "麻食": while(time-startEatTime<8){} break;
            case "油泼面": while(time-startEatTime<6){} break;
            case "洋芋擦擦": while(time-startEatTime<7){} break;
        }
    }
    //没得吃了
    if(this.dishtoeat.length==0)
        this.eating=false;
    //用餐结束
    if(this.eating==false&&this.dishtoeat==0){
        waiter0.nextguest(this.seat);
        this.seat=-1;
        //delete(this);?????????????????????????????????
    }
}

function dish(n,c,p){
    this.name=n;
    this.cost=c;
    this.price=p;
}

// var ifeRestaurant = new restaurant(1000000,20,[]);
// var tonychef=new chef("c1","tony",10000);
// ifeRestaurant.hireclerk(tonychef);
// console.log(ifeRestaurant.clerk);
// ifeRestaurant.fireclerk(tonychef);
// tonychef=undefined;
// console.log(ifeRestaurant.clerk);
// console.log(tonychef);

var porridge =new dish("杂粮粥",2,5);
var vegnoddle=new dish("卤面",13,22);
var mashi=new dish("麻食",12,20);
var oilnoddle=new dish("油泼面",8,13);
var potato=new dish("洋芋擦擦",10,15);
var menu=new Array(porridge,vegnoddle,mashi,oilnoddle,potato);

var guests=new Array();
var MAXguests=1;
function addguest(){
    setInterval(function(){
        console.log(guests.length);
        if(guests.length<MAXguests){
            guests.push(new guest(0));
        }
    },3000);
}

function startBunsiness(){
    console.log("0");
    addguest();
    chef0=new chef(0,"钱",10000);
    waiter0=new waiter(0,"赵",4000);
    myrestaurant=new restaurant(10000,1,new Array(waiter0,chef0));
    dishtodo=new Array();

    time=0;
    setInterval(function(){timer();},1000);
}
function timer(){
    time++;
    console.log(time);
}


