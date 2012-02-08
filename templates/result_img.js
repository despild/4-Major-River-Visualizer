<script type="text/javascript">
	var canvas; 
   $(function() {
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
			canvas.getContext("2d").clearRect(0, 0, w,h);
			canvas.width = 1;
			canvas.width = w;
			canvas.height = 1;
			canvas.height = h;
			resultDraw();
        }
	});

	function resultDraw(){
		var s;	
		var context = canvas.getContext("2d");
		var image = document.getElementById("icon");
		var cnt= {{count}};
		var c_h = canvas.height-100;
		var c_w = canvas.width;
		var n_in_row = parseInt(c_w/30);
		var max_n = parseInt(c_w/30) * parseInt(c_h/30);
		var current_num={{current_count}};
		var drawCount=current_num%max_n;
		var ini=true;


	
		setInterval(playFunc,1000/30);

		function init(){
			context.fillStyle="rgba(0,0,0,1)";
			context.fillRect(0,0,c_w,c_h);
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(0,c_h,c_w,10);
			for ( i = (current_num%max_n), w = 0,  h = 0; i >0 ;i--,w++){
				if (w >= n_in_row){
					w = 0;
					h+=1;
				}
				context.drawImage(image,  w*30,h*30,30,30);
			}
		}
		function playFunc(){
			if (ini){
				init();
				ini=false;
			}
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(0,c_h,c_w,100);
			context.fillStyle = "rgb(0,0,0)";
			context.font = '50px "Arial"';
			context.fillText((current_num),c_w/2-100,c_h+70);
			if(current_num == cnt){
				drawCount = cnt % max_n;
				context.fillStyle = "rgb(0,0,0)";
				context.fillText('사대강',100,c_h+70);	
				drawLoop();
			}else{
				if (current_num%3 ==0){
					s='사';
				}else if (current_num%3==1){
					s='대';
				}else{
					s='강';
				}
				current_num +=1;
				context.font = '50px "Arial"';	
				if(current_num < cnt){
					if (current_num % max_n ==0){
						context.fillStyle="rgba(0,0,0,1)";
						context.fillRect(0,0,c_w,c_h);
						drawCount =0;
					} else {
						drawCount +=1;
					}
					drawLoop();

				}
			}	
		}

		function drawLoop() {
			var w = (drawCount-1)%n_in_row;
			var h = parseInt((drawCount-1)/n_in_row);
			context.drawImage(image,w*30,h*30,30,30);
			
		}
	}
</script>


