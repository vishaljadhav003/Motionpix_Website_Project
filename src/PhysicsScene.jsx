import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import "./PhysicsScene.css";
import VisitorCounter from "./VisitorCounter";

const SVG_COUNT = 15;
const HOVER_RADIUS = 40;

const PhysicsScene = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const iconsRef = useRef([]);

  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const draggedBodyRef = useRef(null);
  const stickNextTickRef = useRef(false);

  const downPosRef = useRef({ x: 0, y: 0 });
  const movedEnoughRef = useRef(false);

  const pressedBodyRef = useRef(null);
  const didUnstickRef = useRef(false);

  useEffect(() => {
    const {
      Engine,
      Render,
      World,
      Bodies,
      Mouse,
      MouseConstraint,
      Runner,
      Vector,
      Body,
      Events,
    } = Matter;

    const container = sceneRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = Math.min(window.innerHeight * 0.7, 700);

    const engine = Engine.create({ gravity: { y: 0.9 } });
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
        sleepingOpacity: 1,
      },
    });
    renderRef.current = render;

    const groundHeight = 60;

    const ground = Bodies.rectangle(
      width / 2,
      height - groundHeight / 2,
      width,
      groundHeight,
      { isStatic: true }
    );

    const leftWall = Bodies.rectangle(-40, height / 2, 80, height * 2, {
      isStatic: true,
    });

    const rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 2, {
      isStatic: true,
    });

    World.add(engine.world, [ground, leftWall, rightWall]);

    const ICON_SIZE = 56;
    const icons = [];

    for (let i = 0; i < SVG_COUNT; i++) {
      const body = Bodies.rectangle(
        Math.random() * width,
        -120 - i * 80,
        ICON_SIZE,
        ICON_SIZE,
        {
          restitution: 0.65,
          friction: 0.25,
          frictionAir: 0.02,
          inertia: Infinity,
          collisionFilter: { category: 0x0001, mask: 0xffffffff },
          render: {
            sprite: {
              texture: `/SVG/${i + 1}.svg`,
              xScale: 0.7,
              yScale: 0.7,
            },
          },
        }
      );

      body.isIcon = true;
      icons.push(body);
    }

    iconsRef.current = icons;
    World.add(engine.world, icons);

    const mouse = Mouse.create(render.canvas);
    mouse.pixelRatio = window.devicePixelRatio;

    // ✅ DESKTOP ONLY scroll fix
    if (window.innerWidth > 768) {
      render.canvas.removeEventListener("wheel", mouse.mousewheel);
      render.canvas.removeEventListener("mousewheel", mouse.mousewheel);
      render.canvas.removeEventListener("DOMMouseScroll", mouse.mousewheel);

      render.canvas.addEventListener("wheel", () => {}, { passive: true });
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.15,
        render: { visible: false },
      },
      collisionFilter: { mask: 0x0001 },
    });

    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const makeSticky = (body) => {
      if (!body) return;
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      Body.setStatic(body, true);
    };

    const unSticky = (body) => {
      if (!body) return;
      Body.setStatic(body, false);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
    };

    const DRAG_THRESHOLD = 6;

    const onPointerDown = (e) => {
      downPosRef.current = { x: e.clientX, y: e.clientY };
      movedEnoughRef.current = false;
      didUnstickRef.current = false;
    };

    const onPointerMove = (e) => {
      const dx = e.clientX - downPosRef.current.x;
      const dy = e.clientY - downPosRef.current.y;

      if (
        !movedEnoughRef.current &&
        dx * dx + dy * dy > DRAG_THRESHOLD * DRAG_THRESHOLD
      ) {
        movedEnoughRef.current = true;

        const body = pressedBodyRef.current;
        if (body && body.isIcon && !didUnstickRef.current) {
          didUnstickRef.current = true;
          unSticky(body);
        }
      }
    };

    render.canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    render.canvas.addEventListener("pointermove", onPointerMove, { passive: true });

    Events.on(mouseConstraint, "startdrag", (e) => {
      if (!e.body || !e.body.isIcon) return;

      pressedBodyRef.current = e.body;

      setIsDragging(true);
      draggedBodyRef.current = e.body;
      render.canvas.style.cursor = "grabbing";
    });

    Events.on(mouseConstraint, "enddrag", () => {
      if (!movedEnoughRef.current) {
        setIsDragging(false);
        draggedBodyRef.current = null;
        pressedBodyRef.current = null;
        render.canvas.style.cursor = "grab";
        return;
      }

      setIsDragging(false);
      stickNextTickRef.current = true;
      render.canvas.style.cursor = "grab";
    });

    Events.on(engine, "afterUpdate", () => {
      if (!stickNextTickRef.current) return;

      stickNextTickRef.current = false;
      const body = draggedBodyRef.current;

      if (body && body.isIcon) makeSticky(body);

      draggedBodyRef.current = null;
      pressedBodyRef.current = null;
    });

    const handleMouseMove = () => {
      const mousePos = mouse.position;
      let found = null;

      for (const body of iconsRef.current) {
        const dist = Vector.magnitude(Vector.sub(body.position, mousePos));
        if (dist < HOVER_RADIUS) {
          found = body;
          break;
        }
      }

      setHoveredIcon(found);
    };

    render.canvas.addEventListener("mousemove", handleMouseMove);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    render.canvas.style.display = "block";
    render.canvas.style.verticalAlign = "top";
    render.canvas.style.cursor = "grab";

    return () => {
      render.canvas.removeEventListener("mousemove", handleMouseMove);
      render.canvas.removeEventListener("pointerdown", onPointerDown);
      render.canvas.removeEventListener("pointermove", onPointerMove);

      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div className="physics-wrapper">
      <div className="physics-ui-layer">
        <VisitorCounter />
      </div>

      <div ref={sceneRef} className="physics-scene" />

      {hoveredIcon && (
        <div
          className="icon-tooltip"
          style={{
            left: hoveredIcon.position.x,
            top: hoveredIcon.position.y - 36,
          }}
        >
          {isDragging ? "Grabbing" : "Grab me"}
        </div>
      )}
    </div>
  );
};

export default PhysicsScene;