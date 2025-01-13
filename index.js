import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");

const cocktails = {
    monday: [12776, 11000, 17205, 11690, 11728],
    tuesday: [12388, 178350, 12856, 17828, 15006],
    wednesday: [12518, 17194, 13058, 13056, 178347],
    thursday: [17208, 16031, 12093, 14978, 12097],
    friday: [178352, 12768, 11375, 17197, 178344],
    saturday: [17193, 12127, 12196, 178349, 178322],
    sunday: [15026, 13190, 17006, 11602, 11604]
};

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/cocktail", async (req, res) => {
    const { day } = req.query;

    if (!cocktails[day]) {
        return res.status(404).send("Invalid day");
    }

    const cocktailIds = cocktails[day];
    const randomId = cocktailIds[Math.floor(Math.random() * cocktailIds.length)];

    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomId}`);
        const cocktail = response.data.drinks[0];

        res.render("cocktail.ejs", {
            name: cocktail.strDrink,
            image: cocktail.strDrinkThumb,
            instructions: cocktail.strInstructions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching cocktail");
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});