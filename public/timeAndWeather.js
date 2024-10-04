let currentHour = 6; // Starting hour
let timeLabels = [], temperatureData = [], windData = [];

// Clock constants
const RADIANS = 0.0174532925;
const CLOCK_RADIUS = 120;
const SEC_R = CLOCK_RADIUS + 16;
const HOUR_R = CLOCK_RADIUS - 40;
const hourHandLength = 2 * CLOCK_RADIUS/3;
const minuteHandLength = CLOCK_RADIUS;
const secondHandLength = CLOCK_RADIUS - 12;

// SVG dimensions and margins 
let margin = { top: 40, right: 40, bottom: 40, left: 40 };
let w = d3.select('figure').node().clientWidth - margin.left - margin.right;
let h = d3.select('figure').node().clientHeight - margin.top - margin.bottom;

// Scales for clock hands
var minuteScale = secondScale = d3.scale.linear()
	.range([0,354])
	.domain([0,59]);

var hourScale = d3.scale.linear()
	.range([0,330])
	.domain([0,11]);

// Drag behavior for clock hands 
var drag = d3.behavior.drag()
	.on('dragstart', dragstart)
	.on('drag', drag)
	.on('dragend', dragend);

let handData = [
  { type: 'hour', value: 0, length: -2 * CLOCK_RADIUS / 3, scale: hourScale },
  { type: 'minute', value: 0, length: -CLOCK_RADIUS, scale: minuteScale },
  { type: 'second', value: 0, length: -CLOCK_RADIUS + 12, scale: secondScale }
];

/**
 * Updates hand positions and triggers animations based on the simulated hour.
 * @param {number} simulatedHour - The hour to simulate on the clock.
 */
function updateData(simulatedHour) {
    const totalMinutes = simulatedHour * 60;

    const hourValue = (simulatedHour + 3) * 5;
    const minuteValue = 3;
    const secondValue = (simulatedHour * 60) % 60;

    handData[0].value = hourValue;
    handData[1].value = minuteValue;
    handData[2].value = secondValue;

    hands.selectAll('line')
        .data(handData)
        .attr({
            x2: function (d) {
                return d.length * Math.cos(d.scale(d.value * 5 * RADIANS));
            },
            y2: function (d) {
                return d.length * Math.sin(d.scale(d.value * 5 * RADIANS)); 
            }
        });
        updateBackgroundAnimation(simulatedHour);
}

var svg = d3.select('svg')
	.attr('width', w + margin.left + margin.right)
	.attr('height', h + margin.top + margin.bottom);

var g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var face = g.append('g')
	.attr('transform', 'translate(' + CLOCK_RADIUS + ',' + CLOCK_RADIUS + ')');

// Draws the clock face
face.append('circle')
	.attr({
		class: 'outline',
		r: CLOCK_RADIUS,
		cx: 0,
		cy: 0,
		fill: '#a0a0a0'
	});

face.selectAll('.second')
	.data(d3.range(0, 60))
.enter().append('line')
	.attr({
		class: 'second',
		x1: 0,
		x2: 0,
		y1: CLOCK_RADIUS,
		y2: CLOCK_RADIUS - 10,
		transform: function(d) {
			return 'rotate(' + minuteScale(d) + ')';
		}
	});


face.selectAll('.hour')
	.data(d3.range(0, 12))
.enter().append('line')
	.attr({
		class: 'hour',
		x1: 0,
		x2: 0,
		y1: CLOCK_RADIUS,
		y2: CLOCK_RADIUS - 20,
		transform: function(d) {
			return 'rotate(' + hourScale(d) + ')';
		}
	});


    face.selectAll('.hour-label')
    .data(d3.range(1, 13))
    .enter().append('text')
    .text(function(d) { return d; })
    .attr({
        class: 'hour-label',
        'text-anchor': 'middle',
        x: function(d) {
            return SEC_R * Math.sin(secondScale(d * 5) * RADIANS); // Updated x-position for hour labels
        },
        y: function(d) {
            return -SEC_R * Math.cos(secondScale(d * 5) * RADIANS) + 8; // Updated y-position for hour labels
        },
        fill: 'white',
        'font-size': 17
    }); 

face.selectAll('.second-label')
    .data(d3.range(5, 61, 5))
    .enter().append('text')
    .classed('.second-label', true)
    .text(function(d) { return d; })
    .attr({
        'text-anchor': 'middle',
        x: function(d) {
            return HOUR_R * Math.sin(hourScale(d / 5) * RADIANS); // Updated x-position for minute labels
        },
        y: function(d) {
            return -HOUR_R * Math.cos(hourScale(d / 5) * RADIANS) + 9; // Updated y-position for minute labels
        },
        fill: 'white'
    });


var hands = face.append('g');

hands.selectAll('line')
	.data(handData)
.enter().append('line')
	.attr({
		class: function(d) { return d.type + '-hand'; },
		x1: 0,
		y1: 0,
		x2: function(d) {
			return d.length * Math.cos(d.value);
		},
		y2: function(d) {
			return d.length * Math.sin(d.value);
		}
	})
	.call(drag);

// small circle in middle to cover hands
face.append('circle')
	.attr({
		cx: 0,
		cy: 0,
		r: 15,
		fill: 'white',
		'stroke': '#374140',
		'stroke-width': 3
	});

