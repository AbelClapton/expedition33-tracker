/**
 * Per-entry media, written by scripts/fetch-entry-media.mjs. Do not edit by hand.
 *
 * Keyed by `<layerId>:<entryId>`, the same key the Quarry and the found sets use.
 * Images live under `public/images/<layer>/`.
 */
export interface EntryMedia {
  /** The entry's own art, when one exists. */
  image?: string;
  /** Short facts for the card's chip row. */
  meta?: string[];
  /** Labelled values for the card's stat grid. */
  stats?: Array<{ label: string; value: string }>;
  /** Prose blocks: how to get it, where it was obtained. */
  sections?: Array<{ title: string; body: string }>;
}

export const ENTRY_MEDIA: Record<string, EntryMedia> = {
  "hairstyles:464983": {
    "image": "/images/hairstyles/464983-bun-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Turn in a Token to Amandine in the Prologue"
      },
      {
        "title": "Where to find it",
        "body": "Location: Obtained from Amandine in exchange for one Festival Token · Region: Lumiere (Intro)"
      }
    ]
  },
  "hairstyles:466310": {
    "image": "/images/hairstyles/466310-baguette-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Spring Meadows Mime"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime in combat. · Region: Spring Meadows"
      }
    ]
  },
  "hairstyles:474631": {
    "image": "/images/hairstyles/474631-short-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Flying Waters Mime"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Mime · Region: Flying Waters"
      }
    ]
  },
  "hairstyles:475415": {
    "image": "/images/hairstyles/475415-baguette-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Ancient Sanctuary Mime"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Mime · Region: Ancient Sanctuary"
      }
    ]
  },
  "hairstyles:475517": {
    "image": "/images/hairstyles/475517-gestral-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Delsitra the Merchant in Gestral Village, near the Sakapatate fighting arena"
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Delsitra · Region: Gestral Village"
      }
    ]
  },
  "hairstyles:475518": {
    "image": "/images/hairstyles/475518-rebellious-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Found in the cellar of the Manor. Via the door in Gestral Village, access the kitchen and open the trapdoor by interacting with objects then drop down and head into the adjacent room"
      },
      {
        "title": "Where to find it",
        "body": "Location: Inside The Manor as accessed from the Gestral Village - In the basement accessed via hatch among some boxes in the corner, unlocked after interacting with 3 objects in the kitchen. Inside a crate by the stairs in the room accessed by crawling under the hole in the wall. · Region: Gestral Village"
      }
    ]
  },
  "hairstyles:504399": {
    "image": "/images/hairstyles/504399-ponytail-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Jerijeri the Merchant in Stone Wave Cliffs"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Jerijeri · Region: Stone Wave Cliffs"
      }
    ]
  },
  "hairstyles:504405": {
    "image": "/images/hairstyles/504405-charming-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Jumeliba the Merchant on a beach southwest of Stone Wave Cliffs."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Jumeliba before the end of Act 1. · Region: Continent"
      }
    ]
  },
  "hairstyles:504406": {
    "image": "/images/hairstyles/504406-curly-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Jumeliba the Merchant on a beach southwest of Stone Wave Cliffs."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Jumeliba before the end of Act 1. · Region: Continent"
      }
    ]
  },
  "hairstyles:504414": {
    "image": "/images/hairstyles/504414-bun-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Blackora the Merchant southwest of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Blakora · Region: Continent"
      }
    ]
  },
  "hairstyles:504415": {
    "image": "/images/hairstyles/504415-ponytail-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Blackora the Merchant southwest of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Blakora · Region: Continent"
      }
    ]
  },
  "hairstyles:504416": {
    "image": "/images/hairstyles/504416-french-bob-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Help the Grandis break the ice in The Carousel. Required the Paint Break ability received after finding 4 Lost Gestrals"
      },
      {
        "title": "Where to find it",
        "body": "Speak to Grandis after freeing the carousel from the ice. Answer yes to receive the new haircut. · Region: Continent"
      }
    ]
  },
  "hairstyles:504417": {
    "image": "/images/hairstyles/504417-half-ponytail-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Rederi the Merchant to the south of Sirene on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Rederi · Region: Continent"
      }
    ]
  },
  "hairstyles:504418": {
    "image": "/images/hairstyles/504418-rebellious-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Rederi the Merchant south of Sirene on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Rederi · Region: Continent"
      }
    ]
  },
  "hairstyles:504419": {
    "image": "/images/hairstyles/504419-double-braid-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Colaro the Merchant on the beach right behind Stone Wave Cliffs on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Colaro · Region: Continent"
      }
    ]
  },
  "hairstyles:504420": {
    "image": "/images/hairstyles/504420-vintage-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Colaro the Merchant on the beach right behind Stone Wave Cliffs on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Colaro · Region: Continent"
      }
    ]
  },
  "hairstyles:504430": {
    "image": "/images/hairstyles/504430-baguette-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Esquie's Nest Mime"
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime. · Region: Esquie's Nest"
      }
    ]
  },
  "hairstyles:504437": {
    "image": "/images/hairstyles/504437-braid-haircut-maelle-art.png",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime. · Region: Yellow Harvest"
      }
    ]
  },
  "hairstyles:504459": {
    "image": "/images/hairstyles/504459-short-curly-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Appla the Merchant on the beach west across the water from Gestral Village on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Appla · Region: Continent"
      }
    ]
  },
  "hairstyles:504460": {
    "image": "/images/hairstyles/504460-braid-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Appla the Merchant near Stone Wave Cliffs Cave on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Appla · Region: Continent"
      }
    ]
  },
  "hairstyles:504461": {
    "image": "/images/hairstyles/504461-vintage-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Geranjo the Merchant on the island northwest of Stone Wave Cliffs on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Geranjo · Region: Continent"
      }
    ]
  },
  "hairstyles:504477": {
    "image": "/images/hairstyles/504477-short-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Carrabi the Merchant on a beach south of Stone Wave Cliffs."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi before the end of Act 1 · Region: Continent"
      }
    ]
  },
  "hairstyles:504495": {
    "image": "/images/hairstyles/504495-braid-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Old Lumiere"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the Mime. · Region: Old Lumiere"
      }
    ]
  },
  "hairstyles:504528": {
    "image": "/images/hairstyles/504528-short-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after defeating the Mime in Frozen Hearts (optional area north of Monoco's Station)."
      },
      {
        "title": "Where to find it",
        "body": "Dropped from the Mime · Region: Frozen Hearts"
      }
    ]
  },
  "hairstyles:504540": {
    "image": "/images/hairstyles/504540-voluminous-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Found northwest of Old Lumiere on the world map, where you'll find 2 Mimes"
      },
      {
        "title": "Where to find it",
        "body": "Reward from defeating the Mimes · Region: Continent"
      }
    ]
  },
  "hairstyles:504541": {
    "image": "/images/hairstyles/504541-voluminous-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Found northwest of Old Lumiere on the world map, where you'll find 2 Mimes"
      },
      {
        "title": "Where to find it",
        "body": "Reward from defeating the Mimes · Region: Continent"
      }
    ]
  },
  "hairstyles:504542": {
    "image": "/images/hairstyles/504542-plunging-bob-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Pecha the Merchant directly south of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Pecha · Region: Continent"
      }
    ]
  },
  "hairstyles:504543": {
    "image": "/images/hairstyles/504543-french-bob-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Pecha the Merchant directly south of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Pecha · Region: Continent"
      }
    ]
  },
  "hairstyles:504562": {
    "image": "/images/hairstyles/504562-french-bob-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Strabami the Merchant east of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Strabami · Region: Continent"
      }
    ]
  },
  "hairstyles:504576": {
    "image": "/images/hairstyles/504576-artist-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Blabary merchant on the continent west of Gestral Village, near the Hidden Gestral Arena."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Blabary · Region: Continent"
      }
    ]
  },
  "hairstyles:504577": {
    "image": "/images/hairstyles/504577-artist-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Blabary merchant on the continent west of Gestral Village, near the Hidden Gestral Arena."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Blabary · Region: Continent"
      }
    ]
  },
  "hairstyles:504578": {
    "image": "/images/hairstyles/504578-artist-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Blabary merchant on the continent west of Gestral Village, near the Hidden Gestral Arena."
      },
      {
        "title": "Where to find it",
        "body": "Soled by Blabary · Region: Continent"
      }
    ]
  },
  "hairstyles:504579": {
    "image": "/images/hairstyles/504579-messy-bun-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Papasso the Merchant on the beach to the west of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Papasso · Region: Continent"
      }
    ]
  },
  "hairstyles:504580": {
    "image": "/images/hairstyles/504580-messy-bun-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Papasso the Merchant on the beach to the west of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Papasso · Region: Continent"
      }
    ]
  },
  "hairstyles:504581": {
    "image": "/images/hairstyles/504581-short-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Papasso the Merchant on the beach west of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Papasso · Region: Continent"
      }
    ]
  },
  "hairstyles:504582": {
    "image": "/images/hairstyles/504582-gustave-s-haircut-verso-art.png",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Sold by Papasso · Region: Continent"
      }
    ]
  },
  "hairstyles:504586": {
    "image": "/images/hairstyles/504586-double-braid-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Granasori the Merchant on the island south of The Monolith on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Granasori · Region: Continent"
      }
    ]
  },
  "hairstyles:504786": {
    "image": "/images/hairstyles/504786-sirene-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sirene"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the Mime. · Region: Sirene"
      }
    ]
  },
  "hairstyles:504842": {
    "image": "/images/hairstyles/504842-baguette-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in the Joy sub-section of Visages"
      },
      {
        "title": "Where to find it",
        "body": "Region: Visages"
      }
    ]
  },
  "hairstyles:511915": {
    "image": "/images/hairstyles/511915-voluminous-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in the Tainted Cliffs region of Inside the Monolith"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime. · Region: Inside the Monolith"
      }
    ]
  },
  "hairstyles:512713": {
    "image": "/images/hairstyles/512713-bun-braid-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "hairstyles:512714": {
    "image": "/images/hairstyles/512714-long-double-bun-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Caves"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "hairstyles:512715": {
    "image": "/images/hairstyles/512715-long-double-bun-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "hairstyles:512716": {
    "image": "/images/hairstyles/512716-long-double-bun-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Caves"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "hairstyles:512717": {
    "image": "/images/hairstyles/512717-chic-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside of Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "hairstyles:513801": {
    "image": "/images/hairstyles/513801-wavy-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Pinabby merchant in Yellow Harvest"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Pinabby · Region: Yellow Harvest"
      }
    ]
  },
  "hairstyles:513973": {
    "image": "/images/hairstyles/513973-curly-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Sodasso the Merchant northwest of Visages on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Sodasso · Region: Continent"
      }
    ]
  },
  "hairstyles:513974": {
    "image": "/images/hairstyles/513974-short-white-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Sodasso the Merchant northwest of Visages on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Sodasso · Region: Continent"
      }
    ]
  },
  "hairstyles:513975": {
    "image": "/images/hairstyles/513975-double-braid-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Sodasso the Merchant northwest of Visages on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Sodasso · Region: Continent"
      }
    ]
  },
  "hairstyles:515730": {
    "image": "/images/hairstyles/515730-pure-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Lucaroparfe the Merchant in the Chromatic Petank area on the eastern border of the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Lucaroparfé · Region: Continent"
      }
    ]
  },
  "hairstyles:516770": {
    "image": "/images/hairstyles/516770-chic-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Unlocked by completing the hopscotch near the Gestral Baths in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi before the end of Act 1 · Region: Continent"
      }
    ]
  },
  "hairstyles:516771": {
    "image": "/images/hairstyles/516771-esquie-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Can be purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi before the end of Act 1 · Region: Continent"
      }
    ]
  },
  "hairstyles:516918": {
    "image": "/images/hairstyles/516918-bun-braid-gustave-art.png",
    "meta": [
      "Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Sold by Jumeliba before the end of Act 1. · Region: Continent"
      }
    ]
  },
  "hairstyles:518582": {
    "image": "/images/hairstyles/518582-gestral-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Find one of Sastro's Lost Gestrals and talk to him at Camp."
      },
      {
        "title": "Where to find it",
        "body": "Obtained from Sastro in the Camp after finding 1 Lost Gestral · Region: Continent"
      }
    ]
  },
  "hairstyles:518583": {
    "image": "/images/hairstyles/518583-gestral-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Gifted by Sastro after finding 2 Lost Gestrals"
      },
      {
        "title": "Where to find it",
        "body": "Obtained from Sastro in the Camp after finding 2 Lost Gestrals · Region: Continent"
      }
    ]
  },
  "hairstyles:518584": {
    "image": "/images/hairstyles/518584-gestral-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Received from Sastro after finding 3 Lost Gestrals"
      },
      {
        "title": "Where to find it",
        "body": "Obtained from Sastro in the Camp after finding 3 Lost Gestrals · Region: Continent"
      }
    ]
  },
  "hairstyles:518585": {
    "image": "/images/hairstyles/518585-gestral-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Received from Sastro after finding 5 Lost Gestrals"
      },
      {
        "title": "Where to find it",
        "body": "Obtained from Sastro in the Camp after finding 5 Lost Gestrals · Region: Continent"
      }
    ]
  },
  "hairstyles:518700": {
    "image": "/images/hairstyles/518700-viking-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "When going from Relationship Level 2 to 3 with Monoco, select \"Fine\" when discussing haircuts"
      },
      {
        "title": "Where to find it",
        "body": "Unlocked in the process of reaching Bond Level 3 with Monoco. Choose these dialogue options: - \"Yes, my hair is impeccable.\" - \"Fine!\" · Region: Sirene"
      }
    ]
  },
  "hairstyles:518701": {
    "image": "/images/hairstyles/518701-samurai-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "When going from Relationship Level 2 to 3 with Monoco, select \"Fine\" when discussing haircuts"
      },
      {
        "title": "Where to find it",
        "body": "Unlocked in the process of reaching Bond Level 3 with Monoco. Choose these dialogue options: - \"Yes, my hair is impeccable.\" - \"Fine!\" · Region: Sirene"
      }
    ]
  },
  "hairstyles:518854": {
    "image": "/images/hairstyles/518854-real-maelle-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Automatically unlocked as you begin Act 3 of the main story"
      },
      {
        "title": "Where to find it",
        "body": "Automatically obtained when you complete Act II. · Region: Inside the Monolith"
      }
    ]
  },
  "hairstyles:518874": {
    "image": "/images/hairstyles/518874-esquie-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:518875": {
    "image": "/images/hairstyles/518875-esquie-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:518876": {
    "image": "/images/hairstyles/518876-esquie-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:518877": {
    "image": "/images/hairstyles/518877-esquie-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:518878": {
    "image": "/images/hairstyles/518878-esquie-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:521401": {
    "image": "/images/hairstyles/521401-baguette-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in The Reacher"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime. · Region: The Reacher"
      }
    ]
  },
  "hairstyles:521457": {
    "image": "/images/hairstyles/521457-painted-me-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after defeating Alicia"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating Alicia · Region: The Reacher"
      }
    ]
  },
  "hairstyles:521628": {
    "image": "/images/hairstyles/521628-bald-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sunless Cliffs as Verso"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime as Verso. · Region: Continent"
      }
    ]
  },
  "hairstyles:521629": {
    "image": "/images/hairstyles/521629-bald-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Continent Merchant near Stone Wave Cliffs Cave"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime as Lune. · Region: Continent"
      }
    ]
  },
  "hairstyles:521630": {
    "image": "/images/hairstyles/521630-bald-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sunless Cliffs as Sciel"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime as Sciel. · Region: Continent"
      }
    ]
  },
  "hairstyles:521631": {
    "image": "/images/hairstyles/521631-bald-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sunless Cliffs as Maelle"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime as Maelle. · Region: Continent"
      }
    ]
  },
  "hairstyles:521632": {
    "image": "/images/hairstyles/521632-bald-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sunless Cliffs as Monoco"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime as Monoco. · Region: Continent"
      }
    ]
  },
  "hairstyles:521889": {
    "image": "/images/hairstyles/521889-clea-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in the upper section of Flying Manor"
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime in Flying Manor. · Region: Flying Manor"
      }
    ]
  },
  "hairstyles:522320": {
    "image": "/images/hairstyles/522320-gestral-white-maelle-art.png",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Golgra in the Dark Gestral Arena. She fights you immediately after completing Round 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527184": {
    "image": "/images/hairstyles/527184-clea-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete Stage 3, Trial 3 of the Endless Tower ."
      },
      {
        "title": "Where to find it",
        "body": "Endless Tower - Reward for defeating the Goblu and Chromatic Abbest in Stage 3, Trial 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527185": {
    "image": "/images/hairstyles/527185-double-braid-white-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Colaro the Merchant northeast of Gestral Village on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Chromatic Echassier in Stage 4, Trial 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527186": {
    "image": "/images/hairstyles/527186-rebellious-white-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 5, Trial 3 of Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Endless Tower -Reward for defeating Chromatic Troubadour and Chromatic Abberation in Stage 5, Trial 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527190": {
    "image": "/images/hairstyles/527190-messy-bun-white-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 6, Trial 3 of Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Found within the Endless Tower - rewarded for defeating the Gargant in Stage 6, Trial 3 · Region: Continent"
      }
    ]
  },
  "hairstyles:527191": {
    "image": "/images/hairstyles/527191-clea-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 7, Trial 3 in Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Found within the Endless Tower - rewarded for defeating the Ultimate Sakapatate and Chromatic Luster in Stage 7, Trial 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527194": {
    "image": "/images/hairstyles/527194-expedition-white-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 9, Trial 3 of Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Found within the Endless Tower - rewarded for defeating the Chromatic Danseuse, Flame Eveque, and Frost Eveque in Stage 9, Trial 3. · Region: Continent"
      }
    ]
  },
  "hairstyles:527196": {
    "image": "/images/hairstyles/527196-ponytail-white-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete all Stages and Trials of the Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Location: Rewarded upon completion of all 33 Endless Tower challenges when you speak to the Faded Woman. · Region: Continent"
      }
    ]
  },
  "hairstyles:527280": {
    "image": "/images/hairstyles/527280-simon-verso-gustave-art.png",
    "meta": [
      "Verso/Gustave",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Simon The Divergent Star within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "hairstyles:527283": {
    "image": "/images/hairstyles/527283-simon-lune-art.png",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Simon The Divergent Star within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "hairstyles:527284": {
    "image": "/images/hairstyles/527284-simon-maelle-art.png",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Simon The Divergent Star within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "hairstyles:527285": {
    "image": "/images/hairstyles/527285-simon-sciel-art.png",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Simon The Divergent Star within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "hairstyles:527286": {
    "image": "/images/hairstyles/527286-simon-monoco-art.png",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating Simon The Divergent Star within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "hairstyles:543259": {
    "image": "/images/hairstyles/543259-chic-verso-art.jpg",
    "meta": [
      "Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the hopscotch near the Gestral Baths flag in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Spawns after completing the game by stepping on the numbers in ascending order. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543290": {
    "image": "/images/hairstyles/543290-double-bun-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the broken hopscotch in the wooded area of Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Reward for stepping on the 10 plates in order, starting here. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543321": {
    "image": "/images/hairstyles/543321-baguette-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543349": {
    "image": "/images/hairstyles/543349-double-bun-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Obtained by completing the hopscotch in Candy Land within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Reward for jumping onto the number panels sequentially, found in an area beyond the Crawlspace. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543366": {
    "image": "/images/hairstyles/543366-osquio-gustave-verso-art.jpg",
    "meta": [
      "Gustave/Verso",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Obtained by defeating Osquio in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating Osquio · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543372": {
    "image": "/images/hairstyles/543372-osquio-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil area within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543373": {
    "image": "/images/hairstyles/543373-osquio-lune-art.jpg",
    "meta": [
      "Lune",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil area within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543374": {
    "image": "/images/hairstyles/543374-osquio-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543375": {
    "image": "/images/hairstyles/543375-osquio-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543398": {
    "image": "/images/hairstyles/543398-chic-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the hopscotch near the Toy Boat Quest in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Appears after standing on the panels in ascending order. Most of them are underwater. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543413": {
    "image": "/images/hairstyles/543413-double-bun-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the \"Whee Whoo\" Esquie statue puzzle in Gestral Baths within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Half-baked Lifeguard alongside a Piece of Cake after turning half of the nearby Esquie statues blue. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543440": {
    "image": "/images/hairstyles/543440-double-bun-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Haircut"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Land inside the blue water ring from the diving board in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Reward for jumping off the diving board and landing in the blue ring, then speaking to the Half-baked Gestral. · Region: Verso's Drafts"
      }
    ]
  },
  "hairstyles:543441": {
    "image": "/images/hairstyles/543441-french-bob-monoco-art.png",
    "meta": [
      "Monoco",
      "Haircut"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for jumping off the diving board and landing in the red ring, then speaking to the Half-baked Gestral. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:464986": {
    "image": "/images/outfits/464986-crimson-uniform-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Side Quest - Prologue: A Uniform for Richard's Son"
      },
      {
        "title": "Where to find it",
        "body": "Location: Rewarded from Jules after agreeing to help Richard · Region: Lumiere (Intro)"
      }
    ]
  },
  "outfits:466311": {
    "image": "/images/outfits/466311-baguette-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Spring Meadows Mime"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime in combat. · Region: Spring Meadows"
      }
    ]
  },
  "outfits:475414": {
    "image": "/images/outfits/475414-baguette-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Ancient Sanctuary Mime"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Mime · Region: Ancient Sanctuary"
      }
    ]
  },
  "outfits:475479": {
    "image": "/images/outfits/475479-sakapatate-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Side Quest in Gestral Village : Help Alexsoundro"
      },
      {
        "title": "Where to find it",
        "body": "Location: Rewarded from Alexsoundro for completing their quest · Region: Gestral Village"
      }
    ]
  },
  "outfits:475491": {
    "image": "/images/outfits/475491-sakapatate-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Buy in Gestral Village from Alexcyclo the Merchant, near the theatre stage"
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Alexcyclo · Region: Gestral Village"
      }
    ]
  },
  "outfits:475515": {
    "image": "/images/outfits/475515-sakapatate-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Delsitra the Merchant in Gestral Village, near the Sakapatate fighting arena"
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Delsitra · Region: Gestral Village"
      }
    ]
  },
  "outfits:475516": {
    "image": "/images/outfits/475516-sakapatate-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Delsitra the Merchant in Gestral Village"
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Delsitra · Region: Gestral Village"
      }
    ]
  },
  "outfits:504428": {
    "image": "/images/outfits/504428-sakapatate-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Successfully complete Ono-Puncho's 9,999 damage request in Gestral Village"
      },
      {
        "title": "Where to find it",
        "body": "Complete Ono-Puncho's Side Quest · Region: Gestral Village"
      }
    ]
  },
  "outfits:504429": {
    "image": "/images/outfits/504429-baguette-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Esquie's Nest Mime"
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime. · Region: Esquie's Nest"
      }
    ]
  },
  "outfits:504462": {
    "image": "/images/outfits/504462-skirt-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Geranjo the Merchant northwest of Stone Wave Cliffs on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Geranjo · Region: Continent"
      }
    ]
  },
  "outfits:504463": {
    "image": "/images/outfits/504463-civilian-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Geranjo the Merchant on the island northwest of Stone Wave Cliffs on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Geranjo · Region: Continent"
      }
    ]
  },
  "outfits:504476": {
    "image": "/images/outfits/504476-lumiere-suit-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Carrabi the Merchant in the Continent overworld (on the beach east of Gestral Village)."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi before the end of Act 1 · Region: Continent"
      }
    ]
  },
  "outfits:504478": {
    "image": "/images/outfits/504478-lumiere-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Carrabi the Merchant on the world map (on the beach east of Gestral Village)."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi · Region: Continent"
      }
    ]
  },
  "outfits:504519": {
    "image": "/images/outfits/504519-danseuse-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Successfully complete the parrying encounter with the Nevron inside Frozen Hearts"
      },
      {
        "title": "Where to find it",
        "body": "Reward from completing the Danseuses request · Region: Frozen Hearts"
      }
    ]
  },
  "outfits:504544": {
    "image": "/images/outfits/504544-obscur-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Kasumi the Merchant in Forgotten Battlefield, near the destroyed bridge"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Kasumi after fighting them. · Region: Forgotten Battlefield"
      }
    ]
  },
  "outfits:504558": {
    "image": "/images/outfits/504558-danseuse-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Verogo the Merchant in Frozen Hearts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Verogo · Region: Frozen Hearts"
      }
    ]
  },
  "outfits:504559": {
    "image": "/images/outfits/504559-pelerin-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Verogo the Merchant in Frozen Hearts, an optional area north of Monoco's Station."
      },
      {
        "title": "Where to find it",
        "body": "Sold by Verogo · Region: Frozen Hearts"
      }
    ]
  },
  "outfits:504566": {
    "image": "/images/outfits/504566-swimsuit-ii-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the \"Normal One\" opponent at Gestral Beach Rafting Volley Club - accessible by swimming after Stone Wave Cliffs to the east."
      },
      {
        "title": "Where to find it",
        "body": "Reward for beating Just a Normal One at Beach Raft Volley in Gestral Beach · Region: Continent"
      }
    ]
  },
  "outfits:504567": {
    "image": "/images/outfits/504567-swimsuit-ii-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat The Strongest Opponent at the Gestral Beach to the east (reachable after Esquie can swim)"
      },
      {
        "title": "Where to find it",
        "body": "Reward for beating The Strongest at Beach Raft Volley in Gestral Beach · Region: Continent"
      }
    ]
  },
  "outfits:504569": {
    "image": "/images/outfits/504569-swimsuit-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Gestral Beach Parkour challenge. Find it in the overworld to the west of Gestral Village"
      },
      {
        "title": "Where to find it",
        "body": "Complete the obstacle course in the Gestral Beach Note: Gustave's items can only be obtained before the end of Act I. · Region: Continent"
      }
    ]
  },
  "outfits:504570": {
    "image": "/images/outfits/504570-swimsuit-i-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Beat the Gestral Beach Parkour course (west of Gestral Village) - the answer to the question at the end doesn't matter."
      },
      {
        "title": "Where to find it",
        "body": "Complete the obstacle course in the Gestral Beach, then answer the Gestral's question: If I were a 2 year-old human, at what age would I gommage? The correct answer is 17, but you can choose any option and still get the swimsuit. · Region: Continent"
      }
    ]
  },
  "outfits:504571": {
    "image": "/images/outfits/504571-skirt-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "In the closet of a bedroom in The Manor, accessible via a door within Stone Wave Cliffs"
      },
      {
        "title": "Where to find it",
        "body": "As you enter The Manor from The Stone Wave Cliffs, interact with the dresser to the left to obtain this outfit for Maelle · Region: Stone Wave Cliffs"
      }
    ]
  },
  "outfits:504587": {
    "image": "/images/outfits/504587-pure-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Granasori the Merchant on the island south of The Monolith on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Granasori · Region: Continent"
      }
    ]
  },
  "outfits:504588": {
    "image": "/images/outfits/504588-swimsuit-ii-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Acquire the Gold Medal in the Time Trial Gestral Beach , southeast of Sirene"
      },
      {
        "title": "Where to find it",
        "body": "Reward for getting a Gold medal in the race at Gestral Beach · Region: Continent"
      }
    ]
  },
  "outfits:504639": {
    "image": "/images/outfits/504639-skirt-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Carnovi the Merchant, found up the slope to the west of Monoco's Station on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carnovi · Region: Continent"
      }
    ]
  },
  "outfits:504640": {
    "image": "/images/outfits/504640-pure-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Correctly answer the Grandis Fashionist poems in Monoco's Station as Sciel"
      },
      {
        "title": "Where to find it",
        "body": "Complete the Grandis Fashionist's questions as Sciel to receive this as a reward - Life's a river winding through the valleys of despair... -> It meets the sea's embrace, where sorrow turns to air. - Life's a story written with the ink of dreams and fears... -> And death the final chapter, where we shed our tears. - Life's a blazing comet, racing through the sky... -> Its light will softly fade, where weary skies lie. · Region: Continent"
      }
    ]
  },
  "outfits:504641": {
    "image": "/images/outfits/504641-pure-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Correctly answer the Grandis Fashionist poems in Monoco's Station as Lune"
      },
      {
        "title": "Where to find it",
        "body": "Complete the Grandis Fashionist's questions as Lune to receive this as a reward - Life blooms like a rose, with petals soft and frail... -> Winter winds will whisper, the ending of the tale. - Life's a canvas painted with the colours of our strife... -> Death the artist's final stroke, completing every life. - Life sings a song of joy and pain, its notes both sweet and bitter... -> Its echoes fade to stillness, our secrets follow after. · Region: Continent"
      }
    ]
  },
  "outfits:504642": {
    "image": "/images/outfits/504642-pure-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Correctly answer the Grandis Fashionist poems in Monoco's Station as Maelle"
      },
      {
        "title": "Where to find it",
        "body": "Complete the Grandis Fashionist's questions as Maelle to receive this as a reward - Life is but a fleeting dream, a whisper in the night... -> While shadows fade to silence, gone beyond our sight. - Through the veil of shadows, life's mysteries are spun... -> Death untangles threads, revealing what's begun. - Life dances on the edge of time, a flicker in the breeze... -> Eternity then cradles us, a promise to appease. · Region: Continent"
      }
    ]
  },
  "outfits:504643": {
    "image": "/images/outfits/504643-swimsuit-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the Only Up-inspired Gestral Beach challenge west of Monoco's Station"
      },
      {
        "title": "Where to find it",
        "body": "Complete the Gestral Ascension Gestral Beach mini game · Region: Continent"
      }
    ]
  },
  "outfits:504693": {
    "image": "/images/outfits/504693-civilian-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Through a door to the Manor on the Continent north of Lost Woods, accessible after unlocking swimming. Check the bookcase upstairs and interact with it to open a secret door."
      },
      {
        "title": "Where to find it",
        "body": "Civilian outfit for Verso Location: Found within the The Manor library - In a hidden room (activate the book shown in the screenshot) · Region: Continent"
      }
    ]
  },
  "outfits:504787": {
    "image": "/images/outfits/504787-sirene-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Sirene"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from Glissando. · Region: Sirene"
      }
    ]
  },
  "outfits:504843": {
    "image": "/images/outfits/504843-baguette-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in the Joy sub-section of Visages"
      },
      {
        "title": "Where to find it",
        "body": "Region: Visages"
      }
    ]
  },
  "outfits:512591": {
    "image": "/images/outfits/512591-lumiere-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Speak to the Gestral in Flying Casino while playing as Monoco"
      },
      {
        "title": "Where to find it",
        "body": "Talk to the Flying Casino npc in the building as Monoco (as he mentions not wanting to talk to humans). · Region: Continent"
      }
    ]
  },
  "outfits:512592": {
    "image": "/images/outfits/512592-swimsuit-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the climbing challenge on the Gestral Beach southeast of Sirene on the world map (only accessible via Esquie flight)"
      },
      {
        "title": "Where to find it",
        "body": "Reward for completing the Gestral Beach climbing challenge. · Region: Continent"
      }
    ]
  },
  "outfits:512708": {
    "image": "/images/outfits/512708-chic-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "outfits:512709": {
    "image": "/images/outfits/512709-chic-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "outfits:512710": {
    "image": "/images/outfits/512710-chic-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the hopscotch near the Toy Boat Quest in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "outfits:512711": {
    "image": "/images/outfits/512711-chic-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the hopscotch near the Gestral Baths flag in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "outfits:512712": {
    "image": "/images/outfits/512712-chic-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant outside of Coastal Cave"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Continent"
      }
    ]
  },
  "outfits:515723": {
    "image": "/images/outfits/515723-renoir-s-suit-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after defeating Renoir in The Monolith"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating Renoir. · Region: Inside the Monolith"
      }
    ]
  },
  "outfits:515728": {
    "image": "/images/outfits/515728-sirene-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Pearo the Merchant outside the entrance to Sirene's Dress on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Pearo · Region: Continent"
      }
    ]
  },
  "outfits:515729": {
    "image": "/images/outfits/515729-pure-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Lucaroparfe the Merchant in the Chromatic Petank area on the eastern border of the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Lucaroparfé · Region: Continent"
      }
    ]
  },
  "outfits:516769": {
    "image": "/images/outfits/516769-chic-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Unlocked by completing the hopscotch near the Gestral Baths in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Carrabi before the end of Act 1 · Region: Continent"
      }
    ]
  },
  "outfits:518589": {
    "image": "/images/outfits/518589-simple-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Rubiju the Merchant on the small island northwest of Visages on the world map"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Rubiju · Region: Continent"
      }
    ]
  },
  "outfits:518853": {
    "image": "/images/outfits/518853-real-maelle-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Automatically unlocked as you begin Act 3 of the main story"
      },
      {
        "title": "Where to find it",
        "body": "Automatically obtained when you complete Act II. · Region: Inside the Monolith"
      }
    ]
  },
  "outfits:518869": {
    "image": "/images/outfits/518869-swimsuit-i-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after reaching Relationship Level 6 with Sciel"
      },
      {
        "title": "Where to find it",
        "body": "Location: Obtain Relationship Level 6 with Sciel - only possible after beginning Act 3. · Region: Inside the Monolith"
      }
    ]
  },
  "outfits:518870": {
    "image": "/images/outfits/518870-swimsuit-i-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Automatically earned after reaching Relationship Level 6 with Sciel"
      },
      {
        "title": "Where to find it",
        "body": "Location: Obtain Relationship Level 6 with Sciel - only possible after beginning Act 3. · Region: Inside the Monolith"
      }
    ]
  },
  "outfits:521402": {
    "image": "/images/outfits/521402-baguette-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in The Reacher"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Mime. · Region: The Reacher"
      }
    ]
  },
  "outfits:521510": {
    "image": "/images/outfits/521510-visages-verso-art.png",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Endless Tower - Underneath the stairs to the right of the Fading Woman. Added as part of the Thank You update. · Region: Continent"
      }
    ]
  },
  "outfits:521953": {
    "image": "/images/outfits/521953-civilian-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchase from Anthonypo the Merchant in Endless Night Sanctuary"
      },
      {
        "title": "Where to find it",
        "body": "Sold by Anthonypo"
      }
    ]
  },
  "outfits:524662": {
    "image": "/images/outfits/524662-painted-me-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after defeating Alicia"
      },
      {
        "title": "Where to find it",
        "body": "Place the Manor Family Canvas quest item on the empty frame in The Manor to unlock the Painting Room. Inside the Painting Room, you can find the outfit on the floor to the right of the black canvas. Note: not specific to this location. The Painting Room can technically be accessed from any door to the Manor once you place the painting in the empty frame. · Region: Continent"
      }
    ]
  },
  "outfits:524913": {
    "image": "/images/outfits/524913-pure-gustave-art.jpg",
    "meta": [
      "Gustave",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete the Blue Mushrooms side quest for Karatom in Gestral Village"
      },
      {
        "title": "Where to find it",
        "body": "Reward for completing Karatom's quest. · Region: Gestral Village"
      }
    ]
  },
  "outfits:527195": {
    "image": "/images/outfits/527195-clair-verso-art.jpg",
    "meta": [
      "Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 11, Trial 3 in Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Location: Rewarded upon completion of all 33 Endless Tower challenges · Region: Continent"
      }
    ]
  },
  "outfits:543320": {
    "image": "/images/outfits/543320-baguette-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543339": {
    "image": "/images/outfits/543339-renoir-gustave-verso-art.png",
    "meta": [
      "Gustave/Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for choosing Verso's ending. · Region: Lumiere (Act 3)"
      }
    ]
  },
  "outfits:543340": {
    "image": "/images/outfits/543340-civilian-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Automatically unlocked after choosing Maelle's ending"
      },
      {
        "title": "Where to find it",
        "body": "Reward for choosing Maelle's ending. · Region: Lumiere (Act 3)"
      }
    ]
  },
  "outfits:543341": {
    "image": "/images/outfits/543341-civilian-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Automatically unlocked after choosing Maelle's ending"
      },
      {
        "title": "Where to find it",
        "body": "Reward for choosing Maelle's ending. · Region: Lumiere (Act 3)"
      }
    ]
  },
  "outfits:543342": {
    "image": "/images/outfits/543342-esquie-gustave-verso-art.jpg",
    "meta": [
      "Gustave/Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Can be purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Very Very Cool Gestral when you ride the ride as Verso. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543343": {
    "image": "/images/outfits/543343-esquie-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Very Very Cool Gestral when you ride the ride as Maelle. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543344": {
    "image": "/images/outfits/543344-esquie-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Very Very Cool Gestral when you ride the ride as Lune. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543345": {
    "image": "/images/outfits/543345-esquie-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Very Very Cool Gestral when you ride the ride as Sciel. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543346": {
    "image": "/images/outfits/543346-esquie-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from Najabla the Gestral Merchant in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Given to you by the Very Very Cool Gestral when you ride the ride as Monoco. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543367": {
    "image": "/images/outfits/543367-osquio-gustave-verso-art.jpg",
    "meta": [
      "Gustave/Verso",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Obtained by defeating Osquio in Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating Osquio · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543368": {
    "image": "/images/outfits/543368-osquio-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil area within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543369": {
    "image": "/images/outfits/543369-osquio-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil area within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543370": {
    "image": "/images/outfits/543370-osquio-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:543371": {
    "image": "/images/outfits/543371-osquio-monoco-art.jpg",
    "meta": [
      "Monoco",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Purchased from the Gestral Merchant in Root of all Evil within Verso's Drafts"
      },
      {
        "title": "Where to find it",
        "body": "Sold by the Gestral Merchant. · Region: Verso's Drafts"
      }
    ]
  },
  "outfits:901008": {
    "image": "/images/outfits/901008-clea-lune-art.jpg",
    "meta": [
      "Lune",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Complete Stage 3, Trial 3 of the Endless Tower ."
      },
      {
        "title": "Where to find it",
        "body": "Speak to the Young Boy after defeating Clea. Can only pick one outfit. Pick the other outfits in NG+ and NG++ to obtain all of them. · Region: Flying Manor"
      }
    ]
  },
  "outfits:901009": {
    "image": "/images/outfits/901009-clea-maelle-art.jpg",
    "meta": [
      "Maelle",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Defeat the Mime in the upper section of Flying Manor"
      },
      {
        "title": "Where to find it",
        "body": "Speak to the Young Boy after defeating Clea. Can only pick one outfit. Pick the other outfits in NG+ and NG++ to obtain all of them. · Region: Flying Manor"
      }
    ]
  },
  "outfits:901010": {
    "image": "/images/outfits/901010-clea-sciel-art.jpg",
    "meta": [
      "Sciel",
      "Outfit"
    ],
    "sections": [
      {
        "title": "How to get it",
        "body": "Earned after completing Stage 7, Trial 3 in Endless Tower"
      },
      {
        "title": "Where to find it",
        "body": "Speak to the Young Boy after defeating Clea. Can only pick one outfit. Pick the other outfits in NG+ and NG++ to obtain all of them. · Region: Flying Manor"
      }
    ]
  },
  "quest-items:448804": {
    "image": "/images/quest-items/448804-resin-art.png"
  },
  "quest-items:448825": {
    "image": "/images/quest-items/448825-weird-pictos-art.png"
  },
  "quest-items:448827": {
    "image": "/images/quest-items/448827-a-journal-from-gustave-s-apprentices-art.png"
  },
  "quest-items:448923": {
    "image": "/images/quest-items/448923-old-key-art.png"
  },
  "quest-items:449483": {
    "image": "/images/quest-items/449483-wooden-stick-art.png"
  },
  "quest-items:449744": {
    "image": "/images/quest-items/449744-wood-boards-art.png"
  },
  "quest-items:455119": {
    "image": "/images/quest-items/455119-eternal-ice-art.png"
  },
  "quest-items:458084": {
    "image": "/images/quest-items/458084-intact-mine-art.png"
  },
  "quest-items:458546": {
    "image": "/images/quest-items/458546-glowing-rock-crystal-i-art.png"
  },
  "quest-items:458547": {
    "image": "/images/quest-items/458547-glowing-rock-crystal-ii-art.png"
  },
  "quest-items:458548": {
    "image": "/images/quest-items/458548-glowing-rock-crystal-iii-art.png"
  },
  "quest-items:464359": {
    "image": "/images/quest-items/464359-a-flower-for-sophie-art.png"
  },
  "quest-items:464966": {
    "image": "/images/quest-items/464966-festival-token-art.png"
  },
  "quest-items:464980": {
    "image": "/images/quest-items/464980-festival-token-art.png"
  },
  "quest-items:464984": {
    "image": "/images/quest-items/464984-festival-token-art.png"
  },
  "quest-items:474955": {
    "image": "/images/quest-items/474955-bourgeon-skin-art.png"
  },
  "quest-items:492396": {
    "image": "/images/quest-items/492396-mushroom-art.png"
  },
  "quest-items:543338": {
    "image": "/images/quest-items/543338-piece-of-cake-art.png"
  },
  "quest-items:543388": {
    "image": "/images/quest-items/543388-toy-boat-art.png"
  },
  "quest-items:543396": {
    "image": "/images/quest-items/543396-piece-of-cake-art.png"
  },
  "quest-items:543412": {
    "image": "/images/quest-items/543412-piece-of-cake-art.png"
  },
  "tints:448805": {
    "image": "/images/tints/448805-revive-tint-shard-art.png"
  },
  "tints:448808": {
    "image": "/images/tints/448808-chroma-elixir-shard-art.png"
  },
  "tints:448815": {
    "image": "/images/tints/448815-chroma-elixir-shard-art.png"
  },
  "tints:448818": {
    "image": "/images/tints/448818-revive-tint-shard-art.png"
  },
  "tints:448821": {
    "image": "/images/tints/448821-energy-tint-shard-art.png"
  },
  "tints:448837": {
    "image": "/images/tints/448837-energy-tint-shard-art.png"
  },
  "tints:448842": {
    "image": "/images/tints/448842-chroma-elixir-shard-art.png"
  },
  "tints:448925": {
    "image": "/images/tints/448925-energy-tint-shard-art.png"
  },
  "tints:448927": {
    "image": "/images/tints/448927-healing-tint-shard-art.png"
  },
  "tints:449459": {
    "image": "/images/tints/449459-revive-tint-shard-art.png"
  },
  "tints:449465": {
    "image": "/images/tints/449465-energy-tint-shard-art.png"
  },
  "tints:449474": {
    "image": "/images/tints/449474-healing-tint-shard-art.png"
  },
  "tints:449712": {
    "image": "/images/tints/449712-shape-of-energy-art.png"
  },
  "tints:449718": {
    "image": "/images/tints/449718-chroma-elixir-shard-art.png"
  },
  "tints:449725": {
    "image": "/images/tints/449725-healing-tint-shard-art.png"
  },
  "tints:449728": {
    "image": "/images/tints/449728-energy-tint-shard-art.png"
  },
  "tints:449754": {
    "image": "/images/tints/449754-healing-tint-shard-art.png"
  },
  "tints:449759": {
    "image": "/images/tints/449759-energy-tint-shard-art.png"
  },
  "tints:449899": {
    "image": "/images/tints/449899-revive-tint-shard-art.png"
  },
  "tints:452800": {
    "image": "/images/tints/452800-shape-of-health-art.png"
  },
  "tints:452838": {
    "image": "/images/tints/452838-revive-tint-shard-art.png"
  },
  "tints:454446": {
    "image": "/images/tints/454446-revive-tint-shard-art.png"
  },
  "tints:454684": {
    "image": "/images/tints/454684-healing-tint-shard-art.png"
  },
  "tints:454697": {
    "image": "/images/tints/454697-revive-tint-shard-art.png"
  },
  "tints:454862": {
    "image": "/images/tints/454862-energy-tint-shard-art.png"
  },
  "tints:454881": {
    "image": "/images/tints/454881-revive-tint-shard-art.png"
  },
  "tints:456568": {
    "image": "/images/tints/456568-revive-tint-shard-art.png"
  },
  "tints:456587": {
    "image": "/images/tints/456587-healing-tint-shard-art.png"
  },
  "tints:456592": {
    "image": "/images/tints/456592-shape-of-life-art.png"
  },
  "tints:458761": {
    "image": "/images/tints/458761-shape-of-energy-art.png"
  },
  "tints:474953": {
    "image": "/images/tints/474953-shape-of-health-art.png"
  },
  "tints:504319": {
    "image": "/images/tints/504319-shape-of-life-art.png"
  },
  "tints:504440": {
    "image": "/images/tints/504440-revive-tint-shard-art.png"
  },
  "tints:543325": {
    "image": "/images/tints/543325-energy-tint-shard-art.png"
  },
  "tints:543336": {
    "image": "/images/tints/543336-healing-tint-shard-art.png"
  },
  "tints:543389": {
    "image": "/images/tints/543389-revive-tint-shard-art.png"
  },
  "tints:543400": {
    "image": "/images/tints/543400-chroma-elixir-shard-art.png"
  },
  "weapons:448835": {
    "image": "/images/weapons/448835-delaram-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "269"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C) Luck (B)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Stone Wave Cliffs - South Entrance - found inside the Paint Cage in the chamber above the Hexga, just beyond where you find the Expedition 78 entry · Region: Stone Wave Cliffs"
      }
    ]
  },
  "weapons:448924": {
    "image": "/images/weapons/448924-lanceram-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "52"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C) Agility (D)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found inside the Spring Meadows - drops from the Lancelier encounter after the rest point · Region: Spring Meadows"
      }
    ]
  },
  "weapons:448926": {
    "image": "/images/weapons/448926-lighterim-lune-icon.png",
    "meta": [
      "Fire",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Fire Skills cost 1 less AP. · Level 10: 20% increased Fire damage with Skills. · Level 20: Start battle with 1 Ice Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Spring Meadows, where it drops from the first Abbest enemy you kill. · Region: Spring Meadows"
      }
    ]
  },
  "weapons:448932": {
    "image": "/images/weapons/448932-brulerum-maelle-icon.png",
    "meta": [
      "Fire",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "78"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (D) Luck (C)"
      },
      {
        "title": "Unlockable passives",
        "body": "Lv 3: Level 4 - Critical hits apply Burn. Level 10 - Base Attack applies 2 Burn. Level 20 - 100% Critical Chance while Stanceless."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Flying Waters - South Entrance - dropped by the first Bruler you kill. · Region: Flying Waters"
      }
    ]
  },
  "weapons:448933": {
    "image": "/images/weapons/448933-deminerim-lune-icon.png",
    "meta": [
      "Lightning",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Lightning Skills cost 1 less AP. · Level 10: 20% increased Lightning damage with Skills. · Level 20: Start battle with 1 Fire Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Flying Waters - South Entrance - Given as a reward for helping the Demineur (Nevron) with their quest · Region: Flying Waters"
      }
    ]
  },
  "weapons:449456": {
    "image": "/images/weapons/449456-cruleram-gustave-verso-icon.png",
    "meta": [
      "Ice",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "98"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (C) Luck (D)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Flying Waters - South Entrance - drops from the first Cruler you kill. · Region: Flying Waters"
      }
    ]
  },
  "weapons:449462": {
    "image": "/images/weapons/449462-abysseram-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "91"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C) Defense (D)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Bourgeon found within the Flying Waters · Region: Flying Waters"
      }
    ]
  },
  "weapons:449467": {
    "image": "/images/weapons/449467-troubadim-lune-icon.png",
    "meta": [
      "Physical",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Defense (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Free Aim Shots deal damage to an additional random target. · Level 10: 50% increased Free Aim damage. · Level 20: Generate a random Stain on Free Aim shot."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the Chromatic Troubadour · Region: Flying Waters"
      }
    ]
  },
  "weapons:449470": {
    "image": "/images/weapons/449470-sakaram-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "111"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (C)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Ancient Sanctuary - drops from defeating the Robust Sakapatate story enemy · Region: Ancient Sanctuary"
      }
    ]
  },
  "weapons:449471": {
    "image": "/images/weapons/449471-trebuchim-lune-icon.png",
    "meta": [
      "Lightning",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Generate a random Stain on Free Aim shot. · Level 10: +1 AP when Stains are consumed. · Level 20: Base Attack generates 2 random Stains."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the Ranger and Catapult Sakapatates found within the Ancient Sanctuary - South Entrance - from the Sanctuary Maze rest point find these enemies in the clearing accessed by crouching through the rocks · Region: Ancient Sanctuary"
      }
    ]
  },
  "weapons:449478": {
    "image": "/images/weapons/449478-demonam-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "145"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (C) Agility (B)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Can be bought from the Gestral Merchant after defeating them in their fight · Region: Gestral Village"
      }
    ]
  },
  "weapons:449479": {
    "image": "/images/weapons/449479-sekarum-maelle-icon.png",
    "meta": [
      "Physical",
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Unlockable passives",
        "body": "Lv 5: Vitality (B) Agility (C)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Can be bought from Eesda after winning a fight against them. Find them in the hut just beyond the market inside the Gestral Village · Region: Gestral Village"
      }
    ]
  },
  "weapons:449486": {
    "image": "/images/weapons/449486-medalum-maelle-icon.png",
    "meta": [
      "Physical",
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (C)"
      },
      {
        "title": "Unlockable passives",
        "body": "Lv 5: Level 4 - Start in Virtuose Stance. Level 10 - In Virtuose Stance, every Burn applied is doubled. Level 20 - In Virtuose Stance, Burn deals double damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Rewarded from the final Gestral fight in the Arena during the story quest - you must win the fight with Maelle to receive the weapon Can also be obtained by defeating Golgra in a duel (recommended late game) · Region: Gestral Village"
      }
    ]
  },
  "weapons:449489": {
    "image": "/images/weapons/449489-betelim-lune-icon.png",
    "meta": [
      "Earth",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Using a Skill that consumes Stains increases damage by 20%. Can stack up to 5 times. Resets on using a Skill without consuming Stains. · Level 10: On turn start, if no Stains, 2 random Stains are generated. · Level 20: +1 AP when Stains are consumed."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Gestral Village - inside the hut behind the Paint Spike (requires Paint Break skill) · Region: Gestral Village"
      }
    ]
  },
  "weapons:449746": {
    "image": "/images/weapons/449746-nusaro-monoco-icon.png",
    "meta": [
      "Dark",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1560"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Parries increase the Bestial Wheel by 1. Taking damage resets the Bestial Wheel. · Level 10: Upgraded Skills deal 30% more damage. · Level 20: +1 AP on Mask change."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Old Lumiere - In the first area after the Monoco cutscene, go through the ruined door on the right and follow the path · Region: Old Lumiere"
      }
    ]
  },
  "weapons:449758": {
    "image": "/images/weapons/449758-confuso-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Light damage can Burn on Critical hits. · Level 10: Apply 3 Burn instead of Mark. · Level 20: Increase Burn damage by 50% per Rank, up to 300% on Rank S."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Visages - Path of Joy, look for an opening on the left before facing the Joy mask. Guarded by Contorsionniste x1. · Region: Visages"
      }
    ]
  },
  "weapons:449879": {
    "image": "/images/weapons/449879-corderon-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Curse self on battle start. Deal 50% more damage while Cursed. · Level 10: Reset Curse duration when entering Twilight state. · Level 20: Play again when entering Twilight state."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Sinister Cave · Region: Continent"
      }
    ]
  },
  "weapons:449880": {
    "image": "/images/weapons/449880-elerim-lune-icon.png",
    "meta": [
      "Earth",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Consuming an Earth Stain applies 1 Shield to self. · Level 10: 20% increased Earth damage with Skills. · Level 20: Base Attack generates an Earth Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Sinister Cave. Can also be purchased from Fusoka in the Flying Manor · Region: Continent"
      }
    ]
  },
  "weapons:452820": {
    "image": "/images/weapons/452820-redalim-lune-icon.png",
    "meta": [
      "Ice",
      "lune"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A), Agility (B)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within Old Lumiere - Under the paint cage. It's close to the Manor Gardens expedition flag . · Region: Old Lumiere"
      }
    ]
  },
  "weapons:452860": {
    "image": "/images/weapons/452860-chevalam-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle at Rank S, but can't be Healed or gain Shields. · Level 10: 20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times. · Level 20: Apply Rush on Rank S."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Crimson Forest - revealed when the Chromatic Gold Chevaliere is defeated. · Region: Continent"
      }
    ]
  },
  "weapons:453338": {
    "image": "/images/weapons/453338-potierim-lune-icon.png",
    "meta": [
      "Ice",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1080"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Healing Skills generate one additional Light Stain. · Level 10: Consuming a Light Stain applies Slow to a random enemy. · Level 20: Base Attack generates a Light Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Dropped by one of the enemies. · Region: Continent"
      }
    ]
  },
  "weapons:454440": {
    "image": "/images/weapons/454440-lithelim-lune-icon.png",
    "meta": [
      "Void",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "739"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (C)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 50% chance to generate a Dark or Light Stain when consuming Stains. · Level 10: +1 AP on consuming a Light Stain. · Level 20: Base Attacks consume one Dark Stain to deal 200% more damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found Inside the Monolith behind the Clair Obscur · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:454678": {
    "image": "/images/weapons/454678-chation-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Sun Skills always apply 10 Foretell, but all damage taken is doubled. · Level 10: Base Attack gives 1 Moon charge and consumes all Foretell to apply Burn. · Level 20: 100% increased Burn damage in Twilight state."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Stone Wave Cliffs - South Entrance - Follow the main path to the destroyed airship. Go through the tunnel that was left by the remnants of the airship, then cross the platform to reach the other side. Stay on this path until you encounter a duo of a Greatsword Cultist and Reaper Cultist near the bridge. Defeat them so that it can drop the weapon. · Region: Stone Wave Cliffs"
      }
    ]
  },
  "weapons:454679": {
    "image": "/images/weapons/454679-coralim-lune-icon.png",
    "meta": [
      "Ice",
      "lune"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B), Defense (A)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Stone Wave Cliffs - South Entrance - at the top of the ruined building. After taking the rope up, go through both doors to find some climbing holds. Jump across the gap to reach the weapon · Region: Stone Wave Cliffs"
      }
    ]
  },
  "weapons:454680": {
    "image": "/images/weapons/454680-duenum-maelle-icon.png",
    "meta": [
      "Physical",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "192"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (C)"
      },
      {
        "title": "Unlockable passives",
        "body": "Lv 7: Level 4 - In Defensive Stance, gaining AP also gives 1 AP to allies. Level 10 - If Stanceless, Base Attack switches to Defensive Stance. Level 20 - +1 AP on Stance switch."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within Stone Wave Cliffs - South Entrance - Shoot all the locks of the Paint Cage located in the farm to obtain the Duenum. · Region: Stone Wave Cliffs"
      }
    ]
  },
  "weapons:455105": {
    "image": "/images/weapons/455105-gaulteram-gustave-verso-icon.png",
    "meta": [
      "Earth",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "259"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (C)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Bourgeon · Region: Continent"
      }
    ]
  },
  "weapons:455109": {
    "image": "/images/weapons/455109-ramasson-sciel-icon.png",
    "meta": [
      "Physical",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1308"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Can consume 1 Moon charge on turn start to recover 20% of each ally's Health. · Level 10: Base Attack gives 1 Moon charge. · Level 20: Moon Skills give one more charge."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Forgotten Battlefield - South Entrance - drops from defeating a common enemy · Region: Forgotten Battlefield"
      }
    ]
  },
  "weapons:455111": {
    "image": "/images/weapons/455111-lusteson-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1272"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Killing an enemy with Foretell applies its Foretell to another random enemy. · Level 10: Apply Mark on consuming Foretell. · Level 20: 20% increased Dark damage with Skills."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Luster · Region: Forgotten Battlefield"
      }
    ]
  },
  "weapons:455114": {
    "image": "/images/weapons/455114-benisim-lune-icon.png",
    "meta": [
      "Earth",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Healing Skills cost 1 less AP. · Level 10: Generate one Earth Stain at the beginning of each turn. · Level 20: Replay instantly on consuming Stains with a Healing Skill."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by the merchant Kasumi · Region: Forgotten Battlefield"
      }
    ]
  },
  "weapons:455115": {
    "image": "/images/weapons/455115-dualiso-gustave-verso-icon.png",
    "meta": [
      "Lightning",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "660"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Play again after a Base Attack. · Level 10: 50% increased Base Attack damage. · Level 20: Base Attack gives 4 Perfection."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the story boss Dualliste · Region: Forgotten Battlefield"
      }
    ]
  },
  "weapons:455122": {
    "image": "/images/weapons/455122-grandaro-monoco-icon.png",
    "meta": [
      "Earth",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle in Heavy Mask. · Level 10: Heavy Mask applies Shell for 3 turns. · Level 20: +1 AP per hit taken."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by the Grandis Merchant · Region: Continent"
      }
    ]
  },
  "weapons:455123": {
    "image": "/images/weapons/455123-cultam-gustave-verso-icon.png",
    "meta": [
      "Dark",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1164"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: No Perfection loss on damage taken. Perfection is instead lost on being Healed. · Level 10: Gain 2 AP on Counterattack. · Level 20: Gain 1 Rank on Counterattack."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by the Grandis Merchant · Region: Continent"
      }
    ]
  },
  "weapons:455124": {
    "image": "/images/weapons/455124-coldum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by the Grandis Merchant · Region: Continent"
      }
    ]
  },
  "weapons:455127": {
    "image": "/images/weapons/455127-algueron-sciel-icon.png",
    "meta": [
      "Frost",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Free Aim shots can consume 1 Foretell to deal 100% more damage. · Level 10: Base Attack applies 3 Foretell. · Level 20: During Twilight, Free Aim shots deal double damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Mandelgo (after defeating him in combat) · Region: Old Lumiere"
      }
    ]
  },
  "weapons:455129": {
    "image": "/images/weapons/455129-battlum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Found within Old Lumiere - South Entrance - drops from Enemy x2 · Region: Old Lumiere"
      }
    ]
  },
  "weapons:455131": {
    "image": "/images/weapons/455131-melarum-maelle-icon.png",
    "meta": [
      "Light",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "269"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C) Luck (B)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Reward for defeating Renoir. · Region: Old Lumiere"
      }
    ]
  },
  "weapons:455132": {
    "image": "/images/weapons/455132-danseso-gustave-verso-icon.png",
    "meta": [
      "Fire",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1104"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Base attack gives 1 Perfection per Burn on target. · Level 10: While Powerful, 20% chance to Burn on hit. · Level 20: +1 AP on Rank Up."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Danseuse · Region: Old Lumiere"
      }
    ]
  },
  "weapons:455134": {
    "image": "/images/weapons/455134-sadon-sciel-icon.png",
    "meta": [
      "Light",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "960"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: On turn start, gain 1 Shield if at least 1 Sun charge is active. · Level 10: Apply 5 Foretell on enemies that break Shields. · Level 20: +2 Sun charges on Counterattack."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Blooraga after defeating him in combat · Region: Visages"
      }
    ]
  },
  "weapons:455136": {
    "image": "/images/weapons/455136-contorso-gustave-verso-icon.png",
    "meta": [
      "Lightning",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1056"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Switch to Rank S on Break. Base Attack can Break. · Level 10: 100% Critical Chance on Rank S. · Level 20: Triggers a lightning strike on Critical hits."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Visages - drops from the first Contorsionniste enemy killed in any of the Vales · Region: Visages"
      }
    ]
  },
  "weapons:455137": {
    "image": "/images/weapons/455137-chapelim-lune-icon.png",
    "meta": [
      "Earth",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1176"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 30% increased Break damage per Earth Stain. · Level 10: Gain 9 AP on Breaking an enemy. · Level 20: Generate one Earth Stain at the beginning of each turn."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Visages - drops from the giant mask enemy found in the Joy Vale expedition flag area (choose \"Joy\" to begin the fight) · Region: Visages"
      }
    ]
  },
  "weapons:455139": {
    "image": "/images/weapons/455139-boucharo-monoco-icon.png",
    "meta": [
      "Fire",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle in Agile Mask. · Level 10: Agile Mask applies Rush for 3 turns. · Level 20: +50% Critical Chance while in Agile Mask."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Visages - drops from the giant mask enemy found in the Sadness Vale expedition flag area (choose \"Sadness\" to begin the fight) · Region: Visages"
      }
    ]
  },
  "weapons:455140": {
    "image": "/images/weapons/455140-clierum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Found within the Visages - drops from the giant mask enemy found in the Anger Vale expedition flag area (choose \"Anger\" to begin the fight) · Region: Visages"
      }
    ]
  },
  "weapons:455143": {
    "image": "/images/weapons/455143-sireso-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "960"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Bonus damage from Perfection applies to all allies at half value. Bonus damage no longer applies to Verso. · Level 10: Perfection gained is increased by 1 while Powerful. · Level 20: Support Skills cost 1 less AP."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from the Chromatic Greatsword Cultist · Region: Sirene"
      }
    ]
  },
  "weapons:455144": {
    "image": "/images/weapons/455144-colim-lune-icon.png",
    "meta": [
      "Light",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "960"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 50% chance to generate a Light Stain when consuming Stains. · Level 10: +1 AP on consuming a Light Stain. · Level 20: 20% increased damage with Skills per active Light Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within Sirene - drops from the first Chorale enemy you kill. One can be found here, high up in the large chamber with many branching bridges · Region: Sirene"
      }
    ]
  },
  "weapons:455145": {
    "image": "/images/weapons/455145-tissenum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Tisseur · Region: Sirene"
      }
    ]
  },
  "weapons:455147": {
    "image": "/images/weapons/455147-chantenum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by Klaudiso after defeating him in combat · Region: Sirene"
      }
    ]
  },
  "weapons:455151": {
    "image": "/images/weapons/455151-tisseron-sciel-icon.png",
    "meta": [
      "Lightning",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Extend Twilight by one turn on using a Moon Skill. +50% Twilight damage increase on using a Sun Skill. · Level 10: Twilight duration is increased by 1. · Level 20: Play again when entering Twilight state."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Sirène · Region: Sirene"
      }
    ]
  },
  "weapons:455153": {
    "image": "/images/weapons/455153-blodam-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1296"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Perfection is now based on current Health. Gain 1 Rank every 20% missing Health. · Level 10: 20% increased Light damage with Skills. · Level 20: +1 AP on Rank Up."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Reaper Cultist · Region: Continent"
      }
    ]
  },
  "weapons:455154": {
    "image": "/images/weapons/455154-corpeso-gustave-verso-icon.png",
    "meta": [
      "Fire",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1356"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Base Attack applies 2 Burn stack per Rank. · Level 10: +1 AP on Rank Up. · Level 20: Increase Burn damage by 50% per Rank, up to 300% on Rank S."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found within the Dark Shores - drops from Noire enemies. · Region: Dark Shores"
      }
    ]
  },
  "weapons:455156": {
    "image": "/images/weapons/455156-dreameso-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Gain 1 Rank on Counterattack. · Level 10: 50% increased Counterattack damage. · Level 20: Gain 2 AP on Counterattack."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Clair Obscur · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:455157": {
    "image": "/images/weapons/455157-gesam-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Convert Light damage from Skills to Physical damage. · Level 10: 20% increased Physical damage with Skills. · Level 20: -1 AP cost for Physical Skills."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Fusoka inside the Flying Manor · Region: Flying Manor"
      }
    ]
  },
  "weapons:455158": {
    "image": "/images/weapons/455158-glaceso-gustave-verso-icon.png",
    "meta": [
      "Ice",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1068"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: +1 Perfection on Critical hit. · Level 10: Self-Heal by 2% Health on dealing a Critical hit. · Level 20: Counterattack is always a Critical hit."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the enemies · Region: Continent"
      }
    ]
  },
  "weapons:455159": {
    "image": "/images/weapons/455159-liteso-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Base Attack consumes all Shields to deal 100% increased damage per Shield. · Level 10: +1 Shield on Counterattack. · Level 20: Base Attack gives 4 Perfection."
      },
      {
        "title": "Where to find it",
        "body": "Location: Dropped by the first Lumiere Citizens killed in the area. · Region: Continent"
      }
    ]
  },
  "weapons:455160": {
    "image": "/images/weapons/455160-noahram-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "32"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Gustave is automatically given this weapon after defeating Maelle in a duel at the beginning of the game. · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:455161": {
    "image": "/images/weapons/455161-nosaram-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Double Perfection gained on Free Aim shots. · Level 10: Free Aim shots break 2 Shields. · Level 20: 50% increased Free Aim damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Grour inside of Renoir's Drafts · Region: Continent"
      }
    ]
  },
  "weapons:455162": {
    "image": "/images/weapons/455162-seeram-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1380"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: +1 to all Perfection gain but can't reach Rank S. · Level 10: Base Attack gives 4 Perfection. · Level 20: 20% increased Light damage with Skills."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Cruler · Region: Continent"
      }
    ]
  },
  "weapons:455163": {
    "image": "/images/weapons/455163-bourgelon-sciel-icon.png",
    "meta": [
      "Light",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1152"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Consuming Foretell applies 2 Burn on target per Sun Charge. · Level 10: 100% increased Burn damage in Twilight state. · Level 20: Sun Skills give one more charge."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Bruler Also dropped by the Chromatic Bourgeon · Region: Continent"
      }
    ]
  },
  "weapons:455164": {
    "image": "/images/weapons/455164-gobluson-sciel-icon.png",
    "meta": [
      "Fire",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1248"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: During Twilight, every time Foretell is applied it also affects another random enemy. · Level 10: Apply 1 Burn every 3 Foretell applied with Skills. · Level 20: 20% increased Fire damage with Skills."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Bruler · Region: Continent"
      }
    ]
  },
  "weapons:455165": {
    "image": "/images/weapons/455165-simoso-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: An ethereal Sword deals Light damage on any damage dealt with Skills. · Level 10: 20% chance to apply Burn on dealing Light damage. · Level 20: Can't die if at least Rank A."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Simon · Region: Continent"
      }
    ]
  },
  "weapons:455166": {
    "image": "/images/weapons/455166-tireso-gustave-verso-icon.png",
    "meta": [
      "Earth",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1380"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Gain 1 Rank on applying Mark. · Level 10: Mark an enemy on Base Attack. · Level 20: Apply Powerless on Marking an enemy."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Eragol (after defeating him in combat) inside The Reacher · Region: The Reacher"
      }
    ]
  },
  "weapons:455167": {
    "image": "/images/weapons/455167-verleso-gustave-verso-icon.png",
    "meta": [
      "Physical",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1284"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: N/A · Level 10: N/A · Level 20: N/A"
      },
      {
        "title": "Where to find it",
        "body": "Location: Verso is automatically given this weapon when he joins the party at the beginning of Act II · Region: Continent"
      }
    ]
  },
  "weapons:455382": {
    "image": "/images/weapons/455382-angerim-lune-icon.png",
    "meta": [
      "Fire",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1224"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Base Attack applies 2 Burn per Fire Stain. · Level 10: Generate one Fire Stain at the beginning of each turn. · Level 20: 30% increased Burn damage per Fire Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Demineur · Region: Continent"
      }
    ]
  },
  "weapons:455383": {
    "image": "/images/weapons/455383-braselim-lune-icon.png",
    "meta": [
      "Fire",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1260"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 30% increased Critical Chance per Ice Stain. · Level 10: +5% of a Gradient Charge on Critical hit. · Level 20: 20% increased Fire damage with Skills."
      },
      {
        "title": "Where to find it",
        "body": "Location: Found Inside of Monolith - drops from the first Braseleur enemies killed in the area. Upgraded by defeating Chromatic Braseleur. · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:455387": {
    "image": "/images/weapons/455387-kralim-lune-icon.png",
    "meta": [
      "Lightning",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1260"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Casting a Skill increases the Skill damage of all other elements by 20%. Resets when casting a Skill of a previous element. · Level 10: On turn start, if no Stains, 2 random Stains are generated. · Level 20: +1 AP when Stains are consumed."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Orphelin · Region: Yellow Harvest"
      }
    ]
  },
  "weapons:455389": {
    "image": "/images/weapons/455389-lunerim-lune-icon.png",
    "meta": [
      "Fire",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "900"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: N/A · Level 10: N/A · Level 20: N/A"
      },
      {
        "title": "Where to find it",
        "body": "Location: Lune is automatically given this weapon when she joins the party in Spring Meadows · Region: Spring Meadows"
      }
    ]
  },
  "weapons:455391": {
    "image": "/images/weapons/455391-painerim-lune-icon.png",
    "meta": [
      "Earth",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Earth Skills cost 1 less AP. · Level 10: 20% increased Earth damage with Skills. · Level 20: Start battle with 1 Lightning Stain."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Grour inside Renoir's Drafts · Region: Continent"
      }
    ]
  },
  "weapons:455392": {
    "image": "/images/weapons/455392-saperim-lune-icon.png",
    "meta": [
      "Lightning",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Using a Gradient Attack generates 1 additional Light Stain. · Level 10: When a Fire Stain is generated, a Lightning Stain is also generated. Once per turn. · Level 20: Gradient Attacks and Gradient Counters deal 50% more damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the enemies · Region: Continent"
      }
    ]
  },
  "weapons:455393": {
    "image": "/images/weapons/455393-scaverim-lune-icon.png",
    "meta": [
      "Dark",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1560"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 50% chance to generate a Dark Stain when consuming Stains. Deal 50% more damage with Skills per active Dark Stain. · Level 10: Base Attacks can consume one Dark Stain to deal 200% more damage. · Level 20: With 4 active Dark Stains, any Skill can consume them to deal 300% more damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Scavenger · Region: Continent"
      }
    ]
  },
  "weapons:455395": {
    "image": "/images/weapons/455395-snowim-lune-icon.png",
    "meta": [
      "Ice",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1440"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Freeze self when falling below 30% health. Prevent the next instance of damage while Frozen. · Level 10: On turn start, if Frozen, remove Freeze and recover 60% Health. · Level 20: Gain 2 Ice Stains and 3 AP when Frozen."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Gargant · Region: Frozen Hearts"
      }
    ]
  },
  "weapons:455399": {
    "image": "/images/weapons/455399-chalium-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Chalier · Region: Continent"
      }
    ]
  },
  "weapons:455402": {
    "image": "/images/weapons/455402-facesum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Boucheclier · Region: Continent"
      }
    ]
  },
  "weapons:455404": {
    "image": "/images/weapons/455404-glaisum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Found within Falling Leaves - drops from a common Glaise enemy · Region: Continent"
      }
    ]
  },
  "weapons:455405": {
    "image": "/images/weapons/455405-jarum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Jar · Region: Continent"
      }
    ]
  },
  "weapons:455407": {
    "image": "/images/weapons/455407-lithum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Alicia · Region: The Reacher"
      }
    ]
  },
  "weapons:455408": {
    "image": "/images/weapons/455408-maellum-maelle-icon.png",
    "meta": [
      "Physical",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "70"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (C)"
      },
      {
        "title": "Where to find it",
        "body": "Location: Maelle is automatically given this weapon when she joins the party in the Flying Waters. You'll find her inside The Manor. · Region: Flying Waters"
      }
    ]
  },
  "weapons:455410": {
    "image": "/images/weapons/455410-plenum-maelle-icon.png",
    "meta": [
      "Ice",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "241"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (C) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Lv 7: Level 4 - On turn start, if Stanceless, switch to Defensive Stance. Level 10 - In Defensive Stance, double Break Damage Level 20 - Support Skills costs 1 less AP."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating Glaise · Region: Yellow Harvest"
      }
    ]
  },
  "weapons:455423": {
    "image": "/images/weapons/455423-seashelum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by Fusoka · Region: Flying Manor"
      }
    ]
  },
  "weapons:455424": {
    "image": "/images/weapons/455424-martenon-sciel-icon.png",
    "meta": [
      "Nature",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1440"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: On Twilight Start, deal damage to all enemies based on the amount of charges. · Level 10: On Twilight Start, apply 2 Foretell per charge to all enemies. · Level 20: Double Sun and Moon charge generation."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Fusoka · Region: Flying Manor"
      }
    ]
  },
  "weapons:455426": {
    "image": "/images/weapons/455426-sidaro-monoco-icon.png",
    "meta": [
      "Dark",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1128"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Might (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 30% increased damage per Upgraded Skill used. Resets on using a non-Upgraded Skill. · Level 10: Base Attack spins the Bestial Wheel to a random value. · Level 20: Using an Upgraded Skill gives 1 AP to all other allies."
      },
      {
        "title": "Where to find it",
        "body": "Location: Can be obtained by defeating Golgra with Monoco. Can also be purchased from Fusoka in the Flying Manor · Region: Gestral Village"
      }
    ]
  },
  "weapons:455427": {
    "image": "/images/weapons/455427-stalum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Stalact enemy · Region: Continent"
      }
    ]
  },
  "weapons:455428": {
    "image": "/images/weapons/455428-veremum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by Mistra · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:455430": {
    "image": "/images/weapons/455430-volesterum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by Cribappa · Region: Continent"
      }
    ]
  },
  "weapons:455436": {
    "image": "/images/weapons/455436-yeverum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Sold by Grour inside Renoir's Drafts · Region: Continent"
      }
    ]
  },
  "weapons:455611": {
    "image": "/images/weapons/455611-blizzon-sciel-icon.png",
    "meta": [
      "Frost",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1560"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Luck (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: While having at least 1 active Moon charge, Moon Skills are always Critical but damage taken is doubled. · Level 10: 25% increased damage per Moon charge. · Level 20: Base Attack gives 1 Moon charge."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Ballet · Region: Continent"
      }
    ]
  },
  "weapons:455612": {
    "image": "/images/weapons/455612-charnon-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1104"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 100% Critical Chance during Twilight. · Level 10: Apply 1 Foretell on Critical hit. · Level 20: 20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Grour inside Renoir's Drafts · Region: Continent"
      }
    ]
  },
  "weapons:455613": {
    "image": "/images/weapons/455613-direton-sciel-icon.png",
    "meta": [
      "Nature",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1500"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: +1 AP per Moon charge on turn start. · Level 10: Base Attack gives 1 Moon charge. · Level 20: During Twilight, Base Attack consumes all AP. Base Attack applies 1 Foretell and deals 50% increased damage per AP consumed."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Persik · Region: Continent"
      }
    ]
  },
  "weapons:455614": {
    "image": "/images/weapons/455614-garganon-sciel-icon.png",
    "meta": [
      "Fire",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1164"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: While having at least 1 active Sun charge, apply one Burn stack per hit taken. · Level 10: Counterattacks apply 1 Burn per active Sun charge. · Level 20: Base attack can consume 1 Sun charge to apply 5 Foretell."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Melosh · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:455615": {
    "image": "/images/weapons/455615-guleson-sciel-icon.png",
    "meta": [
      "Lightning",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1164"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: On Twilight Start, apply Mark to all enemies. · Level 10: Hitting a Marked enemy during Twilight doesn't remove Mark. · Level 20: Apply 3 Foretell on applying Mark."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Anthonypo · Region: Continent"
      }
    ]
  },
  "weapons:455616": {
    "image": "/images/weapons/455616-hevasson-sciel-icon.png",
    "meta": [
      "sciel"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Obtained from fighting Golgra in the Gestral Village with Sciel, after fighting her 3 times previously (initially in the Gestral Village, in the Dark Gestral Arena, and in the Sacred River) Can also be obtained by losing to Sciel in the Gestral Arena. · Region: Gestral Village"
      }
    ]
  },
  "weapons:455617": {
    "image": "/images/weapons/455617-litheson-sciel-icon.png",
    "meta": [
      "Physical",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1044"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: During Moon, all allies have Greater Rush. During Sun, all enemies have Greater Slow. · Level 10: During Twilight, all allies have Greater Rush and all enemies have Greater Slow. · Level 20: +3 AP on applying a Buff or Debuff. Once per turn."
      },
      {
        "title": "Where to find it",
        "body": "Location: Dropped by the first Lumiere Citizens killed in the area. · Region: Continent"
      }
    ]
  },
  "weapons:455618": {
    "image": "/images/weapons/455618-minason-sciel-icon.png",
    "meta": [
      "Physical",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1044"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Sun Skills have increased damage for each Foretell on the target. Moon Skills don't generate Moon charges anymore. · Level 10: With at least 1 active Sun charge, gain one additional AP per Foretell consumed. · Level 20: Base attack can consume 1 Sun charge to apply 5 Foretell."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Chapelier · Region: Continent"
      }
    ]
  },
  "weapons:455619": {
    "image": "/images/weapons/455619-moisson-sciel-icon.png",
    "meta": [
      "Physical",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1236"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: During Twilight, all damage dealt is converted to Dark damage. · Level 10: 20% increased Dark damage with Skills. · Level 20: Apply Shell during Moon, Powerful during Sun, and Rush during Twilight."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Moissonneuse · Region: Continent"
      }
    ]
  },
  "weapons:455620": {
    "image": "/images/weapons/455620-rangeson-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1164"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Lv 7: Level 4 - Recover 5% Health per Foretell applied. Level 10 - Healing Skills cost 1 less AP. Level 20 - 30% increased Heal efficiency per Moon charge. Base Attack gives 1 Moon Charge."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Jerijeri · Region: Stone Wave Cliffs"
      }
    ]
  },
  "weapons:455621": {
    "image": "/images/weapons/455621-scieleson-sciel-icon.png",
    "meta": [
      "Physical",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1284"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Level effects not available in image."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sciel is automatically given this weapon when she joins the party at the Gestral Village · Region: Gestral Village"
      }
    ]
  },
  "weapons:455622": {
    "image": "/images/weapons/455622-ballaro-monoco-icon.png",
    "meta": [
      "Light",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1140"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Reverse Bestial Wheel order. · Level 10: Using an Upgraded Skill gives 1 AP to all other allies. · Level 20: Almighty Mask gives 2 AP to all allies."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the enemies. Can also be obtained as a drop from defeating the Chromatic Glissando in Sirene's Dress · Region: Continent"
      }
    ]
  },
  "weapons:455623": {
    "image": "/images/weapons/455623-brumaro-monoco-icon.png",
    "meta": [
      "Physical",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1260"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Replay instantly when in Almighty Mask. · Level 10: +3 AP when in Almighty Mask. · Level 20: Revive instantly with full Health if dead while in Almighty Mask. Once per Battle."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Aberration · Region: Continent"
      }
    ]
  },
  "weapons:455625": {
    "image": "/images/weapons/455625-chromaro-monoco-icon.png",
    "meta": [
      "Ice",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1260"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle in Caster Mask. · Level 10: Caster Mask applies Regen for 3 turns. · Level 20: Skills cost 1 less AP while in Caster Mask."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Grour inside Renoir's Drafts · Region: Continent"
      }
    ]
  },
  "weapons:455626": {
    "image": "/images/weapons/455626-fragaro-monoco-icon.png",
    "meta": [
      "Lightning",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1560"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Luck (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Free Aim shots spin the Bestial Wheel to a random value. · Level 10: Free Aim shots deal 100% more damage with all Masks except Almighty. · Level 20: 100% Critical Chance while in Almighty Mask."
      },
      {
        "title": "Where to find it",
        "body": "Location: Sold by Mistra · Region: Inside the Monolith"
      }
    ]
  },
  "weapons:455627": {
    "image": "/images/weapons/455627-joyaro-monoco-icon.png",
    "meta": [
      "Lightning",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1380"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle in Almighty Mask. · Level 10: 20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times. · Level 20: Break damage is doubled while in Almighty Mask."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Ultimate Sakapatate in the Endless Night Sanctuary · Region: Continent"
      }
    ]
  },
  "weapons:455628": {
    "image": "/images/weapons/455628-monocaro-monoco-icon.png",
    "meta": [
      "Physical",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1020"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Start battle in Balanced Mask. · Level 10: Balanced Mask applies Powerful for 3 turns. · Level 20: Critical hits deal 30% more damage while in Balanced Mask."
      },
      {
        "title": "Where to find it",
        "body": "Location: Monoco is automatically given this weapon when he joins the party inside Monoco's Station, right after defeating the Stalact. · Region: Continent"
      }
    ]
  },
  "weapons:455629": {
    "image": "/images/weapons/455629-urnaro-monoco-icon.png",
    "meta": [
      "Earth",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1272"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Luck (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Switch to Almighty Mask on Breaking an enemy. · Level 10: Almighty Mask gives 2 AP to all allies. · Level 20: 50% increased Break damage."
      },
      {
        "title": "Where to find it",
        "body": "Location: Drops from defeating the Chromatic Glaise at the Sky Island · Region: Continent"
      }
    ]
  },
  "weapons:456332": {
    "image": "/images/weapons/456332-baguette-gustave-verso-icon.png",
    "meta": [
      "Dark",
      "gustave",
      "verso"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Kill self on battle start. · Level 10: Revive with 100% Health. Once per battle. · Level 20: Play first."
      },
      {
        "title": "Where to find it",
        "body": "Requires: NG+ and a Festival Token Location: After connecting with Sophie during the prologue, find and interact with an interactable in front of the Boulangerie. Spending the token with Gustave selected will unlock the weapon for Gustave/Verso · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:456333": {
    "image": "/images/weapons/456333-baguette-lune-icon.png",
    "meta": [
      "Dark",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Kill self on battle start. · Level 10: Revive with 100% Health. Once per battle. · Level 20: Play first."
      },
      {
        "title": "Where to find it",
        "body": "Requires: NG+ and a Festival Token Location: After connecting with Sophie during the prologue, find and interact with an interactable in front of the Boulangerie. Spending the token with Lune selected will unlock the weapon for Lune · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:456334": {
    "image": "/images/weapons/456334-baguette-maelle-icon.png",
    "meta": [
      "Dark",
      "maelle"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Kill self on battle start. · Level 10: Revive with 100% Health. Once per battle. · Level 20: Play first."
      },
      {
        "title": "Where to find it",
        "body": "Requires: NG+ and a Festival Token Location: After connecting with Sophie during the prologue, find and interact with an interactable in front of the Boulangerie. Spending the token with Maelle selected will unlock the weapon for Maelle · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:456335": {
    "image": "/images/weapons/456335-baguette-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Kill self on battle start. · Level 10: Revive with 100% Health. Once per battle. · Level 20: Play first."
      },
      {
        "title": "Where to find it",
        "body": "Requires: NG+ and a Festival Token Location: After connecting with Sophie during the prologue, find and interact with an interactable in front of the Boulangerie. Spending the token with Sciel selected will unlock the weapon for Sciel · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:456336": {
    "image": "/images/weapons/456336-baguette-monoco-icon.png",
    "meta": [
      "Dark",
      "monoco"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1200"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (B) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Kill self on battle start. · Level 10: Revive with 100% Health. Once per battle. · Level 20: Play first."
      },
      {
        "title": "Where to find it",
        "body": "Requires: NG+ and a Festival Token Location: After connecting with Sophie during the prologue, find and interact with an interactable in front of the Boulangerie. Spending the token with Monoco selected will unlock the weapon for Monoco · Region: Lumiere (Intro)"
      }
    ]
  },
  "weapons:456337": {
    "image": "/images/weapons/456337-choralim-lune-icon.png",
    "meta": [
      "Fire",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "1320"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 100% Critical Chance when 4 Stains are simultaneously active. · Level 10: 20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times. · Level 20: Critical hits apply Burn."
      },
      {
        "title": "Where to find it",
        "body": "Location: Obtained as a drop from defeating the Chromatic Glissando in Sirene's Dress · Region: Continent"
      }
    ]
  },
  "weapons:456338": {
    "image": "/images/weapons/456338-barrier-breaker-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Location: Automatically obtained in camp near the end of Act II, after defeating the second Axon. · Region: Sirene"
      }
    ]
  },
  "weapons:518879": {
    "image": "/images/weapons/518879-bonbim-lune-icon.png",
    "meta": [
      "Lightning",
      "lune"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Luck (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: +5% Critical chance per Burn on the target. · Level 10: Critical hits apply Burn. · Level 20: Lightning Skills consume up to 100 Burn to deal 2% more damage per Burn consumed."
      },
      {
        "title": "Where to find it",
        "body": "Verso's Drafts - Sold by Najabla after defeating the merchant in a fight. · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:527261": {
    "image": "/images/weapons/527261-duollison-sciel-icon.png",
    "meta": [
      "sciel"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Duollistes within the Endless Tower - found in a painting at the top of some stairs, independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "weapons:527277": {
    "image": "/images/weapons/527277-cleim-lune-icon.png",
    "meta": [
      "Light",
      "lune"
    ],
    "stats": [
      {
        "label": "Drop Power",
        "value": "960"
      }
    ],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Agility (B)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: 50% chance to generate a Light Stain when consuming Stains. · Level 10: +1 AP on consuming a Light Stain. · Level 20: 20% increased damage with Skills per active Light Stain."
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating Clea Unleashed within the Endless Tower - independent of the challenges. Added in the Thank You update. · Region: Continent"
      }
    ]
  },
  "weapons:543231": {
    "image": "/images/weapons/543231-esquion-sciel-icon.png",
    "meta": [
      "Dark",
      "sciel"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Using a Skill that doesn't consume Stains increases damage by 20%. Resets on using a Skill that consumes Stains. · Level 10: Base attack changes all current Stains into Dark Stains. · Level 20: With 4 active Dark Stains, any Skill can consume them to deal 300% more damage."
      },
      {
        "title": "Where to find it",
        "body": "On a ledge reached via Climbing Holds, taking a right when the path splits from a green lollipop. · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543234": {
    "image": "/images/weapons/543234-esquim-lune-icon.png",
    "meta": [
      "Dark",
      "lune"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Agility (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Using a Skill that doesn't consume Stains increases damage by 20%. Resets on using a Skill that consumes Stains. · Level 10: Base attack changes all current Stains into Dark Stains. · Level 20: With 4 active Dark Stains, any Skill can consume them to deal 300% more damage."
      },
      {
        "title": "Where to find it",
        "body": "Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543273": {
    "image": "/images/weapons/543273-sucreso-gustave-verso-icon.png",
    "meta": [
      "Earth",
      "gustave",
      "verso"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (A) Defense (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Rank D on turn start. · Level 10: Ranks reduce damage taken by 20% per Rank, instead of increasing damage dealt. · Level 20: 25% increased damage on Rank up. Resets on taking damage."
      },
      {
        "title": "Where to find it",
        "body": "On the treehouse's balcony, reached via Grapple Point · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543304": {
    "image": "/images/weapons/543304-licorum-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Dropped by Chromatic Licorne · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543311": {
    "image": "/images/weapons/543311-esqium-maelle-icon.png",
    "meta": [
      "maelle"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "In a pit reached via Rope · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543319": {
    "image": "/images/weapons/543319-baguettaro-monoco-icon.png",
    "meta": [
      "Fire",
      "monoco"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Defense (A) Luck (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Critical Hits apply Burn. · Level 10: Almighty Mask gives 50% increased damage (cumulative) and doubles enemies' Burn. · Level 20: Almighty Mask Skills consume up to 100 Burn to deal 2% more damage per Burn consumed."
      },
      {
        "title": "Where to find it",
        "body": "Dropped by the Mime. · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543351": {
    "image": "/images/weapons/543351-cannaro-monoco-icon.png",
    "meta": [
      "monoco"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Where to find it",
        "body": "Dropped by Chromatic Machinapied · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543364": {
    "image": "/images/weapons/543364-esquiso-gustave-verso-icon.png",
    "meta": [
      "Light",
      "gustave",
      "verso"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Agility (A) Luck (S)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Gain Aureole on Rank S, but drop to Rank D. · Level 10: 30% increased damage when revived. · Level 20: Gradient attacks deal 100% more damage."
      },
      {
        "title": "Where to find it",
        "body": "Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543402": {
    "image": "/images/weapons/543402-esquiaro-monoco-icon.png",
    "meta": [
      "Earth",
      "monoco"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Vitality (S) Defense (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Base Attack moves the Bestial Wheel to Heavy Mask. · Level 10: Heavy Mask gives 1 Shield to all allies. · Level 20: Damage taken are reduced by 50% while in Heavy Mask."
      },
      {
        "title": "Where to find it",
        "body": "On the edge of the diving board, reached by hitting the Half-baked Gestral out of the way. · Region: Verso's Drafts"
      }
    ]
  },
  "weapons:543435": {
    "image": "/images/weapons/543435-sucetton-sciel-icon.png",
    "meta": [
      "Fire",
      "sciel"
    ],
    "stats": [],
    "sections": [
      {
        "title": "Attribute scalers",
        "body": "Luck (S) Agility (A)"
      },
      {
        "title": "Unlockable passives",
        "body": "Level 4: Every fourth hit with a Skill generates 1 Sun charge and applies 5 Foretell. · Level 10: +20% increased damage per Sun charge. · Level 20: Sun Skills cost 1 less AP."
      },
      {
        "title": "Where to find it",
        "body": "Reward for defeating the Chromatic Barbasucette · Region: Verso's Drafts"
      }
    ]
  }
};
