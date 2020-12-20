
export class buildingNames {
    static getNames(name) {
        var json = require('../assets/data/' + name + '.json')
        let names = []
        for(let i = 0; i < json.features.length; i++){
            names.push(json.features[i].properties.name)
        }
        return names
    }

}