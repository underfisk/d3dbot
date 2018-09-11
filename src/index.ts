//@ts-check
import {D3DClient} from './Discord/D3DClient'
import {API} from './Diablo3/API'
import * as chars from './Diablo3/Characters'
import * as fs from 'fs'
import * as path from 'path';


/**
 * Interface for config
 * @var {Interface}
 */
export interface Config 
{
    discord_token : string,
    discord_prefix : string,
    mashory_key : string,
    region : string,
    locale: string
}

/**
 * Configuration object
 * @var {Config}
 */
let _config : Config = {
    discord_token : "",
    discord_prefix : "",
    mashory_key : "",
    region : "",
    locale: ""
}


/**
 * Read the config file and load the misc data
 * 
 * @return {void}
 */
fs.readFile(path.join(__dirname, '../src/config.json'), 'utf8', (error, data) => {
    if (error) console.log("Error raised: " + error)
    let json = JSON.parse(data)

    if (typeof json != 'undefined')
    {
        _config.discord_token = json.discord.bot_token
        _config.discord_prefix = json.discord.prefix
        _config.mashory_key = json.battle_net.mashory_key
        _config.region = json.discord.region

        const d3d = new D3DClient(_config)
        const myBnet = "WasAnExample"
        const d3api = new API(_config.mashory_key , _config.region, _config.locale )
    
    }
})






