const maxValue = 100; // Valore massimo per l'asse Y

const createSpec = (type) => {
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 300,
        "height": 200,
        "padding": 5,

        "data": [
            {
                "name": "table",
                "values": []
            }
        ],

        "scales": [
            {
                "name": "xscale",
                "type": "band",
                "domain": { "data": "table", "field": "category" },
                "range": "width",
                "padding": 0.1
            },
            {
                "name": "yscale",
                "type": "linear",
                "domain": [0, maxValue],  // 🔥 Imposta il dominio Y statico
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
                        "width": { "scale": "xscale", "band": 0.7 },
                        "y": { "scale": "yscale", "field": "value" },
                        "y2": { "scale": "yscale", "value": 0 },
                        "fill": { "value": type === "history" ? "rgba(0, 0, 255, 0.5)" : "steelblue" }
                    },
                    "update": {
                        "opacity": { "signal": type === "history" ? "datum.opacity" : "1" }
                    }
                }
            },
            // 🔥 Etichette sopra le barre
            {
                "type": "text",
                "from": { "data": "table" },
                "encode": {
                    "enter": {
                        "x": { "scale": "xscale", "field": "category", "offset": 5 },
                        "y": { "scale": "yscale", "field": "value", "offset": -5 },
                        "text": { "field": "value" },
                        "align": { "value": "center" },
                        "baseline": { "value": "bottom" },
                        "fill": { "value": "black" },
                        "fontSize": { "value": 14 }
                    }
                }
            },
            // 🔥 Testo statico per l'asse Y (0 e Max Value)
            {
                "type": "text",
                "encode": {
                    "enter": [
                        {
                            "x": { "value": -10 },
                            "y": { "scale": "yscale", "value": 0, "offset": 5 },
                            "text": { "value": "0" },
                            "align": { "value": "right" },
                            "baseline": { "value": "top" },
                            "fill": { "value": "black" },
                            "fontSize": { "value": 12 }
                        },
                        {
                            "x": { "value": -10 },
                            "y": { "scale": "yscale", "value": maxValue, "offset": -5 },
                            "text": { "value": maxValue.toString() },
                            "align": { "value": "right" },
                            "baseline": { "value": "bottom" },
                            "fill": { "value": "black" },
                            "fontSize": { "value": 12 }
                        }
                    ]
                }
            },
            ...(type.includes("ci") ? [{
                "type": "rule",
                "from": { "data": "table" },
                "encode": {
                    "enter": {
                        "x": { "scale": "xscale", "field": "category" },
                        "y": { "scale": "yscale", "field": "ci_upper" },
                        "y2": { "scale": "yscale", "field": "ci_lower" },
                        "stroke": { "value": "red" },
                        "strokeWidth": { "value": 2 }
                    }
                }
            }] : [])
        ]
    };
};

const createChart = async (id, type) => {
    const result = await vegaEmbed(`#${id}`, createSpec(type));
    return result.view;
};

const updateChart = (view, type) => {
    setInterval(() => {
        const categories = ["A", "B", "C"];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const value = Math.floor(Math.random() * maxValue); // 🔥 Valori limitati da maxValue
        const ci_lower = value - Math.random() * 10;
        const ci_upper = value + Math.random() * 10;
        const opacity = type === "history" || type === "history-ci" ? Math.random() * 0.5 + 0.5 : 1;

        const newData = {
            category,
            value,
            ci_lower,
            ci_upper,
            opacity
        };

        console.log(`[${type.toUpperCase()}] Nuovo dato:`, newData);

        view.change("table", vega.changeset().insert([newData])).run();
    }, 2000);
};

// Creazione delle quattro visualizzazioni
Promise.all([
    createChart("baseline", "baseline"),
    createChart("ci", "ci"),
    createChart("history", "history"),
    createChart("history-ci", "history-ci")
]).then(([baselineView, ciView, historyView, historyCIView]) => {
    updateChart(baselineView, "baseline");
    updateChart(ciView, "ci");
    updateChart(historyView, "history");
    updateChart(historyCIView, "history-ci");
});
