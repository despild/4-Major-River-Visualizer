
	var canvas = document.getElementById("imageView");
	var context = canvas.getContext("2d");
	var square_h = 430;


	var time;
	var lastX = 0, lastY = 0;
	var disY=0;
	var downState = false;
	var recY=0;
	var WIDTH = 820, HEIGHT=430;
	var currentX=0,currentY=0;

	if (canvas.addEventListener) canvas.addEventListener("mousemove", OnMouseMove, false);
	else if (canvas.attachEvent) canvas.attachEvent("onmousemove", OnMouseMove);


	canvas.addEventListener('mousedown', ev_mousedown, false);
	canvas.addEventListener('mouseup', ev_mouseup, false);
	canvas.addEventListener('mousemove', ev_mousemove, false);
	time=setInterval(drawLoop, 16);


	function OnMouseMove(e) {

    	if (typeof e == 'undefined') e = canvas.event;
    	if (typeof e.offsetX != 'undefined' && typeof e.offsetY != 'undefined') {
    	    currentX = e.offsetX;
    	    currentY = e.offsetY;
    	}
    	else {
    	    var relPos = getRelativePos(e.clientX, e.clientY);
    	    currentX = relPos[0];
    	    currentY = relPos[1];
    	}
	}


	function ev_mousedown(ev){
		if(currentX > WIDTH-50 && currentX < WIDTH){
			if(currentY > recY && currentY < recY+80){
				disY = recY-currentY;
				downState = true;
			}
		}
	}
	function ev_mouseup(ev){
		downState = false;
	}

	function ev_mousemove(ev){
		if(downState){
			recY = currentY+disY;
		}
		if(recY <0 || recY+80 > HEIGHT){
			if (recY < 0){
				recY = 0;
			}else{
				recY = HEIGHT-80;
			}
		}
	}

	function drawLoop() {
		context.fillStyle = "rgba(255,255,255,0.5)";
		context.fillRect(0, 0, WIDTH, HEIGHT);
		if(downState){
			context.fillStyle = "rgba(0,0,0,1)";
		}else{
			context.fillStyle = "rgba(0,0,0,1)";
		}
		context.fillRect(WIDTH-50, recY,50,80);

		lastX = currentX;
		lastY = currentY;
	}






