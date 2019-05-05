var renewmoney = function(){
    document.getElementById("showmoney").innerHTML="餐厅资金："+myrestaurant.money;
}

var createRestaurant=(function(){
    var instance=null;
    function restaurant(m,s,c){
        this.money=m;
        this.seat=s;
        this.clerk=c;//记录id
        console.log('restaurant is created!');
    };
    restaurant.prototype.hireclerk=function(c){
        var newclerk= new clerk(c.id,c.name,c.salary);
        this.clerk.push(newclerk.id);
    };
    restaurant.prototype.fireclerk=function(c){
        for(var i=0;i<this.clerk.length;i++){
            if(this.clerk[i]==c.id){
                this.clerk.splice(i,1);
            }
        }
    };
    return{
        getinstance: function(m,s,c){
            if(instance === null){
                instance=new restaurant(m,s,c);
            }
            return instance;
        }
    };
})();//之所以能保证对instance的检查，调用一次就非null，是因为他是自执行函数！！！关于自执行函数还有问题？？？？？？？？？

var clerk = function (i,n,s){
    this.id=i;
    this.name=n;
    this.salary=s;
}
clerk.prototype.work=function(){
}

var createWaiter=(function(){
    var instance=null;
    var waiter = function(i,n,s){
        clerk.call(this,i,n,s);
        console.log('waiter is created!');
    };
    waiter.prototype=Object.create(clerk.prototype);
    waiter.prototype.constructor =waiter;
    waiter.prototype.work=function(w){
        if(w instanceof Array){
            console.log("点菜"+dishtodo);
            //点菜
            w.forEach(ww => {
                dishtodo.push(ww);
                myrestaurant.money-=ww.cost;
                renewmoney();
            });
            mychef.work();          
        }
        else{
            console.log("上菜"+w.name);
            //上菜
            guest0.dishtoeat.push(w);
            if(guest0.eating==false){
                guest0.eat();
            }           
        }
    };
    //接待下一位客人
    waiter.prototype.nextguest=function(s){
        //delete(g);???????????????????
        console.log("nextguest"+s);
        if(guests.length!=0){
            guest0=guests.shift();
            //分配座位
            guest0.seat=s;
            guest0.order();
        }       
    };
    return {
        getinstance:function(i,n,s){
            if(instance===null)
                instance=new waiter(i,n,s);
            return instance;
        }
    }
})();

var createChef=(function(){
    var instance=null;
    var chef = function (i,n,s){
        clerk.call(this,i,n,s);
        this.cooking=false;
        console.log('chef is created!');
    };
    chef.prototype=Object.create(clerk.prototype);
    chef.prototype.constructor =chef;
    chef.prototype.work=function(){
        //做菜
        while(dishtodo.length!=0){
            var cookingdish=dishtodo.shift();
            var startCookTime=time;
            console.log("做菜"+cookingdish.name);
            switch (cookingdish.name) {
                case "杂粮粥": mywaiter.work(cookingdish); break; 
                case "卤面": mywaiter.work(cookingdish); break;
                case "麻食": mywaiter.work(cookingdish); break;
                case "油泼面": mywaiter.work(cookingdish); break;
                case "洋芋擦擦": mywaiter.work(cookingdish); break;
            }
        }
        if(dishtodo.length==0)
            this.cooking=false;
    };
    return {
        getinstance: function(i,n,s){
            if(instance===null){
                instance=new chef(i,n,s);
            }
            return instance;
        }
    }
})();

