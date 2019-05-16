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
        var thiswaiter=this;
        var pro=new Promise(function(resolve){
            setTimeout(resolve,1000,thiswaiter);
        });
        if(w instanceof Array){
            pro.then(function(thiswaiter){
                console.log("点菜"+dishtodo);
                //点菜
                thiswaiter.move(1);
                w.forEach(ww => {
                    dishtodo.push(ww);
                    myrestaurant.money-=ww.cost;
                    renewmoney();
                });
                dishstate();
                mychef.work(); 
            });       
        }
        else{
            pro.then(function(thiswaiter){
                console.log("上菜"+w.name);
                //上菜
                thiswaiter.move(-1);
                guest0.dishtoeat.push(w);            
                if(guest0.eating==false){
                    guest0.eat();
                }
                if(dishtodo.length!=0 || mychef.cooking==true){
                    var pro=new Promise(function(resolve){
                        setTimeout(resolve,1000,thiswaiter);
                    });
                    pro.then(function(thiswaiter){
                        thiswaiter.move(1);
                    });
                }
            });     
        }
    };
    //接待下一位客人
    waiter.prototype.nextguest=function(s){
        //delete(g);???????????????????
        //mywaiter.move(-1);
        var guestimg=document.getElementById("seat").getElementsByTagName("img")[0];
        guestimg.src="img/0.png";
        var pro=new Promise(function(resolve){
            setTimeout(resolve,1000,s);
        });
        pro.then(function(s){
            var waiting=document.getElementById("waiting");
            var waitingimg=waiting.getElementsByTagName("img");
            
            if(waitingimg.length>0){
                console.log("waitingimg.length>0");
                guestimg.src=waitingimg[0].src;
                waiting.removeChild(waitingimg[0]);
            }
            else{
                console.log("waitingimg.length<0");
                guestimg.src="img/1.png";
            }
            console.log("nextguest"+s);
            if(guests.length!=0){
                guest0=guests.shift();
                //分配座位
                guest0.seat=s;
                guest0.order();
            }  
        });
    };
    waiter.prototype.move=function(d){
        var waiterimg=document.getElementById("waiter").getElementsByTagName("img")[0];
        //d=1表示去向上移动找厨师，d=-1表示向下移动找顾客
        if(d==1){
            console.log("找厨师");
            waiterimg.style.marginTop="0px";
        }
        else{
            console.log("找客人");
            waiterimg.style.marginTop="60px";
        }
    }
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
        this.status=document.getElementById("chef").getElementsByTagName("div")[0];
        console.log('chef is created!');
    };
    chef.prototype=Object.create(clerk.prototype);
    chef.prototype.constructor =chef;
    chef.prototype.work=function(){
        //做菜
        if(dishtodo.length!=0){
            this.cooking=true;
            var cooking=dishtodo.shift();
            console.log("做菜"+cooking.name);
            this.status.innerHTML="正在做："+ cooking.name;
            var pro=new Promise(function(resolve, reject){
                setTimeout(resolve,3000,cooking);
            });
            switch (cooking.name) {
                case "杂粮粥": pro.then(chefpromise);break; 
                case "卤面": pro.then(chefpromise); break;
                case "麻食": pro.then(chefpromise); break;
                case "油泼面": pro.then(chefpromise); break;
                case "洋芋擦擦": pro.then(chefpromise); break;
            }
        }
        else{
            this.status.innerHTML="空闲";
            this.cooking=false;
        }
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

function chefpromise(cookingdish){//只能传一个参数
    console.log("做好了"+cookingdish.name);
    dishstate();
    cookingdish.state=1;
    mywaiter.work(cookingdish); 
    mychef.work();
}

function dishstate(){
    var state=document.getElementById("todolist");
    state.innerHTML="待做菜：";
    dishtodo.forEach(dishs => {
        state.innerHTML+=dishs.name+" ";
    });
}

function guest(){
    //记录当前上了的菜
    this.dishtoeat=new Array();
    //记录剩下的还没上的菜的数量
    this.dishleft=0;
    //记录所有点的菜
    this.dishtoshow=new Array();
    this.eating=false;
    this.dishcount=0;
    this.seat=0;
    this.money=0;
    //document.getElementById("seat").getElementById("ordername");不行
    this.status=document.getElementById("seat").getElementsByTagName("div")[0];
}
//点菜
guest.prototype.order=function(){
    this.status.innerHTML="点菜中";
    var thisguest=this;
    var pro=new Promise(function(resolve){
        setTimeout(resolve,2000,thisguest);
    });

    pro.then(function(thisguest){
        var amount=Math.floor((Math.random()*10)/2)+1;
        thisguest.dishleft=amount;
        console.log("点菜amount"+amount);
        var order=new Array();
        //console.log(order);
        for(var i=0;i<amount;i++){
            var ind=Math.floor((Math.random()*10)/2);
            order.push(menu[ind]);
            thisguest.money+=menu[ind].price;
            thisguest.status.innerHTML+=menu[ind].name+" ";
            thisguest.dishtoshow.push(menu[ind]);
        }
        gueststate(guest0);
        mywaiter.work(order);
    })
}
//吃菜
guest.prototype.eat=function(){
    if(this.dishtoeat.length!=0){
        this.eating=true;
        var eatingdish=this.dishtoeat.shift();
        eatingdish.state=1;
        gueststate(guest0);
        guest0.dishleft--;
        console.log(this.status.innerHTML);
        var pro=new Promise(function(resolve, reject){
            setTimeout(resolve,3000,eatingdish);
        });
        switch (eatingdish.name) {
            case "杂粮粥": pro.then(guestpromise); break;
            case "卤面": pro.then(guestpromise); break;
            case "麻食": pro.then(guestpromise); break;
            case "油泼面": pro.then(guestpromise); break;
            case "洋芋擦擦": pro.then(guestpromise); break;
        }
    }
    //没得吃了
    else{
        this.eating=false;  
            //用餐结束
        if(this.dishleft==0){
            console.log("guest用餐结束"+this.seat);
            this.status.innerHTML="用餐结束";
            myrestaurant.money+=this.money;
            renewmoney();
            mywaiter.nextguest(this.seat);
            this.seat=-1;
            //delete(this);?????????????????????????????????
        }      
    }
}

function guestpromise(eatingdish){
    console.log("吃完了"+eatingdish.name);

    eatingdish.state=2;
    gueststate(guest0);
    guest0.eat();
}

function gueststate(guest){
    var con="点单：";
    guest.dishtoshow.forEach(dish => {
        switch (dish.state){
            case 0:{
                con+=dish.name+"(待上菜) ";break;
            }
            case 1:{
                con+=dish.name+"(在吃) ";break;//这里要修改，要显示还剩多长时间
            }
            case 2:{
                con+=dish.name+"(吃完了) ";break;   
            }
        }
    });
    guest.status.innerHTML=con;
}

function dish(n,c,p,ct,et){
    this.name=n;
    this.cost=c;
    this.price=p;
    this.cooktime=ct;
    this.eattime=et;
    this.state=0;//0表示正在做，1表示正在吃，2表示吃完了
}

// var ifeRestaurant = new restaurant(1000000,20,[]);
// var tonychef=new chef("c1","tony",10000);
// ifeRestaurant.hireclerk(tonychef);
// console.log(ifeRestaurant.clerk);
// ifeRestaurant.fireclerk(tonychef);
// tonychef=undefined;
// console.log(ifeRestaurant.clerk);
// console.log(tonychef);

var porridge =new dish("杂粮粥",2,5,1,3);
var vegnoddle=new dish("卤面",13,22,2,5);
var mashi=new dish("麻食",12,20,5,6);
var oilnoddle=new dish("油泼面",8,13,3,5);
var potato=new dish("洋芋擦擦",10,15,4,5);
var menu=new Array(porridge,vegnoddle,mashi,oilnoddle,potato);

var guests=new Array();
var MAXguests=3;
var addguest = function (){
    var pro=new Promise(function(resolve){
        setTimeout(resolve,3000);
    });

    pro.then(function(){
        console.log("addguest");
        if(guests.length<MAXguests){
            var newwaitingguest=document.createElement("img");
            var ind=Math.ceil(Math.random()*5);
            newwaitingguest.src="img/"+ind+".png";
            newwaitingguest.id="waitingimg";
            document.getElementById("waiting").appendChild(newwaitingguest);
            guests.push(new guest(0));         
        }
        addguest();
    });
};

var payoff = function() {
    var pro=new Promise(function(resolve){
        setTimeout(resolve,12000);
    });
    pro.then(function(){
        console.log("发工资了！");
        myrestaurant.money-=mychef.money;
        myrestaurant.money-=mywaiter.money;
        renewmoney();
        payoff();
    });
}

var startBunsiness = function (){
    mychef=createChef.getinstance(0,"钱",8000);
    mywaiter=createWaiter.getinstance(0,"赵",4000);
    myrestaurant=createRestaurant.getinstance(100000,1,new Array(mywaiter,mychef));
    dishtodo=new Array();
    time=0;
    //setInterval(function(){timer();},1000);
    addguest();
    payoff();
    guests.push(new guest(0));
    guest0=null;//当前服务的顾客
    mywaiter.nextguest(1);
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