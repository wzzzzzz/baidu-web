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
                // thiswaiter.move(1,-1);
                // //移动的过程中正好等待后面的进行
                // pro.then(function(thiswaiter){
                //     //点菜               
                //     w.forEach(ww => {
                //         console.log(ww.guest.seat+"点菜"+ww.name);
                //         var f=false;
                //         for(var i=0;i<dishtodo.length;i++){
                //             if(dishtodo[i][0].name==ww.name){
                //                 dishtodo[i].push(ww);
                //                 f=true;
                //             }
                //         }
                //         if(!f){
                //             dishtodo.push(new Array (ww) );
                //         }                  
                //         myrestaurant.money-=ww.cost;
                //     });
                //     renewmoney();//************************************************
                //     gueststate(w[0].guest);//************************************************
                //     dishstate();//************************************************
                //     thiswaiter.state=0;
                //     cookdish();//************************************************
                // });       
            }
            //上菜，一次上一个客人的
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
                    //console.log("上菜ing");
                    //上菜
                    while(dishs.length!=0){                       
                        var thisdish=dishs.shift();
                        //console.log("上菜"+thisdish.name);
                        thisguest.dishtoeat.push(thisdish);//************************************************
                    }
                    gueststate(thisguest);                                                            
                    if(thisdish.guest.eating==false){
                        setTimeout(thisguest.eat(),1);//************************************************
                    }
                    
                    var i=0;
                    for(i=0;i<cheflist.length;i++){
                        if(cheflist[i].state==1){
                            break;
                        }
                    }
                    //if(dishtodo.length!=0||i>0){
                        //console.log("上完了，回厨房");
                        //然后回到厨房
                        var pro1=new Promise(function(resolve){
                            setTimeout(resolve,1000,thiswaiter);
                        });
                        thiswaiter.move(1,-1);
                        pro1.then(function(thiswaiter){                  
                            thiswaiter.state=0; 
                        });
                    //}
                    // else{   
                    //     thiswaiter.state=0; 
                    // }
                });     
            }
    };

    var pad= getComputedStyle(document.getElementById("dininghall"),null)['padding-right'];
    var tableall = document.getElementById("dininghall").clientWidth-pad.substr(0,pad.length-2)*2; 
    var table=tableall/5;
    var servepos = tableall/2-29;
    
    waiter.prototype.move=function(h,w){
        servepos = tableall/2-waiterlist.length*29;       
        var ind=parseInt(this.id[1]);
        var thisservepos=servepos+ind*70;
        var waiterimg=document.getElementById("waiter").getElementsByTagName("img")[ind];
        //d=1表示去向上移动找厨师,此时w代表chef的id，d=-1表示向下移动找顾客，此时w代表座位号seat
        if(h==1){
            //当前位置的左margin
            var mleft=getComputedStyle(waiterimg,null)['margin-left'];
            var nowleft=parseFloat(mleft.substring(0,mleft.length-2));
            var left=(nowleft-thisservepos)/10;
            var i=0;
            var up = setInterval(() => {
                i++;
                // var mleft=getComputedStyle(waiterimg,null)['margin-left'];
                // var now=parseFloat(mleft.substring(0,mleft.length-2));
                // if(now>1000){
                //     console.log("向上飞出去了！！！！！！！！！！！");
                //     console.log(now);
                //     console.log(i);
                // }
                if(i>10){
                    // waiterimg.style.marginLeft=thisservepos+"px";
                    // waiterimg.style.marginTop="0px";
                    clearInterval(up);
                    return;
                }
                waiterimg.style.marginLeft=nowleft-left*i+"px";
                waiterimg.style.marginTop=55-5.5*i+"px";
            }, 50);
        }
        else{
            var left = (w * table-thisservepos)/10;
            var j=0;                              
            var down = setInterval(() => {
                j++;
                // var mleft=getComputedStyle(waiterimg,null)['margin-left'];
                // var nowleft=parseFloat(mleft.substring(0,mleft.length-2));
                // if(nowleft>1000){
                //     console.log("向下飞出去了！！！！！！！！！！！");
                //     console.log(nowleft);
                //     console.log(i);
                // }
                if(j>10){
                    // waiterimg.style.marginLeft=w * table+"px";
                    // waiterimg.style.marginTop=55+"px";
                    clearInterval(down);
                    return;
                }
                waiterimg.style.marginLeft=thisservepos+left*j+"px";
                waiterimg.style.marginTop=5.5*j+"px";
            }, 50);
        }
    }