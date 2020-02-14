import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Reply } from "../entities/Reply";
import { ReplyInput } from "../inputs/ReplyInput";
import { Registration } from "../entities/Registration";
import { Question } from "../entities/Question";

@Resolver()
export class ReplyResolver {
  @Query(() => [Reply])
  async replies() {
    console.log("replies", await Reply.find({ relations: ["registration", "question"] }));

    return Reply.find({ relations: ["registration", "question"] });
  }
  @Query(() => Reply)
  async reply(@Arg("id") id: string) {
    console.log("reply:", await Reply.findOne({ where: { id }, relations: ["registration", "question"] }));
    return Reply.findOne({ where: { id }, relations: ["registration", "question"] });
  }

  @Mutation(() => Reply)
  async createReply(
    @Arg("data") data: ReplyInput,
    @Arg("registrationId") registrationId: string,
    @Arg("questionId") questionId: string,
  ) {
    console.log("data:", data);

    const reply = Reply.create(data);
    reply.registration = await Registration.findOne({ where: { registrationId } });
    reply.question = await Question.findOne({ where: { questionId } });

    console.log("reply:", reply);

    await reply.save();

    return reply;
  }
}
