import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true, default: false })
  is_delete: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  blocked_users: Types.ObjectId[];

  @Prop({ default: Date.now() })
  created_at: Date;

  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
