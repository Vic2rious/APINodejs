const express = require("express");
const app = express();
const PORT = 5500;

app.use(express.json());

app.get("/tshirt", (req, res) => {
    res.status(200).send({
        tshirt: "maroco8",
        size: "large"
    });
});

app.post("/tshirt/:id", (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
        return res.status(418).send({message: "We need a logo!"});
    }

    res.send({
        tshirt: `Tshirt with your ${logo} and ID of ${id}`,
    });
});

// PATCH method example
app.patch("/tshirt/:id", (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
        return res.status(400).send({ message: "We need at least one attribute to update (logo or size)!" });
    }

    res.send({
        message: `Tshirt with ID ${id} has been updated with logo ${logo}`,
    });
});

app.listen(
    PORT,
    () => console.log(`Prismatic core online on http://localhost:${PORT}`)
);
