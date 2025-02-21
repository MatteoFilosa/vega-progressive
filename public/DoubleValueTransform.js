(function () {

    // Definizione del costruttore
    function DoubleValueTransform(params) {
        // Chiamiamo il costruttore di base di Vega
        vega.Transform.call(this, null, params);
    }

    // Metadati della transform: "modifies" indica che modifichiamo le tuple
    DoubleValueTransform.Definition = {
        type: 'DoubleValueTransform',
        metadata: { modifies: true },
        params: [
            { name: 'field', type: 'field', required: true }
        ]
    };

    // Eredita da vega.Transform
    DoubleValueTransform.prototype = Object.create(vega.Transform.prototype);
    DoubleValueTransform.prototype.constructor = DoubleValueTransform;

    // Implementazione della logica: raddoppiamo il valore del campo indicato
    DoubleValueTransform.prototype.transform = function (_, pulse) {
        // `_.field` è un accessor function che legge il campo specificato
        const field = _.field;
        // Recuperiamo il nome effettivo del campo (ad es. "value")
        const fieldName = field.fields[0];

        // Visitiamo tutte le tuple in ingresso (SOURCE) e modifichiamo il valore
        pulse.visit(pulse.SOURCE, function (d) {
            d[fieldName] = field(d) * 2;
        });

        // Indichiamo a Vega di ricalcolare eventuali scale/marks (reflow)
        return pulse.reflow();
    };

    // Registrazione nel namespace Vega
    if (!vega.transforms) vega.transforms = {};
    vega.transforms["DoubleValueTransform"] = DoubleValueTransform;

    // Registrazione nello schema (per il parser di Vega)
    if (!vega.schema) vega.schema = {};
    if (!vega.schema.transforms) vega.schema.transforms = {};
    vega.schema.transforms["DoubleValueTransform"] = DoubleValueTransform.Definition;

    console.log("Custom transform 'DoubleValueTransform' registrata correttamente.");

    

})();

import { transform } from "vega-dataflow";

transform("DoubleValueTransform", DoubleValueTransform);

