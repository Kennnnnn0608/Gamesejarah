document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    let score = 0;
    let scoreTarget = 20;
    let gameStarted = false;
    let gamePaused = false;

    // Pemain dengan warna Merah Putih
    let player = { x: 375, y: 550, width: 50, height: 50, color: "red" };
    let bullets = [];
    let enemies = [];

    // Menambahkan elemen untuk pesan kemenangan
    let winMessageElement = document.createElement("div");
    winMessageElement.id = "win-message";
    winMessageElement.textContent = "Kamu Menang!";
    winMessageElement.style.display = "none";
    document.body.appendChild(winMessageElement);

    function displayLoseMessage() {
        let loseMessageElement = document.createElement("div");
        loseMessageElement.id = "lose-message";
        loseMessageElement.textContent = "Kamu Kalah! Skor terlalu rendah.";
        loseMessageElement.style.position = "absolute";
        loseMessageElement.style.top = "50%";
        loseMessageElement.style.left = "50%";
        loseMessageElement.style.transform = "translate(-50%, -50%)";
        loseMessageElement.style.color = "white";
        loseMessageElement.style.fontSize = "30px";
        loseMessageElement.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.6)";
        document.body.appendChild(loseMessageElement);
    
        document.getElementById("pause-button").style.display = "none";
        document.getElementById("home-button").style.display = "block";
    }
    

    // Kecepatan musuh yang lebih rendah agar tidak terlalu sulit
    let enemySpeed = 1;

    // Fungsi untuk memulai game
    function startGame() {
        document.getElementById("tutorial").style.display = "none";
        document.getElementById("start-button").style.display = "none";
        document.getElementById("pause-button").style.display = "block";
        document.getElementById("home-button").style.display = "none";
        canvas.style.display = "block";
        gameStarted = true;
        gamePaused = false;
        update();
    }

    // Fungsi untuk menjeda permainan
    function togglePause() {
        gamePaused = !gamePaused;
        if (gamePaused) {
            document.getElementById("pause-button").textContent = "Lanjutkan";
            document.getElementById("home-button").style.display = "block";
        } else {
            document.getElementById("pause-button").textContent = "Pause";
            document.getElementById("home-button").style.display = "none";
        }
        update();
    }

    // Fungsi utama untuk memperbarui game
    function update() {
        if (gamePaused) return;  // Jika game sedang dijeda, tidak melakukan update

        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Bersihkan layar
        drawPlayer();
        movePlayer();
        drawBullets();
        drawEnemies();
        checkCollisions();
        document.getElementById("score").textContent = "Skor: " + score;

        if (score >= scoreTarget) {
            displayWinMessage();
            return;
        }

        if (Math.random() < 0.02) createEnemy();
        requestAnimationFrame(update);
    }

    // pemain dengan gambar bendera Indonesia
    function drawPlayer() {
        let playerImage = new Image();
        playerImage.src = "images/indonesia.jpg"; // Pastikan gambar bendera Indonesia ada di folder 'images'
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }

    // Menggerakkan pemain
    function movePlayer() {
        if (leftPressed && player.x > 0) player.x -= 5;
        if (rightPressed && player.x < canvas.width - player.width) player.x += 5;
    }

    // Membuat peluru
    function createBullet() {
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, color: "red" });
    }

    // gambar bendera yang pernah menjajah Indonesia
    function createEnemy() {
        let x = Math.random() * (canvas.width - 50);
        let y = 0;
        let enemyImages = ["images/jepang.png", "images/belanda.png", "images/inggris.png"];
        let enemyImage = enemyImages[Math.floor(Math.random() * enemyImages.length)];
        enemies.push({ x: x, y: y, width: 50, height: 50, image: new Image(), imageUrl: enemyImage });
    }

    // Menggambar musuh
    function drawEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            let img = enemy.image;
            img.src = enemy.imageUrl;
            ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.y += enemySpeed;
            if (enemy.y > canvas.height) enemies.splice(i, 1);
        }
    }

    // Menggambar peluru
    function drawBullets() {
        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            ctx.fillStyle = bullet.color;
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            bullet.y -= 5;

            if (bullet.y < 0) bullets.splice(i, 1);
        }
    }

    // Memeriksa tabrakan antara peluru dan musuh
    function checkCollisions() {
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < enemies.length; j++) {
                if (bullets[i].x < enemies[j].x + enemies[j].width &&
                    bullets[i].x + bullets[i].width > enemies[j].x &&
                    bullets[i].y < enemies[j].y + enemies[j].height &&
                    bullets[i].y + bullets[i].height > enemies[j].y) {
                    bullets.splice(i, 1); // Hapus peluru
                    enemies.splice(j, 1); // Hapus musuh
                    score++;  // Tambah skor
                    break;
                }
            }
        }

        // Memeriksa jika musuh melewati pemain
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].y + enemies[i].height > player.y) {
                // Jika musuh melewati posisi pemain
                enemies.splice(i, 1);  // Hapus musuh dari array
                score--;  // Kurangi skor, bisa disesuaikan sesuai aturan game
                break;  // Keluar dari loop jika musuh sudah melewati
            }
        }
    }

    // Menampilkan pesan kemenangan
    function displayWinMessage() {
        winMessageElement.style.display = "block";
        document.getElementById("pause-button").style.display = "none";
        document.getElementById("home-button").style.display = "block";
    }

    // Tombol Mulai
    document.getElementById("start-button").addEventListener("click", startGame);

    // Tombol Pause
    document.getElementById("pause-button").addEventListener("click", togglePause);

    // Tombol Home
    document.getElementById("home-button").addEventListener("click", function() {
        window.location.reload();
    });

    // Event Key untuk gerakan pemain
    let leftPressed = false;
    let rightPressed = false;

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") leftPressed = true;
        if (event.key === "ArrowRight") rightPressed = true;
        if (event.key === "s") createBullet();  // Menembak
        if (event.key === "h") window.location.reload(); // Home
    });

    document.addEventListener("keyup", function(event) {
        if (event.key === "ArrowLeft") leftPressed = false;
        if (event.key === "ArrowRight") rightPressed = false;
    });
});
