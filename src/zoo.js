/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const data = require('./data');

function animalsByIds(...ids) {
  return data.animals.filter(({ id }) => ids.includes((id)));
}

function animalsOlderThan(animal, minimumAge) {
  const animalName = data.animals.find(({ name }) => name === animal);
  return animalName.residents.every(({ age }) => age >= minimumAge);
}

function employeeByName(employeeName) {
  if (employeeName === undefined) return {};
  return data.employees.find(({ firstName, lastName }) =>
    employeeName === firstName || employeeName === lastName);
}

function createEmployee({ id, firstName, lastName }, { managers, responsibleFor }) {
  return {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
}

function isManager(id) {
  return data.employees.some(({ managers }) => managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  data.employees.push({
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  });
}

function animalCount(...species) {
  if (species.length === 0) {
    const animals = data.animals.map((animal) => animal.name);
    const count = data.animals.map((animal) => animal.residents.length);
    const allAnimals = {};
    animals.forEach((animal, index) => { allAnimals[animal] = count[index]; });
    return allAnimals;
  }
  const searchAnimals = data.animals.filter((animal) => species.includes(animal.name));
  return searchAnimals.reduce((result, each) => each.residents.length, 0);
}

function entryCalculator(entrants) {
  if (!entrants) return 0;
  const people = Object.keys(entrants);
  return people.reduce((result, key) => result + entrants[key] * data.prices[key], 0);
}

// const getLocations = () => {
//   const locations = [];
//   data.animals.forEach((animal) => {
//     if (!locations.includes(animal.location)) locations.push(animal.location);
//   });
//   return locations;
// };

// const notIncludeNames = (locations) => {
//   const map = {};
//   locations.forEach((loc) => map[loc] = data.animals
//     .filter((animal) => animal.location.includes(loc)).map((animal) => animal.name));
//   return map;
// }

// const animalSpecie = (animalName) => {
//   const teste = {};
//   animalName.forEach((animal) => teste[animal] = 'teste');
//   console.log(teste);
// }

// const filterAnimals = (loc) => {
//   const animals = data.animals.filter((animal) => animal.location.includes(loc)).map((animal) => animal.name);
//   const animalNames = animalSpecie(animals);
//   return animalNames;
// }

// const includeLocations = (locations) => {
//   const obj = {};
//   locations.forEach((location) => obj[location] = filterAnimals(location));
//   return obj;
// }

// function animalMap(options = { includeNames: false, sex: 'both', sorted: false }) {
//   const locations = getLocations();
//   if (!options.includeNames) return notIncludeNames(locations);
//   return includeLocations(locations);
// }

// console.log(animalMap({ includeNames: true }));

function daySchedule(day) {
  const { open, close } = data.hours[day];
  if (open > 0 && close > 0) return `Open from ${open}am until ${close - 12}pm`;
  return 'CLOSED';
}

function weekSchedule(scheduleKeys) {
  const result = {};
  scheduleKeys.forEach((day) => { result[day] = daySchedule(day); });
  return result;
}

function fullSchedule() {
  const openTime = data.hours;
  const scheduleKeys = Object.keys(openTime);
  return weekSchedule(scheduleKeys);
}

function schedule(dayName) {
  if (!dayName) return fullSchedule();
  return { [dayName]: daySchedule(dayName) };
}

function oldestFromFirstSpecies(id) {
  const responsibleEmployee = data.employees.find((employee) => employee.id === id);
  const firstSpecie = responsibleEmployee.responsibleFor[0];
  const residentList = data.animals.find((animal) => animal.id === firstSpecie).residents;
  const oldestAnimal = residentList.reduce((result, animal) =>
    (result.age > animal.age ? result : animal));
  return ([oldestAnimal.name, oldestAnimal.sex, oldestAnimal.age]);
}

function increasePrices(percentage) {
  const priceKeys = Object.keys(data.prices);
  priceKeys.forEach((key) => {
    let newValue = data.prices[key] * (1 + (percentage / 100));
    newValue = Math.ceil(newValue * 100);
    data.prices[key] = newValue / 100;
  });
}

function eachId(id) {
  const animalObj = data.animals.find((animal) => animal.id === id);
  return animalObj.name;
}

function employeeResponsability(name) {
  const locateEmployee = data.employees.find((employee) => name.includes(employee.firstName));
  const animalIds = locateEmployee.responsibleFor;
  const animalNames = [];
  animalIds.forEach((id) => animalNames.push(eachId(id)));
  return animalNames;
}

function findEmployee(param) {
  const employeeObj = data.employees.find((employee) =>
    param.includes(employee.id) || param.includes(employee.lastName)
    || param.includes(employee.firstName));
  return [`${employeeObj.firstName} ${employeeObj.lastName}`];
}

function employeeCoverage(...idOrName) {
  let parametersArray;
  if (idOrName.length === 0) {
    parametersArray = data.employees.map((employee) =>
      `${employee.firstName} ${employee.lastName}`);
  } else parametersArray = findEmployee(idOrName);
  const employeeList = {};
  parametersArray.forEach((employee) => {
    employeeList[employee] = employeeResponsability(employee);
  });
  console.log(employeeList);
  return employeeList;
}

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  // animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
