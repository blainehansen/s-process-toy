Hello Survival and Flourishing Fund!

This repo is a small toy version of the S-process. I put it together in a few hours of tinkering, mostly just to help my application stand out 😊

It's obviously just a small thing, and intentionally ignores lots of important details. This readme lists some of those ignored pieces and what I would theoretically do next. I'd love to talk about this live sometime!

# Ignored details

- The curves are just simple quadratic Bezier curves where the *control* point is manipulated instead of a point ["fitted" onto the line](http://scaledinnovation.com/analytics/splines/aboutSplines.html). Since the existing S-process algorithm certainly has some specific equations being used that don't necessarily conform to Bezier curves, I didn't think it was worth spending a bunch of time figuring out geometry that wouldn't ultimately be useful.
  - Question: does the S-process actually use "iterations" to find the funding solution? Or is there a closed form equation that can be used to maximize the marginal value across funders? I don't know what the equations in play are, and what process you're using to find the maximum on the multi-dimensional curve produced by all the curves. This project sounds like a great excuse to brush up on my multi-variate calculus!

- This is a "front-end-only" implementation with no persistence layer (can't save the curves anywhere), since that requires spinning up actual infrastructure that has to be torn down again at some point. Saving things somewhere (a database, in a cloud storage bucket, even in a google sheet or something) would be easy enough, it's just a matter of the project requirements.

- I'm not a designer! I spent basically no time making this pretty, "legible" is good enough for a toy.

# Specifics

- The point coordinates are "clamped" to each other (the mid point can't go higher than the start point, etc) in a fairly blunt way that makes getting the shape exactly right a bit difficult, but it nonetheless ensures the curves monotonically decrease. Is that an accurate requirement of the real S-process? Now that I've stopped hacking I suppose there could be some situations where a funder could think the marginal value for a project will increase with spending (building factories, etc) :shrug:

- I implemented this in [Vue](https://vuejs.org/), mostly just because it's familiar and fairly lightweight. Frameworks are all tradeoffs, I would build the real project in whatever made sense given constraints (such as whatever the current implementation uses).

- I embedded all the svg elements directly rather than use a library such as [chart.js](https://www.chartjs.org/) or [konva](https://konvajs.org/) or [d3](https://d3js.org/), since for small things like this it is usually simpler and performs better (and it's fun to play with svg in my opinion). I'd use a library if it made sense based on the constraints (sensing a theme?).

Thanks!
