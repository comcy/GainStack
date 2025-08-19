# GainStackUi

The UI for a simple workout tracker.
The application is served as a web view and as a PWA.

## Development

For web view during development with live reloading
```bash
ng serve 
```

Testing the build artifact (e.g. the PWA) by using a custom http server
```bash
npx http-server dist/gain-stack-app/browser -p 8080 -c-1 --fallback index.html
```

## Build

```bash
ng build --configuration production --base-href=/ 
```


## Deployments

Following the guide unter [## Build](#build).
Depending to the deployment platform it could be neccessary to add a rewrite rule.

### nginx

tbd


### Netlify

Adding a `_redirects` file:
```txt
/*    /index.html   200
```
---

## Application creation steps


```bash
ng new gain-stack-ui --standalone --routing --style=scss --strict=true --create-application=false
```

Create angular workspace

```bash
cd gain-stack-ui
ng g application gain-stack-app
```

Create application

```bash
cd gain-stack-ui
ng g application gain-stack-app

```
Add PWA feature
```bash
ng add @angular/pwa --project gain-stack-app
```
