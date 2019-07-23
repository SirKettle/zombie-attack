/*
interface Circle {
  x: number;
  y: number;
  radius: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
*/

// @param circle1: Circle
// @param circle2: Circle
export const isCollisionCircles = (circle1, circle2) => {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Boolean(distance < circle1.radius + circle2.radius);
};

// @param rect1: Rectangle
// @param rect2: Rectangle
export const isCollisionRectangles = (rect1, rect2) =>
  Boolean(
    rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y,
  );

// @param x: number
// @param y: number
// @param circle: Circle
export const isCollisionCoordCircle = (x, y, circle) => {
  return false;
};

// @param x: number
// @param y: number
// @param rect: Rectangle
export const isCollisionCoordRectangle = (x, y, rect) =>
  Boolean(x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height);
