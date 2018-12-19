# KangnamShuttle-3.0
강남대학교 셔틀버스 시간표 안내 카카오톡 챗봇 3.0 버전

# Dev

init

```
gimhyeon-uui-MacBook-Pro:KangnamShuttle-3.0 stories2$ firebase init

     🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥     🔥🔥🔥     🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥
     🔥🔥        🔥🔥  🔥🔥     🔥🔥 🔥🔥       🔥🔥     🔥🔥  🔥🔥   🔥🔥  🔥🔥       🔥🔥
     🔥🔥🔥🔥🔥🔥    🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥   🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥
     🔥🔥        🔥🔥  🔥🔥    🔥🔥  🔥🔥       🔥🔥     🔥🔥 🔥🔥     🔥🔥       🔥🔥 🔥🔥
     🔥🔥       🔥🔥🔥🔥 🔥🔥     🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥 🔥🔥🔥🔥🔥🔥🔥🔥  🔥🔥     🔥🔥  🔥🔥🔥🔥🔥🔥  🔥🔥🔥🔥🔥🔥🔥🔥

You're about to initialize a Firebase project in this directory:

  /Users/stories2/Documents/GitHub/KangnamShuttle-3.0

? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Enter to confirm your choices. Functions: Configure and deploy Cloud Functions, Hosting
: Configure and deploy Firebase Hosting sites

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add, 
but for now we'll just set up a default project.

? Select a default Firebase project for this directory: KangnamShuttle3 (kangnamshuttle3)

=== Functions Setup

A functions directory will be created in your project with a Node.js
package pre-configured. Functions can be deployed with firebase deploy.

? What language would you like to use to write Cloud Functions? JavaScript
? Do you want to use ESLint to catch probable bugs and enforce style? No
✔  Wrote functions/package.json
✔  Wrote functions/index.js
? Do you want to install dependencies with npm now? Yes

```

## Set/Get env var

### Set
```
firebase functions:config:set someservice.key="THE API KEY"
```

### Get
```
firebase functions:config:get
```

## Trouble shooting 
- Cannot start emulate firebase functions
[reference](https://github.com/firebase/firebase-tools/issues/442)
```
sudo npm install -g firebase-tools

sudo npm install -g grpc --allow-root --unsafe

cd /path/to/global/node_modules/firebase-tools/node_modules

sudo rm -rf grpc

ln -s /path/to/node_modules/grpc/ /path/to/node_modules/firebase-tools/node_modules/grpc

cd /to/your/project/functions

firebase serve --only functions
```

- Undefined env variable
```
firebase functions:config:get > .runtimeconfig.json
``` 

## Deployment

After coded if you want deploy to cloud server, please type it in terminal.
```
firebase deploy --only functions
```

And this is how to deploy hosting
```
firebase deploy --only hosting
```

## Run

If you want run this project locally, please type it in terminal.
```
sudo firebase serve --only functions
```

## Input type

* text
* photo
* video
* audio