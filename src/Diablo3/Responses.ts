import {Gender, Class} from './characters'

/**
 * Battle.net profile interface
 * @var {interface}
 */
export interface BnetProfile
{
    battleTag? : string,
    paragonLevel?: number,
    paragonLevelHardcore? : number,
    paragonlevelSeason? : number,
    paragonLevelSeasonHardcore? : number,
    guildName?: string,
    heroes? : Hero[],
    lastHeroPlayedId? : number,
    lastUpdated? : any,
    kills? : Kills,
    highestHardcoreLevel? : number,
    timePlayed? : any,
    progression? : Progression,
    seasonalProfiles? : any,
    blacksmith_level? : number,
    jeweler_level? : number,
    mystic_level? : number,
    blacksmith_season_level? : number,
    jeweler_season_level? : number,
    mystic_season_level? : number,
    blacksmith_hardcore_level? : number,
    jeweler_hardcore_level? : number,
    mystic_hardcore_level? : number,
    blacksmith_season_hardcore_level? : number,
    jeweler_season_hardcore_level? : number,

}

/**
 * Diablo 3 Hero API Object
 * @var {interface}
 */
export interface Hero
{
    id? : number,
    name? : string,
    class? : Class,
    classSlug? : Class,
    gender? : Gender,
    level? : number,
    kills? : Kills,
    paragonLevel? : number,
    hardcore? : boolean,
    seasonal? : boolean,
    dead? : boolean,
    last_updated? : any
}

/**
 * Diablo3 Kills API Object
 * @var {interface}
 */
export interface Kills
{
    monsters? : number,
    elites? : number,
    hardcoreMonsters? : number
}

/**
 * Diablo3 Act Progresion API Object
 * @var {interface}
 */
export interface Progression 
{
    act1? : boolean,
    act2? : boolean,
    act3? : boolean,
    act4? : boolean,
    act5? : boolean
}

/**
 * Diablo3 Character API Object
 * @var {interface}
 */
export interface Character
{
    id? : number,
    name? : string,
    class? : Gender,
    level? : number,
    kills? : Kills,
    hardcore? : boolean,
    seasonal? : boolean,
    seasonCreated? : number,
    skills? : any,
    items? : any,
    followers? : any,
    legendaryPowers? : any,
    progression? : Progression,
    alive? : boolean,
    lastUpdated? : any,
    highestSoloRiftCompleted? : number
    stats : any
}

/**
 * Diablo3 Character Item detailed list API Object
 * @var {interface}
 */
export interface CharacterItems
{
    head? : Item,
    neck? : Item,
    torso? : Item,
    shoulders? : Item,
    legs? : Item,
    waist? : Item,
    hands? : Item,
    bracers? : Item,
    feet? : Item,
    leftFinger? : Item,
    rightFinger? : Item,
    mainHand? : Item,
}

/**
 * Diablo3 Item API Object
 * @var {interface}
 */
export interface Item 
{
    id? : number,
    name? : string,
    icon? : string,
    displayColor? : string,
    tooltipParams? : string,
    requiredLevel? : number,
    itemLevel? : number,
    stackSizeMax? : number,
    accountBound? : boolean,
    flavorText? : string,
    typeName? : string,
    type? : any,
    armor? : number,
    damage?: number,
    dps? : number,
    attacksPerSecond? : number,
    minDamage? : number,
    maxDamage? : number,
    elementalType? : string,
    slots? : string,
    attributes? : any,
    attributesHtml? : any,
    openSockets? : number,


}