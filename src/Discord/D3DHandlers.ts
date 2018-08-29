import * as Discord from 'discord.js'
import {D3DCommands, Command} from './D3DCommands'
import {Class, Gender, Icon} from '../Diablo3/Characters'
import {API} from '../Diablo3/API'
import {Config} from '../index'
import { Hero, CharacterItems, Item} from '../Diablo3/Responses';
import * as util from '../Utility'

export class D3DHandlers
{
    /**
     * Client reference
     */
    private d3dclient : Discord.Client

    /**
     * Prefix for the commands by default is $
     * but we load via a JSON
     */
    private prefix : string

    /**
     * Diablo3 API Reference
     */
    private api : API

    constructor(client, config : Config){
        this.d3dclient = client
        this.prefix = config.discord_prefix
        this.api = new API(config.mashory_key, config.region, config.locale)
    }

    /**
     * Sets the handlers for the commands before the bot connects
     * 
     * @return void
     */
    initialize = () => {
        this.d3dclient.on('message', msg => {
            if (msg.author.bot) return

            let args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
            let command = args.shift().toLowerCase();

            if (command === D3DCommands[0].key)
            {
                if (typeof args != 'undefined' && args.length > 0)
                {
                    this.retrieveBattleAccount(msg,args)
                }
                else
                {
                    let err = new Discord.RichEmbed()
                        .setColor('#ff0000')
                        .setTitle("Please send me a valid battle.net account")
                
                    msg.channel.send(err)
                }
            }
            else if (command === D3DCommands[1].key)
            {
                this.listCommands(msg)
            }
            else if (command === D3DCommands[2].key)
            {
                this.retrieveAccountCharacter(msg,args)
            }
            else if (command === D3DCommands[3].key)
            {
                this.retrieveAccountItems(msg,args)
            }
            else if (command === D3DCommands[4].key)
            {
                this.retrieveSingleItem(msg,args)
            }
            else
            {
                let helpMessage = new Discord.RichEmbed()
                    .setColor('#18f900')
                    .setTitle("You have called for help brave hero")
                    .setDescription(`Please type ${this.prefix}commands to see all the commands available.`)
        
                msg.channel.send(helpMessage)
            }
        })
    }

