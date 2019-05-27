
var startBunsiness = function (){
    //初始化创建厨师，服务员，餐厅，待做菜单，待上菜单，客人队列，最大等待人数，已经入座人数
    cheflist=new Array();
    waiterlist=new Array();
    var newchef=new chef("c0",8000);
    cheflist.push(newchef);
    var newwaiter=new waiter("w0",4000);
    waiterlist.push(newwaiter);
    myrestaurant=createRestaurant.getinstance(100000,1,new Array(newwaiter,newchef));
    dishtodo=new Array();
    dishtoserve=new Array();
    guests=new Array();
    MAXwaitingguests=3;
    eatingguests=0;

    //开始运行，新建客人并开始服务，不定时添加客人，定时发工资  
    var guest0=new guest();
    guests.push(guest0);
    guest0.nextguest(0);
    addguest();
    payoff();
};

var addchef=function(){
    var newchef=new chef("c"+cheflist.length,8000);
    cheflist.push(newchef);
    myrestaurant.hireclerk(newchef);
    console.log("增加厨师，现在一共"+cheflist.length);
}

var addwaiter=function(){
    var newwaiter=new waiter("w"+waiterlist.length,4000);
    waiterlist.push(newwaiter);
    myrestaurant.hireclerk(newwaiter);
    var newwaiterimg = document.createElement("IMG");
    newwaiterimg.src="img/waiter.png";
    document.getElementById("waiter").appendChild(newwaiterimg);
    console.log("增加服务员，现在一共"+waiterlist.length);
}

// dishtodo.change->chef.work();
// dishtoserve.change->waiter.work();
var waiterwork=function(w,f){
    var flag=false;
    for(var i=0;i<waiterlist.length;i++){
        if(waiterlist[i].state==0){
            waiterlist[i].work(w,f);
            flag=true;
            break;
        }
    }

    if(!flag){
        //当前不空闲，就等1秒再次试图调用
        console.log("waiterbusy");
        var pro=new Promise(function(resolve){
            setTimeout(resolve,1000);
        });
        pro.then(function(){
            waiterwork(w,f);
        });
    }
}

var cookdish=function(){
    for(var i=0;i<cheflist.length;i++){
        if(cheflist[i].state==0){
            cheflist[i].work();
            break;
        }
    }
}

//************************************************?????????????????????
var dishstate = function (){
    var state=document.getElementById("todolist");
    state.innerHTML="待做菜：";
    dishtodo.forEach(dishs => {
        for(var i=0;i<dishs.length;i++){
            state.innerHTML+=dishs[i].name+" ";
        }
    });
}

//************************************************
var renewmoney = function(){
    document.getElementById("showmoney").innerHTML="餐厅资金："+myrestaurant.money;
}

var payoff = function() {
    var pro=new Promise(function(resolve){
        setTimeout(resolve,120000);
    });
    pro.then(function(){
        console.log("发工资了！");
        myrestaurant.clerk.forEach(c => {
            myrestaurant.money-=c.salary;
        });
        renewmoney();
        payoff();
    });
}



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