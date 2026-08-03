import { Request, Response } from "express"
const PORT: number= 3000
interface Credentials {
    id: number,
    name: string,
    age: number,
    points: number,
    role: string
}

const personas: Credentials[]= [
    {id: 1, name: "dan", age: 19, points: 6, role: "admin"},
    {id: 2, name: "giss", age: 19, points: 7, role: "usuario"}
]
const newUsers= personas.map(p => p.points++)
class Pana implements Credentials {

    constructor(public id: number, public name: string, public age: number, public points: number, public role: string) {}
    
    public saludar(panaName: string): string{
        return `ola ${panaName}`
    }
    public despedir(panaName: string): string{
        return `chao ${panaName}`
    }
}
const keinergogogo= new Pana(1, "Keiner", 19, 7, "usuario")

export function validatePana(req: Request, res: Response, pana: object, port: number): void{
    if(!pana){
        res.status(404).json({message: "Pana not found"})
        return
    }
    
}



