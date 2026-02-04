// 1. 註冊 ScrollTrigger 插件 (滾動觸發動畫必備)
gsap.registerPlugin(ScrollTrigger);

// 2. 使用 window "load" 事件，確保所有圖片與資源載入完成，動畫計算才會精準
window.addEventListener("load", () => {
    
    console.log("Synesthesia 網頁動畫系統啟動...");

    // ============================================
    // A. 首頁 Hero 區塊進場動畫 (Timeline)
    // ============================================
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

    tl.from(".main-title", { 
        y: 80, 
        opacity: 0, 
        letterSpacing: "15px" 
    })
    .from(".sub-title", { 
        y: 40, 
        opacity: 0 
    }, "-=0.8") // 比前一個動畫提前 0.8 秒開始
    .from(".divider", { 
        scaleX: 0, 
        transformOrigin: "center", 
        duration: 1.5 
    }, "-=1");


    // ============================================
    // B. 特殊圖片動態效果
    // ============================================
    
    // 1. 大腦圖片的「有機呼吸感」
    gsap.to(".neuro-synes", {
        scale: 1.05,
        rotation: 1.5,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });


    // 2. 經典作品
    gsap.to(".project-wrap", {
        y: -15,
        skewX: "2deg",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });


    // ============================================
    // C. 區塊滾動依序浮現 (ScrollTrigger)
    // ============================================
    const contentSections = document.querySelectorAll(".content-split");
    
    contentSections.forEach((section) => {
        const text = section.querySelector(".text-col");
        const img = section.querySelector(".img-col");

        gsap.from([text, img], {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    });


    // ============================================
    // D. 按鈕滑過變色互動 (GSAP Hover)
    // ============================================
    // 同時選取外框按鈕與填充按鈕
    const btns = document.querySelectorAll('.btn-outline');

    btns.forEach(btn => {
        // --- 1. 動態插入揭幕層 ---
        const fill = document.createElement('div');
        fill.classList.add('btn-fill-layer');
        btn.appendChild(fill);

        // --- 2. 判斷方向的函數 ---
        const getDirection = (e, item) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            return Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3) % 4;
        };

        // --- 3. 滑鼠進入：揭幕 + 閃爍一次 ---
        btn.addEventListener('mouseenter', (e) => {
            const dir = getDirection(e, btn);
            const tl = gsap.timeline();

            // 根據方向瞬移背景層位置
            if (dir === 0) gsap.set(fill, { x: "0%", y: "-100%" }); // 上
            if (dir === 1) gsap.set(fill, { x: "100%", y: "0%" });  // 右
            if (dir === 2) gsap.set(fill, { x: "0%", y: "100%" });  // 下
            if (dir === 3) gsap.set(fill, { x: "-100%", y: "0%" }); // 左

            // 執行序列動畫
            tl.to(fill, { 
                x: "0%", 
                y: "0%", 
                duration: 0.25, 
                ease: "power2.out" 
            })
            .to(btn, { 
                color: "#000000", 
                duration: 0.2 
            }, "<") // 與揭幕同時變色
            .to(btn, { 
                boxShadow: "0px 0px 45px 5px rgba(255, 252, 225, 0.9)", 
                duration: 0.625, 
                yoyo: true, 
                repeat: 1, // 閃出去再縮回來，共 1 次循環 (即閃一下)
                ease: "sine.inOut"
            });
        });

        // --- 4. 滑鼠離開：反向收幕 ---
        btn.addEventListener('mouseleave', (e) => {
            const dir = getDirection(e, btn);
            let outX = "0%", outY = "0%";
            
            if (dir === 0) outY = "-100%";
            if (dir === 1) outX = "100%";
            if (dir === 2) outY = "100%";
            if (dir === 3) outX = "-100%";

            gsap.to(fill, { 
                x: outX, 
                y: outY, 
                duration: 0.25, 
                ease: "power2.in" 
            });
            
            gsap.to(btn, { 
                color: "#ffffff", 
                boxShadow: "0px 0px 0px 0px rgba(255, 252, 225, 0)", // 確保收起時無發光
                duration: 0.275
            });
        });
    });


    console.log("所有互動功能已成功綁定！");
});

