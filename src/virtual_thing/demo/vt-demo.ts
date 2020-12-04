import { readFileSync } from "fs";
import { join } from "path";

import { Servient, Helpers } from "@node-wot/core";
import { HttpServer } from "@node-wot/binding-http";

import { VirtualThing } from "../index";


//const VTD_PATH = join(__dirname, '..', '..', '..', 'src', 'virtual_thing', 'demo' ,'vt-descr-demo.json');
//const VTD_PATH = join(__dirname, '..', '..', '..', 'src', 'virtual_thing', 'demo' ,'test-intervals.json');
//const VTD_PATH = join(__dirname, '..', '..', '..', 'src', 'virtual_thing', 'demo' ,'test-compound.json');


//const VTD_PATH = join(__dirname, '..', '..', '..', 'src', 'virtual_thing', 'demo' ,'temperature-sensor-thing.json');
const VTD_PATH = join(__dirname, '..', '..', '..', 'src', 'virtual_thing', 'demo' ,'action-calculate.json');



const TD_VALID_SCH = join(__dirname, '..', '..', '..', 'validation-schemas', 'td-json-schema-validation.json');
const VTD_VALID_SCH = join(__dirname, '..', '..', '..', 'validation-schemas', 'vtd-json-schema-validation.json');

let vtd = JSON.parse(readFileSync(VTD_PATH, "utf-8"));
let tdSchema = JSON.parse(readFileSync(TD_VALID_SCH, "utf-8"));
let vtdSchema = JSON.parse(readFileSync(VTD_VALID_SCH, "utf-8"));

let servient = new Servient();
Helpers.setStaticAddress('localhost');
servient.addServer(new HttpServer({port: 8082}));

servient.start().then(thingFactory => {
        new VirtualThing(1, vtd, thingFactory, tdSchema, vtdSchema).produce()
            .then(vt => vt.expose())
            .catch(e => console.error(e));
    })    
    .catch(e => console.error(e));