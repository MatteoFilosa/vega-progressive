window.onload = function () {
    // 🔥 Registra una funzione di trasformazione in Vega
    vega.expressionFunction("doubleValue", function (value) {
        return value * 2;
    });

    const spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 400,
        "height": 200,
        "padding": 5,
        "data": [
            {
                "name": "table",
                "values": [
                    { "category": "A", "value": 30 },
                    { "category": "B", "value": 80 },
                    { "category": "C", "value": 45 }
                ],
                "transform": [
                    {
                        "type": "formula",
                        "expr": "doubleValue(datum.value)", // 🔥 Usa l'expression function
                        "as": "doubleValue"
                    }
                ]
            }
        ],
        "scales": [
            {
                "name": "xscale",
                "type": "band",
                "domain": { "data": "table", "field": "category" },
                "range": "width",
                "padding": 0.05
            },
            {
                "name": "yscale",
                "type": "linear",
                "domain": { "data": "table", "field": "doubleValue" }, // 🔥 Usa il valore trasformato
                "nice": true,
                "range": "height"
            }
        ],
        "axes": [
            { "orient": "bottom", "scale": "xscale" },
            { "orient": "left", "scale": "yscale" }
        ],
        "marks": [
            {
                "type": "rect",
                "from": { "data": "table" },
                "encode": {
                    "enter": {
                        "x": { "scale": "xscale", "field": "category" },
                        "width": { "scale": "xscale", "band": 0.5 },
                        "y": { "scale": "yscale", "field": "doubleValue" }, // 🔥 Usa il valore trasformato
                        "y2": { "scale": "yscale", "value": 0 },
                        "fill": { "value": "steelblue" }
                    }
                }
            }
        ]
    };

    vegaEmbed("#vis", spec)
        .then(function (result) {
            console.log("Visualizzazione con Expression Function renderizzata correttamente.");
        })
        .catch(console.error);
};
