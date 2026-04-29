// 1. إعدادات اللعبة الأساسية
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 800;
canvas.height = 600;

// 2. تعريف اللاعب (الدبابة)
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 30,
    color: '#27ae60',
    speed: 5,
    angle: 0
};

// 3. مصفوفات الرصاص والأعداء
let bullets = [];
let enemies = [];
let score = 0;

// 4. التحكم (الكيبورد والماوس)
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);
// 5. وظيفة رسم اللاعب
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = player.color;
    // رسم جسم الدبابة
    ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
    // رسم المدفع
    ctx.fillStyle = '#1e8449';
    ctx.fillRect(0, -5, player.size, 10);
    ctx.restore();
}

// 6. تحديث حركة اللاعب
function updatePlayer() {
    if (keys['KeyW']) player.y -= player.speed;
    if (keys['KeyS']) player.y += player.speed;
    if (keys['KeyA']) player.x -= player.speed;
    if (keys['KeyD']) player.x += player.speed;

    // تدوير المدفع مع الماوس
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    });
}
// 7. إطلاق النار (عند الضغط على الماوس)
window.addEventListener('mousedown', () => {
    bullets.push({
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 10
    });
});

// 8. وظيفة اللعبة الرئيسية (التحريك والرسم)
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePlayer();
    drawPlayer();

    // تحريك ورسم الرصاص
    bullets.forEach((bullet, index) => {
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // حذف الرصاص الخارج عن الشاشة
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

// تشغيل اللعبة
gameLoop();
