
interface InstructionMeaning {
    [term: string]: {
        english: string;
        tagalog: string;
        otherTerms: string[];
    }
}

const preparationTechniques: InstructionMeaning = {
    'chop': {
        english: 'to cut food into small pieces',
        tagalog: 'hiwain',
        otherTerms: ['chopping']
    },
    'dice': {
        english: 'to cut food into small cubes',
        tagalog: 'tadtarin nang maliliit na parisukat',
        otherTerms: ['dicing']
    },
    'mince': {
        english: 'to cut food into very small pieces',
        tagalog: 'pinong tadtarin',
        otherTerms: ['mincing']
    },
    'julienne': {
        english: 'to cut food into thin strips',
        tagalog: 'hiwain nang pahaba at maninipis',
        otherTerms: ['julienning']
    },
    'slice': {
        english: 'to cut food into flat pieces',
        tagalog: 'hiwain nang maninipis na piraso',
        otherTerms: ['slicing']
    },
    'peel': {
        english: 'to remove the outer layer of a fruit or vegetable',
        tagalog: 'balatan',
        otherTerms: ['peeling']
    },
    'grate': {
        english: 'to shred food into small pieces using a grater',
        tagalog: 'kudkurin',
        otherTerms: ['grating']
    },
    'shred': {
        english: 'to tear food into thin strips or pieces',
        tagalog: 'paghimayin o paghihiwain nang maninipis',
        otherTerms: ['shredding']
    },
    'zest': {
        english: 'to remove the outer skin of citrus fruits',
        tagalog: 'kudkurin ang balat ng citrus',
        otherTerms: ['zesting']
    },
    'core': {
        english: 'to remove the center or seeds of fruits',
        tagalog: 'tanggalin ang buto o gitna',
        otherTerms: ['coring']
    },

    // Add more as needed
};

const cookingMethods: InstructionMeaning = {
    'bake': {
        english: 'to cook food using dry heat in an oven',
        tagalog: 'magluto sa oven',
        otherTerms: ['baking']
    },
    'roast': {
        english: 'to cook food with dry heat in an oven at high temperature',
        tagalog: 'iihawin o paangasin sa oven',
        otherTerms: ['roasting']
    },
    'broil': {
        english: 'to cook food under direct heat',
        tagalog: 'iihawin',
        otherTerms: ['broiling', 'grilling']
    },
    'grill': {
        english: 'to cook food over direct heat',
        tagalog: 'iihawin',
        otherTerms: ['grilling']
    },
    'sauté': {
        english: 'to cook food quickly in a small amount of fat',
        tagalog: 'gisa',
        otherTerms: ['sautéing']
    },
    'fry': {
        english: 'to cook food in hot oil or fat',
        tagalog: 'prito',
        otherTerms: ['frying', 'deep-fry', 'shallow-fry']
    },
    'deep-fry': {
        english: 'to cook food completely submerged in hot oil',
        tagalog: 'pritong lubog',
        otherTerms: ['deep-frying']
    },
    'stir-fry': {
        english: 'to cook food quickly while stirring in a small amount of oil',
        tagalog: 'gisa',
        otherTerms: ['stir-frying']
    },
    'simmer': {
        english: 'to cook food gently in liquid just below boiling point',
        tagalog: 'pakuluan sa banayad na apoy',
        otherTerms: ['simmering']
    },
    'boil': {
        english: 'to cook food in bubbling water at high temperature',
        tagalog: 'pakuluin',
        otherTerms: ['boiling']
    },
    'poach': {
        english: 'to cook food gently in barely simmering liquid',
        tagalog: 'pakuluan sa mababang apoy',
        otherTerms: ['poaching']
    },
    'steam': {
        english: 'to cook food using the steam from boiling water',
        tagalog: 'pausukan o lutuin sa singaw',
        otherTerms: ['steaming']
    },
    'blanch': {
        english: 'to briefly immerse food in boiling water',
        tagalog: 'isawsaw saglit sa kumukulong tubig',
        otherTerms: ['blanching']
    },
    'braise': {
        english: 'to cook food slowly in liquid in a covered pot',
        tagalog: 'pakuluan nang dahan-dahan na may sabaw at takip',
        otherTerms: ['braising']
    },
    'stew': {
        english: 'to cook food slowly in liquid',
        tagalog: 'nilaga',
        otherTerms: ['stewing']
    },

    // Add more as needed
};

