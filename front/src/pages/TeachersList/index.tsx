import React, { useState, FormEvent } from 'react';
import PageHeader from '../../components/PageHeader';

import TeacherItem, { Teacher } from '../../components/TeacherItem';
import Input from '../../components/input';
import Select from '../../components/Select';
import api from '../../services/api';

import './styles.css';

function TeachersList(){
    const[teachers, setTeachers] = useState([]);

    const[subject, setSubject] = useState('');
    const[week_day, setWeekDay] = useState('');
    const[time, setTime] = useState('');

    //evento do formulario
    async function searchTeachers(e: FormEvent){
        e.preventDefault();

        // faz um requisição do tipo get para o backend
        const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time,
        }
    });
    //console.log(subject, week_day, time);
    setTeachers(response.data);
    console.log(response.data);
}

    return(
        <div id="page-teacher-list" className="container">
            <PageHeader title="Estes são os Proffys Disponíveis." >
                <form id="search-teachers" onSubmit={searchTeachers}>
                <Select 
                    name="subject" 
                    label="Matéria"
                    value={subject}
                    onChange={e => {setSubject(e.target.value) }}
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
                    <Select 
                    name="week_day" 
                    label="Dia da semana"
                    value={week_day}
                    onChange={e => {setWeekDay(e.target.value) }}
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
                        name="time" 
                        label="Hora"
                        type="time"
                        value={time}
                        onChange={e => {setTime(e.target.value) }}
                    />
                    <button type="submit">
                        Buscar
                    </button>
                </form>
            </PageHeader>

            <main>
                {teachers.map((teacher: Teacher) => {
                    return <TeacherItem key={teacher.id} teacher={teacher} />;
                })}
            </main>
        </div>
    )
}

export default TeachersList;