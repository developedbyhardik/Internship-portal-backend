export async function addInternship(data) {
  try {
    const { internship } = await import("../data/data.js");

    const result = await internship.insertOne(data);

    return {
      added: true,
    };
  } catch (error) {
    console.error(error);
    return {
      added: false,
    };
  }
}
