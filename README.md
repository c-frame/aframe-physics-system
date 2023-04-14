# Physics for A-Frame VR
A C-Frame fork, collectively maintained by the A-Frame community. Also see [the wiki page](https://aframe.wiki/en/physics).

[![Latest NPM release](https://img.shields.io/npm/v/@c-frame/aframe-physics-system.svg)](https://www.npmjs.com/package/@c-frame/aframe-physics-system)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/c-frame/aframe-physics-system/master/LICENSE)
<!--
![Build](https://github.com/c-frame/aframe-physics-system/workflows/Build%20distribution/badge.svg)
![Test](https://github.com/c-frame/aframe-physics-system/workflows/Browser%20testing%20CI/badge.svg)
-->
Components for A-Frame physics integration.

Supports [CANNON.js](https://schteppe.github.io/cannon.js/) and [Ammo.js](https://github.com/kripken/ammo.js/). See
[examples](https://c-frame.github.io/aframe-physics-system/examples/).

## Contents

+ [Picking an Engine](#picking-an-engine)
+ [Installation](#installation)
+ [Basics](#basics)
+ [Constraints and APIs](#constraints-and-apis)
+ [Driver-specific limitations](#driver-specific-limitations)
+ [Examples](#examples)

## Picking an engine
Which engine you pick will depend a lot on your specific requirements.  Currently there are 3 options for A-Frame physics that may be worth considering:

- a-frame-physics system with Cannon driver
- a-frame-physics system with Ammo driver
- [physx](https://github.com/c-frame/physx) (which uses Nvidia physX as its driver).  Note that there is no current plan to integrate physX into aframe-physics-system, but it may be a better choice for some projects.

Since each driver has a slightly different component interface and schema, it will require some significant updates to your code to switch from one driver to another, so it's worth taking some time up-front to consider which driver is most likely to suit your needs.

At a high level:

- The Cannon driver is the easiest to use, but as a native JavaScript solution, it has the worst performance
- The Ammo driver is harder to use, but has significantly better performance
  - Ammo is a WASM build of the Bullet physics engine, which is a widely used open source physics engine.
- PhysX has the best performance (approx. 2x faster than Ammo.js), and is easy to use for simple use cases, but is more of an unknown quantity in terms of integration with A-Frame for more complex functions like constraints and APIs 
  - The PhysX physics engine is the default physics engine used by both Unity and Unreal Engine.

For each of these drivers, there is the potential for specific limitations that could be problematic.  These could be limitations

- in the physics engine itself
- in the version of the physics engine being used (which may not be the latest version)
- or, in the integration of the phsyics engine with aframe-physics-system (or physx).

See [Driver-specific Limitations](#driver-specific-limitations) below for a list of known driver-specific limitations.

## Installation

Installation instructions vary slightly depending on the driver being used, so see detailed documentation for each driver 

- [Cannon.js](CannonDriver.md#installation)

- [Ammo.js](AmmoDriver.md#installation)

  

## Basics

The components and schemas for aframe-physics system vary depending on whether you are using the Cannon.js or Ammo.js driver.

See detailed documentation for each driver 

- [Cannon.js](CannonDriver.md#basics)

- [Ammo.js](AmmoDriver.md#basics)

Although the syntax for each driver is different, the basic concepts are the same.

- A `physics` component is added to the `<a-scene>`.  The `driver` property of this component indicates which driver to use.  The `debug` property can be set to `true` to get some useful visual hints from the physics engine.  There are also various other driver-specific scene-level settings.
- For physics to apply to an entity, it must be identified as a physics body.
  - In Cannon.js, this is done by applying either the `dynamic-body` or `static-body` component.
  - In Ammo.js, a physics body each physics body needs two components: `ammo-body` (to define the phsyics properties of the body) and `ammo-shape` (to define its shape).  The `type` property on `ammo-body`is used to specify whether the body is `dynamic`, `kinematic` or `static`
- Dynamic bodies are bodies that are under the control of the physics system (e.g. a ball in a game)
- Static bodies are bodies that influence the movement of other bodies, but are not themselves moved by the physics system (e.g. the walls of a room)
- Kinematic bodies are bodies that can move *and* influence the movement of dynamic bodies, but are not themselves  moved by the physics system.  Players' controllers or hands are often kinematic objects.
  - Note that Cannon.js does not discriminate between static & kinematic bodies - they are all designated as "static", even if they can be moved.
- Both Cannon.js and Ammo.js have function to automatically set the shape of a physics body to match the geometry of the entity.  This works a lot of the time, but in some cases, it's necessary to explicitly configure the shape using properties on the relevant components (see driver-specific documentation for details).

For more details, see detailed documentation for each driver 

- [Cannon.js](CannonDriver.md#components)

- [Ammo.js](AmmoDriver.md#components)

## Constraints and APIs

More sophisticated use cases require more than just the configuration of dynamic, static and kinematic bodies.

Both drivers also allow for the configuration of constraints

Constraints such as hinges, springs and so on can be configured between bodies (or between specific points on the surfaces bodies), to provide more sophisticated interactions.   See driver-specific documentation for details.

Both drivers also have APIs that offer

- lifecycle events such as a body initialization, entering a sleeping vs. active state etc.
- collision events that can be used to detect collisions between bodies
- direct interactions with bodies, for example setting their velocity, applying forces to them etc.

Specific details  vary between drivers, so you should consult driver-specific documentation for details.  Since Cannon.js is written in native Javascript, its API is generally easier to use, and problems are simpler to debug.  In comparison, making use of the Ammo.js APIs can be quite hard work (there's definitely scope to improve the available documentation and examples here!)  

- [Cannon.js](CannonDriver.md)

- [Ammo.js](AmmoDriver.md)

  

## Driver-specific limitations

This is a list of limitations that has been oberved with particular drivers (and also with physx).  It's intended to provide a checklist to help developers to choose between physics drivers for a particular project, so they don't pick a driver that turns out to be missing some feature that is fundamental for their application.

This list is probably incomplete, so if you find an additional significant limitation, please add it to this list.

### Cannon.js

- Can't handle collision with fast moving bodies, as it does not offer Continuous Collision Detection (CCD)
- No support for collision filtering - all object pairs 
- Restitution (bounciness) is a global property, rather than per-body
- No stateful collision data - just a stream of events that starts when collision is happening, and stops when collision ends (compare Ammo, which offers distinct collide-start, collide-end events and collision state that can be queried at any time; no idea yet what PhysX offers here...)
  - But see: https://github.com/wmurphyrd/aframe-physics-extras#collision-filter for an extension that enables this.




### Ammo.js

- No support for off-center attachment of spring constraints to bodies (integration issue?)

- No support for slider constraint (slider constraint is like a bead on an abacus) (integration issue?) 

  

### phsyx

- Very few examples - a gap that needs filling!
- Other limitations not known - suspect few limitations in the engine itself, but potentially many in terms of integration.



## Examples

To help demonstrate the features and capabilities of `aframe-physics-system` a collection of examples have been prepared. Please see [examples](https://c-frame.github.io/aframe-physics-system/examples/) for a summary and link to each of the prepared examples.			



