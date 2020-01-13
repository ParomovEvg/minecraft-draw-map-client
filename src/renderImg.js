import fragmentShaderText from "./fragmentShader";
import vertexShaderText from "./vertexShader";

/**
 *
 * @param {Array<number>} imgArr
 * @param {HTMLCanvasElement} canvas
 */
export const renderImg = async (imgArr, canvas, radius) => {
    const cv =  StartCanvas(canvas);
    if(cv === null){return;}
    cv.restore();
    const width = canvas.width;
    imgArr.forEach((int,i)=>{
        cv.fillStyle = `rgb(${int},${int},${int}`;
        cv.fillRect(i % radius, Math.floor(i / radius) , 1, 1 )
    });
};


/**
 *
 * @param canvas
 * @returns {CanvasRenderingContext2D|null}
 * @constructor
 */
function StartCanvas(canvas) {
    const gl = canvas.getContext('2d');

    if (!gl) {
        return null;
    }


    canvas.height = gl.canvas.clientHeight;
    canvas.width = gl.canvas.clientWidth;



    return gl;
}


