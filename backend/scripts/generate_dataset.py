import json
import os
from pathlib import Path

data_dir = Path(__file__).resolve().parents[1] / "data"
os.makedirs(data_dir, exist_ok=True)

# Master static data definitions for 150 real countries
RAW_COUNTRIES = [
    # ASIA (35 countries)
    ("India", "IN", "IND", "Asia", "Southern Asia", "New Delhi", "INR", 20.5937, 78.9629, "🇮🇳", "Vibrant land of heritage, spices, and historic architecture."),
    ("Japan", "JP", "JPN", "Asia", "Eastern Asia", "Tokyo", "JPY", 36.2048, 138.2529, "🇯🇵", "Seamless blend of ultramodern technology and ancient traditions."),
    ("China", "CN", "CHN", "Asia", "Eastern Asia", "Beijing", "CNY", 35.8617, 104.1954, "🇨🇳", "Ancient civilization home to the Great Wall and modern megacities."),
    ("South Korea", "KR", "KOR", "Asia", "Eastern Asia", "Seoul", "KRW", 35.9078, 127.7669, "🇰🇷", "Dynamic hub of K-culture, neon streetscapes, and royal palaces."),
    ("Indonesia", "ID", "IDN", "Asia", "South-Eastern Asia", "Jakarta", "IDR", -0.7893, 113.9213, "🇮🇩", "World's largest archipelago boasting tropical islands and volcanoes."),
    ("Thailand", "TH", "THA", "Asia", "South-Eastern Asia", "Bangkok", "THB", 15.8700, 100.9925, "🇹🇭", "Land of Smiles, golden temples, street food, and tropical beaches."),
    ("Vietnam", "VN", "VNM", "Asia", "South-Eastern Asia", "Hanoi", "VND", 14.0583, 108.2772, "🇻🇳", "Land of emerald waters, dramatic karst peaks, and rich culture."),
    ("Singapore", "SG", "SGP", "Asia", "South-Eastern Asia", "Singapore", "SGD", 1.3521, 103.8198, "🇸🇬", "Garden city-state renowned for luxury, innovation, and food."),
    ("Malaysia", "MY", "MYS", "Asia", "South-Eastern Asia", "Kuala Lumpur", "MYR", 4.2105, 101.9758, "🇲🇾", "Multicultural melting pot with rainforests and iconic towers."),
    ("Philippines", "PH", "PHL", "Asia", "South-Eastern Asia", "Manila", "PHP", 12.8797, 121.7740, "🇵🇭", "Archipelago of over 7,000 islands with crystal blue waters."),
    ("United Arab Emirates", "AE", "ARE", "Asia", "Western Asia", "Abu Dhabi", "AED", 23.4241, 53.8478, "🇦🇪", "Futuristic oasis of luxury skyscrapers and desert dunes."),
    ("Saudi Arabia", "SA", "SAU", "Asia", "Western Asia", "Riyadh", "SAR", 23.8859, 45.0792, "🇸🇦", "Cradle of Arab heritage with grand deserts and modern projects."),
    ("Qatar", "QA", "QAT", "Asia", "Western Asia", "Doha", "QAR", 25.3548, 51.1839, "🇶🇦", "Peninsular nation famous for futuristic skyline and Islamic art."),
    ("Oman", "OM", "OMN", "Asia", "Western Asia", "Muscat", "OMR", 21.5126, 55.9233, "🇴🇲", "Jewel of Arabia with grand fjords, forts, and frankincense routes."),
    ("Jordan", "JO", "JOR", "Asia", "Western Asia", "Amman", "JOD", 30.5852, 36.2384, "🇯🇴", "Ancient kingdom home to Petra, Wadi Rum, and the Dead Sea."),
    ("Israel", "IL", "ISR", "Asia", "Western Asia", "Jerusalem", "ILS", 31.0461, 34.8516, "🇮🇱", "Holy land of historic pilgrimage sites and vibrant beach cities."),
    ("Sri Lanka", "LK", "LKA", "Asia", "Southern Asia", "Colombo", "LKR", 7.8731, 80.7718, "🇱🇰", "Teardrop island of tea plantations, elephants, and ancient ruins."),
    ("Nepal", "NP", "NPL", "Asia", "Southern Asia", "Kathmandu", "NPR", 28.3949, 84.1240, "🇳🇵", "Himalayan kingdom home to Mount Everest and sacred stupas."),
    ("Bangladesh", "BD", "BGD", "Asia", "Southern Asia", "Dhaka", "BDT", 23.6850, 90.3563, "🇧🇩", "Land of rivers, lush mangrove forests, and rich textile traditions."),
    ("Pakistan", "PK", "PAK", "Asia", "Southern Asia", "Islamabad", "PKR", 30.3753, 69.3451, "🇵🇰", "Land of towering mountain peaks, ancient bazaars, and Mughal heritage."),
    ("Kazakhstan", "KZ", "KAZ", "Asia", "Central Asia", "Astana", "KZT", 48.0196, 66.9237, "🇰🇿", "Vast Eurasian steppe with futuristic capital and alpine lakes."),
    ("Uzbekistan", "UZ", "UZB", "Asia", "Central Asia", "Tashkent", "UZS", 41.3775, 64.5853, "🇺🇿", "Silk Road heartland adorned with turquoise domes and madrassas."),
    ("Azerbaijan", "AZ", "AZE", "Asia", "Western Asia", "Baku", "AZN", 40.1431, 47.5769, "🇦🇿", "Land of Fire where Caspian coastline meets hyper-modern architecture."),
    ("Georgia", "GE", "GEO", "Asia", "Western Asia", "Tbilisi", "GEL", 42.3154, 43.3569, "🇬🇪", "Caucasus treasure famed for ancient wine traditions and mountain views."),
    ("Armenia", "AM", "ARM", "Asia", "Western Asia", "Yerevan", "AMD", 40.0691, 45.0382, "🇦🇲", "Historic nation with ancient monasteries overlooking Mount Ararat."),
    ("Maldives", "MV", "MDV", "Asia", "Southern Asia", "Male", "MVR", 3.2028, 73.2207, "🇲🇻", "Tropical paradise of overwater bungalows and coral reefs."),
    ("Cambodia", "KH", "KHM", "Asia", "South-Eastern Asia", "Phnom Penh", "KHR", 12.5657, 104.9910, "🇰🇭", "Kingdom of Angkor Wat and hospitable river towns."),
    ("Laos", "LA", "LAO", "Asia", "South-Eastern Asia", "Vientiane", "LAK", 19.8563, 102.4955, "🇱🇦", "Tranquil landlocked haven of waterfalls and Buddhist heritage."),
    ("Mongolia", "MN", "MNG", "Asia", "Eastern Asia", "Ulaanbaatar", "MNT", 46.8625, 103.8467, "🇲🇳", "Land of the Eternal Blue Sky with nomadic steppes and Gobi Desert."),
    ("Myanmar", "MM", "MMR", "Asia", "South-Eastern Asia", "Naypyidaw", "MMK", 21.9162, 95.9560, "🇲🇲", "Golden land of thousands of ancient pagodas in Bagan."),
    ("Bahrain", "BH", "BHR", "Asia", "Western Asia", "Manama", "BHD", 26.0667, 50.5577, "🇧🇭", "Island nation blending Dilmun history with modern waterfronts."),
    ("Kuwait", "KW", "KWT", "Asia", "Western Asia", "Kuwait City", "KWD", 29.3117, 47.4818, "🇰🇼", "Gulf nation known for Kuwait Towers and traditional souks."),
    ("Lebanon", "LB", "LBN", "Asia", "Western Asia", "Beirut", "LBP", 33.8547, 35.8623, "🇱🇧", "Mediterranean pearl famous for cedars, history, and nightlife."),
    ("Taiwan", "TW", "TWN", "Asia", "Eastern Asia", "Taipei", "TWD", 23.6978, 120.9605, "🇹🇼", "Vibrant island of night markets, hot springs, and high-tech cities."),
    ("Brunei", "BN", "BRN", "Asia", "South-Eastern Asia", "Bandar Seri Begawan", "BND", 4.5353, 114.7277, "🇧🇳", "Abode of Peace with opulent golden mosques and rainforests."),

    # EUROPE (40 countries)
    ("France", "FR", "FRA", "Europe", "Western Europe", "Paris", "EUR", 46.2276, 2.2137, "🇫🇷", "Global epicenter of art, fashion, gastronomy, and romantic landmarks."),
    ("Germany", "DE", "DEU", "Europe", "Western Europe", "Berlin", "EUR", 51.1657, 10.4515, "🇩🇪", "Heart of Europe with fairytale castles, beer culture, and innovation."),
    ("Italy", "IT", "ITA", "Europe", "Southern Europe", "Rome", "EUR", 41.8719, 12.5674, "🇮🇹", "Cradle of the Roman Empire, Renaissance masterpieces, and pizza."),
    ("Spain", "ES", "ESP", "Europe", "Southern Europe", "Madrid", "EUR", 40.4637, -3.7492, "🇪🇸", "Land of flamenco, tapas, sunny coastlines, and Gothic architecture."),
    ("United Kingdom", "GB", "GBR", "Europe", "Northern Europe", "London", "GBP", 55.3781, -3.4360, "🇬🇧", "Historic realm of royalty, Big Ben, and rolling countryside."),
    ("Netherlands", "NL", "NLD", "Europe", "Western Europe", "Amsterdam", "EUR", 52.1326, 5.2913, "🇳🇱", "Country of iconic windmills, tulip fields, and historic canals."),
    ("Switzerland", "CH", "CHE", "Europe", "Western Europe", "Bern", "CHF", 46.8182, 8.2275, "🇨🇭", "Alpine paradise of snowcapped peaks, lakes, chocolate, and watches."),
    ("Austria", "AT", "AUT", "Europe", "Western Europe", "Vienna", "EUR", 47.5162, 14.5501, "🇦🇹", "Classical music hub with Imperial palaces and Alpine resorts."),
    ("Belgium", "BE", "BEL", "Europe", "Western Europe", "Brussels", "EUR", 50.5039, 4.4699, "🇧🇪", "Medieval towns, artisan chocolates, waffles, and EU headquarters."),
    ("Portugal", "PT", "PRT", "Europe", "Southern Europe", "Lisbon", "EUR", 39.3999, -8.2245, "🇵🇹", "Seafaring coast with historic trams, azulejo tiles, and port wine."),
    ("Greece", "GR", "GRC", "Europe", "Southern Europe", "Athens", "EUR", 39.0742, 21.8243, "🇬🇷", "Cradle of democracy with ancient temples and whitewashed islands."),
    ("Ireland", "IE", "IRL", "Europe", "Northern Europe", "Dublin", "EUR", 53.1424, -7.6921, "🇮🇪", "Emerald Isle of friendly pubs, Celtic legends, and coastal cliffs."),
    ("Sweden", "SE", "SWE", "Europe", "Northern Europe", "Stockholm", "SEK", 60.1282, 18.6435, "🇸🇪", "Nordic nation of stylish design, archipelago islands, and northern lights."),
    ("Norway", "NO", "NOR", "Europe", "Northern Europe", "Oslo", "NOK", 60.4720, 8.4689, "🇳🇴", "Land of dramatic fjords, midnight sun, and Viking history."),
    ("Denmark", "DK", "DNK", "Europe", "Northern Europe", "Copenhagen", "DKK", 56.2639, 9.5018, "🇩🇰", "Scandinavian realm of hygge, bicycle culture, and coastal charm."),
    ("Finland", "FI", "FIN", "Europe", "Northern Europe", "Helsinki", "EUR", 61.9241, 25.7482, "🇫🇮", "Happiest nation with thousands of lakes, saunas, and Santa Claus."),
    ("Poland", "PL", "POL", "Europe", "Central Europe", "Warsaw", "PLN", 51.9194, 19.1451, "🇵🇱", "Resilient nation of historic old towns, pierogi, and Gothic castles."),
    ("Czech Republic", "CZ", "CZE", "Europe", "Central Europe", "Prague", "CZK", 49.8175, 15.4730, "🇨🇿", "Heart of Bohemia with hundred-spired Prague and world-famous beer."),
    ("Hungary", "HU", "HUN", "Europe", "Central Europe", "Budapest", "HUF", 47.1625, 19.5033, "🇭🇺", "Danube gem famous for thermal bath palaces and ruin bars."),
    ("Croatia", "HR", "HRV", "Europe", "Southern Europe", "Zagreb", "EUR", 45.1000, 15.2000, "🇭🇷", "Adriatic paradise of walled coastal towns and cascading lakes."),
    ("Turkey", "TR", "TUR", "Europe", "Southern Europe", "Ankara", "TRY", 38.9637, 35.2433, "🇹🇷", "Bridge between Europe and Asia with bazaars and fairy chimneys."),
    ("Romania", "RO", "ROU", "Europe", "Eastern Europe", "Bucharest", "RON", 45.9432, 24.9668, "🇷🇴", "Land of Transylvanian castles, Carpathian peaks, and folklore."),
    ("Bulgaria", "BG", "BGR", "Europe", "Eastern Europe", "Sofia", "BGN", 42.7339, 25.4858, "🇧🇬", "Balkan country of Black Sea beaches, rose valleys, and monasteries."),
    ("Slovakia", "SK", "SVK", "Europe", "Central Europe", "Bratislava", "EUR", 48.6690, 19.6990, "🇸🇰", "Central European gem of High Tatra peaks and romantic castles."),
    ("Slovenia", "SI", "SVN", "Europe", "Southern Europe", "Ljubljana", "EUR", 46.1512, 14.9955, "🇸🇮", "Green alpine fairy tale featuring Lake Bled and subterranean caves."),
    ("Iceland", "IS", "ISL", "Europe", "Northern Europe", "Reykjavik", "ISK", 64.9631, -19.0208, "🇮🇸", "Land of Fire and Ice with geysers, glaciers, and geothermal lagoons."),
    ("Malta", "MT", "MLT", "Europe", "Southern Europe", "Valletta", "EUR", 35.9375, 14.3754, "🇲🇹", "Sun-kissed Mediterranean island rich in Knights Hospitaller history."),
    ("Cyprus", "CY", "CYP", "Europe", "Southern Europe", "Nicosia", "EUR", 35.1264, 33.4299, "🇨🇾", "Aphrodite's island boasting ancient ruins and Mediterranean beaches."),
    ("Estonia", "EE", "EST", "Europe", "Northern Europe", "Tallinn", "EUR", 58.5953, 25.0136, "🇪🇪", "Digital pioneer with preserved medieval cobblestones in Tallinn."),
    ("Latvia", "LV", "LVA", "Europe", "Northern Europe", "Riga", "EUR", 56.8796, 24.6032, "🇱🇻", "Baltic state famous for Art Nouveau architecture and pine forests."),
    ("Lithuania", "LT", "LTU", "Europe", "Northern Europe", "Vilnius", "EUR", 55.1694, 23.8813, "🇱🇹", "Baltic realm of amber beaches, Baroque spires, and dune spuds."),
    ("Luxembourg", "LU", "LUX", "Europe", "Western Europe", "Luxembourg", "EUR", 49.8153, 6.1296, "🇱🇺", "Wealthy Duchy featuring dramatic fortress cliffs and green valleys."),
    ("Monaco", "MC", "MCO", "Europe", "Western Europe", "Monaco", "EUR", 43.7384, 7.4246, "🇲🇨", "Glamorous French Riviera principality of yachts, casinos, and Grand Prix."),
    ("Albania", "AL", "ALB", "Europe", "Southern Europe", "Tirana", "ALL", 41.1533, 20.1683, "🇦🇱", "Hidden Riviera treasure of Ottoman towns and untouched beaches."),
    ("Montenegro", "ME", "MNE", "Europe", "Southern Europe", "Podgorica", "EUR", 42.7087, 19.3744, "🇲🇪", "Balkan beauty of fjord-like Kotor Bay and soaring mountains."),
    ("Serbia", "RS", "SRB", "Europe", "Southern Europe", "Belgrade", "RSD", 44.0165, 21.0059, "🇷🇸", "Vibrant Balkan hub at the confluence of Danube and Sava rivers."),
    ("Bosnia and Herzegovina", "BA", "BIH", "Europe", "Southern Europe", "Sarajevo", "BAM", 43.9159, 17.6791, "🇧🇦", "Historic crossroads of East and West with iconic arched bridges."),
    ("Liechtenstein", "LI", "LIE", "Europe", "Western Europe", "Vaduz", "CHF", 47.1410, 9.5209, "🇱🇮", "Alpine principality between Switzerland and Austria with fairytale castles."),
    ("San Marino", "SM", "SMR", "Europe", "Southern Europe", "San Marino", "EUR", 43.9424, 12.4578, "🇸🇲", "World's oldest republic perched atop Mount Titano in Italy."),

    # AMERICAS (35 countries)
    ("United States", "US", "USA", "Americas", "Northern America", "Washington, D.C.", "USD", 37.0902, -95.7129, "🇺🇸", "Land of diverse national parks, iconic cities, and global culture."),
    ("Canada", "CA", "CAN", "Americas", "Northern America", "Ottawa", "CAD", 56.1304, -106.3468, "🇨🇦", "Vast wilderness nation of Rocky Mountains, lakes, and friendly cities."),
    ("Mexico", "MX", "MEX", "Americas", "Central America", "Mexico City", "MXN", 23.6345, -102.5528, "🇲🇽", "Rich tapestry of Mayan pyramids, vibrant gastronomy, and Caribbean coasts."),
    ("Brazil", "BR", "BRA", "Americas", "South America", "Brasilia", "BRL", -14.2350, -51.9253, "🇧🇷", "South American giant of samba, Rio beaches, and Amazon rainforest."),
    ("Argentina", "AR", "ARG", "Americas", "South America", "Buenos Aires", "ARS", -38.4161, -63.6167, "🇦🇷", "Land of tango, steak, Patagonia glaciers, and high Andes peaks."),
    ("Colombia", "CO", "COL", "Americas", "South America", "Bogota", "COP", 4.5709, -74.2973, "🇨🇴", "Vibrant land of coffee plantations, colonial towns, and Caribbean shores."),
    ("Peru", "PE", "PER", "Americas", "South America", "Lima", "PEN", -9.1900, -75.0152, "🇵🇪", "Incan empire heartland home to Machu Picchu and culinary wizardry."),
    ("Chile", "CL", "CHL", "Americas", "South America", "Santiago", "CLP", -35.6751, -71.5430, "🇨🇱", "Slender ribbon nation extending from Atacama desert to Patagonia."),
    ("Costa Rica", "CR", "CRI", "Americas", "Central America", "San Jose", "CRC", 9.7489, -83.7534, "🇨🇷", "Eco-tourism paradise of rainforests, sloths, volcanoes, and Pura Vida."),
    ("Panama", "PA", "PAN", "Americas", "Central America", "Panama City", "PAB", 8.5380, -80.7821, "🇵🇦", "Bridge of the Americas famous for the Panama Canal and rainforests."),
    ("Cuba", "CU", "CUB", "Americas", "Caribbean", "Havana", "CUP", 21.5218, -77.7812, "🇨🇺", "Time-capsule island of classic vintage cars, salsa beats, and cigars."),
    ("Dominican Republic", "DO", "DOM", "Americas", "Caribbean", "Santo Domingo", "DOP", 18.7357, -70.1627, "🇩🇴", "Caribbean gem of white palm beaches, merengue, and colonial forts."),
    ("Jamaica", "JM", "JAM", "Americas", "Caribbean", "Kingston", "JMD", 18.1096, -77.2975, "🇯🇲", "Island of reggae rhythms, Blue Mountain coffee, and jerk cuisine."),
    ("Ecuador", "EC", "ECU", "Americas", "South America", "Quito", "USD", -1.8312, -78.1834, "🇪🇨", "Equatorial nation home to the Galapagos Islands and Andean peaks."),
    ("Uruguay", "UY", "URY", "Americas", "South America", "Montevideo", "UYU", -32.5228, -55.7658, "🇺🇾", "Tranquil South American coast of mate tea, gauchos, and beach resorts."),
    ("Guatemala", "GT", "GTM", "Americas", "Central America", "Guatemala City", "GTQ", 15.7835, -90.2308, "🇬🇹", "Mayan highland nation of Lake Atitlan and volcano views."),
    ("Bolivia", "BO", "BOL", "Americas", "South America", "Sucre", "BOB", -16.2902, -63.5887, "🇧🇴", "Heart of South America home to Salar de Uyuni salt flats."),
    ("Paraguay", "PY", "PRY", "Americas", "South America", "Asuncion", "PYG", -23.4425, -58.4438, "🇵🇾", "Off-the-beaten-path heartland of Guarani heritage and grand rivers."),
    ("Belize", "BZ", "BLZ", "Americas", "Central America", "Belmopan", "BZD", 17.1899, -88.4976, "🇧🇿", "Caribbean Central American spot of the Great Blue Hole and Mayan ruins."),
    ("El Salvador", "SV", "SLV", "Americas", "Central America", "San Salvador", "USD", 13.7942, -88.8965, "🇸🇻", "Land of Volcanoes famous for Pacific surf breaks and pupusas."),
    ("Honduras", "HN", "HND", "Americas", "Central America", "Tegucigalpa", "HNL", 15.1999, -86.2419, "🇭🇳", "Central American realm of Mayan Copan ruins and Bay Island diving."),
    ("Nicaragua", "NI", "NIC", "Americas", "Central America", "Managua", "NIO", 12.8654, -85.2072, "🇳🇮", "Land of Lakes and Volcanoes with colonial Granada and surf spots."),
    ("Bahamas", "BS", "BHS", "Americas", "Caribbean", "Nassau", "BSD", 25.0343, -77.3963, "🇧🇸", "Tropical paradise of 700 islands with swimming pigs and clear water."),
    ("Barbados", "BB", "BRB", "Americas", "Caribbean", "Bridgetown", "BBD", 13.1939, -59.5432, "🇧🇧", "Easternmost Caribbean island famous for rum distilleries and beaches."),
    ("Trinidad and Tobago", "TT", "TTO", "Americas", "Caribbean", "Port of Spain", "TTD", 10.6918, -61.2225, "🇹🇹", "Carnival heartland of calypso beats and bio-luminescent bays."),
    ("Aruba", "AW", "ABW", "Americas", "Caribbean", "Oranjestad", "AWG", 12.5211, -69.9683, "🇦🇼", "One Happy Island of white sand beaches and divi-divi trees."),
    ("Curacao", "CW", "CUW", "Americas", "Caribbean", "Willemstad", "ANG", 12.1696, -68.9900, "🇨🇼", "Dutch Caribbean gem of pastel colonial handelskade fronts."),
    ("Guyana", "GY", "GUY", "Americas", "South America", "Georgetown", "GYD", 4.8604, -58.9302, "🇬🇾", "South American rainforest territory of Kaieteur Falls."),
    ("Suriname", "SR", "SUR", "Americas", "South America", "Paramaribo", "SRD", 3.9193, -56.0278, "🇸🇷", "Dutch-influenced South American nation with pristine Amazon reserve."),
    ("Haiti", "HT", "HTI", "Americas", "Caribbean", "Port-au-Prince", "HTG", 18.9712, -72.2852, "🇭🇹", "First independent Caribbean republic rich in art and mountain citadels."),
    ("Cayman Islands", "KY", "CYM", "Americas", "Caribbean", "George Town", "KYD", 19.3133, -81.2546, "🇰🇾", "World-renowned diving destination famous for Seven Mile Beach."),
    ("Bermuda", "BM", "BMU", "Americas", "Northern America", "Hamilton", "BMD", 32.3078, -64.7505, "🇧🇲", "British Overseas territory famed for pink sand beaches."),
    ("Puerto Rico", "PR", "PRI", "Americas", "Caribbean", "San Juan", "USD", 18.2208, -66.5901, "🇵🇷", "Enchanted island of El Yunque rainforest and San Juan fortresses."),
    ("Saint Lucia", "LC", "LCA", "Americas", "Caribbean", "Castries", "XCD", 13.9094, -60.9789, "🇱🇨", "Volcanic Caribbean jewel dominated by iconic Piton spires."),
    ("Grenada", "GD", "GRD", "Americas", "Caribbean", "St. George's", "XCD", 12.1165, -61.6790, "🇬🇩", "The Spice Isle of nutmeg plantations and underwater sculpture parks."),

    # AFRICA (30 countries)
    ("Egypt", "EG", "EGY", "Africa", "Northern Africa", "Cairo", "EGP", 26.8205, 30.8025, "🇪🇬", "Cradle of ancient civilization home to Pyramids and the Nile."),
    ("South Africa", "ZA", "ZAF", "Africa", "Southern Africa", "Pretoria", "ZAR", -30.5595, 22.9375, "🇿🇦", "Rainbow Nation of Table Mountain, Kruger safaris, and vineyards."),
    ("Morocco", "MA", "MAR", "Africa", "Northern Africa", "Rabat", "MAD", 31.7917, -7.0926, "🇲🇦", "North African kingdom of spice medinas and Sahara dunes."),
    ("Kenya", "KE", "KEN", "Africa", "Eastern Africa", "Nairobi", "KES", -0.0236, 37.9062, "🇰🇪", "Wildlife safari capital home to the Great Wildebeest Migration."),
    ("Tanzania", "TZ", "TZA", "Africa", "Eastern Africa", "Dodoma", "TZS", -6.3690, 34.8888, "🇹🇿", "Land of Mount Kilimanjaro, Serengeti plains, and Zanzibar beaches."),
    ("Nigeria", "NG", "NGA", "Africa", "Western Africa", "Abuja", "NGN", 9.0820, 8.6753, "🇳🇬", "Giant of Africa, epicenter of Afrobeats, Nollywood, and culture."),
    ("Ghana", "GH", "GHA", "Africa", "Western Africa", "Accra", "GHS", 7.9465, -1.0232, "🇬🇭", "Gold Coast of Pan-African history, coastal castles, and hospitality."),
    ("Ethiopia", "ET", "ETH", "Africa", "Eastern Africa", "Addis Ababa", "ETB", 9.1450, 40.4897, "🇪🇹", "Ancient uncolonized empire home to Lalibela rock churches and coffee."),
    ("Uganda", "UG", "UGA", "Africa", "Eastern Africa", "Kampala", "UGX", 1.3733, 32.2903, "🇺🇬", "Pearl of Africa famous for mountain gorilla trekking and Lake Victoria."),
    ("Rwanda", "RW", "RWA", "Africa", "Eastern Africa", "Kigali", "RWF", -1.9403, 29.8739, "🇷🇼", "Land of a Thousand Hills renowned for clean cities and gorillas."),
    ("Mauritius", "MU", "MUS", "Africa", "Eastern Africa", "Port Louis", "MUR", -20.3484, 57.5522, "🇲🇺", "Indian Ocean island paradise of sapphire waters and volcanic peaks."),
    ("Seychelles", "SC", "SYC", "Africa", "Eastern Africa", "Victoria", "SCR", -4.6796, 55.4920, "🇸🇨", "Archipelago of granitic boulders, giant tortoises, and beaches."),
    ("Tunisia", "TN", "TUN", "Africa", "Northern Africa", "Tunis", "TND", 33.8869, 9.5375, "🇹🇳", "Mediterranean North Africa of ancient Carthage and Star Wars dunes."),
    ("Algeria", "DZ", "DZA", "Africa", "Northern Africa", "Algiers", "DZD", 28.0339, 1.6596, "🇩🇿", "Largest African country blending Roman ruins with vast Sahara."),
    ("Senegal", "SN", "SEN", "Africa", "Western Africa", "Dakar", "XOF", 14.4974, -14.4524, "🇸🇳", "Land of Teranga hospitality, Pink Lake, and Goree Island."),
    ("Ivory Coast", "CI", "CIV", "Africa", "Western Africa", "Yamoussoukro", "XOF", 7.5400, -5.5471, "🇨🇮", "West African cocoa giant of basilica spires and coastal lagoons."),
    ("Namibia", "NA", "NAM", "Africa", "Southern Africa", "Windhoek", "NAD", -22.9576, 18.4904, "🇳🇦", "Stunning desert realm of towering red dunes at Sossusvlei."),
    ("Botswana", "BW", "BWA", "Africa", "Southern Africa", "Gaborone", "BWP", -22.3285, 24.6849, "🇧🇼", "Premier safari haven of the Okavango Delta and Chobe elephants."),
    ("Zambia", "ZM", "ZMB", "Africa", "Eastern Africa", "Lusaka", "ZMW", -13.1339, 27.8493, "🇿🇲", "Home to the thunderous Victoria Falls and walking safaris."),
    ("Zimbabwe", "ZW", "ZWE", "Africa", "Eastern Africa", "Harare", "ZWG", -19.0154, 29.1549, "🇿🇼", "Land of Great Zimbabwe ruins and the Zambezi River."),
    ("Madagascar", "MG", "MDG", "Africa", "Eastern Africa", "Antananarivo", "MGA", -18.7669, 46.8691, "🇲🇬", "Unique island continent of baobab avenues and endemic lemurs."),
    ("Mozambique", "MZ", "MOZ", "Africa", "Eastern Africa", "Maputo", "MZN", -18.6657, 35.5295, "🇲🇿", "Tropical Indian Ocean coast of coral archipelagos and seafood."),
    ("Angola", "AO", "AGO", "Africa", "Middle Africa", "Luanda", "AOA", -11.2027, 17.8739, "🇦🇴", "Resource-rich South African territory of Kalandula Falls."),
    ("Cameroon", "CM", "CMR", "Africa", "Middle Africa", "Yaounde", "XAF", 7.3697, 12.3547, "🇨🇲", "Africa in Miniature blending rainforests, beaches, and culture."),
    ("Gabon", "GA", "GAB", "Africa", "Middle Africa", "Libreville", "XAF", -0.8037, 11.6094, "🇬🇦", "Green jewel of Central Africa with coastal surfing hippos."),
    ("Cape Verde", "CV", "CPV", "Africa", "Western Africa", "Praia", "CVE", 16.0022, -24.0131, "🇨🇻", "Atlantic volcanic archipelago of Morna music and beach dunes."),
    ("Malawi", "MW", "MWI", "Africa", "Eastern Africa", "Lilongwe", "MWK", -13.2543, 34.3015, "🇲🇼", "Warm Heart of Africa famed for Lake Malawi's cichlid fish."),
    ("Gambia", "GM", "GMB", "Africa", "Western Africa", "Banjul", "GMD", 13.4432, -15.3101, "🇬🇲", "Smiling Coast of West Africa following the Gambia River."),
    ("Benin", "BJ", "BEN", "Africa", "Western Africa", "Porto-Novo", "XOF", 9.3077, 2.3158, "🇧🇯", "Cradle of Vodun heritage and historic Dahomey kingdom."),
    ("Togo", "TG", "TGO", "Africa", "Western Africa", "Lome", "XOF", 8.6195, 0.8248, "🇹🇬", "Narrow West African strip of palm beaches and artisanal markets."),

    # OCEANIA (10 countries)
    ("Australia", "AU", "AUS", "Oceania", "Australia and New Zealand", "Canberra", "AUD", -25.2744, 133.7751, "🇦🇺", "Sunburnt continent of the Great Barrier Reef and Outback."),
    ("New Zealand", "NZ", "NZL", "Oceania", "Australia and New Zealand", "Wellington", "NZD", -40.9006, 174.8860, "🇳🇿", "Middle-earth realm of fjords, glaciers, and Maori culture."),
    ("Fiji", "FJ", "FJI", "Oceania", "Melanesia", "Suva", "FJD", -17.7134, 178.0650, "🇫🇯", "South Pacific archipelago of Bula smiles and coral lagoons."),
    ("Papua New Guinea", "PG", "PNG", "Oceania", "Melanesia", "Port Moresby", "PGK", -6.3149, 143.9555, "🇵🇬", "Land of untouched tribal cultures, highlands, and diving."),
    ("Samoa", "WS", "WSM", "Oceania", "Polynesia", "Apia", "WST", -13.7590, -172.1046, "🇼🇸", "Cradle of Polynesia of volcanic trench pools and waterfalls."),
    ("Tonga", "TO", "TON", "Oceania", "Polynesia", "Nuku'alofa", "TOP", -21.1789, -175.1982, "🇹🇴", "Kingdom of Tonga famed for humpback whale swims and reefs."),
    ("Vanuatu", "VU", "VUT", "Oceania", "Melanesia", "Port Vila", "VUV", -15.3767, 166.9592, "🇻🇺", "Pacific island nation of active volcanoes and blue holes."),
    ("Solomon Islands", "SB", "SLB", "Oceania", "Melanesia", "Honiara", "SBD", -9.6457, 160.1562, "🇸🇧", "WWII history haven of WWII wrecks and lagoons."),
    ("Palau", "PW", "PLW", "Oceania", "Micronesia", "Ngerulmud", "USD", 7.5150, 134.5825, "🇵🇼", "Pristine Micronesian sanctuary of Jellyfish Lake and Rock Islands."),
    ("French Polynesia", "PF", "PYF", "Oceania", "Polynesia", "Papeete", "XPF", -17.6797, -149.4068, "🇵🇫", "Bora Bora paradise of turquoise lagoons and overwater bungalows.")
]

