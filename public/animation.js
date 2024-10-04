const stars = 40;
const skyStars = document.getElementById("sky__stars");

function createStars() {
	for (let i = 0; i < stars; i++) {
		let x = Math.floor(Math.random() * 100 + 1);
		let y = Math.floor(Math.random() * 100 + 1);
		const starPoint = document.createElement("div");
		starPoint.style.left = `${x}%`;
		starPoint.style.top = `${y}%`;
		skyStars.appendChild(starPoint);
	}
}

let sunElement = document.getElementById('sun');
let moonElement = document.getElementById('moon');

//if (!sunElement || !moonElement) {
    //alert("Sun or moon element not found!");
//}

/*
// Function to update the sun and moon's position based on the simulated hour
function updateSunAndMoonPosition(simulatedHour) {
    const sunElement = document.getElementById('sun');
    const moonElement = document.getElementById('moon');
    const screenPercentage = (simulatedHour % 24) / 24 * 100;

    sunElement.style.left = `${screenPercentage}%`;

    if ((simulatedHour >= 18 && simulatedHour <= 24) || (simulatedHour >= 0 && simulatedHour < 6)) {
        moonElement.style.left = `${screenPercentage}%`;
    } else {
        moonElement.style.left = '-100%';
    }
}*/

// Function to update the background animation based on the time of day
function updateBackgroundAnimation(hour) {
    const orbit = document.querySelector('.orbit');
    const skyPhase = document.querySelector('.sky__phase');

    // Reset animation properties
    orbit.style.animation = '';
    skyPhase.style.animation = '';

    // Determine the time period based on the hour
    if (hour >= 6 && hour < 12) {
        // Sunrise animation
        orbit.style.animation = 'linear sunrise infinite var(--animation-speed)';
        skyPhase.style.animation = 'linear dawn infinite var(--animation-speed)';
    } else if (hour >= 12 && hour < 18) {
        // Noon animation
        orbit.style.animation = 'linear noon infinite var(--animation-speed)';
        skyPhase.style.animation = 'none'; // No animation during noon
    } else if (hour >= 18 && hour < 24) {
        // Sunset animation
        orbit.style.animation = 'linear sunset infinite var(--animation-speed)';
        skyPhase.style.animation = 'linear dusk infinite var(--animation-speed)';
    } else {
        // Midnight animation
        orbit.style.animation = 'linear midnight infinite var(--animation-speed)';
        skyPhase.style.animation = 'none'; // No animation during midnight
    }
}

function updateShowcase() {
    currentTemperature = temperatureData.length > 0 ? temperatureData[temperatureData.length - 1] : null;
    
    const isRainy = Math.random() < 0.5;


    const showcaseContainer = document.getElementById('showcase-area');
    showcaseContainer.innerHTML = ''; 

    const showcaseWrapper = document.createElement('div');
    showcaseWrapper.classList.add('showcase-wrapper');

    
    stopCloudMovement();
    let currentWeather = "cloudy";
    if (currentTemperature > 3.60) {
        currentWeather = 'sunny';
        animateSun();
    } else if ( currentTemperature > 0) {
        currentWeather = isRainy ? 'rainy' : 'cloudy';
    } else if (currentTemperature < 0) {
        currentWeather = 'snowy';
        //stopCloudMovement();
        animateSnow();
    }
    //stopCloudMovement();
                

    if (currentWeather === 'cloudy') {
        cloudy();
    }
    else if (currentWeather == 'rainy') {
        //stopCloudMovement();
        animateRaindrops();
    }
    else if (currentWeather == 'snowy') {
        //stopCloudMovement();
        animateRaindrops();
    }
    


document.getElementById('rainfall-speed').addEventListener('input', function () {
updateRaindropSpeed();        
});
}


let sunClones = [];

