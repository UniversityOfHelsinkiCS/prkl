import { InputType, Field } from "type-graphql";
import { IsInt, IsEmail, Min, Max, Length, IsOptional } from "class-validator";

@InputType()
export class UserInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  shibbolethUid: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(3)
  role: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(9, 9)
  studentNo: string;

  @Field()
  @IsEmail()
  email: string;
}
