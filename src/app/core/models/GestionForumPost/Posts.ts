import { User } from "../GestionUser/User";
import { CommentPosts } from "./CommentPosts";
import { EmojiPosts } from "./EmojiPosts";
import { ImagePosts } from "./image-posts";

export class Posts {

    idPost?: number;
    content!: string;
    ImageP!: string;
    title!: string;
    createdAt!: Date;
    updatedAt!: Date;
    upVote!: number;
    downVote!: number;
    imageType!: string;
    user!: User | null;           
  emojiPosts!: EmojiPosts[];   
  commentPosts!: CommentPosts[];
  imagePosts!: ImagePosts[];
  
  
}
