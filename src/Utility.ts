
/**
 * Loops trough the enumerator and returns the value of a key if matches
 * 
 * @param T Enum
 * @param any Key
 * 
 * @return T
 */
export function getEnumValueByKey <T>(_enum : any, _key : any) : T{
    for (let [key,value] of Object.entries(_enum)){  
        if (key === _key)
            return <T>value
    }
    return null
}

/**
 * Loops trough the enumerator and returns the key of a value if matches
 * 
 * @param T _enum 
 * @param any _value 
 * 
 * @return string
 */
export function getEnumKeyByValue <T>(_enum : any, _value : any) : string{
    for (let [key,value] of Object.entries(_enum)){  
        if (value === _value)
            return key
    }
}

/**
 * Color structure shortcut
 * 
 * @var {enum}
 */
export enum Color
{
    RedRgb = "#ff0000",
    GreenRgb = "#18f500",
    Orange = 0xFFA500
}