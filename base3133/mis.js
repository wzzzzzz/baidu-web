let sourceData = [{
    product: "手机",
    region: "华东",
    sale: [120, 100, 140, 160, 180, 185, 190, 210, 230, 245, 255, 270]
}, {
    product: "手机",
    region: "华北",
    sale: [80, 70, 90, 110, 130, 145, 150, 160, 170, 185, 190, 200]
}, {
    product: "手机",
    region: "华南",
    sale: [220, 200, 240, 250, 260, 270, 280, 295, 310, 335, 355, 380]
}, {
    product: "笔记本",
    region: "华东", 
    sale: [50, 60, 80, 110, 30, 20, 70, 30, 420, 30, 20, 20]
}, {
    product: "笔记本",
    region: "华北",
    sale: [30, 35, 50, 70, 20, 15, 30, 50, 710, 130, 20, 20]
}, {
    product: "笔记本",
    region: "华南",
    sale: [80, 120, 130, 140, 70, 75, 120, 90, 550, 120, 110, 100]
}, {
    product: "智能音箱",
    region: "华东",
    sale: [10, 30, 4, 5, 6, 5, 4, 5, 6, 5, 5, 25]
}, {
    product: "智能音箱",
    region: "华北",
    sale: [15, 50, 15, 15, 12, 11, 11, 12, 12, 14, 12, 40]
}, {
    product: "智能音箱",
    region: "华南",
    sale: [10, 40, 10, 6, 5, 6, 8, 6, 6, 6, 7, 26]
}];

var regions=document.getElementById("regioncheckbox").childNodes;
var products=document.getElementById("productcheckbox").childNodes;
var table=document.getElementById("table");
var chooseregions=new Array(1,0,0);
var chooseproducts=new Array(1,0,0);
initcheck();
initclickevent();
//思路2————默认显示一行
var datashow=new Array(1,0,0,0,0,0,0,0,0);
changetablediasplay(1,1);
//思路1————默认显示一行
//var data=[];
// data.push(sourceData[0]);
// createtablecontent(1,1);

//初始化画布
initcanvas();
//初始化canvas画全部数据
drawallline();

function initcheck(){
    //默认不勾选
    regions[3].checked=false;
    regions[5].checked=false;
    regions[7].checked=false;
    products[3].checked=false;
    products[5].checked=false;
    products[7].checked=false;       
}

function initclickevent(){
    //添加勾选事件
    regions[1].onclick=checkchooseallregion;
    regions[3].onclick=checkchooseallregion;
    regions[5].onclick=checkchooseallregion;
    regions[7].onclick=chooseallregion;
    products[1].onclick=checkchooseallproduct;
    products[3].onclick=checkchooseallproduct;
    products[5].onclick=checkchooseallproduct;
    products[7].onclick=chooseallproduct;   
}

