<script type="text/javascript">
		var canvas; 
   $(function() {

//		var context;
        resizeCanvas();
        $(window).resize(function() { resizeCanvas() });

        function resizeCanvas()
        {
            var w = window.innerWidth - 40;
            var h = window.innerHeight - 40;
            var canvasString = '<canvas id="ResultCanvas" width="' + w + '" height="' + h + '">Canvas is not supported</canvas>';             

            $('#canvasField').empty();
            $(canvasString).appendTo('#canvasField');
			canvas = $('#ResultCanvas').get(0);
//			context = $('#ResultCanvas').get(0).getContext('2d');
			resultDraw();
        }
	});


	function resultDraw(){
		var s;	
		var canvas = document.getElementById("ResultCanvas");
		var context = canvas.getContext("2d");
		var image = document.getElementById("icon");
		var cnt= {{count}};
		var c_h = canvas.height-100;
		var c_w = canvas.width;
		var n_in_row = parseInt(c_w/30);
		var n_in_col = parseInt(c_h/30);
		var max_n = parseInt(c_w/30) * parseInt(c_h/30);
		var current_num=0;
		var drawCount=0;
		var sa = document.getElementById("sa");
		var dae = document.getElementById("dae");
		var gang = document.getElementById("gang");

		context.fillStyle="rgba(0,0,0,1)";
		context.fillRect(0,0,c_w,c_h);
		context.fillStyle = "rgb(255,255,255)";
		context.fillRect(0,c_h,c_w,100);
		sa.addEventListener('ended',function(){playFunc();if(cnt > current_num){dae.play();}},false);
		dae.addEventListener('ended',function(){playFunc();  if(cnt > current_num){gang.play();}},false);
		gang.addEventListener('ended',function(){playFunc(); if(cnt > current_num){sa.play();}},false);
		sa.play();
	}
//		setInterval(playFunc,10);
	function playFunc(){

		context.fillStyle="rgba(0,0,0,1)";
		context.fillRect(0,0,c_w,c_h);
		context.fillStyle = "rgb(255,255,255)";
		context.fillRect(0,c_h,c_w,100);
		context.fillStyle="rgba(0,0,0,1)";
		context.font = '20px "Arial"';
		context.fillText(current_num,600,c_h+20);
		context.fillText('current_num : '+current_num,600,c_h+80);
		context.fillText('cnt : '+cnt,750,c_h+80);
		if(current_num == cnt){
			drawCount = cnt % max_n;
			context.fillStyle = "rgb(0,0,0)";
			context.font = '50px "Arial"';	
			context.fillText('사대강',100,c_h+70);	
			drawLoop();
		}else{
			context.font = '50px "Arial"';	
			if(current_num < cnt){
				if (current_num%3 ==0){
					s='사';
				}else if (current_num%3==1){
					s='대';
				}else{
					s='강';
				}
				context.fillText(s,100+(current_num%3) * 50,c_h+70);	
				context.font = '20px "Arial"';
				if (current_num % max_n ==0){
					drawCount =0;
				} else {
					drawCount +=1;
				}
				current_num +=1;
				drawLoop();
			}
		}
	
	

		function drawLoop() {
			for ( i = drawCount, w = 0,  h = 0; i >0 ;i--,w++){
				if (w >= n_in_row){
					w = 0;
					h+=1;
				}
				context.drawImage(image, 10 + w*30,10+h*30,30,30);
			}
			context.fillStyle = "rgb(0,0,0)";
			context.font = '50px "Arial"';
			context.fillText(current_num,c_w/2-100,c_h+70);
		}
	
		function mobileLoop(){
			context.fillStyle="rgba(0,0,0,1)";
			context.fillRect(0,0,c_w,c_h);
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(0,c_h,c_w,100);

			context.fillStyle="rgba(0,0,0,1)";
			context.font = '20px "Arial"';
			context.fillText('c_cnt : '+current_num,600,c_h+80);
			if(current_num == cnt){
					drawCount = cnt % max_n;
					context.fillStyle = "rgb(0,0,0)";
					context.font = '50px "Arial"';	
					context.fillText('사대강',100,c_h+70);	
					drawLoop();
			}
			context.font = '50px "Arial"';	
			if(current_num < cnt){
				if (current_num%3 ==0){
					s='사';
				}else if (current_num%3==1){
					s='대';
				}else{
					s='강';
				}
				context.fillText(s,100+(current_num%3) * 50,c_h+70);	

				if (current_num % max_n ==0){
					drawCount =0;
				} else {
					drawCount +=1;
				}
				drawLoop();
				current_num +=1;
			}
		}
	}
</script>



