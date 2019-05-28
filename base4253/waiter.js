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
                setTimeout(resolve,700,thiswaiter);
            });
            //点菜
            if(flag==0){
                thiswaiter.move(1,-1);
                //移动的过程中正好等待后面的进行
                pro.then(function(thiswaiter){
                    //点菜               
                    w.forEach(ww => {
                        console.log(ww.guest.seat+"点菜"+ww.name);
                        var f=false;
                        for(var i=0;i<dishtodo.length;i++){
                            if(dishtodo[i][0].name==ww.name){
                                dishtodo[i].push(ww);
                                f=true;
                            }
                        }
                        if(!f){
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
            //上菜//这里还是有点问题！上菜每次都要移动，应该一次上一个客人的，后面的下一个人上会比较好
            else{
                var dishs=new Array();
                dishs.push(dishtoserve.shift());

                //移动的过程中正好等待后面的进行
                thiswaiter.move(-1,dishs[0].guest.seat);

                while(dishtoserve.length!=0){
                    if(dishtoserve[0].guest==dishs[0].guest)
                        dishs.push(dishtoserve.shift());
                    else break;
                }
                if(dishtoserve.length!=0)
                    setTimeout(waiterwork(null,1),1);
                var thisguest=dishs[0].guest;
                pro.then(function(thiswaiter){
                    console.log("上菜ing");
                    //上菜
                    while(dishs.length!=0){                       
                        var thisdish=dishs.shift();
                        console.log("上菜"+thisdish.name);
                        thisguest.dishtoeat.push(thisdish);//************************************************
                    }                                                            
                    if(thisdish.guest.eating==false){
                        setTimeout(thisguest.eat(),1);//************************************************
                    }
                    console.log("上完了，回厨房");
                    //然后回到厨房
                    var pro1=new Promise(function(resolve){
                        setTimeout(resolve,700,thiswaiter);
                    });
                    thiswaiter.move(1,-1);
                    pro1.then(function(thiswaiter){
                        //这里有问题！！！
                        // if(dishtodo.length!=0 || mychef.cooking==true){
                            //thiswaiter.move(1);  
                        // } 
                       
                        thiswaiter.state=0; 
                    });
                });     
            }
    };

    waiter.prototype.move=function(h,w){
        var ind=parseInt(this.id[1]);
        var waiterimg=document.getElementById("waiter").getElementsByTagName("img")[ind];
        //d=1表示去向上移动找厨师,此时w代表chef的id，d=-1表示向下移动找顾客，此时w代表座位号seat
        if(h==1){
            console.log("找厨师");
            //waiterimg.style.marginTop="0px";
            waiterimg.style.marginLeft=(100*ind).toString() + "px";
            //可以，但是有时候有问题
            var up = setInterval(() => {
                var mtop=getComputedStyle(waiterimg,null)['margin-top'];
                var nowtop=parseInt(mtop.substring(0,mtop.length-2));
                if(nowtop<=5){
                    waiterimg.style.marginTop="0px";
                    clearInterval(up);
                    return;
                }
                waiterimg.style.marginTop=nowtop-7.5+"px";
            }, 50);
        }
        else{
            console.log("找客人");
            //waiterimg.style.marginTop="75px";
            var left = w * table;            
            //可以，但是有时候有问题
            var down = setInterval(() => {
                var mtop=getComputedStyle(waiterimg,null)['margin-top'];
                var nowtop=parseInt(mtop.substring(0,mtop.length-2));
                //var mleft=getComputedStyle(waiterimg,null)['margin-left'];
                //var nowleft=parseInt(mleft.substring(0,mleft.length-2));
                if(nowtop>=70){
                    waiterimg.style.marginTop="75px";
                    clearInterval(down);
                    return;
                }
                //waiterimg.style.marginLeft=mleft+left/10+"px";
                waiterimg.style.marginTop=nowtop+7.5+"px";
            }, 50);
        }
    }