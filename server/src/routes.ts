import express, { request, response } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import db from './database/connections';
import convertHourToMinutes from './Utils/convertHourToMinutes';

const routes = express.Router();
const classesControllers = new ClassesController();
const connectionsController = new ConnectionsController();

// Corpo (Reques Body): Dados para a criação ou atualização de um registro
// utilizado nos métodos post, put
// Route Params: Identificar qual recurso eu quero atualizar ou deletar
// utilzado nos métodos put e delete
// Query Params: Paginação, filtros, ordenação
// utilizado no método get exemplo localhost:3333/users?page=2&sort=name


// metodo de inserir
routes.post('/classes', classesControllers.create);

// metodo de listar
routes.get('/classes', classesControllers.index);

// metodo para inserir os contatos via whatsapp
routes.post('/connections', connectionsController.create);

// metodo que lista o total de conexoes
routes.get('/connections', connectionsController.index);

// teste
interface scheduleItem{
    week_day: number;
    from: string;
    to: string;
}
routes.post('/usuarios', async (request, response) => {
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    // transaçao no banco
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
});

export default routes;