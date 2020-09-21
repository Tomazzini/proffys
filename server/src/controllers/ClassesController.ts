import { Request, Response } from 'express';

import db from '../database/connections';
import convertHourToMinutes from '../Utils/convertHourToMinutes';

interface scheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController{

    // retorna listagem de aulas
    async index(request: Request, response:Response){
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        //select no banco de dados
        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` * `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', subject)
            //inner join com a tabela users
            .join('users', 'classes.user_id', 'users.id')
            //selecione tudo da tabela classes e tabela users
            .select(['classes.*', 'users.*']);
        
        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        // controle de trasação
        // só commita se não der erro em nenhuma inserção, se deu erro faz rollback na transação
        const trx = await db.transaction();

        try{
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
    
            // pega o id do usuario inserido
            const user_id = insertedUsersIds[0];
    
            console.log(name, avatar, whatsapp, bio, user_id);
            const InsertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
    
            const class_id = InsertedClassesIds[0];
    
            const classSchedule = schedule.map((scheduleItem: scheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                };
            })
    
            await trx('class_schedule').insert(classSchedule);
    
            // commita toda a transação
            await trx.commit();
    
            return response.status(201).send();
            
        } catch(err) {
            // desfaz toda a transação
            await trx.rollback();
    
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            });
        }
    
        //try{
        //    // conexão com o banco de dados
        //    // primeiro parametro da função 'db' é o nome da tabela, após pode ser insert, delete, select, update
        //    // insertedUsersIds recupera o id inserido
        //    // cadastro de usuario
        //    const insertedUsersIds = await trx('users').insert({
        //        name,
        //        avatar,
        //        whatsapp,
        //        bio,
        //        
        //    })
        //    console.log(name, avatar, whatsapp,bio);
    //
        //    // recupera o id do user para passar por parametro
        //    const user_id = insertedUsersIds[0];
    //
        //    // cadastro de aula
        //    const insertedClassesIds = await trx('classes').insert({
        //        subject,
        //        cost,
        //        user_id,
        //    });
        //    
        //    console.log(subject, cost, user_id);
        //    // recupera o id da aula inserido
        //    const class_id = insertedClassesIds[0];
    //
        //    const classSchedule = schedule.map( ( scheduleItem: scheduleItem ) =>{
        //        return {
        //            class_id,
        //            week_day: scheduleItem.week_day,
        //            //converte hora em minutos
        //            from: convertHourToMinutes(scheduleItem.from),
        //            to: convertHourToMinutes(scheduleItem.to),
        //        };
        //    })
        //    
        //    console.log(class_id, classSchedule);
        //    // cadastro de horario das aulas
        //    await trx('class_schedule').insert(classSchedule);
        //    console.log('passei aqui');
        //    // commita a transação        
        //    await trx.commit;
        //    
        //    console.log(user_id,name, avatar, whatsapp, bio, subject, cost);
        //    console.log(subject,cost, user_id);
        //    return response.status(201).send();
    //
        //} catch(err){
        //    console.log('deu erro')    
        //    console.log(err);
        //    // desfaz a transação    
        //    await trx.rollback();
    //
        //    return response.status(400).json({
        //        error: 'Unexpected error while creating new class'
        //        
        //    })
        //}
        
    }
}