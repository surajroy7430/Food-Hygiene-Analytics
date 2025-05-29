let establishmentsArray = [];
let analyzedData = {};

document.addEventListener("DOMContentLoaded", async () => {
  await getTotalEstablishments();
  analyzeHygieneData();

  showMenu(analyzedData);

  console.log(analyzedData);
});

// 1. Fetch & Parse
const getTotalEstablishments = async () => {
  let API_URL =
    "https://ratings.food.gov.uk/api/open-data-files/FHRS529en-GB.json";

  try {
    let res = await fetch(`${API_URL}`);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }
    let jsonData = await res.json();
    let data = jsonData?.FHRSEstablishment?.EstablishmentCollection || [];

    establishmentsArray.push(...data);
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
  }
};

let validRatings = ["0", "1", "2", "3", "4", "5"];

let analyzeHygieneData = () => {
  const totalBusinesses = establishmentsArray.length;
  const averageRating = calculateAverageRating(
    establishmentsArray,
    validRatings
  );
  const ratingsDistribution = countByField(establishmentsArray, "RatingValue", [
    ...validRatings,
    "Exempt",
  ]);

  const BusinessCount = countByField(establishmentsArray, "BusinessType");
  const topBusinessTypes = getTopItems(BusinessCount, 5);
  const topRatedBusinesses = getTopRatedBusinesses(
    establishmentsArray,
    "5",
    10
  );

  const authorityInsights = getAuthorityInsights(establishmentsArray);

  let oldData = generateOldMockData(establishmentsArray);
  const mostImprovedAuthority = getMostImprovedAuthority(
    oldData,
    establishmentsArray
  );

  analyzedData = {
    totalBusinesses,
    averageRating,
    ratingsDistribution,
    topBusinessTypes,
    topRatedBusinesses,
    authorityInsights,
    mostImprovedAuthority,
  };
};

let countByField = (data, field, validValues = null) => {
  return data.reduce((acc, item) => {
    let value = item[field];
    if ((value && !validValues) || validValues.includes(value)) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
};

let calculateAverageRating = (data, validRatings) => {
  let ratings = data.filter((item) => validRatings.includes(item.RatingValue));
  let sum = ratings.reduce((acc, item) => acc + parseInt(item.RatingValue), 0);
  let average = Number((sum / ratings.length).toFixed(2));

  return average;
};

let getTopItems = (objCount, limit) => {
  return Object.entries(objCount)
    .map(([key, value]) => ({ type: key, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

let getTopRatedBusinesses = (data, rating, limit) => {
  return data
    .filter((item) => item.RatingValue === rating)
    .sort((a, b) => new Date(b.RatingDate) - new Date(a.RatingDate))
    .slice(0, limit)
    .map((item) => ({
      name: item.BusinessName,
      address: [item?.AddressLine1, item?.AddressLine2].join(", "),
      rating: item.RatingValue,
      ratingDate: item.RatingDate,
      authority: item.LocalAuthorityName,
    }));
};

let groupedByAutority = (data) => {
  return data.reduce((acc, item) => {
    let key = item.LocalAuthorityName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);

    return acc;
  }, {});
};

let getAuthorityInsights = (data) => {
  let groupedData = groupedByAutority(data);

  let insights = {};
  Object.keys(groupedData).forEach((item) => {
    let establishment = groupedData[item];

    let totalBusinesses = establishment.length;
    let averageRating = calculateAverageRating(establishment, validRatings);

    let ratingCount = countByField(establishment, "RatingValue", validRatings);
    let fiveStarPercentage = totalBusinesses
      ? Number(((ratingCount["5"] / totalBusinesses) * 100).toFixed(1))
      : 0;

    insights[item] = {
      averageRating,
      totalBusinesses,
      fiveStarPercentage,
    };
  });

  return insights;
};

let getFiveStarCounts = (data) => {
  let groupedData = groupedByAutority(data);

  let fiveStarCounts = {};
  for (let authority in groupedData) {
    let ratingVal = ["5"];
    let count = countByField(groupedData[authority], "RatingValue", ratingVal);
    fiveStarCounts[authority] = count[ratingVal];
  }

  return fiveStarCounts;
};

let getMostImprovedAuthority = (oldData, newData) => {
  let oldCounts = getFiveStarCounts(oldData);
  let newCounts = getFiveStarCounts(newData);

  let mostImproved = {
    name: "",
    increaseInFiveStarCount: -Infinity,
  };

  for (let authority in newCounts) {
    let newCount = newCounts[authority];
    let oldCount = oldCounts[authority] || 0;

    let increase = newCount - oldCount;

    if (increase > mostImproved.increaseInFiveStarCount) {
      mostImproved = {
        name: authority,
        increaseInFiveStarCount: increase,
      };
    }
  }

  return mostImproved;
};

// Extras
let generateOldMockData = (newData) => {
  return newData.map((item) => {
    if (item.RatingValue === "5" && Math.random() < 0.3) {
      return { ...item, RatingValue: `${Math.floor(Math.random() * 5)}` };
    }
    return item;
  });
};

// CLI UI
const showMenu = (results) => {
  let exit = false;
  while (!exit) {
    const choice = prompt(
      `🍽 Food Hygiene Analyzer 🍽\n\nChoose an option:\n
        1. Show total number of businesses
        2. Show average rating
        3. Show ratings distribution
        4. Show top 5 business types
        5. Show top 10 five-star businesses
        6. Show authority-wise insights
        7. Show most improved authority
        8. Export authority insights to CSV
        0. Exit:
      `
    );

    switch (choice) {
      case "1":
        alert(`Total businesses: ${results.totalBusinesses}`);
        break;
      case "2":
        alert(`Average rating: ${results.averageRating}`);
        break;
      case "3":
        alert(
          `Ratings Distribution:\n${Object.entries(results.ratingsDistribution)
            .map(([key, val]) => `${key}: ${val}`)
            .join("\n")}`
        );
        break;
      case "4":
        alert(
          `Top 5 Business Types:\n${results.topBusinessTypes
            .map((item) => `${item.type}: ${item.count}`)
            .join("\n")}`
        );
        break;
      case "5":
        alert(
          `Top 10 Five-Star Businesses:\n${results.topRatedBusinesses
            .map(
              (item, idx) =>
                `${idx + 1}. ${item.name} (${item.authority}) - ${
                  item.ratingDate
                }`
            )
            .join("\n")}`
        );
        break;
      case "6":
        let insightMsg = "";
        for (let [authority, data] of Object.entries(results.authorityInsights)) {
          insightMsg += `${authority}: Avg ${data.averageRating.toFixed(2)}, 5-Star: ${
            data.fiveStarPercentage
          }%\n`;
        }
        alert(insightMsg);
        break;
      case "7":
        const most = results.mostImprovedAuthority;
        alert(
          `Most Improved Authority: ${most.name}\n5-Star Rating Increase: ${most.increaseInFiveStarCount}`
        );
        break;
      case "8":
        downloadAuthorityCSV(results.authorityInsights);
        alert("CSV downloaded!");
        break;
      case "0":
        exit = true;
        break;
      default:
        alert("Invalid choice. Try again.");
    }
  }
};

function downloadAuthorityCSV(insights) {
  let csv = "Authority,Average Rating,Total Businesses,Five-Star %\n";
  for (let [authority, info] of Object.entries(insights)) {
    csv += `"${authority}",${info.averageRating},${info.totalBusinesses},${info.fiveStarPercentage}\n`;
  }

  // Create downloadable file
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  // Trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "authority_insights.csv";
  link.click();

  URL.revokeObjectURL(url);
}
