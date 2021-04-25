## CoupangEats

- #01 First init

  > NestJS, GraphQL, TypeORM(postgres)

  ```bash
  npm i @nestjs/graphql graphql-tools graphql apollo-server-express

  npm install --save @nestjs/typeorm typeorm pg
  ```

- #02 NestConfig

  ```bash
  npm i --save @nestjs/config

  npm install --save-dev cross-env

  npm install --save joi
  ```

- #03 Restaurant Entity, DTO, Create Resolver

- #04 User Entity, DTO, Create Resolver, Relations User with Restaurant

- #05 Hashed Password

  ```bash
  npm install bcrypt
  ```

- #06 Jwt (Generated token)

  > Our Custom Module for Generated Token

- #07 JwtMiddleware

- #08 CurrentUser Decorator, Guard Based Role

- #09 Category Entity, Create Restaurant Mutation

- #10 Get Restaurants By Category

- #11 Get Restaurant By Id

- #12 Logged Check Guard

- #13 Dish, DishOption Entity

- #14 Add Dish Mutation with JSON Type Column

- #15 Delete Dish

- #16 Get Dish and Edit Dish

- #17 Edit Restaurant

- #18 Get Restaurants Pagination

- #19 Delete Restaurant

- #20 Update User

- #21 Send Verification Mail 1

- #22 Send Verification Mail 2

- #23 Verification User Mutation

- #24 Order Entity

- #25 Order Mutation 1

- #26 Order Mutation 2

- #27 Get Order Query

- #28 Edit Order

- #29 Edit Order Recap

- #30 Subscription 1

  > 우선 Subscription을 사용하려면 Subscription은 http 프로토콜이 아님을 알아야 한다.
  > http 프로토콜과 다른 프로토콜인 ws프로토콜을 사용해야 하고 그렇기 때문에 지금까지 사용했던 http 프로토콜이랑은 별개의 연결을 해줘야 한다.

- #31 Subscription 2

  > Subscripton의 pubSub은 asyncIterator와 publish로 크게 볼 수 있는데 publish는 subscription을 쏘는 친구고 asyncIterator는 쏜 것을 받는 친구라고 보면 된다.
  > publish는 2개의 args중 payload라는 아이를 가지는데 그 아이는 Subscription의 function이름이 된다.