function animateSun() {
// Remove existing sun clones to avoid overlap
//sunClones.forEach(clone => clone.remove());
//sunClones = [];

const showcaseContainer = document.getElementById('showcase-area');

scenes["sunny"].forEach(sunImage => {
    sunImage.classList.add('sun-ray-animation');
    showcaseContainer.appendChild(sunImage);

    // Calculate random position within the showcase area
    //const containerWidth = showcaseContainer.offsetWidth - 180;
   // const containerHeight = showcaseContainer.offsetHeight - 180;
   // const randomLeft = Math.random() * containerWidth;
   // const randomTop = Math.random() * containerHeight;

    // Check if the new position overlaps with existing sun clones
    /*
    let overlap = false;
    sunClones.forEach(existingClone => {
        const existingLeft = parseFloat(existingClone.style.left);
        const existingTop = parseFloat(existingClone.style.top);
        const distance = Math.sqrt(Math.pow(existingLeft - randomLeft, 2) + Math.pow(existingTop - randomTop, 2));
        if (distance < 100) { // Adjust the threshold for overlap as needed
            overlap = true;
        }
    });

    // If there's no overlap, append the sun clone to the showcase area
    if (!overlap) {
        sunClone.style.left = randomLeft + 'px';
        sunClone.style.top = randomTop + 'px';
        showcaseContainer.appendChild(sunClone);
        sunClones.push(sunClone);
    }*/

});
//showcaseContainer.style.background = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("playground.png") center/cover';
}




function updateRaindropSpeed() {
const raindropSpeedSlider = document.getElementById('rainfall-speed');
let speed = parseInt(raindropSpeedSlider.value);

// Clear existing raindrops and start the animation with the updated speed
clearInterval(raindropAnimationInterval);
animateRaindrops(speed);
}

let raindropAnimationInterval;
let raindropClones = []; 

function animateRaindrops(speed) {
let currentWeather = "rainy";
const showcaseContainer = document.getElementById('showcase-area');

raindropClones.forEach(clone => clone.remove());
raindropClones = [];

showcaseContainer.innerHTML = '';

scenes[currentWeather].forEach(raindropImage => {
// Clone the original raindrop and reduce its size
let originalRaindropClone = raindropImage.cloneNode();
originalRaindropClone.style.width = '60px'; // Adjust the size of the original raindrop clone
originalRaindropClone.style.height = 'auto'; // Maintain aspect ratio

// Code to create smaller raindrop clones
for (let i = 0; i < 10; i++) { // Adjust the number of raindrop clones as needed
    let raindropClone = raindropImage.cloneNode();
    raindropClone.style.position = 'absolute';
    raindropClone.style.left = Math.random() * showcaseContainer.offsetWidth + 'px';
    raindropClone.style.top = Math.random() * showcaseContainer.offsetHeight + 'px';
    raindropClone.style.width = '60px'; // Adjust the size of the raindrop clones
    raindropClone.style.height = 'auto'; // Maintain aspect ratio
    raindropClones.push(raindropClone);
    showcaseContainer.appendChild(raindropClone);
}
});
//clearInterval(raindropAnimationInterval);

raindropAnimationInterval = setInterval(() => {
moveRainImagesDown(speed);
}, 50);
}
                  

function moveRainImagesDown(speed) {
const showcaseContainer = document.getElementById('showcase-area');
const rainImages = showcaseContainer.querySelectorAll('img'); // Adjust the selector based on your image elements
//let speed = 2;

raindropClones.forEach(img => {
    const currentTop = parseFloat(img.style.top) || 0;
    const newTop = currentTop + speed; // Adjust the value based on how much you want the images to move down
    img.style.top = `${newTop}px`;
    //speed = speed - 0.2;

    // Reset the position if the image moves off the showcase area
    if (newTop > showcaseContainer.offsetHeight) {
        img.style.top = '0';
        //img.style.left = Math.random() * showcaseContainer.offsetWidth + 'px';                
    }
});
}

document.getElementById('cloud-speed').addEventListener('input', function () {
updateCloudSpeed();
});

let cloudSpeed = parseFloat(document.getElementById('cloud-speed').value);

function updateCloudSpeed() {
cloudSpeed = parseFloat(document.getElementById('cloud-speed').value);
}

function moveCloudRight() {
const showcaseContainer = document.getElementById('showcase-area');
const cloudImages = showcaseContainer.querySelectorAll('img');

cloudImages.forEach(img => {
const currentLeft = parseFloat(img.style.left) || 0;
const newLeft = currentLeft + cloudSpeed;
img.style.left = `${newLeft}%`;

// Reset the position if the cloud image moves off the showcase area
if (newLeft > 100) {
    img.style.left = '-10%'; // You can adjust this value based on your layout
}
});
}




