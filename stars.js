const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Celestial Objects --- //
const celestialObjects = [
    {
        type: 'blackHole',
        x: canvas.width * 0.2,
        y: canvas.height * 0.2,
        radius: 50, // Event horizon radius
        glowRadius: 100, // Radius for the red glow
        speedX: 0.005,
        speedY: 0.005,
        rotation: 0,
        rotationSpeed: 0.01, // Rotation for the red glow
        distortionRadius: 200 // Radius for gravitational lensing effect
    },
    {
        type: 'waningCrescentMoon',
        x: canvas.width * 0.8,
        y: canvas.height * 0.2,
        radius: 40,
        speedX: -0.02,
        speedY: 0.01
    },
    {
        type: 'saturn',
        x: canvas.width * 0.15,
        y: canvas.height * 0.8,
        radius: 30,
        ringRadiusX: 60,
        ringRadiusY: 15,
        speedX: 0.03,
        speedY: -0.01
    },
    {
        type: 'redPlanet',
        x: canvas.width * 0.9,
        y: canvas.height * 0.9,
        radius: 15,
        speedX: -0.05,
        speedY: -0.02
    },
    {
        type: 'gasGiant',
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        radius: 60,
        speedX: 0.01,
        speedY: 0.01
    }
];

function drawBlackHole(obj) {
    ctx.save();
    ctx.translate(obj.x, obj.y);

    // Red Glow/Border (simulating light being pulled in)
    ctx.rotate(obj.rotation); // Apply rotation to the glow
    const redGlowGradient = ctx.createRadialGradient(0, 0, obj.radius, 0, 0, obj.glowRadius);
    redGlowGradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Bright red near core
    redGlowGradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.4)'); // Fading red
    redGlowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)'); // Transparent

    ctx.fillStyle = redGlowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, obj.glowRadius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(255, 0, 0, 0.7)'; // Red shadow for glow
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.rotate(-obj.rotation); // Rotate back for the core

    // Event Horizon (the black core)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(0, 0, obj.radius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'; // Dark shadow for depth
    ctx.shadowBlur = 50;
    ctx.fill();

    ctx.restore();
}

function drawWaningCrescentMoon(obj) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e0e0e0';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(obj.x + obj.radius * 0.4, obj.y - obj.radius * 0.2, obj.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function drawSaturn(obj) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(obj.x, obj.y, obj.ringRadiusX, obj.ringRadiusY, -0.4, 0, Math.PI * 2);
    ctx.strokeStyle = '#a09080';
    ctx.lineWidth = 7;
    ctx.shadowColor = '#a09080';
    ctx.shadowBlur = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(obj.x + 10, obj.y - 10, 5, obj.x, obj.y, obj.radius);
    gradient.addColorStop(0, '#f5dcb4');
    gradient.addColorStop(1, '#c7a683');
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#f5dcb4';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.restore();
}

function drawRedPlanet(obj) {
    ctx.save();
    const gradient = ctx.createRadialGradient(obj.x - 5, obj.y - 5, 2, obj.x, obj.y, obj.radius);
    gradient.addColorStop(0, '#ff8c69');
    gradient.addColorStop(1, '#c54f33');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    ctx.shadowColor = '#ff8c69';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
}

