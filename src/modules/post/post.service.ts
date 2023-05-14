import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const post = await this.postModel.create({
      ...createPostDto,
      user: userId,
    });
    return post;
  }

  async findAll(params: FilterDto) {
    const total = await this.postModel.count();
    const { limit = 10, page = 1 } = params;
    const posts = await this.postModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    return { page, inThisPage: posts.length, total, posts };
  }

  async me(params: FilterDto, userId: string) {
    const total = await this.postModel.count({ user: userId });
    const { limit = 10, page = 1, tags } = params;
    const filters: FilterQuery<Post> = {};
    filters.user = userId;
    if (tags) {
      /* filters.$or = tags.map((t) => {
        return {
          tags: t,
        };
      }); */
      filters.tags = { $elemMatch: { $in: tags } };
    }
    const posts = await this.postModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    return { page, inThisPage: posts.length, total, posts };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const updatedPlanificatedMovement = await this.postModel
      .findOneAndUpdate(
        { $and: [{ user: userId }, { _id: id }] },
        { $set: updatePostDto },
        { new: true },
      )
      .exec();

    if (!updatedPlanificatedMovement) {
      throw new NotFoundException(`Movement with id ${id} not found`);
    }
    return updatedPlanificatedMovement;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
