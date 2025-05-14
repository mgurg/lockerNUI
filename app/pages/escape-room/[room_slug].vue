<template>
  <div v-if="room">
    <div class="relative bg-black text-white rounded-xl">
      <!-- Hero Section (Limited to 1/3 height) -->
      <div class="relative w-full h-[33vh] overflow-hidden rounded-xl ">
        <!-- Fading Effect Over Image -->
        <div
            class="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 via-transparent to-black/60 z-10 rounded-xl">
        </div>

        <!-- Background Gradient (Only if Image Fails) -->
        <div id="fallback-bg" class="absolute inset-0 bg-gradient-to-b from-gray-900 to-black hidden rounded-xl"></div>

        <img
            src="https://picsum.photos/1200/800"
            :alt="room.translation.title"
            class="object-cover w-full h-full rounded-xl"
            onerror="document.getElementById('fallback-bg').classList.remove('hidden'); this.style.display='none';"
        />

        <!-- Content Overlay (Inside Image) -->
        <div class="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 z-20">
          <h1 class="text-3xl sm:text-4xl font-bold [text-shadow:_0_1px_2px_rgba(0,0,0,0.7)]">{{
              room.translation.title
            }}</h1>
          <p class="text-lg text-gray-300 mt-2 font-semibold [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
            {{ room.location.city }}</p>

          <p class="mt-4 text-gray-200 font-normal  [text-shadow:_0_5px_5px_rgba(0,0,0,0.5)] hidden sm:block">
            {{ room.translation.lead }}
          </p>

          <!-- Actions -->
          <div class="mt-6 flex space-x-4">
            <UButton color="primary" variant="solid" :to="room.booking_url" target="_blank">Rezerwuj</UButton>
            <!--            <UButton color="primary" variant="outline">Share</UButton>-->
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full py-8 mx-auto">
      <div class="max-w-2xl w-full mx-auto">
        <!-- Room Description -->
        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">Opis pokoju</h2>
          </template>
          <p class="description-text">{{ room.translation.description }}</p>
        </UCard>

        <!-- Key Information -->
        <UCard class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">Szczegóły</h2>
          </template>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <UIcon name="i-lucide-clock-4" class="mb-2"/>
              <h3 class="font-medium">Czas gry</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ room.duration }} min.</p>
            </div>
            <div>
              <UIcon name="i-lucide-users" class="mb-2"/>
              <h3 class="font-medium">Gracze</h3>
              <p class="text-gray-500 dark:text-gray-400">{{ room.players_min }}-{{ room.players_max }} os.</p>
            </div>
            <div>
              <UIcon name="i-lucide-circle-dollar-sign" class="mb-2"/>
              <h3 class="font-medium">Cena od</h3>
              <p class="text-gray-500 dark:text-gray-400">Od {{ room.price_from }} PLN</p>
            </div>
            <div>
              <!--              <UIcon name="i-lucide-gauge" class="mb-2"/>-->
              <!--              <h3 class="font-medium">Difficulty</h3>-->
              <!--              <p class="text-gray-500 dark:text-gray-400">Advanced</p>-->
              <!--            </div>-->
              <!--            <div>-->
              <!--              <UIcon name="i-lucide-drama" class="mb-2"/>-->
              <!--              <h3 class="font-medium">Success Rate</h3>-->
              <!--              <p class="text-gray-500 dark:text-gray-400">35%</p>-->
              <!--            </div>-->
              <!--            <div>-->
              <UIcon name="i-lucide-languages" class="mb-2"/>
              <h3 class="font-medium">Języki</h3>
              <p class="text-gray-500 dark:text-gray-400">
                      <span
                          v-for="(lang, index) in room.languages"
                          :key="lang.code"
                          class="mr-2"
                      >
        {{ emojiMap[lang.code] }} {{ lang.name }}
        <span v-if="index < room.languages.length - 1">,</span>
      </span>
              </p>
            </div>
          </div>
        </UCard>

        <!-- Pros & Cons Section -->
        <UCard class="mb-8" v-if="false">
          <template #header>
            <h2 class="text-xl font-semibold">Room Overview</h2>
          </template>

          <div class="space-y-4">
            <!-- Pros Accordion -->
            <UAccordion :items="pros">
              <template #content="{ item }">
                <p class="pb-3.5 text-sm text-(--ui-text-muted)" v-for="(text, index) in item.content" :key="index">
                  {{ text }}
                </p>
              </template>
            </UAccordion>

            <!-- Cons Accordion -->
            <UAccordion :items="cons">
              <template #content="{ item }">
                <p class="pb-3.5 text-sm text-(--ui-text-muted)" v-for="(text, index) in item.content" :key="index">
                  {{ text }}
                </p>
              </template>
            </UAccordion>
          </div>
        </UCard>

        <!-- Location Information -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Lokalizacja & Kontakt</h2>
          </template>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-map-pin" class="flex-shrink-0 mt-1"/>
              <div>
                <h3 class="font-medium">Address</h3>
                <p class="text-gray-500 dark:text-gray-400">
                  {{ room.location.street_name }} {{ room.location.street_number }}<br/>
                  {{ room.location.postal_code }} {{ room.location.city }}<br/>
                  {{ room.location.located_in }}
                </p>
              </div>
            </div>
            <!--            <div class="flex items-start gap-3">-->
            <!--              <UIcon name="i-lucide-phone" class="flex-shrink-0 mt-1"/>-->
            <!--              <div>-->
            <!--                <h3 class="font-medium">Phone</h3>-->
            <!--                <p class="text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class="flex items-start gap-3">-->
            <!--              <UIcon name="i-lucide-at-sign" class="flex-shrink-0 mt-1"/>-->
            <!--              <div>-->
            <!--                <h3 class="font-medium">Email</h3>-->
            <!--                <p class="text-gray-500 dark:text-gray-400">info@duneescape.com</p>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </UCard>

        <!-- Other Rooms Section -->
        <!--        <UCard class="mt-8">-->
        <!--          <template #header>-->
        <!--            <div class="flex justify-between items-center">-->
        <!--              <h2 class="text-xl font-semibold">Also in this Location</h2>-->
        <!--              <UButton-->
        <!--                  color="gray"-->
        <!--                  variant="ghost"-->
        <!--                  icon="i-heroicons-arrow-right"-->
        <!--                  label="View all"-->
        <!--              />-->
        <!--            </div>-->
        <!--          </template>-->

        <!--          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">-->
        <!--            &lt;!&ndash; Room Card 1 &ndash;&gt;-->
        <!--            <UCard>-->
        <!--              <template #header>-->
        <!--                <div class="relative h-48">-->
        <!--                  <img-->
        <!--                      src="https://picsum.photos/400/300"-->
        <!--                      alt="Cyberpunk Room"-->
        <!--                      class="absolute inset-0 w-full h-full object-cover rounded-t-lg"-->
        <!--                  />-->
        <!--                  <div class="absolute top-2 right-2">-->
        <!--                    <UBadge color="blue" variant="solid">New</UBadge>-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--              <div class="space-y-2">-->
        <!--                <h3 class="font-medium text-lg">Neon Nights 2099</h3>-->
        <!--                <div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">-->
        <!--          <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-signal"/>-->
        <!--            Medium-->
        <!--          </span>-->
        <!--                  <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-clock"/>-->
        <!--            60 min-->
        <!--          </span>-->
        <!--                  <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-user-group"/>-->
        <!--            2-5-->
        <!--          </span>-->
        <!--                </div>-->
        <!--                <p class="text-sm text-gray-700 dark:text-gray-300">-->
        <!--                  Hack your way through a dystopian cyberpunk world-->
        <!--                </p>-->
        <!--              </div>-->
        <!--              <template #footer>-->
        <!--                <div class="flex justify-between items-center">-->
        <!--                  <span class="font-medium">From $25/person</span>-->
        <!--                  <UButton color="primary" variant="solid" size="sm">Book Now</UButton>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </UCard>-->

        <!--            &lt;!&ndash; Room Card 2 &ndash;&gt;-->
        <!--            <UCard>-->
        <!--              <template #header>-->
        <!--                <div class="relative h-48">-->
        <!--                  <img-->
        <!--                      src="https://picsum.photos/400/301"-->
        <!--                      alt="Medieval Room"-->
        <!--                      class="absolute inset-0 w-full h-full object-cover rounded-t-lg"-->
        <!--                  />-->
        <!--                  <div class="absolute top-2 right-2">-->
        <!--                    <UBadge color="orange" variant="solid">Popular</UBadge>-->
        <!--                  </div>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--              <div class="space-y-2">-->
        <!--                <h3 class="font-medium text-lg">Dragon's Keep</h3>-->
        <!--                <div class="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">-->
        <!--          <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-signal"/>-->
        <!--            Hard-->
        <!--          </span>-->
        <!--                  <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-clock"/>-->
        <!--            75 min-->
        <!--          </span>-->
        <!--                  <span class="flex items-center gap-1">-->
        <!--            <UIcon name="i-heroicons-user-group"/>-->
        <!--            3-8-->
        <!--          </span>-->
        <!--                </div>-->
        <!--                <p class="text-sm text-gray-700 dark:text-gray-300">-->
        <!--                  Medieval fantasy adventure with magical puzzles-->
        <!--                </p>-->
        <!--              </div>-->
        <!--              <template #footer>-->
        <!--                <div class="flex justify-between items-center">-->
        <!--                  <span class="font-medium">From $30/person</span>-->
        <!--                  <UButton color="primary" variant="solid" size="sm">Book Now</UButton>-->
        <!--                </div>-->
        <!--              </template>-->
        <!--            </UCard>-->
        <!--          </div>-->
        <!--        </UCard>-->

      </div>
    </div>
  </div>