function drawGasGiant(obj) {
    ctx.save();
    const gradient = ctx.createRadialGradient(obj.x, obj.y, obj.radius * 0.7, obj.x, obj.y, obj.radius);
    gradient.addColorStop(0, '#e3cba7');
    gradient.addColorStop(1, '#a18b70');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
    ctx.shadowColor = '#e3cba7';
    ctx.shadowBlur = 30;
    ctx.fill();

    ctx.clip();

    const bands = [
        { color: 'rgba(199, 169, 128, 0.8)', yOffset: -40, height: 15 },
        { color: 'rgba(230, 204, 179, 0.9)', yOffset: -25, height: 20 },
        { color: 'rgba(168, 136, 102, 0.8)', yOffset: 5, height: 18 },
        { color: 'rgba(214, 182, 154, 0.9)', yOffset: 30, height: 15 },
        { color: 'rgba(181, 146, 116, 0.8)', yOffset: 50, height: 10 }
    ];
    bands.forEach(band => {
        ctx.fillStyle = band.color;
        ctx.beginPath();
        ctx.ellipse(obj.x, obj.y + band.yOffset, obj.radius, band.height, 0, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = 'rgba(186, 104, 73, 0.85)';
    ctx.beginPath();
    ctx.ellipse(obj.x - obj.radius * 0.4, obj.y + obj.radius * 0.2, 20, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function updateAndDrawCelestialObjects() {
    celestialObjects.forEach(obj => {
        obj.x += obj.speedX;
        obj.y += obj.speedY;
        if(obj.type === 'blackHole') obj.rotation += obj.rotationSpeed;

        const objWidth = obj.type === 'saturn' ? obj.ringRadiusX : obj.radius;
        if (obj.x + objWidth < -200) obj.x = canvas.width + objWidth;
        if (obj.x - objWidth > canvas.width + 200) obj.x = -objWidth;
        if (obj.y + objWidth < -200) obj.y = canvas.height + objWidth;
        if (obj.y - objWidth > canvas.height + 200) obj.y = -objWidth;

        if (obj.type === 'blackHole') drawBlackHole(obj);
        else if (obj.type === 'waningCrescentMoon') drawWaningCrescentMoon(obj);
        else if (obj.type === 'saturn') drawSaturn(obj);
        else if (obj.type === 'redPlanet') drawRedPlanet(obj);
        else if (obj.type === 'gasGiant') drawGasGiant(obj);
    });
}

// --- Twinkling Stars --- //
const stars = [];
const numStars = 300;
const starColors = [ [255, 255, 255], [174, 203, 255], [255, 255, 170], [255, 221, 193] ];

function initStar(star) {
    star.x = Math.random() * canvas.width;
    star.y = Math.random() * canvas.height;
    star.radius = Math.random() * 1.5 + 0.5;
    star.color = starColors[Math.floor(Math.random() * starColors.length)];
    star.maxAlpha = Math.random() * 0.5 + 0.2;
    star.alpha = 0;
    star.phase = Math.random() * Math.PI * 2;
    star.twinkleSpeed = Math.random() * 0.005 + 0.001;
    star.life = Math.random() * 800 + 200;
    star.maxLife = star.life;
}

for (let i = 0; i < numStars; i++) { const star = {}; initStar(star); stars.push(star); }

// --- Shooting Stars --- //
const shootingStars = [];
function createShootingStar() {
    if (Math.random() < 0.4) return;
    shootingStars.push({
        x: Math.random() * canvas.width * 1.5,
        y: Math.random() * canvas.height * 0.2,
        len: Math.random() * 150 + 50,
        speed: Math.random() * 8 + 8,
        angle: Math.PI / 5 + Math.random() * 0.2,
    });
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateAndDrawCelestialObjects();

    stars.forEach(star => {
        // Apply gravitational lensing effect if near black hole
        const bh = celestialObjects.find(obj => obj.type === 'blackHole');
        if (bh) {
            const dx = star.x - bh.x;
            const dy = star.y - bh.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < bh.distortionRadius && dist > bh.radius) {
                const angle = Math.atan2(dy, dx);
                const distortionFactor = 1 - (dist / bh.distortionRadius); // Stronger closer to BH
                const distortedX = star.x + Math.cos(angle) * distortionFactor * 10;
                const distortedY = star.y + Math.sin(angle) * distortionFactor * 10;

                ctx.beginPath();
                ctx.arc(distortedX, distortedY, star.radius, 0, Math.PI * 2);
            } else {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            }
        } else {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        }

        star.phase += star.twinkleSpeed;
        let twinkle = Math.abs(Math.sin(star.phase));
        const fade = Math.min(1, (star.maxLife - star.life) / 100, star.life / 100);
        star.alpha = twinkle * star.maxAlpha * fade;

        ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${star.alpha})`;
        ctx.fill();

        star.life--;
        if (star.life <= 0) {
            initStar(star);
        }
    });

    shootingStars.forEach((ss, index) => {
        const tailX = ss.x + ss.len * Math.cos(ss.angle);
        const tailY = ss.y - ss.len * Math.sin(ss.angle);
        const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        ss.x -= ss.speed * Math.cos(ss.angle);
        ss.y += ss.speed * Math.sin(ss.angle);
        if (ss.x < -ss.len || ss.y > canvas.height + ss.len) {
            shootingStars.splice(index, 1);
        }
    });

    requestAnimationFrame(draw);
}

setInterval(createShootingStar, Math.random() * 2000 + 1000);
draw();