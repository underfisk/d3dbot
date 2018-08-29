import * as Discord from 'discord.js'
import { D3DHandlers } from './D3DHandlers';
import { Config } from '../index'
/**
 * Discord Diablo3 Client
 */
export class D3DClient
{
  /**
   * Discord bot token which we need to connect
   */
  private _token : string

  /**
   * Discord Client
   */
  private client: Discord.Client


  /**
   * Command handlers
   */
  private handlers: D3DHandlers

  constructor( config : Config ){
    if (typeof config.discord_token === "undefined")
      throw new Error("Please send a valid discord bot token")

    this._token = config.discord_token
    this.client = new Discord.Client()
    this.handlers = new D3DHandlers(this.client, config)

    this.initialize()
  }

  /**
   * Initializes Discord Bot
   * 
   * @return void
   */
  initialize ()
  {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
     
    //Register handlers for commands
    this.handlers.initialize()

    //Login the bot
    this.client.login(this._token);
  }

  /**
   * Discord.Client Instance
   * 
   * @return Discord.Client
   */
  get clientInstance() {
    return typeof this.client !== 'undefined' ? this.client : null;
  }

}