let cloudMovementInterval;
let cloudClones = []; 

function cloudy() {
const showcaseContainer = document.getElementById('showcase-area');
    showcaseContainer.innerHTML = ''; // Clear previous images

    //cloudClones.forEach(clone => clone.remove());
    //cloudClones = [];

    scenes["cloudy"].forEach(cloudImg => {
        // Clone the original raindrop and reduce its size
let originalCloudClone = cloudImg.cloneNode();
originalCloudClone.style.width = '100px'; // Adjust the size of the original raindrop clone
originalCloudClone.style.height = 'auto'; // Maintain aspect ratio
//showcaseContainer.appendChild(originalRaindropClone);

// Code to create smaller raindrop clones
for (let i = 0; i < 10; i++) { // Adjust the number of raindrop clones as needed
    let cloudClone = cloudImg.cloneNode();
    cloudClone.style.position = 'absolute';
    cloudClone.style.left = Math.random() * showcaseContainer.offsetWidth + 'px';
    cloudClone.style.top = Math.random() * showcaseContainer.offsetHeight + 'px';
    cloudClone.style.width = '100px'; // Adjust the size of the raindrop clones
    cloudClone.style.height = 'auto'; // Maintain aspect ratio
    cloudClones.push(cloudClone);
    showcaseContainer.appendChild(cloudClone);
}
    });
    cloudMovementInterval = setInterval(() => {
moveCloudRight();
}, 50);
}


function stopCloudMovement() {
clearInterval(cloudMovementInterval);
}


document.getElementById('snow-speed').addEventListener('input', function () {
updateSnowSpeed();


});


let snowAnimationInterval;
let snowflakeClones = [];

function updateSnowSpeed() {
const snowSpeedSlider = document.getElementById('snow-speed');
let speed = parseInt(snowSpeedSlider.value);

// Clear existing raindrops and start the animation with the updated speed
clearInterval(snowAnimationInterval);
animateSnow(speed);
}

function animateSnow() {
    let currentWeather = "snowy";
    const showcaseContainer = document.getElementById('showcase-area');

    snowflakeClones.forEach(clone => clone.remove()); // Clear existing snowflake clones if any
    snowflakeClones = [];

    showcaseContainer.innerHTML = '';

    scenes[currentWeather].forEach(snowflakeImage => {
// Code to create smaller snowflake clones
for (let i = 0; i < 10; i++) { // Adjust the number of snowflake clones as needed
    let snowflakeClone = snowflakeImage.cloneNode();
    snowflakeClone.style.position = 'absolute';
    snowflakeClone.style.left = Math.random() * showcaseContainer.offsetWidth + 'px';
    snowflakeClone.style.top = Math.random() * showcaseContainer.offsetHeight + 'px';
    snowflakeClone.style.width = '40px'; // Adjust the size of the snowflake clones
    snowflakeClone.style.height = 'auto'; // Maintain aspect ratio
    snowflakeClones.push(snowflakeClone);
    showcaseContainer.appendChild(snowflakeClone);
}
});
    clearInterval(snowAnimationInterval);

    const snowSpeedSlider = document.getElementById('snow-speed');
    let speed = parseInt(snowSpeedSlider.value);
            
    snowAnimationInterval = setInterval(() => {
        moveSnowImagesDown(speed);
    }, 50);
}
                 


function moveSnowImagesDown(speed) {
const showcaseContainer = document.getElementById('showcase-area');
const rainImages = showcaseContainer.querySelectorAll('img'); // Adjust the selector based on your image elements
//let speed = 2;

rainImages.forEach(img => {
    const currentTop = parseFloat(img.style.top) || 0;
    const newTop = currentTop + speed; // Adjust the value based on how much you want the images to move down
    img.style.top = `${newTop}px`;
    //speed = speed - 0.2;

    // Reset the position if the image moves off the showcase area
    if (newTop > showcaseContainer.offsetHeight) {
        img.style.top = '0';
        
    }
});
}

function updateSnowSpeed() {
const snowSpeedSlider = document.getElementById('snow-speed');
let speed = parseInt(snowSpeedSlider.value);

// Clear existing snowflakes and start the animation with the updated speed
clearInterval(snowAnimationInterval);
animateSnow(speed);
}



