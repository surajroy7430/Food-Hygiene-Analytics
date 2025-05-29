# Food-Hygiene-Analytics

This JavaScript-based project fetches food hygiene data from the UK's Food Standards Agency and analyzes it to extract useful insights, including average ratings, distribution, top-rated establishments, business types, and performance by local authorities.

## Features

- Fetches real-world establishment hygiene data from the Food Standards Agency.
- Calculates average hygiene ratings across all establishments.
- Displays distribution of ratings (0–5, Exempt).
- Identifies:
  - Top 5 business types by number of establishments.
  - Top 10 recently 5-star rated businesses.
  - Performance insights for each local authority (average rating, % of 5-star ratings).
- Simulates historical data and detects the most improved local authority in terms of 5-star ratings.
- Interactive CLI-style interface using `prompt()` and `alert()` to explore insights.
- Export local authority insights to a downloadable CSV file.

---

## How It Works

### 1. Data Fetching

Uses the official [Food Standards Agency Open Data API](https://ratings.food.gov.uk/open-data) to fetch hygiene rating data in JSON format.

```js
https://ratings.food.gov.uk/api/open-data-files/FHRS529en-GB.json
```

### 2. Data Analytics Function

| Function                     | Purpose                                                               |
| ---------------------------- | --------------------------------------------------------------------- |
| `getTotalEstablishments()`   | Fetches and stores establishment data.                                |
| `analyzeHygieneData()`       | Runs analysis on the fetched data.                                    |
| `calculateAverageRating()`   | Computes average hygiene rating from valid ratings (0–5).             |
| `countByField()`             | Utility to count occurrences of specific field values.                |
| `getTopItems()`              | Sorts and slices object entries by count.                             |
| `getTopRatedBusinesses()`    | Finds latest 5-star businesses.                                       |
| `getAuthorityInsights()`     | Gathers stats for each local authority (average rating, % of 5-star). |
| `getMostImprovedAuthority()` | Identifies authority with biggest increase in 5-star ratings.         |
| `showMenu()`                 | CLI-like menu using `prompt()` and `alert()` to explore insights.     |
| `downloadAuthorityCSV()`     | Downloads a CSV of authority-wise hygiene insights.                   |

### 3. Extra Features

| Function                | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `generateOldMockData()` | Simulates old data with 30% downgrade ratings for comparison. |

---

## Output

```json
{
  "totalBusinesses": 1304,
  "averageRating": 4.53,
  "ratingsDistribution": {
    "1": 18,
    "2": 20,
    "3": 110,
    "4": 166,
    "5": 780,
    "Exempt": 121
  },
  "topBusinessTypes": [
    {
      "type": "Restaurant/Cafe/Canteen",
      "count": 312
    },
    {
      "type": "Retailers - other",
      "count": 241
    },
    {
      "type": "Takeaway/sandwich shop",
      "count": 201
    },
    {
      "type": "Other catering premises",
      "count": 174
    },
    {
      "type": "Hospitals/Childcare/Caring Premises",
      "count": 152
    }
  ],
  "topRatedBusinesses": [
    {
      "name": "Prezzo",
      "address": "26 - 30 Station Way, Cheam",
      "rating": "5",
      "ratingDate": "2025-05-21",
      "authority": "Sutton"
    },
    {
      "name": "Whitehill Food And Wine - MACE",
      "address": "6 Hillfield Parade, Bishopsford Road",
      "rating": "5",
      "ratingDate": "2025-05-21",
      "authority": "Sutton"
    },
    {
      "name": "Play BC Preschool",
      "address": "Elm Grove Hall, Butter Hill",
      "rating": "5",
      "ratingDate": "2025-05-20",
      "authority": "Sutton"
    },
    {
      "name": "Sassis In The Grove",
      "address": "The Grove Lodge, 1 High Street",
      "rating": "5",
      "ratingDate": "2025-05-19",
      "authority": "Sutton"
    },
    {
      "name": "Willow Lodge Nursing Home",
      "address": "Willow Lodge, 59 Burdon Lane",
      "rating": "5",
      "ratingDate": "2025-05-19",
      "authority": "Sutton"
    },
    {
      "name": "Spill The Beans Coffee Shop",
      "address": "Church Hall, Carshalton Beeches Baptist Free Church",
      "rating": "5",
      "ratingDate": "2025-05-16",
      "authority": "Sutton"
    },
    {
      "name": "Tudor Lodge",
      "address": "45 The Gallop, Sutton",
      "rating": "5",
      "ratingDate": "2025-05-16",
      "authority": "Sutton"
    },
    {
      "name": "Leo Academy Trust - Leo Catering",
      "address": "Cheam Park Farm Junior School, Kingston Avenue",
      "rating": "5",
      "ratingDate": "2025-05-15",
      "authority": "Sutton"
    },
    {
      "name": "Costa Coffee",
      "address": "29 The Market, Wrythe Lane",
      "rating": "5",
      "ratingDate": "2025-05-14",
      "authority": "Sutton"
    },
    {
      "name": "Grove Road School",
      "address": "36 - 46 Grove Road, Sutton",
      "rating": "5",
      "ratingDate": "2025-05-14",
      "authority": "Sutton"
    }
  ],
  "authorityInsights": {
    "Sutton": {
      "averageRating": 4.53,
      "totalBusinesses": 1304,
      "fiveStarPercentage": 59.8
    }
  },
  "mostImprovedAuthority": {
    "name": "Sutton",
    "increaseInFiveStarCount": 249
  }
}
```

---

## Setup Instructions

- Clone this repository or copy the script into an HTML file.
- Open the HTML in a browser that supports ES6 and fetch.
- Open DevTools (F12) to view the output of the analysis in the console.
- If you face CORS issues while fetching data, consider using CORS chrome extention and enable it

---

## How to View the Exported CSV

After choosing option `8` in the CLI, the file `authority_insights.csv` will be downloaded.
You can open it with:

- Excel
- Google Sheets
- Any text editor
