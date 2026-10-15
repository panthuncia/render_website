# What I'm working on- all the parts, what the acronyms mean, and how it fits together

There's been some questions about what exactly all the pieces of what I'm working on at the moment are, especially since they're often addressed as acronyms, so I though I'd lay out exactly what I'm working on, and what each piece contributes.

# General Computer Graphics libraries

The projects I'm working on tend to be very complex <sup>(citation needed)</sup>, and rely on modern graphics API features from Vulkan/DX12, which means I need to *use* Vulkan/DX12. However, Vulkan itself (and DX12) are *incredibly* complex APIs, which require *very* low-level code, down to the granularity of having to manage per-resource cache flush behavior manually to ensure that a shader which reads from a buffer another shader produced actually sees the correct data. As such, it is very much not recommended to use them 'raw' for such a large-scope project- the code would become unmanageable, and be full of bugs. Instead, we need to abstract a lot of the complexity out, such that we can program in a much more developer-friendly API, designing systems to automatically leverage Vulkan/DX12 correctly, and to its full potential. This is where the next two projects of mine come into play: OpenRenderGraph, and BasicRHI (these will have their own dedicated, much longer writeups, for those interested in the technical aspects of this work).
## OpenRenderGraph (ORG)

OpenRenderGraph is, as it is named, an open-source render graph framework. A render graph is a system which takes some set of passes (render pass, compute pass, etc), where a 'pass' contains (a) a sequence of commands to execute, and (b) a declaration of what data will be used by that pass, and in what way (read or write, basically), and from a sequence of said passes, computes an execution schedule, with all of the annoying GPU API details taken care of automatically. It can also perform automatic memory aliasing (reusing the same GPU memory throught the frame for different purposes), and can automatically break work out onto the async compute queue when useful. Having a system like this massively simplifies working with something like Vulkan- instead of having to explicitly program every single memory barrier, and decide which GPU resources can share the same backing memory, etc, you can just give the render graph the passes you intend to execute, and it figures all of that out for you.

## BasicRHI (Render Hardware Interface)

This is nice, but it still leaves one issue- if I just wrote OpenRenderGraph using Vulkan (or DX12) directly, it would be *stuck* on that API, with no flexibility for platforms that don't have that specific API. That's where BasicRHI comes in- a library which takes both Vulkan *and* DirectX12, and creates a single wrapper API which can be used to run the same code on either API (and, interestingly, can actually *interleave* different render passes running on *different* APIs throughout the frame). This means that code I write for OpenRenderGraph can run on any platform that supports an API BasicRHI supports (currently just DX12 and Vulkan), rather than being limited to a single API.

# Skyrim-specific projects

On top of these libraries, I've been working on several Skyrim-related things, starting with:

## Skyrim Advanced Rendering Project (SARP)

This is my testing ground for experimenting with advanced topics in computer graphics, with the guiding focus of "what if we wanted to be able to stream Skyrim's world at any cell radius seamlessly, up to and including having the entire Skyrim map loaded at once, while also eliminating all of the geometry and texturing limitations Skyrim has? How would such a system need to be designed, and how performant can it be?". This has helped me experiment with and optimize topics such as:

- GPU-driven rendering
- Virtualized geometry
- GPU-driven texture MIP streaming
- Stutter-free world streaming at any scale
- Lock-free parallel programming

This system is very advanced, but it currently exists *entirely outside* of the game. It is launched through its own executable, and reads game files directly. Some elements of this will come to CS directly (deferred rendering, GPU-driven rendering, etc.), and others may either be future CS features, or may be part of a separate dll that only *interfaces* with CS- some of that has yet to be determined.

Bringing these features to Skyrim needs to be done incrementally- many of them either directly depend on another feature, or would be best used while another is enabled. However, I decided to start with by far the largest lift:

## Drawcall Limit Fix (GPU driven rendering, current focus)

As described in my previous post, when designed properly, GPU-driven rendering allows you to collapse CPU-side per-object per-frame costs to zero. Instead of looping over every potentially visible object, we keep the objects active in the scene persistently in GPU memory, and then use the GPUs thousands of threads to decide which are visible in parallel. This *does* introduce a small amount of GPU work (meaning without other changes, GPU-bound performance will go down a bit- more on how we mitigate this in future posts), but in exchange, there is effectively no upper bound on the number of objects that can be in the scene. Ten thousand or a million, all that changes is that the GPU culling pass might take a couple hundred microseconds longer. Designing this system will be the focus of my next few posts, and borrows heavily from my experience and designs from SARP.

## Texture MIP streaming

Skyrim loads textures at full quality for all objects in the scene. If we want people to be able to add a ton more objects into the scene (as DCLF will allow), it needs to stop doing this, and instead load only the mipmaps needed by the visible object, at their current distance. Furthermore, the approach needs to be GPU-driven- we're operating under the assumption that we can't be looping over all scene objects on the CPU, so this needs to (a) operate based on GPU feedback, only for textures we *actually* need, and (b) be as low-latency as possible.

This is already implemented in SARP (with DirectStorage support), and can largely be ported 1-1. It should reduce in-game material texture VRAM usage to a flat ~2-3GB (it won't increase it if you're already under this), regardless of how high-resolution the actual textures themselves are.

## Deferred Rendering

When rendering geometry on the GPU, there are three questions that must be answered:

- Where is the object
- What are the properties of this object's material
- Given the lights in the scene, and the material of the object, what should its final color be

Renderers that address all of these questions in one step are called "forward renderers", They rasterize scene geometry once (or twice, with a depth-only prepass as an optimization), and calculate (almost) everything the rest of the system needs to know about these objects in that single shader. this has some advantages, and makes things like MSAA (multi-sample anti-aliasing) easier, but it also has severe disadvantages- primarily, it requires one gigantic shader program that evaluates the material, calculates lighting, and also writes any intermediate buffers later stages need (scene normals are a common example), meaning the shader program becomes very complex, often performs poorly (for various reasons) and you need a *lot* of different variants (geometry variants * material variants * lighting variants) - leading to a combinatorial explosion of shader permutations. Skyrim's renderer is *basically* a forward renderer. It does do *some* lighting operations after the raster pass, but I would still generally classify it as "basically forward". This is also directly tied to the light limit.

Deferred rendering takes a different approach- instead of doing all of the work upfront, it runs a smaller rasterization shader that only answers the first two questions (position and material properties), and then does a compute shader pass to evaluate the lighting per-pixel. This has several benefits, but the important ones for Skyrim would be reducing shader permutation count, and completely eliminating the limits on the number of lights (and shadowed lights) in a scene.

There is also a third type of renderer called "visibility buffer", which splits all *three* questions into different shaders (this is what SARP uses), with even more benefits, but that is a discussion for later.?

## Others

Several others (including virtual shadow maps) are on the pipeline (and already exist in SARP), but are too far away to discuss for now)

# Release Plans

Think of OpenRenderGraph and BasicRHI as developer tools- they enable everything I'm doing, but won't release as dedicated features/mods. 

The first thing to *actually* release (other than my secret evil side project) will be the beta test for drawcall limit fix. I would estimate a few weeks for this to be ready for testing, though it may come sooner if I solve some problems faster than I anticipate. Full release timing depends on how (a) many issues people run into, and (b) how quickly I can get the code into a shape I feel comfortable merging into CS- especially the ORG integration, since the expectation is that it will become the system through which all ORG (Vulkan/DX12) features communicate and are scheduled.

Beyond that, texture streaming is *probably* next, as it is directly related to enabling DCLF to be used to its full potential, with either deferred rendering or virtual shadow maps after that.

