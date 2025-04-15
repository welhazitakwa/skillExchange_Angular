import { User } from "../GestionUser/User";
import { CommentPosts } from "./CommentPosts";
import { EmojiPosts } from "./EmojiPosts";

export class Posts {

    idPost!: number;
    content!: string;
    ImageP!: string;
    title!: string;
    createdAt!: Date;
    updatedAt!: Date;
    upVote!: number;
    downVote!: number;
    user!: User | null;           
  emojiPosts!: EmojiPosts[];   
  commentPosts!: CommentPosts[];
  
}
