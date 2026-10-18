---
title: "Fixing Skyrim's render pipeline (drawcall limit fix): part 2"
date: 2026-10-09
slug: fixing-skyrims-render-pipeline
authors: [panthuncia]
tags: [skyrim, rendering, vulkan]
description: "What needs to be done to make Skyrim GPU-driven"
---

In the last post on this topic we determined that the biggest issue with Skyrim's render pipeline was "the whole thing", and that to make meaningful improvements we would need to restructure it from the ground up. This post follows up on that, with a description of (a) what needs to be replaced, and (b) what the approach will look like. Initially, the goal will be to (effectively) perfectly replicate Skyrim's own native renderer, so that we can thoroughly validate the new GPU-driven pipeline against what the native engine does. Later work will focus on leveraging GPU-driven rendering to go beyond what the native engine is capable of, rather than just faster.

In order to do this, we need to be able to draw an entire Skyrim frame without the native engine's input. Thankfully, CS's existing shaders cover all of Skyrim's materials already, meaning we only need to worry about getting those shaders the inputs they need. This will mostly come down to ensuring our replacement engine has coverage of (a) every type of object the game renders (static objects, actors, trees, LOD, etc.), and (b) every type of view it renders (main camera, shadow views, etc.) and ensuring our GPU-resident scene can represent all of them correctly. This will involve:

- Hooking everything in the native game engine that writes scene state (anything that adds or changes an object or material), turning them into events we can process elsewhere
- Efficiently handling those events without *any* interaction with the main thread, assembling them into a copy of the game's scene that lives in GPU memory.

In order for the end result to be performant, we need to start out with a few hard design restrictions:

- *everything* must be an event. There can be no scene polling.
- Reliance on the base game engine for any frame input other than the camera matrices and other such minimal work is not allowed
- *no* DCLF scene work may occur on the main thread
- *no* synchronization points may be added between DCLF's scene workers and the main thread (the main thread never waits on DCLF work, and vice-versa), or between any DCLF worker tasks.

The full list of features we'll need to implement is below- we'll address the specifics of various subsets as we go.

### Object types

- Normal static objects
- Landscape and landscape LODs
- Object LODs (combined LODs, as DynDOLOD makes)
- Particles
- Faces (facegen)
- Skins (bone-animated meshes, like characters and trees)
- Scrolling-UV (used for ant trails, for example)
- Tree LOD
- Billboards
- Decals
- Effects
- Transparencies

### View types:

- Primary color view
- First-person objects (hands, sword)
- Local lights (point, spot)
- Precipitation occlusion
- Skylighting occlusion (CS feature, not base game)
- Volumetric shadows
- Reflection cubemaps
- Directional cascades (sun shadows)
- Focus shadows (character lights)

### Other systems which need compute-shader ports

- Culling (frustum, occlusion, portal-strict)
- Object fade
- Hidden objects
- NiSwitchNode
- Wind-animated foliage