export type Action = 'moveLeft' | 'moveDown' | 'moveRight' | 'moveUp'

export type KeyMap = { [key in Action]: string[] }

export type FlatKeyMap = { [key: string]: Action }