    /**
     * Callback when the command is triggered to get a battle net
     * account information
     * 
     * @return void
     */
    retrieveBattleAccount = (msg : Discord.Message, args : string[]) => 
    {
        let bnet = args[0]
        this.api.GetAccountProfile(bnet.trim())
            .then( data => {
                let $chars : string = ""
                data.heroes.forEach(hero => {
                    $chars += `**${hero.seasonal ? 'Seasonal' : ' '} ${hero.hardcore ? 'Hardcore' : ' '}(${hero.gender === Gender.Male ? 'Male' : 'Female'} ${hero.class}, Lv.${hero.level}, Paragon.${hero.paragonLevel}) ID [${hero.id}] ${hero.name} [isDead ${hero.dead ? 'yes' : 'no'}] **\n`
                })

                let barbarians_timeplayed = data.timePlayed.barbarians,
                    necros_timeplayed = data.timePlayed.necromancers,
                    wizard_timeplayed = data.timePlayed.wizards,
                    crusaders_timeplayed = data.timePlayed.crusaders,
                    demonhunters_timeplayed = data.timePlayed.demonhunters,
                    monks_timeplayed = data.timePlayed.monks,
                    witchdoctors_timeplayed = data.timePlayed.witchdoctors

                let total_chars_count = data.heroes.length,
                    total_necros = data.heroes.filter(hero => hero.class === Class.Necromancer).length,
                    total_barbarians = data.heroes.filter(hero => hero.class === Class.Barbarian).length,
                    total_wizard = data.heroes.filter(hero => hero.class === Class.Wizard).length,
                    total_demonhunters = data.heroes.filter(hero => hero.class === Class.DemonHunter).length,
                    total_witchdoctors = data.heroes.filter(hero => hero.class === Class.WitchDoctor).length,
                    total_monks = data.heroes.filter(hero => hero.class === Class.Monk).length,
                    total_crusaders = data.heroes.filter(hero => hero.class === Class.Crusader).length
                
                let kills_history = 
                `Monsters **${data.kills.monsters}**
                 Hardcore Monsters  **${data.kills.hardcoreMonsters}**
                 Elites  **${data.kills.elites}**
                `
                    
                msg.channel.send({embed: {
                    color: 1,
                    title: `**I hope this is what'd you want** \n`,
                    description : "Be careful making requests, do not do them so fast otherwise you get temporarly blocked. \n",
                    thumbnail: {
                        url: "https://www.viral-gaming.de/wp-content/uploads/2017/11/diablor_preview_logo_minified.png"
                    },
                    footer: {
                        text: "All rights for blizzard",
                        icon: ""
                    },

                    fields: [{
                        name: "Battle.net",
                        value: bnet
                      },
                      {
                          name: "Guild",
                          value: `** ${data.guildName} ** `
                      },
                      {
                        name: `Total Characters (${total_chars_count})`,
                        value: `
                            **${total_barbarians}** Barbarian(s)  played ${barbarians_timeplayed} /h, 
                            **${total_necros}** Necromancer(s) played ${necros_timeplayed} /h, 
                            **${total_wizard}** Wizard(s) played ${wizard_timeplayed} /h, 
                            **${total_crusaders}** Crusader(s) played ${crusaders_timeplayed} /h, 
                            **${total_demonhunters}** Demon hunter(s) played ${demonhunters_timeplayed} /h,
                            **${total_monks}** Monk(s) played ${monks_timeplayed} /h,
                            **${total_witchdoctors}** Witch doctor(s) played ${witchdoctors_timeplayed} /h`,
                      },
                      {
                        name: "Characters",
                        value: $chars
                      },
                      {
                          name: "Kills",
                          value: kills_history
                      },
                      {
                          name: "Acts",
                          value: `
                          Act 1 - **${data.progression.act1 ? 'Completed' : 'On going'}**
                          Act 2 - **${data.progression.act2 ? 'Completed' : 'On going'}**
                          Act 3 - **${data.progression.act3 ? 'Completed' : 'On going'}**
                          Act 4 - **${data.progression.act4 ? 'Completed' : 'On going'}**
                          Act 5 - **${data.progression.act5 ? 'Completed' : 'On going'}**
                          `
                      },
                      {
                          name: "NPCS",
                          value: `
                            Blacksmith Lv.**${data.blacksmith_level} **
                            Blacksmith(Season) Lv.**${data.blacksmith_season_level}**
                            BlackSmith(Hardcore) Lv.**${data.blacksmith_season_hardcore_level} **
                          
                            Jeweler Lv.**${data.jeweler_level} **
                            Jeweler(Season) Lv.**${data.jeweler_season_level} ** 
                            Jeweler(Hardcore) Lv.**${data.jeweler_season_hardcore_level} **
                            
                            Mystic Lv.**${data.mystic_level}**
                            Mystic(Season) Lv.**${data.mystic_season_level}**
                            Mystic(Hardcore) Lv.**${data.mystic_hardcore_level}**
                          `
                      },
                      {
                          name: "Highest",
                          value: `
                            Harcore Level **${data.highestHardcoreLevel}**
                          `
                      },
                      {
                          name: "Last Played",
                          value : `
                            Character ** ${ data.heroes.filter(e => e.id === data.lastHeroPlayedId)[0].name }  **
                            Last login at ** ${ new Date(data.lastUpdated * 1000).toString() } **
                          `
                      }
                    ],
                    timestamp: new Date(),
                }})
            })
            .catch(err => {
                if (err.response.status === 404)
                {         
                    let errMessage = new Discord.RichEmbed()
                        .setColor(util.Color.RedRgb)
                        .setTitle("We could't find the account you're looking for.")
                        .setFooter('Please make sure you send the name#id of the battle.net')
            
                    msg.channel.send(errMessage)
                }
            })
    }


