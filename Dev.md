
# Dev

```
npm config set unsafe-perm true
```

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

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

- Linux terminal
```
firebase functions:config:get > .runtimeconfig.json
```

- Windows PowerShell
```
firebase functions:config:get | ac .runtimeconfig.json
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

## OpenAPI

### Paypal in-app purchase

- Reference [Link](https://www.nodejsera.com/paypal-payment-integration-using-nodejs-part1.html)

### Weather

- Endpoint: `https://openweathermap.org/`

### Ubikhan

- Endpoint: `https://new.ubikhan.com/`

### Public Subway

- Reference: `https://data.seoul.go.kr/dataList/datasetView.do?infId=OA-111&srvType=A&serviceKind=1&currentPageNo=null`
- Station Code: `http://data.seoul.go.kr/dataList/datasetView.do?infId=OA-118&srvType=S&serviceKind=1`


| 노선 코드 | 노선 명 | 역사 명 | 역사 코드 |
|:-:|:-:|:-:|:-:|
| E  | 용인경전철 | 강남대  | 4502  |
| E  | 용인경전철 | 기흥  | 4501  |
| B  | 분당선 | 기흥  | 1865  |

### Public Bus

- 강남대역 정류소 번호 -> `228000694`
- 강남대역 건너편 정류소 번호 -> `228000684`

#### 강남대역 정류소 버스 정보

| 노선 명 | 노선 고유 번호 | 노선 종류 | 강남대역 | 강남대역 건너편 |
|:-:|:-:|:-:|:-:|:-:|
| 5000A용인  | `228000388`  | 직행  | 62  | 18  |
| 5000B용인  | `228000174`  | 직행  | 71  | 27  |
| 5001용인  | `228000176`  | 직행  | 61  | 26  |
| 5003A용인  | `228000389`  | 직행  | 54  | 18  |
| 5003B용인  | `228000182`  | 직행  | 64  | 28  |
| 5005용인  | `228000175`  | 직행  | 70  | 26  |
| 5600용인  | `228000184`  | 직행  | 89  | 26  |
| 8165고양  | `241004890`  | 공항  | 55  | 7  |

#### API
- 버스 도착 전체 노선 정보
`http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?serviceKey=<SERVICE_KEY>&busRouteId=<BUS UNIQUE ROUTE ID>`

- XML2JSON
`https://github.com/abdmob/x2js`
