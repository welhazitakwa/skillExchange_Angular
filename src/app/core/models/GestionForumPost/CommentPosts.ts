import { EmojiComments } from "./EmojiComments";
import { Posts } from "./Posts";

export class CommentPosts {

	
//  idComment!:number;
// content!:string;
// createdAt!:Date| null;
// updatedAt!:Date| null;
// post_id_post!:Posts;
// email!:string;
// emojiComments!: EmojiComments[];  
idComment!:number;
content?:string;
createdAt?:Date| null;
updatedAt?:Date| null;
post_id_post?:Posts;
email!:string;
emojiComments?: EmojiComments[];  
}