    /**
     * Retrieves a single item with the slug and id
     * 
     * @return void
     */
    retrieveSingleItem = (msg : Discord.Message, args : string[]) => {
        let itemSlugAndId = args[0]
        
        this.api.GetItem(itemSlugAndId)
            .then( item => {
                console.log(item)
                
                msg.channel.send({embed: {
                    color: util.Color.Orange,
                    title: item.name,
                    thumbnail: {
                        url : `http://media.blizzard.com/d3/icons/items/large/${escape(item.icon)}.png`
                    },
                    description: item.typeName,
                    fields: [{
                        name: "Story",
                        inline: true,
                        value: item.flavorText
                    },
                    {
                        name: "Required Level",
                        inline: true,
                        value: item.requiredLevel
                    },
                    {
                        name: "Damage",
                        inline: true,
                        value: `${item.damage}  DPS: ${item.dps}`
                    },
                    {
                        name: "Account Bound",
                        inline: true,
                        value: item.accountBound ? 'yes' : 'no'
                    }

                    ]
                }})
            })
            .catch(err => {
                if (err.response.status === 404)
                {         
                    let errMessage = new Discord.RichEmbed()
                        .setColor(util.Color.RedRgb)
                        .setTitle("We could't find the item you're looking for.")
                        .setFooter('Please make sure you send a item slug and id')
            
                    msg.channel.send(errMessage)
                }
            })
    }

    /**
     * Retrieves all the items of a specific character and shows them detailed
     * (The ones equipped)
     * 
     * @return void
     */
    retrieveAccountItems = (msg : Discord.Message, args : string[]) => {
        let bnet = args[0],
            char_id = args[1]

        this.api.GetAccountItems(bnet, char_id)
            .then( items  => {
                let _fields : any[] = []

                for(let [k,v] of Object.entries(items))
                { 
                    _fields.push({
                        name: v.name,
                        inline: true,
                        value: `
                            Id: **${v.id}**
                            Name: **${v.name}**
                            Required Lv.**${v.requiredLevel}**
                            Item Lv.**${v.itemLevel}**
                            Account Bound: **${v.accountBound ? 'yes' : 'no'} **
                            Armor: **${v.armor}**
                            Damage: **${v.damage || 0}**
                            AttacksPerSecond: **${v.attacksPerSecond}**
                            Slot: **${k}**
                        `
                    })
                }

                msg.channel.send({ embed: {
                    thumbnail: {
                        url: "https://www.viral-gaming.de/wp-content/uploads/2017/11/diablor_preview_logo_minified.png"
                    },
                    fields: _fields,
                    footer: {
                        text: "All rights reserved to blizzard"
                    }
                }})
            })
            .catch( err => {
                console.log (err )
                if ( err.response && err.response.status === 404)
                {
                    let error = new Discord.RichEmbed()
                        .setColor(util.Color.RedRgb)
                        .setTitle("Your battle.net account or hero id is invalid")
            
                    msg.channel.send(error)
                }
            })
    }

