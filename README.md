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

- #32 Subscription 3 (Authentication)

  > 기존에는 http headers에서 토큰을 받아 토큰으로 유저를 찾아냈지만 Subscription은 http가 아니라 headers가 없다 그래서 인증할 다른 방법을 찾아야 한다.
  > Subscription은 토큰을 connection의 context에서 알려주기 때문에 connection의 context에서 토큰을 받아와야 한다.
  > 받아오는 것 까지 좋은데 그 토큰으로 유저 인증을 해야하는데 기존에 JwtMiddleware에서 인증을 했는데 얘는 이제 Subscription일 때는 사용이 불가함 Subscription은 request,response라는 개념이 없기 떄문에
  > 그러니까 전역으로 사용되는 AuthGuard에서 이제 토큰을 통해 인증을 해줘야함 그래서 JwtMiddleware를 지우고 AuthGuard에 토큰인증 로직을 넣은 것
  > 여기까지도 좋은데 만약, 롤은 필요없지만 로그인은 되어있어야 한다면? 그래서 내가 CurrentUser Decorator를 통해 유저를 알아내야 하는 Resolver라면?
  > 이러면 또 문제가 하나 생긴다. AuthGuard에서는 Role이 없을때 바로 true를 리턴하게 만들었기 때문에 ctx에 유저를 넣지 않는다. 그래서 ctx에서 유저를 가져오는 CurrentUser Decorator가 User를 못가져온다.
  > 그렇기 때문에 AuthGuard에서 롤은 없지만 ctx 내부에 token이 있다면 token을 해석하여 ctx에 유저를 추가하게끔 만들어줬다.

- #33 Subscription 4 (Filter)

- #34 Subscription 5

- #35 Subscription 6 (getOrderSubscription for Owner)

  > resolve function은 해당 Subscription함수가 리턴하는 값을 조정할 수 있게 하는 함수이다.

- #36 Total Price Sum

- #37 Subscription 7 (cookedOrder for Rider)

- #38 Subscription 8 (changeOrder for everyone)

- #39 Subscription 9 (assignRider Mutation)
