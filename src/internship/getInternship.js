export async function getInternship() {
  try {
    const { internship } = await import("../data/data.js");

    const result = await internship.find({}).toArray();

    return {
      getData: true,
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      getData: false,
    };
  }
}
