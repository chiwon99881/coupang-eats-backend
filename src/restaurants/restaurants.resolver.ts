import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
export class RestaurantsResolver {
    @Query(type => Boolean)
    goBool(): boolean {
        return true;
    }
}