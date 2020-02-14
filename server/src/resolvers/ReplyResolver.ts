import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Reply } from "../entities/Reply";
import { ReplyInput } from "../inputs/ReplyInput";
import { User } from "../entities/User";
import { Question } from "../entities/Question";

@Resolver()
export class ReplyResolver {
  @Query(() => [Reply])
  async replies() {
    console.log("replies", await Reply.find({ relations: ["student", "question"] }));

    return Reply.find({ relations: ["student", "question"] });
  }
  @Query(() => Reply)
  async reply(@Arg("id") id: string) {
    console.log("reply:", await Reply.findOne({ where: { id }, relations: ["student", "question"] }));
    return Reply.findOne({ where: { id }, relations: ["student", "question"] });
  }

  @Mutation(() => Reply)
  async createReply(
    @Arg("data") data: ReplyInput,
    @Arg("currentUserId") currentUserId: string,
    @Arg("questionId") questionId: string,
  ) {
    console.log("data:", data);

    const reply = Reply.create(data);
    reply.student = await User.findOne({ where: { currentUserId } });
    reply.question = await Question.findOne({ where: { questionId } });

    console.log("reply:", reply);

    await reply.save();

    return reply;
  }
}
