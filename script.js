import vegaEmbed from "https://cdn.jsdelivr.net/npm/vega-embed@6/+esm";
import DoubleValueTransform from "./DoubleValueTransform.js"; // Importa la custom transform
import { transform } from "./vega-dataflow";

// 🔥 REGISTRA LA TRANSFORM IN VEGA
transform("DoubleValueTransform", DoubleValueTransform);

// 🔥 ADESSO VEGA LA RICONOSCE!

window.onload = function () {
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
                        "type": "DoubleValueTransform", // 🔥 Ora è registrata!
                        "field": "value"
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
                "domain": { "data": "table", "field": "value" },
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
                        "y": { "scale": "yscale", "field": "value" },
                        "y2": { "scale": "yscale", "value": 0 },
                        "fill": { "value": "steelblue" }
                    }
                }
            }
        ]
    };

    vegaEmbed("#vis", spec)
        .then(function (result) {
            console.log("Visualizzazione con DoubleValueTransform renderizzata correttamente.");
        })
        .catch(console.error);

    console.log(vega.transforms);

};