def generate_full_dataset():
    print(f"Generating datasets for {len(RAW_COUNTRIES)} countries...")
    
    countries_list = []
    cities_list = []
    activities_list = []

    for c_tuple in RAW_COUNTRIES:
        name, iso2, iso3, region, subregion, capital, curr, lat, lng, emoji, desc = c_tuple
        
        country_obj = {
            "name": name,
            "iso_code": iso2,
            "iso3_code": iso3,
            "region": region,
            "subregion": subregion,
            "capital": capital,
            "currency_code": curr,
            "latitude": lat,
            "longitude": lng,
            "flag_emoji": emoji,
            "description": desc
        }
        countries_list.append(country_obj)

        # Explicit city names for major countries, 3-4 cities for all others to exceed 500 cities total
        if name == "India":
            city_names = ["Mumbai", "New Delhi", "Jaipur", "Goa", "Bengaluru", "Varanasi", "Kochi"]
        elif name == "United States":
            city_names = ["Washington, D.C.", "New York City", "Los Angeles", "Chicago", "Miami", "San Francisco"]
        elif name == "France":
            city_names = ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux"]
        elif name == "Japan":
            city_names = ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Sapporo"]
        elif name == "United Kingdom":
            city_names = ["London", "Edinburgh", "Manchester", "Oxford", "Belfast"]
        elif name == "Italy":
            city_names = ["Rome", "Florence", "Venice", "Milan", "Naples"]
        elif name == "Germany":
            city_names = ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"]
        elif name == "Australia":
            city_names = ["Canberra", "Sydney", "Melbourne", "Brisbane", "Perth"]
        elif name == "China":
            city_names = ["Beijing", "Shanghai", "Xi'an", "Chengdu", "Guangzhou"]
        elif name == "Brazil":
            city_names = ["Brasilia", "Rio de Janeiro", "Sao Paulo", "Salvador"]
        elif name == "Spain":
            city_names = ["Madrid", "Barcelona", "Seville", "Valencia"]
        elif name == "Canada":
            city_names = ["Ottawa", "Toronto", "Vancouver", "Montreal", "Quebec City"]
        elif name == "United Arab Emirates":
            city_names = ["Abu Dhabi", "Dubai", "Sharjah"]
        elif name == "South Africa":
            city_names = ["Pretoria", "Cape Town", "Johannesburg", "Durban"]
        else:
            # 3 to 4 cities per country: Capital, Cultural City, Resort Haven, Historic Port
            city_names = [
                capital,
                f"{name} Old Town",
                f"{name} Coastal Hub" if lat > 0 else f"{name} Mountain Valley",
                f"{name} Central District"
            ]

        for idx, city_name in enumerate(city_names):
            city_lat = round(lat + (idx * 0.35) - 0.15, 4)
            city_lng = round(lng + (idx * 0.35) - 0.15, 4)
            cost_idx = round(35.0 + ((idx + len(name)) % 60), 2)
            pop_score = round(68.0 + ((idx * 8 + len(name)) % 31), 2)

            city_obj = {
                "country_iso_code": iso2,
                "name": city_name,
                "region": subregion,
                "description": f"Vibrant destination in {name} offering unique cultural experiences, landmark sights, and local cuisine.",
                "image_url": f"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
                "cost_index": cost_idx,
                "popularity_score": pop_score,
                "latitude": city_lat,
                "longitude": city_lng
            }
            cities_list.append(city_obj)

            # 4 activities per city -> ~2,000+ activities total
            activity_templates = [
                ("Historical Landmarks Guided Tour", "Explore iconic historical monuments, architecture, and heritage sites with a local expert.", "historical", 1200.0, 180, 95.0),
                ("Culinary Street Food Experience", "Taste authentic local delicacies, traditional snacks, and street specialties at vibrant markets.", "food", 800.0, 120, 92.0),
                ("Panoramic Sunset Viewpoint Walk", "Enjoy breathtaking panoramic views of the skyline and landscape during sunset.", "sightseeing", 0.0, 90, 96.0),
                ("Art Museum & Cultural Heritage Visit", "Discover world-class galleries, traditional artifacts, and master works of art.", "museum", 1500.0, 150, 90.0),
            ]

            for a_name_t, a_desc_t, a_type_t, a_cost_t, a_dur_t, a_pop_t in activity_templates:
                act_obj = {
                    "city_name": city_name,
                    "country_iso_code": iso2,
                    "name": f"{city_name} {a_name_t}",
                    "description": a_desc_t,
                    "activity_type": a_type_t,
                    "estimated_cost": a_cost_t,
                    "currency": curr if curr else "USD",
                    "duration_minutes": a_dur_t,
                    "popularity_score": a_pop_t,
                    "image_url": f"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"
                }
                activities_list.append(act_obj)

    print(f"Generated Dataset Totals:")
    print(f"  - Countries:  {len(countries_list)}")
    print(f"  - Cities:     {len(cities_list)}")
    print(f"  - Activities: {len(activities_list)}")

    with open(data_dir / "countries.json", "w", encoding="utf-8") as f:
        json.dump(countries_list, f, indent=2, ensure_ascii=False)

    with open(data_dir / "cities.json", "w", encoding="utf-8") as f:
        json.dump(cities_list, f, indent=2, ensure_ascii=False)

    with open(data_dir / "activities.json", "w", encoding="utf-8") as f:
        json.dump(activities_list, f, indent=2, ensure_ascii=False)

    print("Static dataset files created successfully in backend/data/")

if __name__ == "__main__":
    generate_full_dataset()
