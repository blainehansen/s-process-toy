Hello Survival and Flourishing Fund!

This repo is a small toy version of the S-process. It represents roughly three sessions of tinkering, mostly just to help my application stand out 😊

It's obviously just a small thing, and intentionally ignores lots of details I would flesh out fully if this were the "real" project. This page lists some of those ignored pieces and what I would theoretically do next.

# Ignored details

- The curves are just simple quadratic Bezier curves where the *control* point is manipulated instead of a point ["fitted" onto the line](http://scaledinnovation.com/analytics/splines/aboutSplines.html). Since the existing S-process algorithm uses some specific equations that likely don't conform to Bezier curves, I didn't think it was worth spending a bunch of time figuring out ultimately unneeded geometry.
  - Question: does the S-process actually use "iterations" to find the funding solution? Or is there a closed form equation that can be used to maximize the marginal value across funders? I don't know what the equations in play are, and what process you're using to find the maximum on the multi-dimensional curve produced by all the curves. I'm very curious to learn more!

- The toy allows saving curve data to Google Sheets, using their [authentication/permission system](https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit_flow_examples) and the [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts). The only problem is [Google requires apps to go through a verification process to use certain "permission" scopes](https://support.google.com/cloud/answer/9110914), so right now this toy is just in "testing mode". It works for me! (*Most of the time*, since I hacked it together so quickly it's kinda flaky.) [Here's a screencast of me using it.](https://s-process-toy.blainehansen.me/s-process.gif)
  - I was intending to also allow *loading* curve data from an existing Sheet, but discovered the Sheets API [doesn't allow "listing" sheets or "picking" a particular sheet](https://stackoverflow.com/questions/37876423/get-the-list-of-all-spreadsheets-associated-with-google-account-using-sheets-api), which requires using the [Google Drive API](https://developers.google.com/sheets/api/guides/migration#v4-api_4). If this was a real project I would push through those details and make it work, but for a little toy it was just unnecessary [scope creep](https://en.wikipedia.org/wiki/Scope_creep).

- I'm not a designer! I spent basically no time making this pretty, since "legible" is good enough for a toy right?

# Specifics

- The point coordinates are "clamped" to each other (the mid point can't go higher than the start point, etc) in a fairly blunt way that makes getting the shape exactly right a bit difficult, but it nonetheless ensures the curves monotonically decrease. Is that an accurate requirement of the real S-process? Now that I've stopped hacking I suppose there could be some situations where a funder could think the marginal value for a project will increase with spending (building factories, etc) :shrug:

- I implemented this in [Vue](https://vuejs.org/), mostly just because it's familiar and fairly lightweight. Frameworks are all tradeoffs, I would build the real project in whatever made sense given constraints (such as whatever the current implementation uses).

- I embedded all the svg elements directly rather than use a library such as [chart.js](https://www.chartjs.org/) or [konva](https://konvajs.org/) or [d3](https://d3js.org/), since for small things like this it is usually simpler and performs better (and it's fun to play with svg in my opinion). I'd use a library if it made sense based on the constraints (sensing a theme?).

Thanks!
