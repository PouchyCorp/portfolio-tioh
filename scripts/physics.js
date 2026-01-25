// Physics logic

function getBodyAt(world, x, y) {
  const bodies = world.find({
    $at: Physics.vector(x, y)
  });
  return bodies[0] || null;
}

function initPhysics() {
  let world =
  Physics(function (world) {
    var viewWidth = 500;
    var viewHeight = 300;
    var renderer = Physics.renderer('canvas', {
      el: 'physics',
      width: viewWidth,
      height: viewHeight,
      meta: false,
      styles: {
        'circle': {
          strokeStyle: '#351024',
          lineWidth: 1,
          fillStyle: '#d33682',
          angleIndicator: '#351024'
        }
      }
    });
    world.add(renderer);
    world.on('step', function () {
      world.render();
    });
    var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
    world.add(Physics.behavior('edge-collision-detection', {
      aabb: viewportBounds,
      restitution: 0.99,
      cof: 0.99
    }));
    world.add(
      Physics.body('circle', {
        x: 50,
        y: 30,
        vx: 0.2,
        vy: 0.01,
        radius: 20
      })
    );
    world.add(Physics.behavior('body-impulse-response'));
    world.add(Physics.behavior('constant-acceleration'));
    Physics.util.ticker.on(function (time, dt) {
      world.step(time);
    });
    Physics.util.ticker.start();
  });

  const canvas = document.getElementById('physics');

  const mouse = {
    x: 0,
    y: 0,
    down: false
  };

  let dragConstraint = null;
  let draggedBody = null;

  let mouseGhostObject = Physics.body('point', {
        treatment : 'static',
        hidden: true,
        x: mouse.x,
        y: mouse.y
      });

    console.log(mouseGhostObject);

  

  canvas.addEventListener('mousedown', e => {
    mouse.down = true;
    updateMouse(e);
    mouseGhostObject.x = mouse.x;
    mouseGhostObject.y = mouse.y;
    world.add(mouseGhostObject);

    const body = getBodyAt(world, mouse.x, mouse.y);
    console.log("Dragging body:", body);
    if (!body) return;

    draggedBody = body;

    dragConstraint = Physics.behavior('verlet-constraints').distanceConstraint(
      body,
      mouseGhostObject,
      0.8,
      Physics.vector(mouse.x, mouse.y)
    );

    console.log(dragConstraint);
    world.add(dragConstraint);
  });


  canvas.addEventListener('mousemove', e => {
    if (!dragConstraint) return;

    updateMouse(e);
    mouseGhostObject.state.pos.set(mouse.x, mouse.y);
  });


  canvas.addEventListener('mouseup', () => {
    if (!dragConstraint) return;

    Physics.behavior('verlet-constraints').drop();
    world.remove(mouseGhostObject);
    dragConstraint = null;
    draggedBody = null;
  });




  function updateMouse(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
}