function checkchooseallregion(){
    var thisvalue =this.value;
    if(!this.checked){
        if(!(regions[1].checked || regions[3].checked || regions[5].checked)){
            this.checked=true;
            return;
        }
        chooseregions[thisvalue]=0;
        regions[7].checked=false;
    }
    else {
        chooseregions[thisvalue]=1;
        if(regions[1].checked&&regions[3].checked&&regions[5].checked){
            regions[7].checked=true;
        }
    }
    //console.log(chooseregions);
    changedata();
}
function chooseallregion(){
    var thischeck=this.checked;
    if(thischeck==false){
        this.checked=true;
    }
    else{
        regions[1].checked=thischeck;
        regions[3].checked=thischeck;
        regions[5].checked=thischeck;
        chooseregions[0]=1;
        chooseregions[1]=1;
        chooseregions[2]=1;
    }
    //console.log(chooseregions);
    changedata();
}
function checkchooseallproduct(){
    var thisvalue =this.value;
    if(!this.checked){
        if(!(products[1].checked || products[3].checked || products[5].checked)){
            this.checked=true;
            return;
        }
        chooseproducts[thisvalue]=0;
        products[7].checked=false;
    }
    else {
        chooseproducts[thisvalue]=1;
        if(products[1].checked&&products[3].checked&&products[5].checked){
            products[7].checked=true;
        }
    }
    //console.log(chooseproducts);
    changedata();
}
function chooseallproduct(){
    var thischeck=this.checked;
    if(thischeck==false){
        this.checked=true;
    }
    else{
        products[1].checked=thischeck;
        products[3].checked=thischeck;
        products[5].checked=thischeck;
        chooseproducts[0]=1;
        chooseproducts[1]=1;
        chooseproducts[2]=1;
    }
    //console.log(chooseproducts);
    changedata();
}
function changedata(){
    // console.log(chooseregions);
    // console.log(chooseproducts);
    data=[];
    var pcount=0;
    var rcount=0;
    for(var i=0;i<3;i++){
        if(chooseregions[i]==1){
            for(var j=0;j<3;j++){
                var t=i+3*j;
                if(chooseproducts[j]==1){
                    data.push(sourceData[t]);
                    datashow[t]=1;
                }
                else{
                    datashow[t]=0;
                }
            }
            rcount++;
        }
        else{
            for(var j=0;j<3;j++){
                var t=i+3*j;
                datashow[t]=0;
            }
        }
    }
    pcount=data.length/rcount;
    //思路1————每次全部清空重新写表格
    //cleartablecontent();
    //createtablecontent(pcount,rcount);
    //思路2————每次只改变对应行的display
    changetablediasplay(pcount,rcount);
}
function changetablediasplay(pcount,rcount){
    var tablehead1=document.getElementById("tablehead1");
    var tablehead2=document.getElementById("tablehead2");    
    var trs=table.childNodes[1].childNodes;  
    for(var i=1;i<10;i++){
        if(datashow[i-1]==0){
            trs[2*i].style.display="none";
        }
        else{
            trs[2*i].style.display="table-row";
        }
    }
    if(pcount==1||rcount>1){
        tablehead1.innerHTML="商品";
        tablehead2.innerHTML="地区";
        //用来标记跨行格是否显示出来了
        var flag=false;
        for(var i=0;i<9;i++){
            tds=trs[2*i+2].childNodes;
            producttd=tds[1];
            regiontd=tds[3];
            //然后交换两个的文字
            producttd.innerHTML=sourceData[i].product;
            regiontd.innerHTML=sourceData[i].region;
            //检查chooseregions来分别处理display
            if(i%3==0){
                flag=false;
            }
            if(chooseregions[i%3]==1&&flag==false){
                producttd.style.display="table-cell";
                producttd.style.backgroundColor="white";
                producttd.rowSpan=rcount;
                flag=true;
            }
            else{
                producttd.style.display="none";
            }
        }
    }
    else if(rcount==1){
        tablehead1.innerHTML="地区";
        tablehead2.innerHTML="商品";        
        var flag=false;
        for(var i=0;i<9;i++){
            tds=trs[2*i+2].childNodes;
            producttd=tds[1];
            regiontd=tds[3];
            //然后交换两个的文字
            producttd.innerHTML=sourceData[i].region;
            regiontd.innerHTML=sourceData[i].product;
            //检查chooseproducts来分别处理display
            if(i<3){
                flag=false;
            }
            if(chooseproducts[parseInt(i/3)]==1&&flag==false){
                producttd.style.display="table-cell";
                producttd.style.backgroundColor="white";
                producttd.rowSpan=pcount;
                flag=true;
            }
            else{
                producttd.style.display="none";
            }
        }
    }
}
//鼠标滑过表格的行
function mouseovertable(t) {
    //console.log(t.tagName);
    t.style.backgroundColor = "rgb(220,150,150)";
    //console.log(t.id);
    drawrectgraph(sourceData[t.id].sale);
    drawlinegraph(sourceData[t.id].sale);
    var line=document.getElementById("line");
    line.style.display="block";
    var lineall=document.getElementById("line-all");
    lineall.style.display="none";
}
//滑出行
function mouseouttable(t) {
    t.style.backgroundColor="white";
    var line=document.getElementById("line");
    line.style.display="none";
    var lineall=document.getElementById("line-all");
    lineall.style.display="block";
}

function drawrectgraph(sales){
    var svg=document.getElementById("svg");
    var rects=svg.getElementsByTagName("rect");
    
    for(var i=0;i<12;i++){
        var h=300-0.3*sales[i];
        //这里不能用.height或者.style.height来获得height值，可以用.attribute.height来获得，用.setAttribute('','')来修改
        rects[i].setAttribute('height',300-h)
        rects[i].setAttribute('y',h)
    }
}

