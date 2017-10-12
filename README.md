# Chingu Dashboard

_[ Screenshot to be included ]_

## What?

Chingu Dashboard is a tool designed to help the Chingu Admin team with managing the Chingu Cohorts, by simplifying and automating certain parts of their current existing workflows.

## Why?

At the time of creating this project, the Chingu Admin team was still working on automating their member selection / approval / rejection process. They were still most of the required tasks by hand. (For example, they would have to copy and paste recipients' addresses manually before sending out emails.)

Given Chingu's growing member base and popularity, we wanted to lighten the workload of the Chingu Admin team, while also ensuring that they could spend their time on more meaningful tasks, such as checking up on each teams' progress rather than copying and pasting stuff.

Also, we **hate** it when people have to waste their time doing manual labor that can be automated.

## Getting Started (Installation Guide)

1. Clone a copy of the repo.
1. Run `npm install` to install all packages first.
1. Run `npm start`. (This executes `npm run build:dev` and `npm run start:dev`.) By running this command, npm will watch for changes in files on server code and client code. If there are changes, npm reloads the server or rebuilds client code.

### Additional Details

What do those commands do?

1.  `npm run build:dev` builds client code and watches for new changes
1. `npm run start:dev` starts server and watches for new changes
1. `clean:cache` is supposed to clean the cache file. Currently, it removes the `build` folder. Need to fix that.

You will want to use `npm start` because it runs both npm scripts in parallel.

## Contributing

Interested in contributing? Check out our [contributor's guide](CONTRIBUTING.md)!