    /**
     * Retrieves a specific character by id on a battle.net
     * 
     * @return void
     */
    retrieveAccountCharacter = (msg : Discord.Message ,args : string[]) => 
    {
        let bnet = args[0],
            char_id = args[1]

        this.api.GetAccountCharacter(bnet, char_id)
            .then( character => {

                let _class : string = util.getEnumKeyByValue<Class>(Class, character.class),
                    iconImg : string = util.getEnumValueByKey<Icon>(Icon, _class),
                    _kills : string = `Monsters ${character.kills.monsters || 0} \t| Elites ${character.kills.elites || 0} \t| Hardcore Monsters ${character.kills.hardcoreMonsters || 0}`,
                    _items : string = `
                Head (**${character.items.head.name}**)
                Neck (**${character.items.neck.name}**)
                Torso (**${character.items.torso.name}**)
                Shoulders (**${character.items.shoulders.name}**)
                Legs (**${character.items.legs.name}**)
                Waist (**${character.items.waist.name}**)
                Hands (**${character.items.hands.name}**)
                Bracers (**${character.items.bracers.name}**)
                Feet (**${character.items.feet.name}**)
                Left Finger (**${character.items.leftFinger.name}**)
                Right Finger (**${character.items.rightFinger.name}**)
                Main Hand (**${character.items.mainHand.name}**)
                `,
                _activeSkills : string = "\n",
                _passiveSkills : string = "\n"

                character.skills.active.forEach(e => {
                    _activeSkills += e.skill.name + " - " + e.rune.name + "\n"
                })
                character.skills.passive.forEach(e => {
                    _passiveSkills += e.skill.name + "\n"
                })

                let _skills : string = `
                **Actives:** ${_activeSkills}
                **Passives:** ${_passiveSkills}
                `
                let _stats : string = `
                Health: **${character.stats.life}**
                Damage: **${character.stats.damage}**
                Toughness: **${character.stats.toughness}**
                Healing: **${character.stats.healing}**
                AttackSpeed: **${character.stats.attackSpeed}**
                Armor: **${character.stats.armor}**
                Strength: **${character.stats.strength}**
                Dexterity: **${character.stats.dexterity}**
                Vitality: **${character.stats.vitality}**
                Intelligence: **${character.stats.intelligence}**
                Physical Resist: **${character.stats.physicalResist}**
                Poison Resist: **${character.stats.poisonResist}**
                Arcane Resist: **${character.stats.arcaneResist}**
                Block Chance: **${character.stats.blockChance}**
                Block Amount Min: **${character.stats.blockAmountMin}**
                Block Amount Max: **${character.stats.blockAmountMax}**
                Gold Find: **${character.stats.goldFind} %**
                Thorns: **${character.stats.thorns}**
                Crit Chance: **${character.stats.critChance} %**
                Life Steal: **${character.stats.lifeSteal}**
                Life Per Kill: **${character.stats.lifePerKill}**
                Life On Hit: **${character.stats.lifeOnHit}**
                Primary Resource: **${character.stats.primaryResource}**
                Secondary Resource: **${character.stats.secondaryResource}**

                ` 

                msg.channel.send({embed: {
                    color: 2,
                    title: `**${bnet}, Character nº ${char_id}**`,
                    thumbnail: {
                        url : iconImg
                    },
                    fields: [{
                        name: `${character.name}`,
                        value: `${_class} \t Lv.${character.level} \t Created at Season ${character.seasonCreated}`,
                        inline: true
                      },
                      {
                          name: "Last Login",
                          value: new Date(character.lastUpdated * 1000).toString(),
                          inline: true
                      },
                      {
                          name: "General",
                          value: `The character is ${character.seasonal ? 'seasonal' : 'not seasonal'} and ${character.hardcore ? 'hardcore' : 'not hardore'} also ${character.alive ? 'he\s alive' : 'he\'s dead'}`,
                          inline: true
                        },
                      {
                        name: "Acts",
                        value: `
                        Act 1 - **${character.progression.act1 ? 'Completed' : 'On going'}**
                        Act 2 - **${character.progression.act2 ? 'Completed' : 'On going'}**
                        Act 3 - **${character.progression.act3 ? 'Completed' : 'On going'}**
                        Act 4 - **${character.progression.act4 ? 'Completed' : 'On going'}**
                        Act 5 - **${character.progression.act5 ? 'Completed' : 'On going'}**
                        `
                      },
                      {
                          name: "Rifts",
                          value: `The highest of this character was ** ${character.highestSoloRiftCompleted}**`
                      },
                      {
                          name: "Kills",
                          value: _kills
                      },
                      {
                          name: "Skills",
                          value: _skills
                      },
                      {
                          name: "Items",
                          value: _items
                      },
                      {
                          name: "Stats",
                          value: _stats
                      }
                    ],

                    footer: {
                        text: "All rights for blizzard",
                        icon: ""
                    },
                    timestamp: new Date()
                }})
            })
            .catch( err => {
                console.log (err )
                if ( err.response && err.response.status === 404)
                {
                    let error = new Discord.RichEmbed()
                        .setColor(util.Color.RedRgb)
                        .setTitle("Your battle.net account or hero id is invalid")
            
                    msg.channel.send(error)
                }
            })
    }

    /**
     * Callback for !commands
     * 
     * @return void
     */
    listCommands = msg => 
    {
        let cmdList : string = ""
        Object.values(D3DCommands).forEach( obj => {
            cmdList += `${obj.key} <${obj.args}>     -    ${obj.description} \n`
        })

        let listMessage = new Discord.RichEmbed()
            .setColor(util.Color.RedRgb)
            .setTitle("Command List Available")
            .setDescription(cmdList)
            .setFooter('Dont use <>, they are just to mention that it is an argument')
    
            msg.channel.send(listMessage)
    }

    listHelp = msg => {
        /**
         * Explain here like how to get the hero id, the item slug/id etc
         */
    }
}