function dragstart() {
}

/**
 * Handles the drag event on clock hands, adjusting their position based on cursor movement.
 */
function drag() {
    const rad = Math.atan2(d3.event.y, d3.event.x);
    d3.select(this)
        .attr({
            x2: d => CLOCK_RADIUS * Math.cos(rad),
            y2: d => CLOCK_RADIUS * Math.sin(rad)
        });
}

/**
 * Finalizes the drag action, updating the clock's display based on the new hand positions
 * Updates the weather data for the selected time
 */
function dragend() {
    const [x, y] = d3.mouse(this);
    const angle = Math.atan2(y, x);
    const degrees = (angle / RADIANS + 360) % 360;
    const simulatedHour = Math.ceil(degrees / 30);
    currentHour = (simulatedHour <= 0 ? 12 : simulatedHour) + 2;
    updateData(currentHour);
    updateSimulatedInfo(currentHour);
    updateBackgroundColor(currentHour);
    generateRealisticData(currentHour);
}


/**
 * Updates the background animation based on the current simulated hour.
 * @param {number} hour - The simulated hour to use for updating the background animation.
 */
function updateBackgroundAnimation(hour) {
    const orbit = document.querySelector('.orbit');
    const skyPhase = document.querySelector('.sky__phase');
    orbit.style.animation = '';
    skyPhase.style.animation = '';
    if (hour >= 6 && hour < 12) {
        orbit.style.animation = 'linear sunrise infinite var(--animation-speed)';
        skyPhase.style.animation = 'linear dawn infinite var(--animation-speed)';
    } else if (hour >= 12 && hour < 18) {
        orbit.style.animation = 'linear noon infinite var(--animation-speed)';
        skyPhase.style.animation = 'none';
    } else if (hour >= 18 && hour < 24) {
        orbit.style.animation = 'linear sunset infinite var(--animation-speed)';
        skyPhase.style.animation = 'linear dusk infinite var(--animation-speed)';
    } else {
        orbit.style.animation = 'linear midnight infinite var(--animation-speed)';
        skyPhase.style.animation = 'none';
    }
}


/**
 * Simulates time progression and updates weather data periodically.
 */
function simulateTimeProgression() {
    const intervalId = setInterval(() => {
        if ((currentHour - 6) % hoursToShow === 0) {
            timeLabels = [];
            temperatureData = [];
            windData = [];
        }
        currentHour = (currentHour % 24) + 1;
        generateRealisticData(currentHour);
        updateSimulatedInfo(currentHour);
        updateBackgroundColor(currentHour);
        updateData(currentHour);
        if (currentHour === 17) clearInterval(intervalId);
    }, 10000);
}


/**
 * Generates realistic temperature and wind data based on the simulated hour.
 * @param {number} hour - The simulated hour for which to generate data.
 */
function generateRealisticData(hour) {
    const formattedHour = hour % 24;
    timeLabels.push(`${formattedHour.toString().padStart(2, '0')}:00`);
    const tempChange = hour >= 6 && hour <= 16 ? (hour - 6) * 0.2 : (hour - 17) * 0.2;
    temperatureData.push(2 + tempChange);
    windData.push(5 - tempChange);
    updateChart(); // Assumes updateChart refreshes the chart with new data
}

/**
 * Updates displayed simulated time, temperature, and wind speed.
 * @param {number} hour - The simulated hour for which to update displayed info.
 */
function updateSimulatedInfo(hour) {
    const formattedHour = hour % 24;
    const temperature = temperatureData.length > 0 ? temperatureData.at(-1).toFixed(2) : 'N/A';
    const windSpeed = windData.length > 0 ? windData.at(-1).toFixed(2) : 'N/A';
    document.getElementById('simulated-time').textContent = `${formattedHour}:00`;
    document.getElementById('simulated-temperature').textContent = `${temperature} °C`;
    document.getElementById('simulated-wind-speed').textContent = `${windSpeed} mph`;
}

/**
 * Updates the background color based on the simulated hour to reflect different times of day.
 * @param {number} hour - The simulated hour for which to update the background color.
 */
function updateBackgroundColor(simulatedHour) {
    let backgroundColor;

    if (simulatedHour >= 6 && simulatedHour < 7) {
        // From 6 am to 7 am
        backgroundColor = `linear-gradient(to bottom, #00008B ${((simulatedHour - 6) / 1) * 100}%, #87CEEB)`;
    } else if (simulatedHour >= 7 && simulatedHour < 8) {
        // From 7 am to 8 am
        backgroundColor = `linear-gradient(to bottom, #000, #00008B, #ffdb58 ${((simulatedHour - 7) / 1) * 100}%, #00008B)`;
    } else if (simulatedHour >= 8 && simulatedHour < 17) {
        // From 8 am to 5 pm
        backgroundColor = '#87CEEB'; // Light Blue
    } else if (simulatedHour >= 17 && simulatedHour < 18) {
        // From 5 pm to 6 pm
        backgroundColor = `linear-gradient(to bottom, #87CEEB ${((simulatedHour - 17) / 1) * 100}%, #00008B)`;
    } else {
        // From 6 pm to 6 am
        backgroundColor = `linear-gradient(to bottom, #000 ${((simulatedHour - 18) / 6) * 100}%, #000)`;
    }
    document.body.style.background = backgroundColor;
}


