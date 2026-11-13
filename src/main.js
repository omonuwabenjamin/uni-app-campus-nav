const buildings = [
  {
    id: 'north-hall',
    name: 'North Hall',
    type: 'Accommodation',
    category: 'residence',
    description: 'Residence halls with social lounges and student services.',
    coords: { row: 1, col: 2 },
    note: '10 min walk to the library',
    access: ['Laundry', 'Bike storage', 'Common room'],
    walkTime: 10,
  },
  {
    id: 'library',
    name: 'Main Library',
    type: 'Study Hub',
    category: 'library',
    description: 'A quiet study hub with printing, group rooms, and café seating.',
    coords: { row: 2, col: 3 },
    note: 'Open until 11:00 PM',
    access: ['Printing', 'Computers', 'Study rooms'],
    walkTime: 8,
  },
  {
    id: 'science-quad',
    name: 'Science Quad',
    type: 'Academic Block',
    category: 'science',
    description: 'Laboratories and lecture theatres for science and engineering students.',
    coords: { row: 3, col: 2 },
    note: 'Connected to the engineering labs',
    access: ['Lab access', 'Lecture halls', 'Cafeteria'],
    walkTime: 12,
  },
  {
    id: 'student-centre',
    name: 'Student Centre',
    type: 'Services',
    category: 'services',
    description: 'Support hub for wellbeing, finance, and student activities.',
    coords: { row: 2, col: 5 },
    note: 'Next to the union square',
    access: ['Advice desk', 'Café', 'Events'],
    walkTime: 6,
  },
  {
    id: 'sports-hub',
    name: 'Sports Hub',
    type: 'Recreation',
    category: 'sports',
    description: 'Indoor courts, gym facilities, and sports club rooms.',
    coords: { row: 4, col: 4 },
    note: 'High foot traffic during evenings',
    access: ['Gym', 'Pool', 'Clubs'],
    walkTime: 15,
  },
  {
    id: 'admin',
    name: 'University Admin',
    type: 'Administration',
    category: 'admin',
    description: 'Admissions and student administration offices and help desk.',
    coords: { row: 1, col: 5 },
    note: 'Accepts student card queries',
    access: ['ID services', 'Support desk', 'Scholarship help'],
    walkTime: 9,
  },
];

const mapRows = 5;
const mapCols = 7;
const buildingList = document.querySelector('#buildingList');
const searchInput = document.querySelector('#searchInput');
const selectedName = document.querySelector('#selectedName');
const buildingType = document.querySelector('#buildingType');
const buildingDescription = document.querySelector('#buildingDescription');
const buildingMeta = document.querySelector('#buildingMeta');
const routeButton = document.querySelector('#routeButton');
const mapGrid = document.querySelector('#mapGrid');

let selectedBuilding = buildings[0];

function getShortestRoute(start, destination) {
  const walkTime = Math.abs(start.coords.row - destination.coords.row) +
    Math.abs(start.coords.col - destination.coords.col) + 4;

  return `${walkTime} min via pedestrian route`;
}

function renderBuildingList(filterText = '') {
  const query = filterText.trim().toLowerCase();

  const filtered = buildings.filter((building) => {
    const haystack = `${building.name} ${building.type} ${building.category}`.toLowerCase();
    return haystack.includes(query);
  });

  buildingList.innerHTML = filtered
    .map(
      (building) => `
        <li>
          <button class="building-item ${building.id === selectedBuilding.id ? 'active' : ''}" data-id="${building.id}">
            <span>${building.name}</span>
            <small>${building.walkTime} min</small>
          </button>
        </li>
      `
    )
    .join('');

  buildingList.querySelectorAll('.building-item').forEach((button) => {
    button.addEventListener('click', () => {
      const match = buildings.find((building) => building.id === button.dataset.id);
      if (match) {
        selectedBuilding = match;
        render();
      }
    });
  });
}

function renderMap() {
  mapGrid.innerHTML = '';

  const tiles = [];

  for (let row = 0; row < mapRows; row += 1) {
    for (let col = 0; col < mapCols; col += 1) {
      const tile = document.createElement('div');
      tile.className = 'tile';

      const buildingHere = buildings.find(
        (building) => building.coords.row === row && building.coords.col === col
      );

      if (buildingHere) {
        tile.classList.add('occupied', buildingHere.category);
        tile.setAttribute('data-building-id', buildingHere.id);
        tile.setAttribute('title', buildingHere.name);

        if (buildingHere.id === selectedBuilding.id) {
          tile.classList.add('selected');
        }

        tile.addEventListener('click', () => {
          selectedBuilding = buildingHere;
          render();
        });
      }

      tiles.push(tile);
    }
  }

  mapGrid.append(...tiles);
}

function renderDetails() {
  selectedName.textContent = selectedBuilding.name;
  buildingType.textContent = selectedBuilding.type;
  buildingDescription.textContent = selectedBuilding.description;

  buildingMeta.innerHTML = `
    <li><strong>Location:</strong> ${selectedBuilding.note}</li>
    <li><strong>Walk time:</strong> ${selectedBuilding.walkTime} minutes</li>
    <li><strong>Facilities:</strong> ${selectedBuilding.access.join(', ')}</li>
  `;
}

function render() {
  renderBuildingList(searchInput.value);
  renderMap();
  renderDetails();
}

searchInput.addEventListener('input', (event) => {
  renderBuildingList(event.target.value);
});

routeButton.addEventListener('click', () => {
  const start = buildings[0];
  const routeText = getShortestRoute(start, selectedBuilding);
  buildingMeta.innerHTML = `
    <li><strong>Starting point:</strong> ${start.name}</li>
    <li><strong>Route:</strong> ${routeText}</li>
    <li><strong>Facilities:</strong> ${selectedBuilding.access.join(', ')}</li>
  `;
});

render();
