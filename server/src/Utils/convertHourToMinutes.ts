export default function convertHourToMinutes(time: string){

    // transforma hora em number e separa por : exemplo 08:00    
    const [hour, minutes] = time.split(':').map(Number);
    
    // converte hora em minutos
    const timeMinutes = (hour * 60) + minutes;

    return timeMinutes;
}