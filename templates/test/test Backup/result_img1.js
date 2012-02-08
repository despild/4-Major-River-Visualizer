<script type="text/javascript">


window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


	var canvas = document.getElementById("ResultCanvas");
	var context = canvas.getContext("2d");
	var image = document.getElementById("icon");
	var cnt= {{count}};
	var square_h = 430;
	var can_h = {{canvas_h}};
	var nor=25;
	var h = parseInt(cnt / nor);
	var extra = cnt % nor;
	var time;
	var disY=0;
	var downState = false;
	var recY=0;
	var WIDTH = 820, HEIGHT=430;
	var currentX=0,currentY=0;
	var reMapY=0;
	var current_h =0;
	var gra = context.createLinearGradient(0,0,0,430);
	var g_cnt=0;
	var f_cnt=0;
	var action ={
		mousedown: function(){

			if(currentX > WIDTH-20 && currentX < WIDTH){
				if(currentY > recY && currentY < recY+square_h){
					disY = recY-currentY;
					downState = true;
				}
			}
			drawLoop();
		},
		mousemove: function(){

			if(downState){
				recY = currentY+disY;
			}
			if(recY <0 || recY+square_h > HEIGHT){
				if (recY < 0){
					recY = 0;
				}else{
					recY = HEIGHT-square_h;
				}
			}
			if (square_h < 430){
				reMapY=(can_h-400)*recY/(430-square_h);
				current_h = parseInt(reMapY/30);
			}
			drawLoop();
		},
		mouseup: function(){

			downState = false;
			drawLoop();
		},

		touchstart: function(){

			downState = true;
			if(currentX > WIDTH-20 && currentX < WIDTH){
				if(currentY > recY && currentY < recY+square_h){
					disY = recY-currentY;
					downState = true;
				}
			}
			drawLoop();
		},
		touchmove: function(){

			if(downState){
				recY = currentY+disY;
			}
			if(recY <0 || recY+square_h > HEIGHT){
				if (recY < 0){
					recY = 0;
				}else{
					recY = HEIGHT-square_h;
				}
			}
			if (square_h < 430){
				reMapY=(can_h-400)*recY/(430-square_h);
				current_h = parseInt(reMapY/30);
			}
			drawLoop();
		},
		touchend: function(){

			downState = false;
			drawLoop();
		}

	};
	

	var ed;

			drawLoop();
	gra.addColorStop(0.0, "rgb(150,150,150)");
	gra.addColorStop(0.2, "rgb(255,255,255)");
	gra.addColorStop(0.8, "rgb(255,255,255)");
	gra.addColorStop(1.0, "rgb(150,150,150)");
	//if (canvas.addEventListener) canvas.addEventListener("mousemove", OnMouseMove, false);
//	else if (canvas.attachEvent) canvas.attachEvent("onmousemove", OnMouseMove);

	canvas.addEventListener("mousedown", eventM, false);
	canvas.addEventListener("mouseup", eventM, false);
	canvas.addEventListener("mousemove", eventM, false);
	canvas.addEventListener("touchstart", eventT, false);
	canvas.addEventListener("touchend", eventT, false);
	canvas.addEventListener("touchmove", eventT, false);

	canvas.addEventListener('touchmove',function(event){event.preventDefault();},false);

//	action['mousedown']();


 
  function animloop(){
      drawLoop();
      requestAnimFrame(animloop);
    };


//	time=setInterval(drawLoop, 33);
animloop();
	if (can_h < 430){
		square_h = 430;
	}else{
		if ((430*430) /can_h> 10){
			square_h = (430*430)/can_h;
		}else{
			square_h = 10;
		}
	}

	function eventT(e){

		currentX = e.targetTouches[0].pageX-8;
		currentY = e.targetTouches[0].pageY-27;
		action[e.type]();
	}
	function eventM(e){
		if (typeof e.offsetX != 'undefined' && typeof e.offsetY != 'undefined') {

    	    currentX = e.offsetX;
    	    currentY = e.offsetY;
		}else if (typeof e.pageX != 'undefined' && typeof e.pageY != 'undefined'){

			currentX = e.pageX-8;
			currentY = e.pageY-27;
    	}else{

    	    var relPos = getRelativePos(e.clientX, e.clientY);

    	    currentX = relPos[0];
    	    currentY = relPos[1];
    	}
		

		ed= e	;
		action[e.type]();
	}




	function drawLoop() {
		f_cnt+=1;
		drawResult();		

		context.fillStyle = "rgba(0,0,0,0.9)";
		context.fillRect(0, 0, WIDTH, HEIGHT);
		context.fillStyle = "rgba(100,100,100,0.9)";
		context.fillRect(WIDTH-20, 0,20,HEIGHT);
		context.fillStyle = gra;
		context.fillRect(WIDTH,0,110,HEIGHT);

		if(downState){
			context.fillStyle = "rgba(255,255,255,1)";
		}else{
			context.fillStyle = "rgba(255,255,255,1)";
		}
		
		context.fillRect(WIDTH-20, recY,20,square_h);
		drawResult();

/*
		if(downState){
			context.fillStyle = "rgba(255,0,0,1)";
		}else{
			context.fillStyle = "rgba(255,255,0,1)";
		}

		context.font = '50px "Arial"';
		context.fillText(currentX+'  '+currentY,100,100);
		context.fillText('err',100,200);

		context.fillStyle = "rgba(255,0,0,1)";
		context.font = '50px "Arial"';
		context.fillText(f_cnt,100,100);
		context.fillText("총 행수 : "+h,100,160);
		context.fillText("현재 캔버스 처음 행의 위치 : " + current_h,100,220);
		context.fillText("행당 아이템 수 : " + nor,100,280);
		context.fillText("스크롤 가능 여부 : " + downState,100,340);
*/		
	}
	function drawResult(){
		context.fillStyle = "rgba(0,0,0,1)";
		context.font = '10px "Arial"';
		g_cnt=0;
		if (h > 14){
			if (current_h<1){
				for(j = current_h;j<current_h+14;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}else if(current_h<h-16){
				for(j = current_h;j<current_h+14;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}else{
				for(j = current_h;j<h;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}
		}else if (h > 13){
			if (current_h<1){
				for(j = current_h;j<current_h+13;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}else if(current_h<h-16){
				for(j = current_h;j<current_h+13;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}else{
				for(j = current_h;j<h;j++){
					for (i=0;i<nor;i++)
						context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);
					context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
					g_cnt=(j+1)*25;
				}
			}
		}else{
			for(j = 0;j<h;j++){
				for (i=0;i<nor;i++){
					context.drawImage(image,20+(i*30),10+(j*30)-reMapY,30,30);

				}
				context.fillText(" --- "+(j+1)*25,830,30+(j*30)-reMapY);
				g_cnt=(j+1)*25;
			}
		}

		for (i=0;i<extra;i++){
			context.drawImage(image,20+(i*30),10+h*30-reMapY,30,30);		
		}
		if (extra != 0)		context.fillText(" --- "+(extra+g_cnt),830,30+(j*30)-reMapY);
	}
		

</script>

