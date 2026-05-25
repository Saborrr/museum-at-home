"use strict";

var BUNDLED_ART = [
  {
    "id": "wiki-the-starry-night",
    "title": "The Starry Night",
    "artist": "Vincent van Gogh",
    "year": "1889",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-starry-night.jpg",
    "thumb": "img/paintings/wiki-the-starry-night.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-bedroom",
    "title": "The Bedroom",
    "artist": "Vincent van Gogh",
    "year": "1888",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-bedroom.jpg",
    "thumb": "img/paintings/wiki-the-bedroom.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-sunflowers",
    "title": "Sunflowers",
    "artist": "Vincent van Gogh",
    "year": "1888",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-sunflowers.jpg",
    "thumb": "img/paintings/wiki-sunflowers.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-café-terrace-at-night",
    "title": "Café Terrace at Night",
    "artist": "Vincent van Gogh",
    "year": "1888",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-café-terrace-at-night.jpg",
    "thumb": "img/paintings/wiki-café-terrace-at-night.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-night-café",
    "title": "The Night Café",
    "artist": "Vincent van Gogh",
    "year": "1888",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-night-café.jpg",
    "thumb": "img/paintings/wiki-the-night-café.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-almond-blossoms",
    "title": "Almond Blossoms",
    "artist": "Vincent van Gogh",
    "year": "1890",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-almond-blossoms.jpg",
    "thumb": "img/paintings/wiki-almond-blossoms.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-mona-lisa",
    "title": "Mona Lisa",
    "artist": "Leonardo da Vinci",
    "year": "c. 1503–1519",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-mona-lisa.jpg",
    "thumb": "img/paintings/wiki-mona-lisa.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-last-supper",
    "title": "The Last Supper",
    "artist": "Leonardo da Vinci",
    "year": "c. 1495–1498",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-last-supper.jpg",
    "thumb": "img/paintings/wiki-the-last-supper.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-creation-of-adam",
    "title": "The Creation of Adam",
    "artist": "Michelangelo",
    "year": "c. 1508–1512",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-creation-of-adam.jpg",
    "thumb": "img/paintings/wiki-the-creation-of-adam.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-birth-of-venus",
    "title": "The Birth of Venus",
    "artist": "Sandro Botticelli",
    "year": "c. 1485",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-birth-of-venus.jpg",
    "thumb": "img/paintings/wiki-the-birth-of-venus.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-primavera",
    "title": "Primavera",
    "artist": "Sandro Botticelli",
    "year": "c. 1480",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-primavera.jpg",
    "thumb": "img/paintings/wiki-primavera.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-scream",
    "title": "The Scream",
    "artist": "Edvard Munch",
    "year": "1893",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-scream.jpg",
    "thumb": "img/paintings/wiki-the-scream.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-girl-with-a-pearl-earring",
    "title": "Girl with a Pearl Earring",
    "artist": "Johannes Vermeer",
    "year": "c. 1665",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-girl-with-a-pearl-earring.jpg",
    "thumb": "img/paintings/wiki-girl-with-a-pearl-earring.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-great-wave-off-kanagawa",
    "title": "The Great Wave off Kanagawa",
    "artist": "Katsushika Hokusai",
    "year": "c. 1831",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-great-wave-off-kanagawa.jpg",
    "thumb": "img/paintings/wiki-the-great-wave-off-kanagawa.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-kiss",
    "title": "The Kiss",
    "artist": "Gustav Klimt",
    "year": "1907–1908",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-kiss.jpg",
    "thumb": "img/paintings/wiki-the-kiss.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-persistence-of-memory",
    "title": "The Persistence of Memory",
    "artist": "Salvador Dalí",
    "year": "1931",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-persistence-of-memory.jpg",
    "thumb": "img/paintings/wiki-the-persistence-of-memory.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-american-gothic",
    "title": "American Gothic",
    "artist": "Grant Wood",
    "year": "1930",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-american-gothic.jpg",
    "thumb": "img/paintings/wiki-american-gothic.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-nighthawks",
    "title": "Nighthawks",
    "artist": "Edward Hopper",
    "year": "1942",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-nighthawks.jpg",
    "thumb": "img/paintings/wiki-nighthawks.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-impression-sunrise",
    "title": "Impression, Sunrise",
    "artist": "Claude Monet",
    "year": "1872",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-impression-sunrise.jpg",
    "thumb": "img/paintings/wiki-impression-sunrise.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-water-lilies-(nymphéas)",
    "title": "Water Lilies (Nymphéas)",
    "artist": "Claude Monet",
    "year": "1906",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-water-lilies-(nymphéas).jpg",
    "thumb": "img/paintings/wiki-water-lilies-(nymphéas).jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-guernica",
    "title": "Guernica",
    "artist": "Pablo Picasso",
    "year": "1937",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-guernica.jpg",
    "thumb": "img/paintings/wiki-guernica.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-school-of-athens",
    "title": "The School of Athens",
    "artist": "Raphael",
    "year": "1509–1511",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-school-of-athens.jpg",
    "thumb": "img/paintings/wiki-the-school-of-athens.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-third-of-may-1808",
    "title": "The Third of May 1808",
    "artist": "Francisco Goya",
    "year": "1814",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-third-of-may-1808.jpg",
    "thumb": "img/paintings/wiki-the-third-of-may-1808.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-fighting-temeraire",
    "title": "The Fighting Temeraire",
    "artist": "J.M.W. Turner",
    "year": "1839",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-fighting-temeraire.jpg",
    "thumb": "img/paintings/wiki-the-fighting-temeraire.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-christina's-world",
    "title": "Christina's World",
    "artist": "Andrew Wyeth",
    "year": "1948",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-christina's-world.jpg",
    "thumb": "img/paintings/wiki-christina's-world.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-wanderer-above-the-sea-of-fog",
    "title": "Wanderer above the Sea of Fog",
    "artist": "Caspar David Friedrich",
    "year": "c. 1818",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-wanderer-above-the-sea-of-fog.jpg",
    "thumb": "img/paintings/wiki-wanderer-above-the-sea-of-fog.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-composition-vii",
    "title": "Composition VII",
    "artist": "Wassily Kandinsky",
    "year": "1913",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-composition-vii.jpg",
    "thumb": "img/paintings/wiki-composition-vii.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-composition-with-red-blue-and-",
    "title": "Composition with Red, Blue, and Yellow",
    "artist": "Piet Mondrian",
    "year": "1930",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-composition-with-red-blue-and-.jpg",
    "thumb": "img/paintings/wiki-composition-with-red-blue-and-.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-son-of-man",
    "title": "The Son of Man",
    "artist": "René Magritte",
    "year": "1964",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-son-of-man.jpg",
    "thumb": "img/paintings/wiki-the-son-of-man.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-bal-du-moulin-de-la-galette",
    "title": "Bal du moulin de la Galette",
    "artist": "Pierre-Auguste Renoir",
    "year": "1876",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-bal-du-moulin-de-la-galette.jpg",
    "thumb": "img/paintings/wiki-bal-du-moulin-de-la-galette.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-the-sleeping-gypsy",
    "title": "The Sleeping Gypsy",
    "artist": "Henri Rousseau",
    "year": "1897",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-the-sleeping-gypsy.jpg",
    "thumb": "img/paintings/wiki-the-sleeping-gypsy.jpg",
    "source": "wikimedia"
  },
  {
    "id": "wiki-whistler's-mother",
    "title": "Whistler's Mother",
    "artist": "James Abbott McNeill Whistler",
    "year": "1871",
    "museum": "Wikimedia Commons / Google Art Project",
    "image": "img/paintings/wiki-whistler's-mother.jpg",
    "thumb": "img/paintings/wiki-whistler's-mother.jpg",
    "source": "wikimedia"
  },
  {
    "id": "met-436535",
    "title": "Wheat Field with Cypresses",
    "artist": "Vincent van Gogh",
    "year": "1889",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436535.jpg",
    "thumb": "img/paintings/met-436535.jpg",
    "source": "met"
  },
  {
    "id": "met-436528",
    "title": "Irises",
    "artist": "Vincent van Gogh",
    "year": "1890",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436528.jpg",
    "thumb": "img/paintings/met-436528.jpg",
    "source": "met"
  },
  {
    "id": "met-436532",
    "title": "Self-Portrait with a Straw Hat (obverse: The Potato Peeler)",
    "artist": "Vincent van Gogh",
    "year": "1887",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436532.jpg",
    "thumb": "img/paintings/met-436532.jpg",
    "source": "met"
  },
  {
    "id": "met-437394",
    "title": "Aristotle with a Bust of Homer",
    "artist": "Rembrandt (Rembrandt van Rijn)",
    "year": "1653",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-437394.jpg",
    "thumb": "img/paintings/met-437394.jpg",
    "source": "met"
  },
  {
    "id": "met-437397",
    "title": "Self-Portrait",
    "artist": "Rembrandt (Rembrandt van Rijn)",
    "year": "1660",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-437397.jpg",
    "thumb": "img/paintings/met-437397.jpg",
    "source": "met"
  },
  {
    "id": "met-437881",
    "title": "Young Woman with a Water Pitcher",
    "artist": "Johannes Vermeer",
    "year": "ca. 1662",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-437881.jpg",
    "thumb": "img/paintings/met-437881.jpg",
    "source": "met"
  },
  {
    "id": "met-436575",
    "title": "View of Toledo",
    "artist": "El Greco (Domenikos Theotokopoulos)",
    "year": "ca. 1599–1600",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436575.jpg",
    "thumb": "img/paintings/met-436575.jpg",
    "source": "met"
  },
  {
    "id": "met-436573",
    "title": "Cardinal Fernando Niño de Guevara (1541–1609)",
    "artist": "El Greco (Domenikos Theotokopoulos)",
    "year": "ca. 1600",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436573.jpg",
    "thumb": "img/paintings/met-436573.jpg",
    "source": "met"
  },
  {
    "id": "met-436105",
    "title": "The Death of Socrates",
    "artist": "Jacques Louis David",
    "year": "1787",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436105.jpg",
    "thumb": "img/paintings/met-436105.jpg",
    "source": "met"
  },
  {
    "id": "met-436106",
    "title": "Antoine Laurent Lavoisier (1743–1794) and Marie Anne Lavoisier (Marie Anne Pierrette Paulze, 1758–1836)",
    "artist": "Jacques Louis David",
    "year": "1788",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436106.jpg",
    "thumb": "img/paintings/met-436106.jpg",
    "source": "met"
  },
  {
    "id": "met-435844",
    "title": "The Musicians",
    "artist": "Caravaggio (Michelangelo Merisi)",
    "year": "1597",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-435844.jpg",
    "thumb": "img/paintings/met-435844.jpg",
    "source": "met"
  },
  {
    "id": "met-435809",
    "title": "The Harvesters",
    "artist": "Pieter Bruegel the Elder",
    "year": "1565",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-435809.jpg",
    "thumb": "img/paintings/met-435809.jpg",
    "source": "met"
  },
  {
    "id": "met-435868",
    "title": "The Card Players",
    "artist": "Paul Cézanne",
    "year": "1890–92",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-435868.jpg",
    "thumb": "img/paintings/met-435868.jpg",
    "source": "met"
  },
  {
    "id": "met-435882",
    "title": "Still Life with Apples and a Pot of Primroses",
    "artist": "Paul Cézanne",
    "year": "ca. 1890",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-435882.jpg",
    "thumb": "img/paintings/met-435882.jpg",
    "source": "met"
  },
  {
    "id": "met-438817",
    "title": "The Dance Class",
    "artist": "Edgar Degas",
    "year": "1874",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-438817.jpg",
    "thumb": "img/paintings/met-438817.jpg",
    "source": "met"
  },
  {
    "id": "met-436947",
    "title": "Boating",
    "artist": "Edouard Manet",
    "year": "1874",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-436947.jpg",
    "thumb": "img/paintings/met-436947.jpg",
    "source": "met"
  },
  {
    "id": "met-437430",
    "title": "By the Seashore",
    "artist": "Auguste Renoir",
    "year": "1883",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-437430.jpg",
    "thumb": "img/paintings/met-437430.jpg",
    "source": "met"
  },
  {
    "id": "met-437654",
    "title": "Circus Sideshow (Parade de cirque)",
    "artist": "Georges Seurat",
    "year": "1887–88",
    "museum": "Metropolitan Museum of Art, New York",
    "image": "img/paintings/met-437654.jpg",
    "thumb": "img/paintings/met-437654.jpg",
    "source": "met"
  }
];
