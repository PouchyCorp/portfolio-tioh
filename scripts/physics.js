// Physics logic

function getBodyAt(world, x, y) {
  const bodies = world.find({
    $at: Physics.vector(x, y)
  });
  return bodies[0] || null;
}

function initPhysics() {
  Physics(function (world) {
    var viewWidth = 1920;
    var viewHeight = 1080;
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
      world.getBodies().forEach(body => {
        const v = body.state.vel;
        const speed = v.norm();

        body.state.angular.vel = 0;
        body.state.angular.acc = 0;
        body.torque = 0;


        const MAX_SPEED = 0.5;


        if (speed > MAX_SPEED) {
          v.normalize().mult(MAX_SPEED);
        }
      });

      world.render();
    });

      var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
      world.add(Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.99,
        cof: 0.99
      }));
      
      physicObjects = [
        Physics.body('circle', {
          x: 50,
          y: 30,
          radius: 50
        }),
        Physics.body('circle', {
          x: 50,
          y: 30,
          radius: 30
        }), 
        Physics.body('circle', {
          x: 50,
          y: 30,
          radius: 60
        })
      ];
      
      physicObjects.forEach(obj => {
        world.add(obj);
      });

      const canvas = document.getElementById('physics');

      const mouse = {
        x: 0,
        y: 0,
        down: false
      };

      let constrainObj = Physics.behavior('verlet-constraints');

      let dragConstraint = null;
      let draggedBody = null;

      let mouseGhostObject = Physics.body('point', {
        treatment: 'static',
        mass: 1,
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

        dragConstraint = constrainObj.distanceConstraint(
          body,
          mouseGhostObject,
          0.2,
          1
        );

        console.log(dragConstraint);
      });


      canvas.addEventListener('mousemove', e => {
        if (!dragConstraint) return;

        updateMouse(e);
        mouseGhostObject.state.pos.set(mouse.x, mouse.y);
      });


      canvas.addEventListener('mouseup', () => {
        if (!dragConstraint) return;

        constrainObj.drop();
        world.remove(mouseGhostObject);
        dragConstraint = null;
        draggedBody = null;
      });

      function updateMouse(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      }

      world.add(Physics.behavior('sweep-prune'))
      world.add(Physics.behavior('body-impulse-response'));
      world.add(Physics.behavior('body-collision-detection'));
      world.add(constrainObj);


      Physics.util.ticker.on(function (time, dt) {
        world.step(time);
      });
      Physics.util.ticker.start();
    });
  }
