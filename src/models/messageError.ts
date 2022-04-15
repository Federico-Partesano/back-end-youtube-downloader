

type Elements = 'Match' | 'Chat' | 'User' | 'Nickname' | 'Club';



export type MessageError = `Invalid ${'nickname' | 'request' | 'content' | "club" | "User"}!` |
 `${Elements} not found!` | 
 `${Elements} already ${'exists!' | 'used!'}`|
 `Wrong ${Elements | 'credentials!'}` | 
 'Not is your turn!' | 
 'Body values must be less than 8 and greater than 0!' |
 'This User already logged!'