const flavoringTerms: InstructionMeaning = {
    'season': {
        english: 'to add salt, pepper, or other spices to enhance flavor',
        tagalog: 'timplahan',
        otherTerms: ['seasoning']
    },
    'marinate': {
        english: 'to soak food in a seasoned liquid before cooking',
        tagalog: 'ibabad sa sawsawan o timplado',
        otherTerms: ['marinating']
    },
    'whisk': {
        english: 'to beat ingredients rapidly with a wire whisk',
        tagalog: 'paluin',
        otherTerms: ['whisking']
    },
    'beat': {
        english: 'to mix ingredients vigorously until smooth',
        tagalog: 'paluin hanggang maging makinis',
        otherTerms: ['beating']
    },
    'fold': {
        english: 'to gently combine ingredients with a folding motion',
        tagalog: 'dahan-dahang ihalo',
        otherTerms: ['folding']
    },
    'toss': {
        english: 'to mix ingredients by lifting and turning',
        tagalog: 'haluin nang magaan',
        otherTerms: ['tossing']
    },
    'mix': {
        english: 'to combine ingredients together',
        tagalog: 'haluin',
        otherTerms: ['mixing']
    },
    'stir': {
        english: 'to mix ingredients with a circular motion',
        tagalog: 'haluin',
        otherTerms: ['stirring']
    },
    'blend': {
        english: 'to mix ingredients until smooth and uniform',
        tagalog: 'haluin hanggang pino',
        otherTerms: ['blending']
    },
    'sift': {
        english: 'to pass ingredients through a fine mesh to remove lumps',
        tagalog: 'salain',
        otherTerms: ['sifting']
    },
    'knead': {
        english: 'to work dough by pressing and folding',
        tagalog: 'masahin',
        otherTerms: ['kneading']
    },

    // Add more terms as needed
};

const otherTerms: InstructionMeaning = {
    'preheat': {
        english: 'to heat an oven or pan before cooking',
        tagalog: 'painitin muna ang oven',
        otherTerms: ['preheating']
    },
    'reduce': {
        english: 'to cook liquid until it thickens and decreases in volume',
        tagalog: 'pakuluin hanggang lumapot o kumonti ang sabaw',
        otherTerms: ['reducing']
    },
    'garnish': {
        english: 'to decorate food with small amounts of other foods',
        tagalog: 'palamutian ng pagkain',
        otherTerms: ['garnishing']
    },
    'deglaze': {
        english: 'to add liquid to a pan to dissolve browned bits',
        tagalog: 'lagyan ng likido para matunaw ang dikit sa kawali',
        otherTerms: ['deglazing']
    },
    'caramelize': {
        english: 'to heat sugar until it becomes golden brown and syrupy',
        tagalog: 'pa-itimin o pasukalin ang asukal hanggang maging caramel',
        otherTerms: ['caramelizing']
    },
    'glaze': {
        english: 'to coat food with a shiny coating',
        tagalog: 'lagyan ng makintab na patong',
        otherTerms: ['glazing']
    },
    'cool': {
        english: 'to let food reach room temperature',
        tagalog: 'hayaang lumamig',
        otherTerms: ['cooling']
    },
    'drizzle': {
        english: 'to pour liquid in a thin stream',
        tagalog: 'budburan o patakan nang manipis',
        otherTerms: ['drizzling']
    },
    'dust': {
        english: 'to lightly sprinkle with powder',
        tagalog: 'budburan',
        otherTerms: ['dusting']
    },
    'coat': {
        english: 'to cover food completely with another ingredient',
        tagalog: 'balutin',
        otherTerms: ['coating']
    },
    'layer': {
        english: 'to arrange ingredients in layers',
        tagalog: 'patakin-patong',
        otherTerms: ['layering']
    },
    'dress': {
        english: 'to add dressing or sauce to food',
        tagalog: 'lagyan ng sarsa o dressing',
        otherTerms: ['dressing']
    },
    'dredge': {
        english: 'to coat food lightly with flour or breadcrumbs',
        tagalog: 'balutin ng harina o breadcrumbs',
        otherTerms: ['dredging']
    },

    // Add more terms as needed
};

// Export all instruction meanings for easy access
export const instructionTerms = {
    preparationTechniques,
    cookingMethods,
    flavoringTerms,
    otherTerms,
};

// Export individual sections for specific use cases
export {
    preparationTechniques,
    cookingMethods,
    flavoringTerms,
    otherTerms,
};