---
title: "Fixing Skyrim's render pipeline (drawcall limit fix): part 2"
date: 2026-10-09
slug: fixing-skyrims-render-pipeline
authors: [panthuncia]
tags: [skyrim, rendering, vulkan]
description: "What needs to be done to make Skyrim GPU-driven"
---

In the last post on this topic we determined that the biggest issue with Skyrim's render pipeline was "the whole thing", and that to make meaningful improvements we would need to restructure it from the ground up. This post follows up on that, with a description of (a) what needs to be replaced, and (b) what the approach will look like.