//----------------------------------
// 以下為視差效果
//-----------------------------------
// 監聽滑鼠移動
window.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const centerX = window.innerWidth / 5;
    const centerY = window.innerHeight / 3;
    
    // 計算偏移比例
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;

    // --- 1. 背景大標題視差 (輕微移動) ---
    gsap.to(".main-title", {
        x: percentX * 20,
        y: percentY * 15,
        duration: 1.75,
        ease: "power2.out"
    });

});



// --- 引言區拆解動畫動畫 ---

// --- 引言區拆解動畫（含滑鼠微光互動）---（方案 B：流動彩虹節奏） ---

const splitTargets = document.querySelectorAll(".split-text");

splitTargets.forEach((target) => {
    // 1. 取得文字並拆解
    const originalText = target.innerText;
    target.innerText = "";

    // 定義康丁斯基流動調色盤 (按光譜/音階排列)
    const rainbowPalette = [
        "#F100CB", // 洋派紅
        "#FF8709", // 能量橘
        "#FFFCE1", // 淡定黃
        "#0AE448", // 聯覺綠
        "#00BAE2", // 天空藍
        "#9D95FF"  // 輕盈紫
    ];
    
    // 建立一個計數器，讓顏色按順序循環
    let colorIndex = 0;

    [...originalText].forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char;
        //span.style.display = "inline-flex"; 
        span.style.opacity = "0";
        span.style.position = "relative";
        target.appendChild(span);

        // --- 滑鼠互動：流動音階色彩 ---
        span.addEventListener("mouseenter", () => {
            // 每次觸發時取下一個顏色
            const currentColor = rainbowPalette[colorIndex % rainbowPalette.length];
            colorIndex++; 

            gsap.to(span, {
                color: currentColor,
                textShadow: `0px 0px 7.5px ${currentColor}, 0px 0px 10px ${currentColor}`,
                scale: 1.5, // 稍微放大更多，強調鋼琴鍵被按下的感覺
                y: -8,      // 向上彈跳
                duration: 0.3,
                ease: "back.out(3)" // 強烈的彈回感
            });
        });

        // 滑鼠離開：優雅恢復
        span.addEventListener("mouseleave", () => {
            gsap.to(span, {
                color: "inherit",
                textShadow: "0px 0px 0px rgba(255, 252, 225, 0)",
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.in"
            });
        });
    });

    // 2. 初始滾動進入動畫
    const chars = target.querySelectorAll("span");

    gsap.to(chars, {
        scrollTrigger: {
            trigger: target,
            start: "top 85%",
            toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        startAt: { y: 20 },
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
});


//----------------------------------
// 以下為特殊效果
//-----------------------------------
// 滑鼠滑動有光粒子效果拖曳
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

// 定義康丁斯基彩虹色庫 (也可使用您之前的 rainbowPalette)
const trailColors = ["#F100CB", "#FF8709", "#FFFCE1", "#0AE448", "#00BAE2", "#9D95FF"];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 4 + 2; // 隨機大小
        this.speedX = Math.random() * 2 - 1; // 隨機水平漂移
        this.speedY = Math.random() * 2 - 1; // 隨機垂直漂移
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02; // 粒子逐漸消失
        if (this.size > 0.1) this.size -= 0.05; // 粒子逐漸變小
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // 加入發光效果
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // 移除看不見的粒子
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

window.addEventListener('mousemove', (e) => {
    // 每次移動產生 3 個不同顏色的粒子
    for (let i = 0; i < 3; i++) {
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];
        particles.push(new Particle(e.clientX, e.clientY, color));
    }
});

function animate() {
    // 每一幀都稍微清除畫布，製造出「拖尾」感
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();