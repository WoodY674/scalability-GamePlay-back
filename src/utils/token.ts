const jwt = require('jsonwebtoken');

//keys are encoded in b64
const privateKeyFake = Buffer.from(process.env.NEXT_PUBLIC_PRIV_KEY_FAKE ?? "", 'base64').toString('utf8') + "\n"
const pubkeyFake = Buffer.from(process.env.NEXT_PUBLIC_PUB_KEY_FAKE ?? "", 'base64').toString('utf8') + "\n"
const pubkey = Buffer.from(process.env.NEXT_PUBLIC_PUB_KEY ?? "", 'base64').toString('utf8') + "\n"

export enum TokenType{
    Fake,
    Real
}

export interface TokenPayload{
    userId: string
    mail: string
}

export function verifyToken(token: string, type:TokenType) :TokenPayload| never {
    const payload = jwt.verify(token, (type == TokenType.Fake ? pubkeyFake : pubkey),{ algorithms: 'RS256' }, function(err:Error, payload:any) {
        if(err != null){
            return {err:err}
        }
        return payload
    });

    if(payload.err != undefined){
        throw new Error(`Can't verify the token ${payload}` )
    }

    if(payload.exp < Math.floor(Date.now() / 1000)){
        throw new Error("Token expired")
    }
    return payload
}
export function signToken(payload:TokenPayload){
    return jwt.sign({...payload, exp: Math.floor(Date.now() / 1000) + (60 * 60),}, privateKeyFake, { algorithm: 'RS256' })
}
