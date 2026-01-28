// Physics logic
const MAX_SPEED = 5;

function initPhysics() {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Body = Matter.Body;

  // create an engine
  var engine = Engine.create(
    options = {
      gravity: { x: 0, y: 0 }
    }
  );

  const container = document.querySelector('#stage')

  // create a renderer
  var render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: container.clientWidth,
      height: container.clientHeight,
      wireframes: false,
      background: 'transparent',
    }
  });

  let circleA = Bodies.circle(150, 100, 100, { restitution: 1, friction: 0, frictionAir: 0,
    render: {
      sprite: {
        texture: 'data/paper-ball.png',
        xScale: 0.25,
        yScale: 0.25
      }
    },
    velocity: { x : Math.random()*4 - 2, y: Math.random()*4 - 2 }
  });
  let circleB = Bodies.circle(300, 100, 100, { restitution: 1, friction: 0, frictionAir: 0,
    render: {
      sprite: {
        texture: 'data/paper-ball.png',
        xScale: 0.25,
        yScale: 0.25
      }
    },
    velocity: { x : Math.random()*4 - 2, y: Math.random()*4 - 2 }
  });

  // add all of the bodies to the world
  Composite.add(engine.world, [circleA, circleB]);




  function createBounds(width, height, thickness = 100) {
    return [
      // floor
      Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
        isStatic: true,
        restitution: 1,
        friction: 0
      }),
      // ceiling
      Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
        isStatic: true,
        friction: 0,
        restitution: 1
      }),
      // left
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
        isStatic: true,
        friction: 0,
        restitution: 1
      }),
      // right
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
        isStatic: true,
        friction: 0,
        restitution: 1
      }),
    ];
  }

  let bounds = createBounds(container.clientWidth, container.clientHeight);
  Composite.add(engine.world, bounds);

  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

  Composite.add(engine.world, mouseConstraint);

  Events.on(engine, "beforeUpdate", () => {
    for (const body of engine.world.bodies) {
      if (body.isStatic) continue;

      const v = body.velocity;
      const speed = Math.hypot(v.x, v.y);

      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        Body.setVelocity(body, {
          x: v.x * scale,
          y: v.y * scale,
        });
      }
    }
  });

  let centerBounds = document.getElementById('center-bounds');

  Events.on(mouseConstraint, "startdrag", (event) => {
    const body = event.body;
    if (body) {
      // add au visible bouding box around the center area
      centerBounds.classList.remove('fadeOut');
      centerBounds.classList.add('fadeIn');
    }
  });

  Events.on(mouseConstraint, "enddrag", (event) => {
    const body = event.body;
    if (body) {
      const mousePosition = mouse.position;
      var center = document.getElementById('center-bounds').getBoundingClientRect();

      if (mousePosition.x > center.left && mousePosition.x < center.right &&
         mousePosition.y > center.top && mousePosition.y < center.bottom) {
          // If released in center bounds, remove the body
          Composite.remove(engine.world, body);
      }
      centerBounds.classList.remove('fadeIn');
      centerBounds.classList.add('fadeOut');
    }
  });

  function stopRunner() {
    Runner.stop(runner);
  }
  function resumeRunner() {
    Runner.start(runner, engine);
  }

  window.pos


  // run the renderer
  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  console.log('Physics initialized');
}