function guest(){
    this.dishtoeat=new Array();
    this.eating=false;
    this.dishcount=0;
    this.seat=0;
    this.money=0;
}
//点菜
guest.prototype.order=function(){
    var amount=1;//Math.floor((Math.random()*10+1)/2);
    console.log("点菜amount"+amount);
    var order=new Array();
    for(var i=0;i<amount;i++){
        var ind=Math.floor((Math.random()*10)/2);
        order.push(menu[ind]);
        this.money+=menu[ind].price;
    }
    console.log("点的菜：");
    console.log(order);
    mywaiter.work(order);
}
//吃菜
guest.prototype.eat=function(){
    while(this.dishtoeat.length!=0){
        var startEatTime=time;
        this.eating=true;
        var eatingdish=this.dishtoeat.shift();
        console.log("吃菜");
        switch (eatingdish.name) {
            case "杂粮粥": break; //while(time-startEatTime<3){}
            case "卤面": break;
            case "麻食": break;
            case "油泼面": break;
            case "洋芋擦擦": break;
        }
    }
    //没得吃了
    if(this.dishtoeat.length==0)
        this.eating=false;
    //用餐结束
    if(this.eating==false&&this.dishtoeat==0){
        console.log("guest用餐结束"+this.seat);
        myrestaurant.money+=this.money;
        renewmoney();
        mywaiter.nextguest(this.seat);
        this.seat=-1;
        //delete(this);?????????????????????????????????
    }
}

function dish(n,c,p,t){
    this.name=n;
    this.cost=c;
    this.price=p;
    this.cooktime=t;
}

// var ifeRestaurant = new restaurant(1000000,20,[]);
// var tonychef=new chef("c1","tony",10000);
// ifeRestaurant.hireclerk(tonychef);
// console.log(ifeRestaurant.clerk);
// ifeRestaurant.fireclerk(tonychef);
// tonychef=undefined;
// console.log(ifeRestaurant.clerk);
// console.log(tonychef);

var porridge =new dish("杂粮粥",2,5,1);
var vegnoddle=new dish("卤面",13,22,2);
var mashi=new dish("麻食",12,20,5);
var oilnoddle=new dish("油泼面",8,13,3);
var potato=new dish("洋芋擦擦",10,15,4);
var menu=new Array(porridge,vegnoddle,mashi,oilnoddle,potato);

var guests=new Array();
var MAXguests=1;
var addguest = function (){
    setInterval(function(){
        console.log(guests.length);
        if(guests.length<MAXguests){
            guests.push(new guest(0));
            mywaiter.nextguest(1);
        }
    },3000);
};

var startBunsiness = function (){
    console.log("0");
    addguest();
    mychef=createChef.getinstance(0,"钱",10000);
    mywaiter=createWaiter.getinstance(0,"赵",4000);
    myrestaurant=createRestaurant.getinstance(10000,1,new Array(mywaiter,mychef));
    dishtodo=new Array();
    time=0;
    //setInterval(function(){timer();},1000);
    guests.push(new guest(0));
    guest0=null;//当前服务的顾客
    mywaiter.nextguest(1);
};

var timer =function (){
    time++;
    console.log(time);
};





//以下是单例模式的一个写法————通用的单例模式例子 的test
// var getSingle = function(fn){ 
//     var result=null; 
//     return function (){
//         if(result==null){
//             //console.log(arguments);//这个参数就是实际上ar iframe1=createSingleIframe("f1","gg",100);调用fn的时候传进来的参数
//             //result=new fn(); //不能用是因为没法传参数
//             result=fn.apply(this,arguments);//这里两个参数都不能少//并且fn这个函数必须有返回值
//         }
//         return result;
//         //return result || (result=fn.apply(this,arguments)); 
//     }; 
// }; //创建div登录框 
// var createLoginLayer=function (){ 
//     console.log("div");
//     var div= document.createElement('div'); 
//     div.innerHTML='我是登录框'; 
//     document.body.appendChild(div); 
//     return div; 
// }; //创建iframe的dom节点 
// var createIframe = function (i,n,s){
//     console.log("iframe");
//     var obj=new Object();
//     obj.id=i;
//     obj.name=n;
//     obj.salary=s;
//     return obj;
//     // this.id=i;
//     // this.name=n;
//     // this.salary=s;
// }    
// var createSingleLoginLayer = getSingle(createLoginLayer); 
// var createSingleIframe=getSingle(createIframe);
// console.log(createSingleLoginLayer); 
// var loginLayer1 = createSingleLoginLayer(); 
// var loginLayer2 = createSingleLoginLayer(); 
// var iframe1=createSingleIframe("f1","gg",100);
// var iframe2=createSingleIframe(); 
// console.log(loginLayer1 === loginLayer2);
// console.log(iframe1 === iframe2);
// console.log(iframe1.id);