</template>


<script setup>
import {computed, ref} from 'vue';

import {roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet} from "~/client/index.ts";
import {useRoute} from "vue-router";

const localePath = useLocalePath()
const route = useRoute();
const runtimeConfig = useRuntimeConfig()
const roomSlug = route.params.slug || route.path.split("/").pop();


const room = ref()
const roomName = ref('')
const roomDescription = ref('')

const emojiMap = {
  en: "🇬🇧",
  es: "🇪🇸",
  pl: "🇵🇱",
  fr: "🇫🇷",
  de: "🇩🇪",
}

const fetchRoom = async () => {
  try {
    const response = await roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet({
      path: {language: "pl", room_url_slug: roomSlug},
    });
    room.value = response.data;
    roomName.value = response.data.translation.title;
    roomDescription.value = response.data.translation.lead;
  } catch (error) {
    console.error("Failed to fetch escape room details:", error);
  }
};

fetchRoom();

const canonicalUrl = `${runtimeConfig.public.baseDomain}${route.fullPath}`;
const hreflangLinks = [
  {rel: 'alternate', hreflang: 'pl', href: canonicalUrl},
  {rel: 'alternate', hreflang: 'x-default', href: canonicalUrl}
];

const excludedSlugs = [
  'halloween-night', 'ostatni-skarb-czarnobrodego', 'super-ziolo', 'wikingowie-widmo-ragnaroku', 'chojnik-misja-kunegundy',
  'project-human', 'korium', 'dom-zly', 'davinci', 'zamczysko-magikowo', 'komnata-cieni', 'wioska-elfow-uratuj-swieta',
  'feniks-klatwa-ognia', 'koniec-wolnosci', 'turniej-trojmagiczny', 'i-zyli-dlugo', 'sekret-nicolasa', 'chatka-z-piernika',
  'piracka-grota-klatwa-siedmiu-morz', 'panorama', 'przystanek-ksiezycowa', 'trupia-glowka', 'zelazny-tron-westeros',
  'noc-w-muzeum', 'w-samo-poludnie', 'licho', 'swiatynia-krwi-i-rozpaczy', 'skarbiec-odyna', 'ecological', 'uwolnic-dzina',
  'chata-ogra', 'android', 'elfie-psoty', 'galaktyczna-odyseja-2-0', 'misja-teleportacja', 'lesna-chatka-wiedzmy', 'swiatynia-zlotego-slonca',
  'escape-box-skrzynia-czarodzieja', 'grota-czarnoksieznika', 'plan-na-wlam', 'zapomniany-sierociniec', 'cela-nr-4-recydywa', 'wonderland',
  'ksiega-magii-czar-wiedzmy', 'kac-wawel', 'pokoj-wieznia-nr-13', 'krypta-hrabiny-dabkov', 'tajemnica-nicolasa-flamela', 'tlk-interstellar',
  'klasa', 'oddech-demona', 'wednesday-milosc-az-po-grob', 'prawdziwy-mikolaj', 'wednesday-akademia-dziwolagow', 'cyberspace', 'astrokrator',
  'swieta', 'wyznania-egzorcysty', 'szpital', 'zaginiona', 'zielona-mila', 'komnata-tajemnic', 'stary-sklep-z-zabawkami', 'dia-de-muertos',
  'oszukac-wiedzme', 'bunkier', 'laboratorium', 'skazani', 'harry-potter', 'szlak-nieumarlych', 'klopsztanga', 'komnata-alchemika-ambrozego',
  'gniazdo-feniksa', 'gabinet-detektywa-korneliusza-spryta', 'zemsta-umarlaka', 'hrabia-plater-i-tajemnica-gabinetu', 'grobowiec-faraona',
  'tajemnica-bibliotekarza', 'frank-stein', 'sekrety-akademii-nevermore', 'motel-california', 'duch-wojownika', 'steampunk-alternatywna-rzeczywistosc',
  'legenda-siedmiu-pierscieni', 'statek-kosmiczny-kierunek-mars', 'wrozbitka', 'transmigracja', 'tajemnice-watykanu', 'fabryka-potworow-detektywistyczna-przygoda',
  'klatwa-noc-walpurgi', 'piracka-tawerna', 'alicja-w-krainie-czarow', 'przeklety-strych', 'archiwum-x-sprawa-666', 'pracownia-leonarda-da-vinci', 'operacja-byfyj',
  'sladami-harry-ego', 'grobowiec-tutanchamona', 'sekretna-fabryka-swietego-mikolaja', 'psychiatryk-2-0', 'gabinet-archeolozki-iwony-was', 'kryjowka-wiedzmy',
  'slepa-furia', 'sectum-sempra', 'potworne-miasteczko', 'polowanie-na-dusze', 'zakopani-zywcem', 'skrytka-nr-16', 'upadle-krolestwo', 'piracki-skarb',
  'jaskinia-mistrza-shinobi', 'hades', 'postapo-2', 'uwiezieni', 'hipnoza', 'aresztowani', 'czarna-perla', 'klatwa-smoka', 'opuszczony-szpital',
  'poki-smierc-nas-nie-rozlaczy-krakow', 'szepty-lasu', 'szkola-magii-pierwszy-rok', 'rzez-niewiniatek', 'bestie-peruna',
  'napad-na-bank-dziki-zachod', 'nowa-odyseja-kosmiczna', 'laboratorium-tesli', 'tozsamosc-mordercy', 'kancelaria', 'diabelski-cyrk',
  'chlopiec', 'kopalnia-diamentow', 'krypta', 'duchy-rosalie', 'cyberdzungla', 'alicja', 'piracka-tawerna-bydgoszcz', 'misja-neffo', 'el-profesor-napad-prawie-doskonaly',
  'espace-room', 'wiedzma-i-albercik', 'katakumby', 'opuszczony-hotel', 'browar-krasnoludzki', 'zaklete-amulety', 'prison-escape', 'klatwa-majow',
  'komnata-czarnego-pana', 'sekret-umyslu', 'sekretny-gabinet-zegarmistrza', 'zaginione-krysztaly-2-0', 'expecto-patronum', 'transport', 'wiedzmowa-ksiega',
  'ale-sztuka', 'turniej-magiczny', 'serce-ozyrysa', 'kuznia-krasnoluda', 'piracka-skrzynia-umarlaka', 'apartament', 'klatwa-zarazy', 'cicha-noc',
  'plan-a-napad-na-bank', 'poscig-za-el-patronem', 'powstanie-warszawskie', 'zew-przedwiecznych', 'grobowiec-faraona-lublin', 'tajemnicze-domostwo',
  'western-dziki-saloon', 'wyspa-tajemnic', 'krasnoludy', 'muzeum-2-0', 'piwnica-2-0', 'indiana-2-0', 'alchemik', 'saloon', 'nieznajomi', 'indiana-jones-i-swiatynia-majow',
  'klatwa-czarnobrodego', 'magia-hogwartu', 'ostatni-egzorcyzm', 'prosektorium', 'pokoj-zuzlowy', 'ladowanie-na-ksiezycu', 'el-cartel', 'olimp', 'skrzynie-umarlakow',
  'komnata-wiedzmy', 'sherlock-holmes', 'przygody-indiana-jones', 'jas-i-malgosia', 'rodzina-addamsow', 'osobowosc', 'bialy-wilk', 'sherlock-holmes-wroclaw', 'krew-wikingow',
  'w-krainie-czarow', '13-posterunek', 'stara-szafa', 'operacja-metro', 'koszmarna-willa-tylko-umarli-nie-klamia', 'terrorysta-bomba-w-magazynie',
  'dawno-dawno-temu', 'american-school-story', 'in-da-club', 'szum', 'prl-2-0-dekonspiracja-gienka', 'licencja-00', 'tajemnice-elfandiru', 'wikingowie-amulety-mocy',
  'wehikul-czasu-tajemnica-leonarda', 'rozdzial-i-szepty', 'star-warz-w-poszukiwaniu-holokronu', 'militarny-kryzys', 'galeria-sztuki', 'chata-wiedzmy', 'chory-lekarz',
  'serce-roztocza', 'tajemnica-jumanji', 'sanitariusz', 'odkrywcy', 'dzicy-sa', 'ubik', 'zielona-mila-warszawa', 'ostatni-lodowiec', 'nawiedzony-dwor', 'przeklety-pierscien',
  'testament', 'nieoczekiwana-zmiana-trasy', 'urok', 'anatomia-zbrodni-2', 'pachnidlo', 'lodz-podwodna', 'histeria', 'saloon-wroclaw', 'sala-tortur-zygfryda-de-lowe',
  'sekret-burmistrza', 'krematorium-sledztwo', 'wyzyskpol', 'postapo-schron', 'strefa-cienia', 'muzeum-okultyzmu-panstwa-warren', 'galaktyka-tajemnic', 'lochy-krola-artura',
  'tajemnica-starej-kamienicy', 'bunkier-2-biuro-komendanta', 'atomowa-groza', 'kraina-wiecznej-nocy', 'legenda-krola-artura', 'zamek-czarnego-kruka',
  'magia-zielonej-komnaty', 'misja-a-v-a-t-a-r', 'bon-appetit', 'czarownice-z-eylau', 'syreni-spiew', 'duch-wulkanu-czlowieki-w-kotle', 'tajemnica-ksiegi-lasu',
  'interactive-2-0', 'horror', 'gabinet-ignacego-lukasiewicza', 'podroz-do-nikad', 'klatwa-starej-wiedzmy', 'psychopata', 'misja-napoleon', 'golden-hajs',
  'tajemnica-alchemika', 'kopalnia-zlota', 'podroz', 'p-ssword', 'czarna-dziura', 'da-vinci', 'zaklad-karny', 'szpieg-z-prl-u', 'the-final-show', 'w-cieniu-piramid',
  'grota-mocy', 'legendy-camelotu', 'dom-pogrzebowy', 'lokalizacja', 'klatwa-zbojow', 'superheroom', 'psychiatryk', 'muzeum-tortur', 'freakshow', 'tunele-pod-miastem',
  'na-skraju-lasu', 's-o-s', 'tajemnica-faraona', 'klatwa-skarbu-majow', 'spetani-w-raju', 'pila-odkupienie', 'skarb-templariuszy', 'postapo', 'upiorny-teatrzyk-lalek',
  'stranger-room', 'spisek-kardynala', 'olimp-gdynia', 'koneser', 'zdazyc-przed-patologiem', 'dooby-doo', 'zdobyc-plany-gwiazdy-smierci', 'przekleta-wyspa', 'obled',
  'fabryka-czekolady', 'peron-9-i-3-4', 'tajna-kwatera-dyktatora', 'szalony-naukowiec', 'noc-zywych-trupow', 'nekromanta-rytual-smierci', 'tajemnica-61-kilometra',
  'wolfenstein', 'nawiedzona-piwnica', 'szalone-lata-80-te', 'eksperyment', 'pulapka-szeryfa', 'wioska-smerfow', 'plugawy-hotel', 'cube', 'hannibal', 'w-gaszczu-tajemnic',
  'upior-z-alt-allenstein', 'apokalipsa', 'underworld', 'swiatynia-majow', 'zasypani', 'szeol-schron-ostateczny', 'narnia-opowiesci', 'ekspedycja-na-marsa',
  'saloon-dziki-zachod', 'psychoterapia', 'orion-53-space-challenge', 'klatwa-faraona', 'sekret-dziadka', 'indiana-jones-i-swiety-graal', 'krwawa-rzeznia', 'koszmar',
  'lodz-podwodna-gdynia', 'polana', 'excalibur', 'vinci', 'sala-przesluchan', 'pokoj-hotelowy-miejsce-zabojstwa', 'the-moonshiner', 'pokoj-zagadka', 'poza-swiatem',
  'tajemniczy-las', 'pogrzeb-arystokraty', 'krypta-wroclaw', 'murder-house', 'niepokoj', 'faraon', 'ale-cyrk', 'okret-podwodny', 'gniew-olimpu', 'lowcy-snow', 'legenda-miecza',
  'kara-smierci-sredniowieczny-loch', 'opuszczona-piwnica', 'odeon', 'zbrodnia-na-plotnie', 'sekret-profesora-lipnitzkiego', 'escape-davinci', 'chata-wiedzmy-rzeszow',
  'osadzeni-w-bunkrze', 'sekretny-gabinet-al-a-capone', 'rytual-historia-prawdziwa', 'pegazus', 'skarbowka-tajemnicza-zbrodnia', 'halloween', 'midnight-killer-mk-ii',
  'morderstwo-w-orient-expressie', 'kraina-czarow', 'reaktor-404-powrot-atomu', 'kryjowka-genialnego-wynalazcy', 'cela-hannibala-lectera', 'pokoj-laleczki-chucky',
  'tupolew', 'james-bond', 'cela-smierci', 'seksmisja', 'obled-bydgoszcz', 'statek-piratow', 'tajemnicza-komnata', 'schron-2-0', 'killer', 'agent-fbi', 'das-motel',
  'rozbitkowie-w-dzungli', 'wrota-czasu-tortuga', 'klatwa-tutenchamona', 'redrum', 'baza-agenta-sb', 'tozsamosc', 'prolog', 'uspieni', 'jumanji', '5-morderstw',
  'program-gozdzik', 'chata-guslarki', 'baker-street', 'wrota-czasu-egipt', 'prison-break', 'fantazja', 'guantanamo', 'pogrzebani', 'showshank', 'chata-wiedzmy-warszawa',
  'se7en', 'prosektorium-wroclaw', 'tajemnica-egipskich-bogow', 'czarna-perla-dlugie', 'noc-w-las-vegas', 'amber-gold', 'w-odleglej-galaktyce', 'krypta-wampira',
  'zmieniajac-rzeczywistosc', 'zaginiony-oficer', 'pila', 'sex-room', 'kraina-czarow-wroclaw', 'zombie-apokalipsa', 'skarby-majow', 'zdrada-w-breslau', 'walkiria',
  'dom-mordercy-remastered', 'gniew-bogow', 'epidemia', 'cosa-nostra', 'skarb-czarnobrodego', 'kolekcjoner', 'krakowska-bestia', 'ostatnia-cela', 'rycerski',
  'wehikul-czasu', 'piraci', 'sherlock-s-room', 'wyspa-odkrywcow', 'misja-specjalna', 'alicja-w-krainie-czarow-gdansk', 'zloto-nazistow', 'pokoj-babci',
  'zapomniany-pokoj', 'oddzial-psychiatryczny', 'posterunek-13', 'cela-nr-4', 'schron-bankowy', 'bagno-ogra', 'testament-radom', 'klejnot-skarabeusza',
  'krysztal-przekletych', 'lesne-trolle', 'moriarty-sp-z-o-o', 'poki-smierc-nas-nie-rozlaczy', 'pieklo-hazardzisty', 'maly-ksiaze-sen-pilota', 'misja-cube',
  'skrzynia-czarodzieja-harry-escape-box', 'wyspa-smoka-swiatynia-zywiolow', 'morskie-opowiesci', 'zbojnicka-kryjowka', 'operacja-prezentowy-zrzut',
  'protokol-c-h-i-m-e-r-a', 'ostatnie-rozdanie-jaskinia-hazardu', 'awaria-zasilania-w-parku-jurajskim', 'owen', 'ekstremus', 'alexandria-013',
  'zagadki-legendarnych-piratow', 'mlodzi-odkrywcy', 'uniwersytet-potworny', 'skrzynie-wikingow-escape-box', 'cien-nietoperza', 'biala-przepowiednia',
  'ksiega-zla', 'handlarz', 'rod-kraka', 'upiorny-dwor', 'alicja-w-krainie-czarow-chorzow', 'tajemnice-szkoly-magii', 'zostan-milionerem',
  'nautilus-podmorska-przygoda', 'czarnobyl-ostatnia-godzina', 'zodiak', 'plan-na-wlam-bydgoszcz', 'skarb-piratow', 'ucieczka-z-wiezienia',
  'tajemnica-atlantydy-remake', 'seria-niefortunnych-zagadek', 'klatwa-czarnoksieznika',
];