function initcanvas(){
    var can=document.getElementById("line-graph");
    var ctx=can.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(50,50);
    ctx.lineTo(50,300);
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50,60);
    ctx.lineTo(550,60);
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50,120);
    ctx.lineTo(550,120);
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50,180);
    ctx.lineTo(550,180);
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50,240);
    ctx.lineTo(550,240);
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(50,300);
    ctx.lineTo(550,300);
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.stroke();

    ctx.font="15px Verdana";
    ctx.fillText("数量",35,40);
    ctx.fillText("月份",560,305);
    ctx.fillText("800",10,65);
    ctx.fillText("600",10,125);
    ctx.fillText("400",10,185);
    ctx.fillText("200",10,245);
    ctx.fillText("0",10,305);
    ctx.fillText("1月",60,320);
    ctx.fillText("2月",100,320);
    ctx.fillText("3月",140,320);
    ctx.fillText("4月",180,320);
    ctx.fillText("5月",220,320);
    ctx.fillText("6月",260,320);
    ctx.fillText("7月",300,320);
    ctx.fillText("8月",340,320);
    ctx.fillText("9月",380,320);
    ctx.fillText("10月",420,320);
    ctx.fillText("11月",460,320);
    ctx.fillText("12月",500,320);
}

function drawlinegraph(sales){
    var can=document.getElementById("line");
    //重置 canvas 宽高可以清空画布
    can.width=can.width;
    var ctx=can.getContext("2d");
    //console.log(sales);
    ctx.beginPath();
    ctx.arc(70,300-0.3*sales[0],3,0,Math.PI*2,true);
    for(var i=1;i<12;i++){
            var h=300-0.3*sales[i];
            ctx.lineTo(67+40*i,h);
            ctx.moveTo(73+40*i,h);
            ctx.arc(70+40*i,h,3,0,Math.PI*2,true);
    }
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();  
}

function drawallline(){
    var can=document.getElementById("line-all");
    var ctx=can.getContext("2d");
    //console.log(sales);
    sourceData.forEach(d => {
        var sales=d.sale;
        ctx.beginPath();
        ctx.arc(70,300-0.3*sales[0],3,0,Math.PI*2,true);
        for(var i=1;i<12;i++){
                var h=300-0.3*sales[i];
                ctx.lineTo(67+40*i,h);
                ctx.moveTo(73+40*i,h);
                ctx.arc(70+40*i,h,3,0,Math.PI*2,true);
        }
        ctx.strokeStyle="rgb(100,100,100)";
        ctx.stroke();
    }); 
}
//思路1
// function cleartablecontent(){
//     var alltrs=table.childNodes;
//     for(var i=2;i<alltrs.length;){
//         table.removeChild(alltrs[i]);
//     }
// }
// function createtablecontent(pcount,rcount){   
//     var tablehead1=document.getElementById("tablehead1");
//     var tablehead2=document.getElementById("tablehead2");

//     if(pcount==1||rcount>1){
//         tablehead1.innerHTML="商品";
//         tablehead2.innerHTML="地区";

//         var t=0;
//         for(var i=0;i<3;i++){
//             var done=0;
//             if(chooseproducts[i]==1){
//                 for(var j=0;j<3;j++){
//                     if(chooseregions[j]==1){
//                         t++;
//                         var trs=document.createElement("tr");
//                         if(done==0){                           
//                             var td1=document.createElement("td");
//                             var text1=document.createTextNode(sourceData[3*i].product);
//                             td1.appendChild(text1);
//                             td1.rowSpan=rcount;
//                             td1.scope="row";
//                             trs.appendChild(td1);
//                             done=1;
//                         }
                        
//                         table.appendChild(filltable(trs,sourceData[j].region,t));
//                     }
//                 }           
//             }
//         }
//     } 
//     else if(rcount==1){
//         tablehead1.innerHTML="地区";
//         tablehead2.innerHTML="商品";

//         var t=0;
//         for(var i=0;i<3;i++){
//             var done=0;
//             if(chooseregions[i]==1){
//                 for(var j=0;j<3;j++){
//                     if(chooseproducts[j]==1){
//                         t++;
//                         var trs=document.createElement("tr");
//                         if(done==0){                           
//                             var td1=document.createElement("td");
//                             var text1=document.createTextNode(sourceData[i].region);
//                             td1.appendChild(text1);
//                             td1.rowSpan=pcount;
//                             td1.scope="row";
//                             trs.appendChild(td1);
//                             done=1;
//                         }
                        
//                         table.appendChild(filltable(trs,sourceData[3*j].product,t));
//                     }
//                 }           
//             }
//         }
//     }
// }
// function filltable(trs,tdtext,t){
//     var td2=document.createElement("td");
//     var text2=document.createTextNode(tdtext);
//     td2.appendChild(text2);
//     trs.appendChild(td2);
//     for(var k=0;k<12;k++){
//         var td=document.createElement("td");
//         var text=document.createTextNode(data[t-1].sale[k]);
//         td.appendChild(text);
//         trs.appendChild(td);
//     }
//     return trs;
// }
