import axios from 'axios'
import {BnetProfile, Character, Item, CharacterItems} from './Responses'

/**
 * All the communications are made here within a required instance in order
 * to request data from Blizzard API
 * 
 * @author Enigma
 * @package D3Bot
 */
export class API
{
    /**
     * OAuth2 client id from Blizzard Dev Portal
     */
    private client_id : string = ""

    /**
     * OAuth2 client secret from Blizzard Dev Portal
     */
    private client_secret : string = ""

    /**
     * Token is automaticly defined after retrieved
     * using client_id and client_secret
     */
    private token: string = ""

    /**
     * Defines the region where we'll search data
     * default "eu"
     */
    private region : string = "eu"

    /**
     * Blizzard API game data url
     */
    private data_endpoint : string = `https://${this.region}.api.battle.net/d3/data/`

    /**
     * Blizzard API profile data url
     */
    private profile_endpoint : string = `https://${this.region}.api.battle.net/d3/profile/`

    /**
     * Blizzard API base url
     */
    private base_endpoint : string = `https://${this.region}.api.battle.net/d3/`

    /**
     * Locale for api data translation
     */
    private locale : string = "en_GB"
   
    /**
     * Initializes all the API needed data
     * @param id 
     * @param secret 
     * @param _region 
     * @param _locale 
     */
    constructor(id : string, secret: string, _region? : string, _locale?: string){
        this.client_id = id
        this.client_secret = secret
        this.region = _region
        this.locale = _locale

        //Load our Authorization token
        this.getToken()
    }

    /**
     * Requests the account profile and return an object with the API Structure
     * 
     * @param bnet
     * 
     * @return {Promise<BnetProfile>}
     */
    getAccountProfile (bnet) : Promise<BnetProfile> {
        return new Promise<BnetProfile>( (resolve, reject) => {
            if (typeof bnet === "undefined" ||  bnet === "")
                reject('Please send a valid battle net name, a string')
            else
            {
                let url = `${this.profile_endpoint + escape(bnet)}/?locale=${this.locale}&access_token=${this.token}`
                axios.get(url).then( res => {
                        let bnet_obj : BnetProfile= {
                            battleTag : res.data.battleTag,
                            paragonLevel: res.data.paragonLevel,
                            paragonLevelHardcore : res.data.paragonLevelHardcore,
                            paragonlevelSeason : res.data.paragonlevelSeason,
                            paragonLevelSeasonHardcore : res.data.paragonLevelSeasonHardcore,
                            guildName : res.data.guildName,
                            heroes : [],
                            lastHeroPlayedId : res.data.lastHeroPlayed,
                            lastUpdated : res.data.lastUpdated,
                            kills : {
                                monsters : res.data.kills.monsters,
                                elites : res.data.kills.elites,
                                hardcoreMonsters : res.data.kills.hardcoreMonsters
                            },
                            highestHardcoreLevel : res.data.highestHardcoreLevel,
                            timePlayed : {
                                barbarians: res.data.timePlayed.barbarian,
                                necromancers: res.data.timePlayed.necromancer,
                                wizards : res.data.timePlayed.wizard,
                                crusaders: res.data.timePlayed.crusader,
                                monks : res.data.timePlayed.monk,
                                demonhunters: res.data.timePlayed['demon-hunter'],
                                witchdoctors : res.data.timePlayed['witch-doctor']
                                
                            },
                            progression : {
                                act1 : res.data.progression.act1,
                                act2 : res.data.progression.act2,
                                act3 : res.data.progression.act3,
                                act4 : res.data.progression.act4,
                                act5 : res.data.progression.act5
                            },
                            seasonalProfiles : res.data.seasonalProfiles,
                            blacksmith_level : res.data.blacksmith.level,
                            blacksmith_season_level : res.data.blacksmithSeason.level,
                            blacksmith_season_hardcore_level : res.data.blacksmithSeasonHardcore.level,
                            jeweler_level : res.data.jeweler.level,
                            jeweler_season_level : res.data.jewelerSeason.level,
                            jeweler_season_hardcore_level : res.data.jewelerSeasonHardcore.level,
                            mystic_level : res.data.mystic.level,
                            mystic_season_level : res.data.mysticSeason.level,
                            mystic_hardcore_level : res.data.mysticSeasonHardcore.level

                        }
                        
                        res.data.heroes.forEach(hero => {
                            bnet_obj.heroes.push({
                                id: hero.id,
                                name: hero.name,
                                class : hero.class,
                                classSlug : hero.classSlug,
                                gender: hero.gender,
                                level : hero.level,
                                paragonLevel : hero.paragonLevel,
                                last_updated : hero.last_updated
                            })
                        });

                        resolve(bnet_obj)
                    })
                .catch( err => {
                    reject(err)
                })
            }
        })
    }


    /**
     * Requests a specific character of a battle.net account and return a structured API data
     * 
     * @param bnet
     * @param char_id 
     * 
     * @return Promise<Character>
     */
    getAccountCharacter (bnet, char_id) : Promise<Character> {
        return new Promise<Character>( (resolve,reject) => {
            let url = `${this.base_endpoint}profile/${escape(bnet)}/hero/${escape(char_id)}/?locale=${this.locale}&access_token=${this.token}`
            axios.get(url).then( res => {
                resolve(<Character> res.data)
            })
            .catch( err => {
                reject(err)
            })
        })
    }

    /**
     * Requests all the account equipped items of a character and return's a structured API data
     * 
     * @param bnet 
     * @param char_id 
     * 
     * @return Promise<CharacterItems>
     */
    getAccountItems (bnet, char_id) : Promise<CharacterItems>{
        return new Promise<CharacterItems>( (resolve,reject) => {
            let url = `${this.base_endpoint}profile/${escape(bnet)}/hero/${escape(char_id)}/items/?locale=${this.locale}&access_token=${this.token}`
            axios.get(url).then(res => {
                resolve(<CharacterItems>res.data)
            })
            .catch( err => {
                reject(err)
            })
        })
    }

    /**
     * Requests for a single item with the slug/id and return's a structured API object
     * 
     * @param itemSlugAndId
     * 
     * return Promise<Item>
     */
    getItem (itemSlugAndId) : Promise<Item>{
        return new Promise<Item>( (resolve,reject) => {
            let url = `${this.data_endpoint}item/${escape(itemSlugAndId)}/?locale=${this.locale}&access_token=${this.token}`
            console.log(url)
            axios.get(url).then(res => {
                resolve(<Item> res.data)
            })
            .catch( err => {
                reject(err)
            })
        })
    }

    getToken = () => {
        axios.get(`https://${this.region}.battle.net/oauth/token?client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=client_credentials`)
            .then(res => {
                this.token = res.data.access_token
            })
            .catch( err => {
                console.log("Error on retrieving th token")
            })
    }
}