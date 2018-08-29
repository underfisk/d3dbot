/**
 * Interface defined as a pattern for the commands
 */
export interface Command
{
    key : string,
    description : string,
    args: string
}
/**
 * Defined commands (not the best way but practical)
 */
export var D3DCommands : Command[] = [
    { key : "account", description: "You can retrieve a battle.net information", args: "battlenet#id"},
    { key : "commands", description: "You can get the list of all the existing commands", args: "none"},
    { key : "character", description: "Retrieves a single character and displays the information", args:"battlenet#id, hero_id"},
    { key : "character_items", description: "Retrieves a single character items detailed information", args:"battlenet#id, hero_id"},
    { key : "item", description: "Retrieves a single detailed item with the slug/id", args:"itemSlugAndId"}
]
