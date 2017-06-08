//窗口加载方法
window.onload=init;
//获取鼠标的参数
window.onmousemove=MouseMove;
//获取键盘按键参数
window.onkeydown=KeyDown;
//创建全局变量
var game_bg,ball,board;
var boardX=0;//挡板的坐标，默认为0
var boardY=600;
//创建一个数组，用于存放砖块
var breakers=[];
//var breakers=new Array();
var cW=1024;
var cH=768;
//小球的移动速度
var vx=8;
var vy=-8;
//小球的初始化位置
var ballX=400;
var ballY=500;
var context;//设置画笔为全局变量
var i=0;
var mp;
var score=0;
var p1;
//游戏入口
function init(){
	log("进入游戏...");
	//找到游戏画布
	var canvas=document.getElementById("canvas-game");
	//找到画布中的画笔，通过画笔在画板上绘制
	 context=canvas.getContext("2d");
	//创建一个可以存放图片的容器
	//game_bg= new Image();
	//game_bg.src="img/image/bg.png";//引入一张图片
	//context.drawImage(game_bg,0,0);//绘制的方法
	game_bg=AddImage("img/image/bg.png");
	board=AddImage("img/image/board.png");
	ball= AddImage("img/image/ball.png");
	CreaterBreaker();//创建砖块
	mp=document.getElementById("mp3");
	p1=document.getElementById("tt");
	//breakers.splice(0,1);//第一个参数从下标多少开始，第二饿参数是删除几个
	//定时器,1s刷新60次
	setInterval(GameTick,1000/50);	
}
//刷新机制的方法
function GameTick(){
	log("刷新第"+(i++)+"次")
	cleanScreen();//每次刷新界面之前，需要清空当前屏幕
	context.drawImage(game_bg,0,0);//将图片绘制到画布上
	context.drawImage(board,boardX,boardY);
	//context.drawImage(item,20,90);
	updateball();//小球更新
	updataBreakers();//绘制砖块，更新砖块
	//小球绘制,顺序会影响遮罩关系
	context.drawImage(ball,ballX,ballY);
	//检测挡板和小球的碰撞
	Testboardandball();
	Testbreakerandball();
}
function Testbreakerandball(){
	for (var i=breakers.length-1;i>=0;i--){
		var item=breakers[i];
		var hit=HitTestpoint(item.x,item.y+ball.height,197,70,ballX,ballY);
		if(hit){
			mp.play();
			vy*=-1;
			breakers.splice(i,1);
			p1.innerText="score:"+(++score);
			break;
		}
	}	
}
function Testboardandball(){
	var hit=HitTestpoint(boardX-ball.width,boardY-ball.height,board.width+ball.width,board.height+ball.height,ballX,ballY);
	if (hit) {
		ballY=boardY-ball.height;
		vy*=-1;
	} 
}
//满足碰撞的条件
//x1,y1挡板的坐标,w1,h1为挡板的宽高,x2,y2为小球坐标
function HitTestpoint(x1,y1,w1,h1,x2,y2){
	if(x2>=x1&&x2<=x1+w1&&y2>=y1&&y2<=y1+18){	
		return true;
	}else{
		return false;
	}
}
function updataBreakers(){
	for (var i=0;i<breakers.length;i++) {
		var item=breakers[i];//item:item,x:20+198*i,y:100
		context.drawImage(item.item,item.x,item.y);
	}
}
/*var Screen = {
        welcome: function() {
            this.text = 'CANVAS RICOCHET';
            this.textSub = 'Click To Start';
            this.textColor = 'white';
            this.create();//调用本身的图像绘制方法
        },
        create: function() {//具体绘制的方法
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, Game.width, Game.height);
            ctx.fillStyle = this.textColor;
            ctx.textAlign = 'center';
            ctx.font = '40px helvetica, arial';
            ctx.fillText(this.text, Game.width / 2, Game.height / 2);
            ctx.fillStyle = '#999999';
            ctx.font = '20px helvetica, arial';
            ctx.fillText(this.textSub, Game.width / 2, Game.height / 2 + 30);
        },
        gameover: function() {//游戏结束画面的设置
            this.text = 'Game Over';
            this.textSub = 'Click To Retry';
            this.textColor = 'red';
            this.create();//调用本身的图像绘制方法
        }
    };*/
function CreaterBreaker(){
	for (var j=0;j<4;j++) {
	    //breakers.push({item:item,x:20,y:100+70*i});
	for (var i=0;i<5;i++) {
		//Math.round(Math.random(*6+4))
		var item=AddImage("img/image/"+(4+j)+".png");
		//如何把砖块的坐标保存到数组中
		//item.x=20+197*i;
		//item.y=100;
		breakers.push({item:item,x:20+197*i,y:90+70*j});
	    }
	}
}
//小球位置刷新的方法
function updateball(){
	ballX-=vx;
	ballY-=vy;
	if(ballY<=90){
		 //当小球碰撞到上方的时候，移动方向发生改变
		vy*=-1;//速度方向取反
	}
	if(ballX>=cW-ball.width){
		vx*=-1;
	}
	if(ballX<=0){
		vx*=-1;
	}
	//当小球的位置低于挡板的y坐标时，游戏结束
	if(ballY>=cH-ball.height){
		//vy*=-1;
		//this.gameover();
	}	
}
//挡板移动的方法 鼠标
function MouseMove(e){
	//鼠标最左边的位置
	boardX=e.x-board.width/2;
	if(e.x<=0+board.width/2){
		boardX=0;
	}
	//鼠标最右侧能够移动的位置
	if(e.x>=(cW-board.width/2)){
		boardX=cW-board.width;
	}
}
//创建一个加载图片的方法  url是图片路径
function AddImage(url){
	var img=new Image();
	img.src=url;
	return img;
}
//清空当前屏幕的方法
function cleanScreen(){
	//清空当前屏幕
	context.clearRect(0,0,1024,768);
}
//后台输出游戏的进度或调试其中的错误
function log(msg){
	console.log(msg);
}
function KeyDown(e){
	//37-40
	if (e.keyCode==37) {
		boardX-=20;
	}
	if (e.keyCode==39) {
		boardX+=20;
	}
}
