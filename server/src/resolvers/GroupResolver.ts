import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Group } from "../entity/Group";
import { CreateGroupInput } from "../inputs/CreateGroupInput";

@Resolver()
export class GroupResolver {
  @Query(() => Group)
  group(@Arg("id") id: string) {
    return Group.findOne({ where: { id } });
  }
  @Query(() => [Group])
  groups() {
    return Group.find({ relations: ["students"] });
  }

  @Mutation(() => Group)
  async createGroup(@Arg("data") data: CreateGroupInput) {
    // data.course.id = "d5183504-b0f7-418b-aaa1-dfa2eb17b813";
    console.log("CreateGroupInput:", CreateGroupInput.toString());
    console.log("data:", data);
    const group = Group.create(data);
    console.log("group:", group);
    await group.save();

    return group;
  }
}
