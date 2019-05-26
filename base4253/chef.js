    var chef = function (i,s){
        clerk.call(this,i,s);
        //0表示空闲，可以进行下一步，1表示非空闲，需要等待
        this.state=0;
        this.status=document.getElementById("chef").getElementsByTagName("div")[0];
    };
    chef.prototype=Object.create(clerk.prototype);
    chef.prototype.constructor =chef;
    chef.prototype.work=function(){
        //做菜
        if(dishtodo.length!=0){
            this.state=1;
            var cooking=dishtodo.shift();
            var args=new Object();
            args.chef=this;
            args.dishs=cooking;
            console.log("做菜"+cooking[0].name);
            dishstate(); //************************************************
            this.status.innerHTML="正在做："+ cooking[0].name;

            var pro=new Promise(function(resolve){
                setTimeout(resolve,cooking[0].cooktime*1000,args);
            });
            switch (cooking[0].name) {
                case "杂粮粥": pro.then(chefpromise);break; 
                case "卤面": pro.then(chefpromise); break;
                case "麻食": pro.then(chefpromise); break;
                case "油泼面": pro.then(chefpromise); break;
                case "洋芋擦擦": pro.then(chefpromise); break;
            }
        }
        else{
            this.status.innerHTML="空闲";
            this.state=0;
        }
    };

function chefpromise(args){ //只能传一个参数
    console.log("做好了"+args.dishs[0].name);
    args.chef.state=0;
    cookdish();
    args.dishs.forEach(d => {
        d.state=1;
        dishtoserve.push(d);//************************************************
        waiterwork(d,1);
        //mywaiter.work(c); //************************************************
    });      
}
