export class Globals{
    static get LOGGING(){
        return 'on';
    }

    static Log = (message) => {
        if(Globals.LOGGING == 'on')
            console.log(message);
    }
}