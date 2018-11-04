//@ts-check
import {D3DClient} from './discord/d3dClient'
import {API} from './diablo3/api'
import * as chars from './diablo3/characters'
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
    client_id : string,
    client_secret: string,
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
    client_id : "",
    client_secret: "",
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
        _config.client_id = json.battle_net.client_id
        _config.client_secret = json.battle_net.client_secret
        _config.region = json.battle_net.region
        _config.locale = json.battle_net.locale

        const d3d = new D3DClient(_config)
        const d3api = new API(_config.client_id, _config.client_secret, _config.region, _config.locale )
    
    }
})