const shouldNoIndex = computed(() => !excludedSlugs.includes(roomSlug));

useHead({
  link: [
    {rel: 'canonical', href: canonicalUrl},
    ...hreflangLinks,
  ],
  htmlAttrs: {
    lang: 'pl',
  },
});

useSeoMeta({
  title: computed(() => `Escape room ${roomName.value}`),
  ogTitle: computed(() => `Escape room ${roomName.value}`),
  description: computed(() => `${roomDescription.value}`),
  ogDescription: computed(() => `${roomDescription.value}`),
  robots: computed(() => shouldNoIndex.value ? "noindex, nofollow" : "index, follow"),
  ogImage: '/og/er_a.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/og/er_a.jpg',
});

const redirectToExternalPage = async (path, uuid) => {
  const query = uuid ? {uuid} : {};

  await navigateTo({
    path: localePath(path),
    query
  });
};

const redirectToExternalReservation = async (url) => {
  window.open(url, "_blank");
}

const pros = ref([
  {
    label: 'What We Love',
    icon: 'i-lucideicons-thumbs-up',
    content: [
      "✅ Immersive atmosphere with stunning visual effects and authentic Dune-inspired props",
      "✅ Unique puzzles that blend sci-fi elements with logical thinking",
      "✅ Perfect for fans of the Dune universe with many thematic references"
    ]
  }
]);

const cons = ref([
  {
    label: 'Keep in Mind',
    icon: 'i-lucideicons-thumbs-down',
    content: [
      "⚠️ Challenging difficulty level - not recommended for beginners",
      "⚠️ Some puzzles require physical activity and crawling",
      "⚠️ Room can get warm due to special effects - dress accordingly"
    ]
  }
]);
</script>

<style scoped>
.description-text {
  white-space: pre-line;
}
</style>