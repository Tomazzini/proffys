import React, { useState, FormEvent } from 'react';
import PageHeader from '../../components/PageHeader';
import { useHistory } from 'react-router-dom';

import Input from '../../components/input';
import Select from '../../components/Select';
import warningIcon from '../../assets/images/icons/warning.svg';
import Textarea from '../../components/TextArea';

import './styles.css'
import api from '../../services/api';

function TeachersForm(){
    //redireciona a pagina
    const history = useHistory();

   // valores que serão alterados no formulário 
   //estado inicial das variaveis do formulario
   const [name, setName] = useState('');
   const [avatar, setAvatar] = useState('');
   const [whatsapp, setWhatsapp] = useState('');
   const [bio, setBio] = useState(''); 
   
   const [subject, setSubject] = useState(''); 
   const [cost, setCost] = useState(''); 

   // método de estado no react
   const [scheduleItems, setScheduleItems] = useState([
      { week_day: 0, from: '', to: '' }
   ]);

   function addNewScheduleItem(){
      setScheduleItems([
         //copia um array em javascript
         ...scheduleItems,
         //adiciona um novo array quando clicar em onClick
         { week_day: 0, from: '', to: '' }
      ]) 
   }

   function setScheduleItemValue(position: number, field: string, value: string) {
      const updateScheduleItems = scheduleItems.map((scheduleitem, index) => {
         if (index === position){
            // ...scheduleitem copia um array em javaScript
            // sobrepoe as informações com um novo array
            return { ...scheduleitem, [field]: value}
         }

         return scheduleitem;

      });      

      setScheduleItems(updateScheduleItems);
   }

   function handleCreateClass(e: FormEvent) {
    //previne o comportamento default de um formulário, não dar reload na página
    e.preventDefault();

    api.post('/classes', {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost: Number(cost),
      schedule: scheduleItems
    }).then(() => {
       alert('Cadastro realizado com sucesso!');

       //redireciona para landingpage
       history.push('/');
    }).catch(() => {
       alert('Erro no cadastro!');
    })

    //console.log(console.error())
    
    // teste
    //console.log({
    //  name,
    //  avatar,
    //  whatsapp,
    //  bio,
    //  subject,
    //  cost,
    //  scheduleItems
    //});

   }

        return(
        <div id="page-teacher-form" className="container">
            <PageHeader 
                title="Que incrível que você quer dar aulas."
                description="O primeiro passo é preencher essa formulário de inscrição"
            />
            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>
                        <Input 
                            name="name" 
                            label="Nome completo"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />

                        <Input 
                            name="avatar" 
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => { setAvatar(e.target.value) }}
                        />

                        <Input 
                            name="whatsapp" 
                            label="Whatsapp"
                            value={whatsapp}
                            onChange={(e) => { setWhatsapp(e.target.value) }}
                        />

                        <Textarea 
                            name="bio" 
                            label="Biografia"
                            value={bio}
                            onChange={(e) => { setBio(e.target.value) }}
                        />    
                    </fieldset>    

                    <fieldset>
                        <legend>Sobre a aula</legend>
                        <Select 
                            name="subject" 
                            label="Matéria"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value) }}
                            options={[
                                { value: 'Artes', label: 'Artes' },
                                { value: 'Matemática', label: 'Matemática' },
                                { value: 'Física', label: 'Física' },
                                { value: 'Geografia', label: 'Geografia' },
                                { value: 'Português', label: 'Português' },
                                { value: 'Ciências', label: 'Ciências' },
                                { value: 'História', label: 'História' },
                                { value: 'Educação Física', label: 'Educação Física' },
                                { value: 'Inglês', label: 'Inglês' }

                            ]}
                        />

                        <Input 
                            name="cost" 
                            label="Custo da sua aula por hora"
                            value={cost}
                            onChange={(e) => { setCost(e.target.value) }}
                        />
                    </fieldset> 

                    <fieldset>
                        <legend>Horários disponíveis
                            <button type="button" onClick={addNewScheduleItem}>
                                + Novo horário
                            </button>
                        </legend>

                        {scheduleItems.map((scheduleItem, index) =>{
                            return(
                                <div key={scheduleItem.week_day} className="schedule-item">
                                    <Select 
                                    name="week_day" 
                                    label="Dia da semana"
                                    value={scheduleItem.week_day}
                                    onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}
                                    options={[
                                        { value: '0', label: 'Domingo' },
                                        { value: '1', label: 'Segunda-feira' },
                                        { value: '2', label: 'Terça-feira' },
                                        { value: '3', label: 'Quarta-feira' },
                                        { value: '4', label: 'Quinta-feira' },
                                        { value: '5', label: 'Sexta-feira' },
                                        { value: '6', label: 'Sábado' }
                                        ]}
                                    />
                                    <Input 
                                       name="from" 
                                       label="Das" 
                                       type="time"
                                       value={scheduleItem.from}
                                       onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />
                                    <Input 
                                       name="to" 
                                       label="Até" 
                                       type="time"
                                       value={scheduleItem.to}
                                       onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />
                                </div>
                            );
                        })}    

                    </fieldset>
                    
                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            Importante <br />
                            Preencha todos os dados
                        </p>    
                        <button type="submit">
                            Salvar cadastro
                        </button>
                    </footer>
                </form>   
            </main>
        </div>
    )
}

export default TeachersForm;