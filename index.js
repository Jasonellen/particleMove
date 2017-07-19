window.onload=function(){
  init();
}

//获取canvsa 设置画布和宽高
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');
var _width = canvas.width = canvas.offsetWidth;
var _height = canvas.height = canvas.offsetHeight;
//更新页面用requestAnimationFrame替代setTimeout
window.requestAnimationFrame =  window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

//创建粒子对象（具有位置、半径、颜色和速度属性，画圆、运动 连线 和 远离的方法）
function Particle(x, y, r, color){
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.movex = Math.random()<0.5 ? Math.random()/3 : Math.random()/-5;
  this.movey = Math.random()<0.5 ? Math.random()/2 : Math.random()/-5;
}
//画圆
Particle.prototype.draw = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0 ,360);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
};
// 连线
Particle.prototype.line = function (other) {
  var dx = this.x - other.x;
  var dy = this.y - other.y;
  let gap = Math.sqrt(dx*dx + dy*dy)
  if(gap < 80){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(other.x, other.y);
    ctx.strokeStyle = "rgba(255,255,255,.3)";
    ctx.lineWidth = .7;
    ctx.stroke();
    ctx.restore();
  }
};
//运动 (改变x,y的坐标)
Particle.prototype.move = function () {
  this.movex = (this.x <_width && this.x>0)?this.movex:-this.movex;
  this.movey = (this.x <_height && this.x>0)?this.movex:-this.movey;
  this.x += this.movex;
  this.y += this.movey;
};
//远离鼠标
Particle.prototype.faraway = function (other) {
  var fx = this.x - other.x;
  var fy = this.y - other.y;
  var fd = Math.sqrt(fx*fx + fy*fy);
  if(fd < 50){
    if(fx<0 && fy<0){
      this.x -= 50;
      this.y -= 50;
    }else if(fx<0 && fy>0){
      this.x -= 50;
      this.y += 50;
    }else if(fx>0 && fy<0){
      this.x += 50;
      this.y -= 50;
    }else{
      this.x += 50;
      this.y += 50;
    }
  }
};


//创建远离点
function Away(x, y){
  this.x = x;
  this.y = y;
  this.color = 'red';
}
Away.prototype.awaydraw = function () {
  ctx.save();
  ctx.beginPath();
  ctx.arc(this.x, this.y, Math.random()*20, 0 , 360);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.restore();
};


//粒子数组 和 粒子个数
var P_array =[];
var P_num = 360;
var length = 0;
//初始化页面
function init(){
  //创建很多个 粒子
  for(var i=0; i< P_num; i++){
    var _color = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
    console.log(_color)
    P_array.push(new Particle(Math.random()*_width, Math.random()*_height, Math.random()*5, _color))
  }
  length = P_array.length;
  //页面 动 起来
  run();
}

//动 起来
function run(){
  ctx.clearRect(0, 0, _width, _height)
  //如果鼠标在窗口内，就画远离点
  if(_away.x){
    _away.awaydraw();
  }
  for(var i=0; i<length; i++){
    P_array[i].move();
    P_array[i].draw();
    P_array[i].faraway(_away)
    //逐个判断连线
    for(var j=0; j<length; j++){
      P_array[i].line(P_array[j])
    }
  }
  //循环执行
  requestAnimationFrame(run);
}

//远离点跟随鼠标移动
var _away = new Away(0, 0)
window.onmousemove = function(e){
  var _scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var e = e || window.event;
  _away.x = e.clientX;
  _away.y = e.clientY + _scrollTop;
}
window.onmouseout = function(){
  _away.x = null;
  _away.y = null;
}
