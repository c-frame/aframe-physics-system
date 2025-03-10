# Cannon Driver

[CANNON.js](https://pmndrs.github.io/cannon-es/) is a native JavaScript physics library, which is one of the available choices of driver in aframe-physics-system

This page describes how to use aframe-physics-system with the Cannon Driver

## Installation

### Scripts

In the [dist/](https://github.com/c-frame/aframe-physics-system/tree/master/dist) folder, download the full or minified build. Include the script on your page, and all components are automatically registered for you:

```html
<script src="https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.3/dist/aframe-physics-system.min.js"></script>
```

CDN builds for aframe-physics-system@v$npm_package_version:

- [aframe-physics-system.js](https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.3/dist/aframe-physics-system.js) *(development)*
- [aframe-physics-system.min.js](https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.3/dist/aframe-physics-system.min.js) *(production)*

### npm

```
npm install --save @c-frame/aframe-physics-system
```

```javascript
// my-app.js
require('aframe-physics-system');
```

Once installed, you'll need to compile your JavaScript using something like [Browserify](https://browserify.org/) or [Webpack](https://webpack.github.io/). Example:

```bash
npm install -g browserify
browserify my-app.js -o bundle.js
```

`bundle.js` may then be included in your page. See [here](https://browserify.org/#middle-section) for a better introduction to Browserify.

#### npm + webpack

When using webpack, you need to ensure that your `loader` for `.js` files includes this dependency. The example below assumes you're using Babel.

```js
{
  test: /\.js$/,
  include: ['src', require.resolve('aframe-physics-system') ],
  use: {
    loader: 'babel-loader', // or whatever loader you're using to parse modules
    options: {}
  }
}
```

> **Note**: You cannot use `exclude: /node_modules` for your `.js` loader. You must instead use `include` and pass an array of directories as dependencies to transpile.



## Basics

```html
<!-- The debug:true option creates a wireframe around each physics body. If you don't see a wireframe,
     the physics system may be unable to parse your model without a shape:box or shape:hull option. -->
<a-scene physics="debug: true">

  <!-- Camera -->
  <a-entity camera look-controls></a-entity>

  <!-- Floor -->
  <a-plane static-body></a-plane>

  <!-- Immovable box -->
  <a-box static-body position="0 0.5 -5" width="3" height="1" depth="1"></a-box>

  <!-- Dynamic box -->
  <a-box dynamic-body position="5 0.5 0" width="1" height="1" depth="1"></a-box>

</a-scene>
```

## Components

### `dynamic-body` and `static-body`

The `dynamic-body` and `static-body` components may be added to any `<a-entity/>` that contains a mesh. Generally, each scene will have at least one `static-body` for the ground, and one or more `dynamic-body` instances that the player can interact with.

- **dynamic-body**: A freely-moving object. Dynamic bodies have mass, collide with other objects, bounce or slow during collisions, and fall if gravity is enabled.
- **static-body**: A fixed-position or animated object. Other objects may collide with static bodies, but static bodies themselves are unaffected by gravity and collisions.

| Property       | Dependencies     | Default | Description                                         |
| -------------- | ---------------- | ------- | --------------------------------------------------- |
| shape          | —                | `auto`  | `auto`, `box`, `cylinder`, `sphere`, `hull`, `none` |
| mass           | `dynamic-body`   | 5       | Simulated mass of the object, > 0.                  |
| linearDamping  | `dynamic-body`   | 0.01    | Resistance to movement.                             |
| angularDamping | `dynamic-body`   | 0.01    | Resistance to rotation.                             |
| sphereRadius   | `shape:sphere`   | —       | Override default radius of bounding sphere.         |
| cylinderAxis   | `shape:cylinder` | —       | Override default axis of bounding cylinder.         |

#### Body Shapes

Body components will attempt to find an appropriate CANNON.js shape to fit your model. When defining an object you may choose a shape or leave the default, `auto`. Select a shape carefully, as there are performance implications with different choices:

* **None** (`none`) – Does not add collision geometry. Use this when adding collision shapes manually, through the `shape` component or custom JavaScript.
* **Auto** (`auto`) – Chooses automatically from the available shapes.
* **Box** (`box`) – Great performance, compared to Hull or Trimesh shapes, and may be fitted to custom models.
* **Cylinder** (`cylinder`) – See `box`. Adds `cylinderAxis` option.
* **Sphere** (`sphere`) – See `box`. Adds `sphereRadius` option.
* **Convex** (`hull`) – Wraps a model like shrink-wrap. Convex shapes are more performant and better supported than Trimesh, but may still have some performance impact when used as dynamic objects.
* **Primitives** – Plane/Cylinder/Sphere. Used automatically with the corresponding A-Frame primitives.
* **Trimesh** (`mesh`) – *Deprecated.* Trimeshes adapt to fit custom geometry (e.g. a `.OBJ` or `.DAE` file), but have very minimal support. Arbitrary trimesh shapes are difficult to model in any JS physics engine, will "fall through" certain other shapes, and have serious performance limitations.

For more details, see the CANNON.js [collision matrix](https://github.com/schteppe/cannon.js#features).

Example using a bounding box for a custom model:

```html
<!-- Box -->
<a-entity obj-model="obj: url(...)" dynamic-body="shape: box; mass: 2"></a-entity>

<!-- Cylinder -->
<a-entity obj-model="obj: url(...)" dynamic-body="shape: cylinder; cylinderAxis: y; mass: 5"></a-entity>
```

### `shape`

Compound shapes require a bit of work to set up, but allow you to use multiple primitives to define a physics shape around custom models. These will generally perform better, and behave more accurately, than `mesh` or `hull` shapes. For example, a chair might be modeled as a cylinder-shaped seat, on four long cylindrical legs.

Example:

```html
<a-entity gltf-model="src: mug.glb"
          body="type: dynamic; mass: 5; shape: none;"
          shape__main="shape: cylinder;
                       height: 0.36;
                       radiusTop: 0.24;
                       radiusBottom: 0.24;"
          shape__handle="shape: box;
                         halfExtents: 0.15 0.18 0.04;
                         offset: 0.4 0 0;">
</a-entity>
```

| Property     | Shapes     | Default   | Description                                          |
| ------------ | ---------- | --------- | ---------------------------------------------------- |
| shape        | —          | `box`     | `box`, `sphere`, or `cylinder`                       |
| offset       | —          | `0 0 0`   | Position of shape relative to body.                  |
| orientation  | —          | `0 0 0 1` | Rotation of shape relative to body.                  |
| radius       | `sphere`   | `1`       | Sphere radius.                                       |
| halfExtents  | `box`      | `1 1 1`   | Box half-extents. Use `0.5 0.5 0.5` for a 1x1x1 box. |
| radiusTop    | `cylinder` | `1`       | Cylinder upper radius.                               |
| radiusBottom | `cylinder` | `1`       | Cylinder lower radius.                               |
| height       | `cylinder` | `1`       | Cylinder height.                                     |
| numSegments  | `cylinder` | `8`       | Cylinder subdivisions.                               |

### `constraint`

The `constraint` component is used to bind physics bodies together using hinges, fixed distances, or fixed attachment points.

Example:

```html
<a-box id="other-box" dynamic-body />
<a-box constraint="target: #other-box;" dynamic-body />
```

| Property         | Dependencies                           | Default | Description                                                  |
| ---------------- | -------------------------------------- | ------- | ------------------------------------------------------------ |
| type             | —                                      | `lock`  | Type of constraint. Options: `lock`, `distance`, `hinge`, `coneTwist`, `pointToPoint`. |
| target           | —                                      | —       | Selector for a single entity to which current entity should be bound. |
| maxForce         | —                                      | 1e6     | Maximum force that may be exerted to enforce this constraint. |
| collideConnected | —                                      | true    | If true, connected bodies may collide with one another.      |
| wakeUpBodies     | —                                      | true    | If true, sleeping bodies are woken up by this constraint.    |
| distance         | `type:distance`                        | auto    | Distance at which bodies should be fixed. Default, or 0, for current distance. |
| pivot            | `type: pointToPoint, coneTwist, hinge` | 0 0 0   | Offset of the hinge or point-to-point constraint, defined locally in this element's body. |
| targetPivot      | `type: pointToPoint, coneTwist, hinge` | 0 0 0   | Offset of the hinge or point-to-point constraint, defined locally in the target's body. |
| axis             | `type: coneTwist, hinge`               | 0 0 1   | An axis that each body can rotate around, defined locally to this element's body. |
| targetAxis       | `type: coneTwist, hinge`               | 0 0 1   | An axis that each body can rotate around, defined locally to the target's body. |

### `spring`

The `spring` component connects two bodies, and applies forces as the bodies become farther apart.

Example:

```html
<a-box id="anchor" position="0 2 -3" static-body></a-box>
<a-box position="0 1 -3"
       dynamic-body
       spring="target: #anchor;
               damping: 0.25;
               stiffness: 25;"></a-box>
```

| Property     | Default | Description                                                  |
| ------------ | ------- | ------------------------------------------------------------ |
| target       | —       | Target (other) body for the constraint.                      |
| restLength   | 1       | Length of the spring, when no force acts upon it.            |
| stiffness    | 100     | How much will the spring suppress force.                     |
| damping      | 1       | Stretch factor of the spring.                                |
| localAnchorA | —       | Where to hook the spring to body A, in local body coordinates. |
| localAnchorB | —       | Where to hook the spring to body B, in local body coordinates. |

## Using the CANNON.js API

For more advanced physics, use the CANNON.js API with custom JavaScript and A-Frame components. The [CANNON.js documentation](https://pmndrs.github.io/cannon-es/docs/index.html) and source code offer good resources for learning to work with physics in JavaScript.

In A-Frame, each entity's `CANNON.Body` instance is exposed on the `el.body` property. To apply a quick push to an object, you might do the following:

```html
<a-scene>
  <a-entity id="nyan" dynamic-body="shape: hull" obj-model="obj: url(nyan-cat.obj)"></a-entity>
  <a-plane static-body></a-plane>
</a-scene>
```

```javascript
var el = sceneEl.querySelector('#nyan');
el.body.applyImpulse(
  /* impulse */        new CANNON.Vec3(0, 1, -1),
  /* world position */ new CANNON.Vec3().copy(el.getAttribute('position'))
);
```

## Events

| event         | description                                                  |
| ------------- | ------------------------------------------------------------ |
| `body-loaded` | Fired when physics body (`el.body`) has been created, and has a shape configured.  Also fired if the body's shape is modified later. |
| `collide`     | Fired when two objects collide. Touching objects may fire `collide` events frequently. Unavailable with `driver: worker`. |

### Collisions

> **NOTE:** Collision events are currently only supported with the local driver, and will not be fired with `physics="driver: worker"` enabled.

CANNON.js generates events when a collision is detected, which are propagated onto the associated A-Frame entity. Example:

```javascript
var playerEl = document.querySelector('[camera]');
playerEl.addEventListener('collide', function (e) {
  console.log('Player has collided with body #' + e.detail.body.id);

  e.detail.target.el;  // Original entity (playerEl).
  e.detail.body.el;    // Other entity, which playerEl touched.
  e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
  e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
});
```

Note that CANNON.js cannot perfectly detect collisions with very fast-moving bodies. Doing so requires Continuous Collision Detection, which can be both slow and difficult to implement. If this is an issue for your scene, consider (1) slowing objects down, (2) detecting collisions manually (collisions with the floor are easy – `position.y - height / 2 <= 0`), or (3) attempting a PR to CANNON.js. See: [Collision with fast bodies](https://github.com/schteppe/cannon.js/issues/202).

## System Configuration

Contact materials define what happens when two objects meet, including physical properties such as friction and restitution (bounciness). The default, scene-wide contact materials may be configured on the scene element:

```html
<a-scene physics="friction: 0.1; restitution: 0.5">
  <!-- ... -->
</a-scene>
```

> NOTE: It is possible to run physics on a Web Worker using the `physics="driver: worker"` option.
> Using a worker is helpful for maintaining a smooth framerate, because physics simulation does
> not block the main thread. However, scenes needing highly-responsive interaction (for example,
> tossing and catching objects) may prefer to run physics locally, where feedback from the physics
> system will be immediate.
>
> However, current status of the worker version of Cannon driver seems to be poor.  A number of functions that work with Cannon.js in local mode do not seem to work in driver mode.  See [examples](https://c-frame.github.io/aframe-physics-system/examples/) for an overview of the current status.

| Property                       | Default | Description                                                  |
| ------------------------------ | ------- | ------------------------------------------------------------ |
| debug                          | true    | Whether to show wireframes for debugging.                    |
| gravity                        | -9.8    | Force of gravity (in m/s^2).                                 |
| iterations                     | 10      | The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations. |
| maxInterval                    | 0.0667  | Maximum simulated time (in milliseconds) that may be taken by the physics engine per frame. Effectively prevents weird "jumps" when the player returns to the scene after a few minutes, at the expense of pausing physics during this time. |
| friction                       | 0.01    | Coefficient of friction.                                     |
| restitution                    | 0.3     | Coefficient of restitution (bounciness).                     |
| contactEquationStiffness       | 1e8     | Stiffness of the produced contact equations.                 |
| contactEquationRelaxation      | 3       | Relaxation time of the produced contact equations.           |
| frictionEquationStiffness      | 1e8     | Stiffness of the produced friction equations.                |
| frictionEquationRegularization | 3       | Relaxation time of the produced friction equations           |
| driver                         | local   | [`local`, `worker`]                                          |
| workerFps                      | 60      | Steps per second to be used in physics simulation on worker. |
| workerInterpolate              | true    | Whether the main thread should interpolate physics frames from the worker. |
| workerInterpBufferSize         | 2       | Number of physics frames to be 'padded' before displaying. Advanced. |
| workerDebug                    | false   | If true, the worker codepaths are used on the main thread. This is slow, because physics snapshots are needlessly serialized, but helpful for debugging. |
| stats                          |         | Where to output performance stats (if any), `panel`, `console`, `events` (or some combination). <br />- `panel` output stats to a panel similar to the A-Frame stats panel.<br />-`events` generates `physics-tick-timer` events, which can be processed externally.<br/> -`console`outputs stats to the console. |

More advanced configuration, including specifying different collision behaviors for different objects, is available through the CANNON.js JavaScript API.

Resources:

* [CANNON.World](https://pmndrs.github.io/cannon-es/docs/classes/World.html)

* [CANNON.ContactMaterial](https://pmndrs.github.io/cannon-es/docs/classes/ContactMaterial.html)


## Statistics

The following statistics are available from the Cannon Driver.  Each of these is refreshed every 100 ticks (i.e. every 100 frames).

Some statistics are related to the internals of the Cannon Driver, and are not completely understood at this time - but they may nevertheless be helpful in providing an approximate estimate of the complexity involved in a given physics scene.

| Statistic | Meaning                                                      |
| --------- | ------------------------------------------------------------ |
| Static    | The number of static bodies being handled by the physics engine. |
| Dynamic   | The number of dynamic bodies being handled by the physics engine. |
| Contacts  | The number of contacts between pairs of bodies.              |
| Before    | The number of milliseconds per tick before invoking the physics engine.  Typically this is the time taken to synchronize the scene state into the physics engine, e.g. movements of static bodies, or changes to physics shapes.<br />Median = median value in the last 100 ticks<br />90th % = 90th percentile value in the last 100 ticks<br />99th % = maximum recorded value over the last 100 ticks. |
| After     | The number of milliseconds per tick after invoking the physics engine.  Typically this is the time taken to synchronize the physics engine state into the scene, e.g. movements of dynamic bodies.<br />Reported as Median / 90th / 99th percentiles, as above. |
| Engine    | The number of milliseconds per tick actually running the physics engine.<br />Reported as Median / 90th / 99th percentiles, as above. |
| Total     | The total number of milliseconds of physics processing per tick: Before + Engine + After.  Reported as Median / 90th / 99th percentiles, as above. |



