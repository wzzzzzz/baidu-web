import './style.css';
import Icon from './icon.png';

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
//localStorage.clear();
var regions=document.getElementById("regioncheckbox").childNodes;
var products=document.getElementById("productcheckbox").childNodes;
var table=document.getElementById("table");
var chooseregions=new Array(1,0,0);
var chooseproducts=new Array(1,0,0);
var editingTDid="";

//思路2————默认显示一行
var datashow=new Array(1,0,0,0,0,0,0,0,0);
changetablediasplay(1,1);
//思路1————默认显示一行
//var data=[];
// data.push(sourceData[0]);
// createtablecontent(1,1);
//初始化勾选
initcheck();
//初始化添加click时间
initclickevent();
//添加编辑
initoverevent();
//更新显示的数据
updatetddata();
//初始化处理hash
hashchange();
window.onhashchange=hashchange;

//初始化画布
initcanvas();
//初始化canvas画全部数据
drawallline();

//初始化************************************************************************
//初始化勾选情况
function initcheck(){
    //默认不勾选
    regions[3].checked=false;
    regions[5].checked=false;
    regions[7].checked=false;
    products[3].checked=false;
    products[5].checked=false;
    products[7].checked=false;
    if(window.location.hash==""){
        window.location.hash="100100";
    }
}
//初始化点击选择//这里是不是放在html里做更好？
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
//初始化鼠标滑过单元格对应的事件
function initoverevent(){
    for(var i=0;i<9;i++){
        var thistd=document.getElementById(i);
        var trchilds=thistd.childNodes;
        //console.log(trchilds.length);
        for(var j=0;j<12;j++){
            var thisitem;
            if(j>9){
                thisitem=i+"-"+j;
            }
            else thisitem=i+"-"+"0"+j;
            trchilds[j+5].id=thisitem;
            trchilds[j+5].onmouseover=inTD;
            trchilds[j+5].onmouseout=outTD;
            trchilds[j+5].childNodes[0].style.display="inline-block";
            var icon=document.createElement("img");
            icon.src=Icon;
            icon.style.width="10px";
            icon.style.height="15px";
            icon.onclick=startedit;
            //trchilds[j+4].style.margin-left="5px";
            trchilds[j+5].appendChild(icon);
            icon.style.display="none";
            icon.style.float="right";
            // icon.style.position="relative";
            // icon.style.left="20px";

            var canclebut=document.createElement("button");
            canclebut.style.padding="3px";
            canclebut.innerHTML="取消";
            canclebut.onclick=cancleedit;
            trchilds[j+5].appendChild(canclebut);
            canclebut.style.display="none";
            var savebut=document.createElement("button");
            savebut.style.padding="3px";
            savebut.innerHTML="保存";
            savebut.onclick=savedata;
            savebut.style.display="none";
            trchilds[j+5].appendChild(savebut);
        }
    }
    //在单元格外点击就取消编辑
    document.onmousedown=function(e){
        if(editingTDid!=""){
            if(!(e.target.tagName=="BUTTON"||(e.target.tagName=="INPUT"&&e.target.parentNode.tagName=="TD"))){
                //console.log(e.target.tagName);
                //console.log(e.target.parentNode.tagName);
                cancleedit(document.getElementById(editingTDid));
            }
        }
    };
}
//每次打开时更新显示的单元格数据及柱状图
function updatetddata(){
    for(var i=0;i<9;i++){
        var trchilds=document.getElementById(i).childNodes;
        for(var j=5;j<17;j++){
            var thisitem=trchilds[j].id;
            //console.log(trchilds[j].id);
            if(localStorage.length!=0){
                //console.log("1");
                trchilds[j].childNodes[0].innerHTML=localStorage.getItem(thisitem);
            }
            else{
                console.log("nolocaldata");
                trchilds[j].childNodes[0].innerHTML=sourceData[i].sale[j-5];
            }
        }
    }
    if(localStorage.length!=0){
        drawrectgraph(0);
    }
}
//初始化处理hash
function hashchange(){
    console.log("hashchange");
    var h=window.location.hash;
    if(h!=""){
        var flag=true;
        for(var i=1;i<4;i++){
            if(h[i]=="1"){
                chooseregions[i-1]=1;
                regions[i*2-1].checked=true;
            }
            else{
                chooseregions[i-1]=0;
                regions[i*2-1].checked=false;
                flag=false;
            }
        }
        if(flag) regions[7].checked=true;
        else regions[7].checked=false;
        flag=true;
        for(var i=4;i<7;i++){
            if(h[i]=="1"){
                chooseproducts[i-4]=1;
                products[i*2-7].checked=true;
            }
            else{
                chooseproducts[i-4]=0;
                products[i*2-7].checked=false;
                flag=false;
            }
        }
        if(flag) products[7].checked=true;
        else products[7].checked=false;
        changedata();
    }
}
//勾选处理**********************************************************************
//地区栏检查是否勾选全部
function checkchooseallregion(){
    var thisvalue =parseInt(this.value);
    if(!this.checked){
        if(!(regions[1].checked || regions[3].checked || regions[5].checked)){
            this.checked=true;
            return;
        }
        chooseregions[thisvalue]=0;
        var h=window.location.hash;
        var hh=h.substring(0,thisvalue+1)+"0"+h.substr(thisvalue+2);
        //console.log(hh);
        window.location.hash=hh;
        regions[7].checked=false;
    }
    else {
        chooseregions[thisvalue]=1;
        var h=window.location.hash;
        var hh=h.substring(0,thisvalue+1)+"1"+h.substr(thisvalue+2);
        //console.log(hh);
        window.location.hash=hh;
        if(regions[1].checked&&regions[3].checked&&regions[5].checked){
            regions[7].checked=true;
        }
    }
    //console.log(chooseregions);
    changedata();
}
//选择了所有的地区
function chooseallregion(){
    var thischeck=this.checked;
    if(thischeck==false){
        //console.log("1");
        //如果原本就选中的，点了之后不变化
        this.checked=true;
    }
    else{
        regions[1].checked=thischeck;
        regions[3].checked=thischeck;
        regions[5].checked=thischeck;
        chooseregions[0]=1;
        chooseregions[1]=1;
        chooseregions[2]=1;
        var h=window.location.hash;
        var hh="#111"+h.substr(4);
        //console.log(hh);
        window.location.hash=hh;
    }
    //console.log(chooseregions);
    changedata();
}
//产品栏勾选全部
function checkchooseallproduct(){
    var thisvalue =parseInt(this.value);
    if(!this.checked){
        if(!(products[1].checked || products[3].checked || products[5].checked)){
            this.checked=true;
            return;
        }
        chooseproducts[thisvalue]=0;
        var h=window.location.hash;
        var hh=h.substring(0,thisvalue+4)+"0"+h.substr(thisvalue+5);
        //console.log(hh);
        window.location.hash=hh;
        products[7].checked=false;
    }
    else {
        chooseproducts[thisvalue]=1;
        var h=window.location.hash;
        var hh=h.substring(0,thisvalue+4)+"1"+h.substr(thisvalue+5);
        //console.log(hh);
        window.location.hash=hh;
        if(products[1].checked&&products[3].checked&&products[5].checked){
            products[7].checked=true;
        }
    }
    //console.log(chooseproducts);
    changedata();
}
//选择了所有的产品
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
        var h=window.location.hash;
        var hh=h.substring(0,5)+"111";
        //console.log(hh);
        window.location.hash=hh;
    }
    //console.log(chooseproducts);
    changedata();
}
//改变勾选时改变数据
function changedata(){
    // console.log(chooseregions);
    // console.log(chooseproducts);
    //data=[];
    var pcount=0;
    var rcount=0;
    for(var i=0;i<3;i++){
        if(chooseregions[i]==1){
            for(var j=0;j<3;j++){
                var t=i+3*j;
                if(chooseproducts[j]==1){
                    //data.push(sourceData[t]);
                    pcount++;
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
    pcount=pcount/rcount;
    //思路1————每次全部清空重新写表格
    //cleartablecontent();
    //createtablecontent(pcount,rcount);
    //思路2————每次只改变对应行的display
    changetablediasplay(pcount,rcount);
}
//改变勾选时改变商品和地区的顺序
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
            var tds=trs[2*i+2].childNodes;
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
            var tds=trs[2*i+2].childNodes;
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
//编辑数据***********************************************************************
//鼠标滑过表格的行
function mouseovertable(t) {
    t.style.backgroundColor = "rgb(220,150,150)";
    if(localStorage.length!=0){
        drawrectgraph(t.id);
        drawlinegraph(t.id);
    }
    else{
        drawrectgraph(t.id);
        drawlinegraph(t.id);
    }
    var line=document.getElementById("line");
    line.style.display="block";
    var lineall=document.getElementById("line-all");
    lineall.style.display="none";
}
//鼠标滑出表格的行
function mouseouttable(t) {
    t.style.backgroundColor="white";
    var line=document.getElementById("line");
    line.style.display="none";
    var lineall=document.getElementById("line-all");
    lineall.style.display="block";
}

var eles=document.getElementsByClassName("mouseOverOut");
for(var k=0;k<eles.length;k++){
    eles[k].addEventListener("mouseover",function(){ mouseovertable(this);});
    eles[k].addEventListener("mouseout",function(){ mouseouttable(this);});
}


//鼠标滑过单元格，显示小铅笔
function inTD(){
    //console.log(this.innerHTML);
    // console.log(this.childNodes[0].tagName);
    // console.log(this.childNodes[1].tagName);
    var firstchildname=this.childNodes[0].tagName;
    //console.log(firstchildname);
    if(firstchildname=="DIV"){
        //this.childNodes[0].style.display="inline-block";
        this.childNodes[1].style.display="inline-block";
    }
}
//滑出单元格不显示小铅笔
function outTD(){
    this.childNodes[1].style.display="none";
}
//点击小铅笔编辑数据
function startedit(){
    if(editingTDid!=""){
        cancleedit(document.getElementById(editingTDid));
    }
    var thistd=this.parentNode;
    editingTDid=thistd.id;
    //console.log(thistd.innerHTML);//这里我发现，td节点的html打印出来是这样的，就把子节点全都作为innerhtml了，结果测试后发现别的节点也都这样，而且打印出来的innerhtml还是有格式的，换行之类的也包括在里面<div>120</div><img src="icon.jpg" style="width: 10px; height: 15px; display: inline-block; float: right;">
    var tdchilds=thistd.childNodes;
    //console.log(tdchilds.length);
    tdchilds[1].style.display="none";
    var tdinput=document.createElement("input");
    tdinput.value=tdchilds[0].innerHTML;
    tdinput.style.width="40px";
    thistd.replaceChild(tdinput,tdchilds[0]);
    tdchilds[2].style.display="inline-block";
    tdchilds[3].style.display="inline-block";
    tdinput.onkeyup=function(e){
        if(e.keyCode==13){
            //console.log(this.parentNode);
            savedata(this.parentNode);
        }
        if(e.keyCode==27){
            cancleedit(this.parentNode);
        }
    };
}
//点击保存按钮保存数据
function savedata(t){
    var tr;
    if(t.tagName=="TD"){
        tr=t;
    }
    else{
        tr=this.parentNode;
    }
    //console.log(tr);
    var index=tr.id;
    var tdchilds=tr.childNodes;
    var inputvalue=tr.childNodes[0].value;
    if(isNaN(inputvalue)){
        alert("请输入数字！");
        cancleedit(tr);
    }
    else{
        if(localStorage.length!=0){
            //console.log(localStorage.getItem(index));
            localStorage.setItem(index,inputvalue);
            //console.log(localStorage.getItem(index));
        }
        else{
            savelocalstorage();
            localStorage.setItem(index,inputvalue);
        }
        //把input换成div
        var tddiv=document.createElement("DIV");
        tddiv.style.display="inline-block";
        tddiv.innerHTML=inputvalue;
        tr.replaceChild(tddiv,tdchilds[0]);
        //把后面两个button不显示
        tr.childNodes[2].style.display="none";
        tr.childNodes[3].style.display="none";
        //更新图表
        drawallline();
    }
}
//取消编辑数据
function cancleedit(t){
    var tr;
    if(t.tagName=="TD"){
        tr=t;
    }
    else{
        tr=this.parentNode;
    }
    var index=tr.id;
    var tdchilds=tr.childNodes;
    //把input换成div
    var tddiv=document.createElement("DIV");
    tddiv.style.display="inline-block";
    if(localStorage.length!=0){
        tddiv.innerHTML=localStorage.getItem(index);
    }
    else{
        if(index[2]=="0")
            tddiv.innerHTML=sourceData[index].sale[index[3]];
        else {
            var saleindex=10+1*index[3];
            tddiv.innerHTML=sourceData[index].sale[index[saleindex]];
        }
    }
    tr.replaceChild(tddiv,tdchilds[0]);
    //把后面两个button不显示
    tr.childNodes[2].style.display="none";
    tr.childNodes[3].style.display="none";
}
//第一次保存localstorage
function savelocalstorage(){
    for(var i=0;i<9;i++){
        var trchilds=document.getElementById(i).childNodes;
        for(var j=5;j<17;j++){
            var thisitem=trchilds[j].id;
            var value=trchilds[j].childNodes[0].innerHTML;
            localStorage.setItem(thisitem,value);
        }
    }
    console.log(localStorage);
    // if(localStorage.length!=0)
    //     console.log("1");
    // else console.log("0");
}
//图表**************************************************************************
//改变画的柱状图的柱子高度
function drawrectgraph(ind){
    var svg=document.getElementById("svg");
    var rects=svg.getElementsByTagName("rect");
    var sales;
    if(localStorage.length!=0){
        var sales=new Array();
        var trchilds=document.getElementById(ind).childNodes;
        for(var j=5;j<17;j++){
            var thisitem=trchilds[j].id;
            sales.push(localStorage.getItem(thisitem));
        }
    }
    else sales=sourceData[parseInt(ind)].sale;
    for(var i=0;i<12;i++){
        var h=300-0.3*parseInt(sales[i]);
        //这里不能用.height或者.style.height来获得height值，可以用.attribute.height来获得，用.setAttribute('','')来修改
        rects[i].setAttribute('height',300-h)
        rects[i].setAttribute('y',h)
    }
}
//初始化画布
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
//在画布上画当前行的折线图
function drawlinegraph(ind){
    var can=document.getElementById("line");
    //重置 canvas 宽高可以清空画布
    can.width=can.width;
    var ctx=can.getContext("2d");
    //console.log(sales);
    var trchilds=document.getElementById(ind).childNodes;
    if(localStorage.length!=0){
        var index=ind+"-00";
        var value0=localStorage.getItem(index);
        ctx.beginPath();
        ctx.arc(70,300-0.3*value0,3,0,Math.PI*2,true);
        for(var j=6;j<17;j++){
            var thisitem=trchilds[j].id;
            var value=localStorage.getItem(thisitem);
            var h=300-0.3*parseInt(value);
            ctx.lineTo(67+40*(j-5),h);
            ctx.moveTo(73+40*(j-5),h);
            ctx.arc(70+40*(j-5),h,3,0,Math.PI*2,true);
        }
    }
    else{
        var sales=sourceData[ind].sale;
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
    ctx.strokeStyle="rgb(100,100,100)";
    ctx.stroke();
}

//在画布上画所有行的折线图
function drawallline(){
    var can=document.getElementById("line-all");
    //重置 canvas 宽高可以清空画布
    can.width=can.width;
    var ctx=can.getContext("2d");
    //console.log(sales);
    if(localStorage.length!=0){
        for(var i=0;i<9;i++){
            var trchilds=document.getElementById(i).childNodes;
            var thisitem;
            thisitem=i+"-00";
            ctx.beginPath();
            ctx.arc(70,300-0.3*localStorage.getItem(thisitem),3,0,Math.PI*2,true);
            
            for(var j=6;j<17;j++){
                var thisitem=trchilds[j].id;
                var value=localStorage.getItem(thisitem);
                var h=300-0.3*parseInt(value);
                ctx.lineTo(67+40*(j-5),h);
                ctx.moveTo(73+40*(j-5),h);
                ctx.arc(70+40*(j-5),h,3,0,Math.PI*2,true);
            }
            ctx.strokeStyle="rgb(100,100,100)";
            ctx.stroke();
        }
    }
    else{
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
