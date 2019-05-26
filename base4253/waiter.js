    var waiter = function(i,s){
        clerk.call(this,i,s);
        //0表示空闲，可以进行下一步，1表示非空闲，需要等待
        this.state=0;
    };
    waiter.prototype=Object.create(clerk.prototype);
    waiter.prototype.constructor =waiter;
    waiter.prototype.work=function(w,flag){
        var thiswaiter=this;
            this.state=1;
            //点菜和上菜都要花1秒
            var pro=new Promise(function(resolve){
                setTimeout(resolve,1000,thiswaiter);
            });
            //点菜
            if(flag==0){
                thiswaiter.move(1);
                pro.then(function(thiswaiter){
                    //点菜               
                    w.forEach(ww => {
                        console.log(ww.guest.seat+"点菜"+ww.name);
                        var flag=false;
                        for(var i=0;i<dishtodo.length;i++){
                            if(dishtodo[i][0].name==ww.name){
                                dishtodo[i].push(ww);
                                flag=true;
                            }
                        }
                        if(!flag){
                            dishtodo.push(new Array (ww) );
                        }                  
                        myrestaurant.money-=ww.cost;
                    });
                    renewmoney();//************************************************
                    gueststate(w[0].guest);//************************************************
                    dishstate();//************************************************
                    thiswaiter.state=0;
                    cookdish(); //************************************************
                });       
            }
            //上菜
            else{
                thiswaiter.move(1);                                           
                pro.then(function(thiswaiter){
                    console.log("上菜ing");
                    thiswaiter.move(-1);
                    //上菜
                    while(dishtoserve.length!=0){                       
                        var thisdish=dishtoserve.shift();
                        console.log("上菜"+thisdish.name);
                        thisdish.guest.dishtoeat.push(thisdish);//************************************************
                                
                        if(thisdish.guest.eating==false){
                            setTimeout(thisdish.guest.eat(),1);//************************************************
                        }
                        //这里有问题！！！
                        // if(dishtodo.length!=0 || mychef.cooking==true){
                            //thiswaiter.move(1);  
                        // }     
                    }
                    console.log("上完了");
                    thiswaiter.state=0;
                });     
            }
    };

    waiter.prototype.move=function(d){
        var waiterimg=document.getElementById("waiter").getElementsByTagName("img")[0];
        //d=1表示去向上移动找厨师，d=-1表示向下移动找顾客
        if(d==1){
            waiterimg.style.marginTop="0px";
            //可以，但是有时候有问题
            // var up = setInterval(() => {
            //     var now=parseInt(waiterimg.style.marginTop.substring(0,waiterimg.style.marginTop.length-2));
            //     if(now<=0)
            //         clearInterval(up);
            //     if(isNaN(now)){
            //         waiterimg.style.marginTop="6px";
            //     }
            //     else {
            //         waiterimg.style.marginTop=now-6+"px";
            //     }
            // }, 100);
        }
        else{
            waiterimg.style.marginTop="60px";
            //可以，但是有时候有问题
            // var down = setInterval(() => {
            //     var now=parseInt(waiterimg.style.marginTop.substring(0,waiterimg.style.marginTop.length-2));
            //     if(now>=60)
            //         clearInterval(down);
            //     if(isNaN(now)){
            //         waiterimg.style.marginTop="6px";
            //     }
            //     else {
            //         waiterimg.style.marginTop=now+6+"px";
            //     }
            // }, 100);
        }
    }