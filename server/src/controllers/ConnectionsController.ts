import {Request, Response} from 'express'
import db from '../database/connections';

export default class ConnectionsController {

    async index(resquest: Request, response: Response){
        const totalConnections = await db('connections').count('* as total');

        const { total } = totalConnections[0];

        return response.json({ total });
    }

    async create(resquest: Request, response: Response){
        const {user_id} = resquest.body;

        await db('connections').insert({
            user_id,
        });
        
        return response.send();
    }
}
    
