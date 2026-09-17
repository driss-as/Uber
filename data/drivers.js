// Base de données locale de VTC fictifs, concentrés sur les lieux clés de
// Paris (monuments, quartiers touristiques) et les aéroports franciliens

// Catégories de course, dans l'esprit des offres Uber réelles
export const RIDE_TYPES = {
  UberX: { label: 'UberX', priceMultiplier: 1, capacity: 4, color: '#f0f0f0' },
  Comfort: { label: 'Comfort', priceMultiplier: 1.25, capacity: 4, color: '#e3e9f7' },
  Green: { label: 'Uber Green', priceMultiplier: 1.08, capacity: 4, color: '#dcf1e4' },
  Black: { label: 'Uber Black', priceMultiplier: 1.7, capacity: 4, color: '#dcdcdc' },
  Van: { label: 'Uber Van', priceMultiplier: 1.45, capacity: 6, color: '#f3e6da' },
};

const TYPE_CYCLE = ['UberX', 'Comfort', 'Black', 'Green', 'Van'];

// Avatar généré (DiceBear, libre d'usage) à partir du nom du chauffeur
function avatarFor(name) {
  return `https://api.dicebear.com/9.x/avataaars/png?size=128&seed=${encodeURIComponent(name)}`;
}

const RAW_DRIVERS = [
  { id: 'd1', lat: 48.8584, lng: 2.2945, heading: 40, model: 'Tesla Model 3', name: 'Lucas Bernard' }, // Tour Eiffel
  { id: 'd2', lat: 48.8738, lng: 2.295, heading: 120, model: 'Peugeot 508', name: 'Camille Petit' }, // Arc de Triomphe
  { id: 'd3', lat: 48.853, lng: 2.3499, heading: 250, model: 'Toyota Corolla', name: 'Nathan Roux' }, // Notre-Dame
  { id: 'd4', lat: 48.8606, lng: 2.3376, heading: 300, model: 'Mercedes Classe E', name: 'Sophie Fontaine' }, // Louvre
  { id: 'd5', lat: 48.8867, lng: 2.3431, heading: 10, model: 'Renault Talisman', name: 'Louis Girard' }, // Sacré-Cœur
  { id: 'd6', lat: 48.8698, lng: 2.3079, heading: 190, model: 'BMW Série 3', name: 'Manon Bonnet' }, // Champs-Élysées
  { id: 'd7', lat: 48.8462, lng: 2.3464, heading: 160, model: 'Skoda Octavia', name: 'Hugo Faure' }, // Panthéon
  { id: 'd8', lat: 48.86, lng: 2.3266, heading: 80, model: 'Tesla Model Y', name: 'Chloé Simon' }, // Musée d'Orsay
  { id: 'd9', lat: 48.8656, lng: 2.3212, heading: 220, model: 'Volkswagen Passat', name: 'Ethan Michel' }, // Place de la Concorde
  { id: 'd10', lat: 48.863, lng: 2.2872, heading: 330, model: 'Hyundai Ioniq', name: 'Léa Garcia' }, // Trocadéro
  { id: 'd11', lat: 48.8532, lng: 2.3692, heading: 60, model: 'Citroën C5', name: 'Maxime Perrin' }, // Bastille
  { id: 'd12', lat: 48.8606, lng: 2.3522, heading: 280, model: 'Kia Niro', name: 'Julie Robert' }, // Centre Pompidou
  { id: 'd13', lat: 48.8462, lng: 2.3372, heading: 150, model: 'Audi A4', name: 'Théo Morel' }, // Jardin du Luxembourg
  { id: 'd14', lat: 48.8719, lng: 2.3316, heading: 200, model: 'Ford Mondeo', name: 'Emma Lefèvre' }, // Opéra Garnier
  { id: 'd15', lat: 48.8683, lng: 2.3293, heading: 90, model: 'Nissan Leaf', name: 'Antoine Dubois' }, // Place Vendôme
  { id: 'd16', lat: 48.8867, lng: 2.3406, heading: 70, model: 'Renault Zoé', name: 'Laura Moreau' }, // Montmartre
  { id: 'd17', lat: 48.8555, lng: 2.347, heading: 310, model: 'Citroën C4', name: 'Nicolas Girard' }, // Île de la Cité
  { id: 'd18', lat: 48.8556, lng: 2.2986, heading: 180, model: 'Peugeot 3008', name: 'Inès Rousseau' }, // Champ de Mars
  { id: 'd19', lat: 48.8662, lng: 2.3125, heading: 130, model: 'Škoda Superb', name: 'Alexandre Blanc' }, // Grand Palais
  { id: 'd20', lat: 48.8566, lng: 2.3522, heading: 20, model: 'Toyota Prius', name: 'Sarah Fournier' }, // Hôtel de Ville
  { id: 'd21', lat: 48.8674, lng: 2.3634, heading: 240, model: 'BMW Série 5', name: 'Romain Mercier' }, // Place de la République
  { id: 'd22', lat: 48.8709, lng: 2.3654, heading: 100, model: 'Volkswagen ID.3', name: 'Clara Dupont' }, // Canal Saint-Martin
  { id: 'd23', lat: 48.8799, lng: 2.3822, heading: 290, model: 'Mercedes Classe C', name: 'Baptiste Lambert' }, // Buttes-Chaumont
  { id: 'd24', lat: 48.8636, lng: 2.25, heading: 50, model: 'Hyundai Tucson', name: 'Océane Vincent' }, // Bois de Boulogne
  { id: 'd25', lat: 48.828, lng: 2.4336, heading: 210, model: 'Tesla Model S', name: 'Julien Muller' }, // Bois de Vincennes
  { id: 'd26', lat: 48.8809, lng: 2.3553, heading: 340, model: 'Ford Kuga', name: 'Pauline Leroy' }, // Gare du Nord
  { id: 'd27', lat: 49.0097, lng: 2.5479, heading: 170, model: 'Kia Sportage', name: 'Adrien Meyer' }, // Aéroport CDG
  { id: 'd28', lat: 48.7262, lng: 2.3652, heading: 110, model: 'Audi Q3', name: 'Charlotte Denis' }, // Aéroport d'Orly
  { id: 'd29', lat: 48.9694, lng: 2.4414, heading: 260, model: 'Renault Mégane', name: 'Kevin Vidal' }, // Aéroport Le Bourget
  { id: 'd30', lat: 48.8571, lng: 2.3346, heading: 30, model: 'Nissan Qashqai', name: 'Justine Caron' }, // Comédie-Française
];

export const DRIVERS = RAW_DRIVERS.map((driver, index) => {
  const type = TYPE_CYCLE[index % TYPE_CYCLE.length];
  return {
    ...driver,
    type,
    rating: (4.6 + ((index * 7) % 40) / 100).toFixed(2), // 4.60 à 4.99
    photo: avatarFor(driver.name),
  };
});
