var createRestaurant=(function(){
    var instance=null;
    function restaurant(m,s,c){
        this.money=m;
        this.seat=s;
        this.clerk=c;//记录id
        console.log('restaurant is created!');
    };
    restaurant.prototype.hireclerk=function(c){
        this.clerk.push(c);
    };
    restaurant.prototype.fireclerk=function(c){
        for(var i=0;i<this.clerk.length;i++){
            if(this.clerk[i]==c.id){
                this.clerk.splice(i,1);
            }
        }
    };
    return{
        //单例模式
        getinstance: function(m,s,c){
            if(instance === null){
                instance=new restaurant(m,s,c);
            }
            return instance;
        }
    };
})();//之所以能保证对instance的检查，调用一次就非null，是因为他是自执行函数！！！关于自执行函数还有问题？？？？？？？？？


