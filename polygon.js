let color = "white";
let size = 5;
let Polygons = [];

let maxX = 0;
let maxY = 0;
let mouseX = 0;
let mouseY = 0;
let mouseActive = false;
let gravityRadius = 50;
let gravityStrength = 0.45;
let damping = 1;

// Entire code is written by Leventezg

function createPolygon(x ,y ) {
    const polygon = document.createElement("div");

    polygon.style.backgroundColor = color;
    polygon.style.position = "absolute";
    polygon.style.borderRadius = "50%";
    
    polygon.style.width = size + "px";
    polygon.style.height = size + "px";
    polygon.style.left = x + "px";
    polygon.style.top = y + "px";


    return polygon;
}

function createPolygonMesh(quantity, radius, borderX, borderY) {
    const mesh = document.createElement("div");
    mesh.style.position = "relative";
    mesh.style.width = borderX + "px";
    mesh.style.height = borderY + "px";
    mesh.style.overflow = "hidden";
    maxX = borderX;
    maxY = borderY;

    const reservedX = [];
    const reservedY = [];

    for (let i = 0; i < quantity; i++) {
        let x, y;

        do {
            x = Math.random() * (borderX - size);
            y = Math.random() * (borderY - size);
            let tooClose = false;
            for (let j = 0; j < reservedX.length; j++) {
                if (Math.abs(x - reservedX[j]) < radius + size && Math.abs(y - reservedY[j]) < radius + size ) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) {
                reservedX.push(x);
                reservedY.push(y);
                break;
            }
        } while (true);
        
        const polygon = createPolygon(x, y);
        mesh.appendChild(polygon);
        Polygons.push({pos: {x: x, y: y}, vel: {x: 0, y: 0}, element: polygon});

    }

    requestAnimationFrame(animate);
    return mesh;
}

addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseActive = true;
});

addEventListener("mouseout", () => {
    mouseActive = false;
});

function animate() {
    const ballRadius = size / 2;
    const minDistance = size;

    Polygons.forEach(polygon => {
        if (mouseActive) {
            const dx = polygon.pos.x - mouseX;
            const dy = polygon.pos.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 1 && distance < gravityRadius) {
                const strength = (gravityRadius - distance) / gravityRadius * gravityStrength;
                const ax = dx / distance * strength;
                const ay = dy / distance * strength;
                polygon.vel.x += ax;
                polygon.vel.y += ay;
            }
        }

        polygon.vel.x *= damping;
        polygon.vel.y *= damping;
        polygon.pos.x += polygon.vel.x;
        polygon.pos.y += polygon.vel.y;

        if (polygon.pos.x > maxX - size) {
            polygon.pos.x = maxX - size;
            polygon.vel.x = -Math.abs(polygon.vel.x) * 0.8;
        }
        if (polygon.pos.x < 0) {
            polygon.pos.x = 0;
            polygon.vel.x = Math.abs(polygon.vel.x) * 0.8;
        }
        if (polygon.pos.y > maxY - size) {
            polygon.pos.y = maxY - size;
            polygon.vel.y = -Math.abs(polygon.vel.y) * 0.8;
        }
        if (polygon.pos.y < 0) {
            polygon.pos.y = 0;
            polygon.vel.y = Math.abs(polygon.vel.y) * 0.8;
        }
    });

    for (let i = 0; i < Polygons.length; i++) {
        for (let j = i + 1; j < Polygons.length; j++) {
            const a = Polygons[i];
            const b = Polygons[j];
            const ax = a.pos.x + ballRadius;
            const ay = a.pos.y + ballRadius;
            const bx = b.pos.x + ballRadius;
            const by = b.pos.y + ballRadius;
            const dx = ax - bx;
            const dy = ay - by;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0 && distance < minDistance) {
                const overlap = (minDistance - distance) / 2;
                const nx = dx / distance;
                const ny = dy / distance;

                a.pos.x += nx * overlap;
                a.pos.y += ny * overlap;
                b.pos.x -= nx * overlap;
                b.pos.y -= ny * overlap;

                const rvx = a.vel.x - b.vel.x;
                const rvy = a.vel.y - b.vel.y;
                const relVel = rvx * nx + rvy * ny;
                if (relVel < 0) {
                    const impulse = -relVel;
                    a.vel.x += nx * impulse * 0.5;
                    a.vel.y += ny * impulse * 0.5;
                    b.vel.x -= nx * impulse * 0.5;
                    b.vel.y -= ny * impulse * 0.5;
                }
            }
        }
    }

    Polygons.forEach(polygon => {
        polygon.element.style.left = polygon.pos.x + "px";
        polygon.element.style.top = polygon.pos.y + "px";
    });

    requestAnimationFrame(animate);
}





