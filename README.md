# demo-dfc
Demo of Chainguard's Dockerfile converter (dfc) tool. A simple NodeJS app is migrated from a standard node image to a Chainguarded image, showing the dfc's capabilities.
## Assumptions
The Chainguard dockerfile converter (dfc) has been [installed](https://github.com/chainguard-dev/dfc?tab=readme-ov-file#installation)
## Usage
`docker build -f nodejs-ubuntu.before.Dockerfile . -t before-dfc-app`

`docker run --name before-dfc-app --rm -p 3000:3000 before-dfc-app`

[open the before server](http://localhost:3000)

Run the dfc:
`dfc nodejs-ubuntu.before.Dockerfile > nodejs-ubuntu.after.Dockerfile`

NOTE: because of differences in the behavior of `useradd` and `adduser` add `-D` to the after.Dockerfile.

`docker build -f nodejs-ubuntu.after.Dockerfile . -t after-dfc-app`

`docker run --name after-dfc-app --rm -p 3001:3000 after-dfc-app`

[open the after server](http://localhost:3001)
