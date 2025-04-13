export enum EmojiType {
  Like = '👍',
  Love = '❤️',
  Laugh = '😂',
  Wow = '😮',
  Sad = '😢',
  Angry = '😡'
}

// Ajout de la signature d'index pour éviter l'erreur TypeScript
export const EmojiTypeMapping: { [key in EmojiType]: string } = {
  [EmojiType.Like]: 'LIKE',
  [EmojiType.Love]: 'LOVE',
  [EmojiType.Laugh]: 'LAUGH',
  [EmojiType.Wow]: 'WOW',
  [EmojiType.Sad]: 'SAD',
  [EmojiType.Angry]: 'ANGRY'
};
