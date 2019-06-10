function guest(s){
    //记录当前上了的菜
    this.dishtoeat=new Array();
    //记录剩下的还没上的菜的数量
    this.dishleft=0;
    //记录所有点的菜
    this.dishtoshow=new Array();
    this.eating=false;
    this.dishcount=0;
    this.seat=-1;//座位号是0-4
    this.money=0;
    //document.getElementsByClassName("seat").getElementById("ordername");不行
    this.status;
}
//点菜
guest.prototype.order=function(){
    this.status.innerHTML="点菜中";
    var thisguest=this;
    var amount=Math.floor((Math.random()*10)/2)+1;
    thisguest.dishleft=amount;
    var pro=new Promise(function(resolve){
        setTimeout(resolve,2000,thisguest);
    });
    pro.then(function(thisguest){
        var order=new Array();
        for(var i=0;i<amount;i++){
            //测试修改
            var ind=Math.floor((Math.random()*10)/2);
            //var ind=i;
            var newdish;
            switch (ind) {
                case 0: newdish=new porridge(thisguest);break;
                case 1: newdish=new vegnoddle(thisguest);break;
                case 2: newdish=new mashi(thisguest);break;
                case 3: newdish=new oilnoddle(thisguest);break;
                case 4: newdish=new potato(thisguest);break;
            }
            order.push(newdish);
            thisguest.money+=newdish.price;
            thisguest.dishtoshow.push(newdish);
        }
        //waiterwork(order,0);//************************************************

        //点好发给厨师
        order.forEach(o => {
            //console.log(o.guest.seat+"点菜"+o.name);
            var f=false;
            for(var i=0;i<dishtodo.length;i++){
                if(dishtodo[i][0].name==o.name){
                    dishtodo[i].push(o);
                    f=true;
                    break;
                }
            }
            if(!f){
                var dishs=[o];
                dishtodo.push(dishs);
            }                  
            myrestaurant.money-=o.cost;
        });
        renewmoney();//************************************************
        gueststate(thisguest);
        dishstate();//************************************************
        cookdish();//************************************************
    })
}
//吃菜
guest.prototype.eat=function(){
    if(this.dishtoeat.length!=0){
        this.eating=true;
        var eatingdish=this.dishtoeat.shift();
        eatingdish.state=1;
        gueststate(this);
        this.dishleft--;
        //console.log(this.status.innerHTML);
        var thisguest=this;
        var pro=new Promise(function(resolve){
            setTimeout(resolve,eatingdish.eattime*1000,thisguest);
        });
        switch (eatingdish.name) {
            case "杂粮粥": eatingdish.state=2; pro.then(guestpromise); break;
            case "卤面": eatingdish.state=2; pro.then(guestpromise); break;
            case "麻食": eatingdish.state=2; pro.then(guestpromise); break;
            case "油泼面": eatingdish.state=2; pro.then(guestpromise); break;
            case "洋芋擦擦": eatingdish.state=2; pro.then(guestpromise); break;
        }
    }
    //没得吃了
    else{
        this.eating=false;  
        //用餐结束
        if(this.dishleft==0){
            //console.log(this.seat+"号桌用餐结束");
            this.status.innerHTML="用餐结束";
            myrestaurant.money+=this.money;
            renewmoney();//************************************************
            eatingguests--;
            this.nextguest(this.seat);
            this.seat=-1;           
            //delete(this);?????????????????????????????????
        }      
    }
}

guest.prototype.nextguest=function(s){
    var thisguest=this;
    var guestimg=document.getElementsByClassName("seat")[parseInt(s)].getElementsByTagName("img")[0];
    guestimg.src="img/0.png";
    var pro=new Promise(function(resolve){
        setTimeout(resolve,1000,thisguest);
        eatingguests++;
    });
    pro.then(function(){
        var waiting=document.getElementById("waiting");
        var waitingimg=waiting.getElementsByTagName("img");
        
        if(waitingimg.length>0){
            guestimg.src=waitingimg[0].src;
            waiting.removeChild(waitingimg[0]);
        }
        else{
            guestimg.src="img/1.png";
        }
        //console.log(s+"号桌新来顾客");

        //前一位离开后一位入座
        if(guests.length!=0){
            newguest=guests.shift();
            //分配座位
            newguest.seat=s;
            newguest.status=document.getElementsByClassName("seat")[parseInt(s)].getElementsByTagName("div")[0];            
            newguest.order();
        } 
        //客人直接入座
        else{
            thisguest.seat=s;
            thisguest.status=document.getElementsByClassName("seat")[parseInt(s)].getElementsByTagName("div")[0];            
            thisguest.order();
        }
    });
}

function guestpromise(thisguest){  
    gueststate(thisguest);
    thisguest.eat();
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

var addguest = function (){
    var pro=new Promise(function(resolve){
        setTimeout(resolve,3000);
    });

    pro.then(function(){
        //console.log("addguest");
        if(guests.length<MAXwaitingguests){
            var newwaitingguest=document.createElement("img");
            var ind=Math.ceil(Math.random()*5);
            newwaitingguest.src="img/"+ind+".png";
            newwaitingguest.id="waitingimg";
            document.getElementById("waiting").appendChild(newwaitingguest);
            guests.push(new guest());         
        }
        if(eatingguests<5){
            thisguest=guests.shift();
            //分配座位
            thisguest.nextguest(eatingguests);
        }

        addguest();
    });
};