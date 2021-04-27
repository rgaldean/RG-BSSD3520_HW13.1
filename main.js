    ////////////////////////////////////////////////////////
   //                                                    //
  // 13.1 - Video, Canvas, and Pixel Manipulation       //
 //                                                    //
////////////////////////////////////////////////////////
// I downloaded this github repository from mozilla 
// and took out only what we need for today,
// because of the size of the repository
// in the interest of time.
// https://github.com/mdn/dom-examples
///////////////////////////////////////////////

//References:
// -Explanation of the github video project:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas
// -Video tag properties
// https://www.w3schools.com/tags/tag_video.asp
// -Keyboard key pressed
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

////////////// In class //////////////////
//X Task 1: Hide the video so that it only shows in the canvas.
//X Task 2: Make the video play when any key is pressed.
//X Task 3: Add the chroma key code from the downloaded project.
//X Task 4: Use the mouse over pixel from the color-picker example to pick a video pixel.
//X Task 5: Chroma key the pixel that is rolled over.

//////////////////////////////////
//Homework Due Mon. before 10PM:
// 1. Change the vsideo to only play if the space key is pressed.
// 2. If the b key is pressed, change the vide to black and white using the color-maipulation example.
// 3. If the c key is pressed, change the video back to regular color from black and white.
//////////////////////////////////


'use strict';

const vw = 320;
const vh = 192;

let targetColor = {r:100, g:100, b:43}
let grayMode = false;

// draw called every animation frame
const draw = () => {
    const canvas = document.getElementById('canvas');
          //canvas.height = window.innerHeight;
          //canvas.width = window.innerWidth;
    if (canvas.getContext) {
        const videoP = document.getElementById('video');
        const ctx = canvas.getContext('2d');
   
        //clear the canvas
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        //draw the pixels from the video to the canvas.
        ctx.drawImage(videoP, 0,0, vw, vh);
        
        //get frame data (all pixel values) from canvas
        let fr = ctx.getImageData(0, 0, vw, vh);
        
        
        //Begin Chroma Key Code
        //divide data by 4 because each r,g,b,a group is one pixel
        let l = fr.data.length / 4;
        
        //go through each pixel and examine its values
        for (let i = 0; i < l; i++) {
            let r = fr.data[i * 4 + 0];
            let g = fr.data[i * 4 + 1];
            let b = fr.data[i * 4 + 2];
            //if pixel is near target color then make it transparent
            if (r > targetColor.r && g > targetColor.g && b < targetColor.b)
                fr.data[i * 4 + 3] = 0;
            if(grayMode ==true){
               let grey= (r+g+b)/3;
               fr.data[i*4+0] = grey;
               fr.data[i*4+1] = grey;
               fr.data[i*4+2] = grey;
           
               
            }
        }
        
        //overwrite current frame data from video to the same canvas
        ctx.putImageData(fr, 0, 0);
        //End Chroma Key Code
        
        //request the next animation frame
        window.requestAnimationFrame(draw);
    }
}

document.addEventListener('DOMContentLoaded', () => {    
    const videoP = document.getElementById('video');
          videoP.addEventListener('loaded', ()=>{
              console.log("video loaded")
          });
          videoP.hidden = true;    
    
    document.getElementById('canvas').addEventListener('mousemove', (event) => {
          const ctx = document.getElementById('canvas').getContext('2d');
          const x = event.layerX;
          const y = event.layerY;
          const pixel = ctx.getImageData(x, y, 1, 1);
          const data = pixel.data;
	      targetColor.r = data[0];
          targetColor.g = data[1];
          targetColor.b = data[2];
    });
    
    draw();
});

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key == ' '){
        document.getElementById('video').play();
    }
    
    if (event.key == 'b'){
        grayMode = true;
        console.log(grayMode)
    }
        
    if (event.key == 'c'){
        grayMode = false;
        console.log(grayMode)
   }
});
    