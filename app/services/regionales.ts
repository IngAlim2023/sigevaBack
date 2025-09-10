import Regionale from "#models/regionale"

export default class RegionalesSer{
    async read(){
        return await Regionale.all()
    }
}