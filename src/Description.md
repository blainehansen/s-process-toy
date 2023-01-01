# Hello Survival and Flourishing Fund!

This repo is a small toy version of the S-process. It represents a few sessions of hacking, and I did it just to help my application stand out 😊

It's not complete or polished, and intentionally ignores lots of details I would flesh out fully if this were the "real" project.

## Ignored details

- The "curves" are just straight lines between the points, at least by default. The "curvy mode" button switches from lines to a simple quadratic Bezier curve where the *control* point is manipulated instead of a point "fitted" onto the line. I played with using curves that smoothly interpolated between the points as is discussed in [this link](http://scaledinnovation.com/analytics/splines/aboutSplines.html), but any version of such simply fitted curves doesn't monotonically decrease in the way I felt was correct and intuitive for marginal utility curves. Since the existing S-process algorithm uses some specific equations that likely don't conform to Bezier curves, I didn't think it was worth spending a bunch of time figuring out ultimately unneeded geometry.
  - Question: does the S-process actually use "iterations" to find the funding solution? Or is there a closed form equation that can maximize the marginal value across funders? I don't know what the equations the current implementation uses, and what process you're using to find the maximum on the multi-dimensional curve produced by all the curves. I'm very curious to learn more!

- The toy allows saving curve data to Google Sheets, using their [authentication/permission system](https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#implicit_flow_examples) and the [Google Sheets API](https://developers.google.com/sheets/api/guides/concepts). Since this is just a toy I haven't implemented this as robustly as I would in a real project (I'm not even sure saving to Google Sheets is a good product choice!) Here are some of the issues:
  - [Google requires apps to go through a verification process to use certain "permission" scopes](https://support.google.com/cloud/answer/9110914), so right now this toy is just in "testing mode". [Here's a screencast of me using it.](https://s-process-toy.blainehansen.me/s-process.gif)
  - I haven't fully handled [access token expiration](https://developers.google.com/identity/oauth2/web/guides/migration-to-gis#token_request), so there are some flaky situations that require a page refresh.
  - I was intending to also allow *loading* curve data from an existing Sheet, but discovered the Sheets API [doesn't allow "listing" sheets or "picking" a particular sheet](https://stackoverflow.com/questions/37876423/get-the-list-of-all-spreadsheets-associated-with-google-account-using-sheets-api), which requires using the [Google Drive API](https://developers.google.com/sheets/api/guides/migration#v4-api_4). I decided pushing through those details for a toy like this would be [scope creep](https://en.wikipedia.org/wiki/Scope_creep).

- I'm not a designer! I spent basically no time making this pretty, since "legible" is good enough for a toy right?

## Specifics

- The point coordinates are "clamped" to each other (the mid point can't go higher than the start point, etc) in a fairly blunt way that makes getting the shape exactly right a bit difficult, but it nonetheless ensures the "curves" monotonically decrease. Is that an accurate requirement of the real S-process?

- I implemented this in [Vue](https://vuejs.org/), mostly just because it's familiar and fairly lightweight. Frameworks are all tradeoffs, I would build the real project in whatever made sense given constraints, such as whatever the current implementation uses. What tech does the current implementation use? Is it public? I couldn't find the repo for it anywhere online.

- I embedded all the svg elements directly rather than use a library such as [chart.js](https://www.chartjs.org/) or [konva](https://konvajs.org/) or [d3](https://d3js.org/), since for small things like this it is usually simpler and performs better (and it's fun to play with svg in my opinion). I'd use a library if it made sense based on the constraints (sensing a theme?).

Thanks!
