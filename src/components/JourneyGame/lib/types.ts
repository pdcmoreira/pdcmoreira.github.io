export type MovementAction = 'moveLeft' | 'moveDown' | 'moveRight' | 'moveUp'

export type TriggerActions = 'main'

export type Action = MovementAction | TriggerActions

export type KeyMap = { [key in Action]: string[] }

export type FlatKeyMap = { [key: string]: Action }
