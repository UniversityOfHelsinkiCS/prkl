import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Reply } from "../entity/Reply";
import { CreateReplyInput } from "../inputs/CreateReplyInput";
import { User } from "../entity/User";

@Resolver()
export class ReplyResolver {
  @Query(() => [Reply])
  async replies() {
    console.log("replies", await Reply.find({ relations: ["student"] }));

    return Reply.find({ relations: ["student"] });
  }
  @Query(() => Reply)
  async reply(@Arg("id") id: string) {
    console.log("reply:", await Reply.findOne({ where: { id }, relations: ["student"] }));
    return Reply.findOne({ where: { id }, relations: ["student"] });
  }

  @Mutation(() => Reply)
  async createReply(@Arg("data") data: CreateReplyInput, @Arg("currentUserId") currentUserId: string) {
    console.log("data:", data);
    const reply = Reply.create(data);
    reply.student = await User.findOne({ where: { currentUserId } });
    console.log("reply:", reply);
    await reply.save();
    return reply;
  }
}
