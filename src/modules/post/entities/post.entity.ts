import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Post extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Number, default: 0, validators: { min: 0 } })
  reactions: number;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  images: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
