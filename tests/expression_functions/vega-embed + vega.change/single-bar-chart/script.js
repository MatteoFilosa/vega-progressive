window.onload = function () {
    // 🔥 Registra una expression function per manipolare i dati in arrivo
    vega.expressionFunction("doubleValue", function (value) {
        return value * 2;
    });

    // Definizione del grafico
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
                        "expr": "doubleValue(datum.value)", // 🔥 Applica la expression function
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
                "domain": { "data": "table", "field": "doubleValue" },
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
                        "y": { "scale": "yscale", "field": "doubleValue" },
                        "y2": { "scale": "yscale", "value": 0 },
                        "fill": { "value": "steelblue" }
                    }
                }
            }
        ]
    };

    // 📌 Esegue Vega e ottiene la `view`
    vegaEmbed("#vis", spec).then(function (result) {
        const view = result.view;

        // 🔄 Simuliamo un server che invia nuovi dati ogni 2 secondi
        setInterval(() => {
            // Dato casuale per simulare l'aggiornamento del database
            const newCategory = String.fromCharCode(65 + Math.floor(Math.random() * 3)); // "A", "B" o "C"
            const newValue = Math.floor(Math.random() * 100); // Valore casuale

            console.log(`📡 Nuovo dato ricevuto: ${newCategory} -> ${newValue}`);

            // Aggiorna il grafico inserendo il nuovo valore
            view.change(
                "table",
                vega.changeset().insert([{ category: newCategory, value: newValue }])
            ).run();
        }, 2000);

    }).catch(console.error);
};
