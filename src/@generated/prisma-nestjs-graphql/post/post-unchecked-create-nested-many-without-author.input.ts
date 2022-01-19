import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { PostCreateWithoutAuthorInput } from './post-create-without-author.input';
import { PostCreateOrConnectWithoutAuthorInput } from './post-create-or-connect-without-author.input';
import { PostWhereUniqueInput } from './post-where-unique.input';

@InputType()
export class PostUncheckedCreateNestedManyWithoutAuthorInput {

    @Field(() => [PostCreateWithoutAuthorInput], {nullable:true})
    create?: Array<PostCreateWithoutAuthorInput>;

    @Field(() => [PostCreateOrConnectWithoutAuthorInput], {nullable:true})
    connectOrCreate?: Array<PostCreateOrConnectWithoutAuthorInput>;

    @Field(() => [PostWhereUniqueInput], {nullable:true})
    connect?: Array<PostWhereUniqueInput>;
}
