// ==================================================================
// === LANGUAGE SELECTOR - ONLY EDIT THE VALUE IN THIS LINE ===
// ==================================================================
// Change this value to 'id' for Indonesian Bahasa or 'en' for English.
const CURRENT_LANGUAGE = "en";
// ==================================================================
const ALL_TEXTS = {
  // English Text (Default)
  en: {
    appTexts: {
      html_title: "Understanding Unit Fractions",
      
      title_parts: {
        fractions: "Fractions",
        help: "help us show",
        parts: "parts of a whole",
        period: "."
      },
      
      statements: {
        statement1: "We can have a ",
        statement2: "Which can be cut into ",
        statement3: "Each part is a ",
        statement4: "We ",
        statement4_end: " unit fractions this way."
      },
      
      button_texts: {
        whole_cake: "whole cake",
        equal_parts: "equal parts",
        unit_fraction: "unit fraction",
        represent: "represent"
      },
      
      image_texts: {
        initial: "",
        whole_cake: "The Whole Cake",
        equal_parts: "Six Equal Parts",
        unit_fraction: "One out of six equal parts",
        represent: "One over 6"
      },
      
      images: {
        initial: "./assets/cake.png",
        whole_cake: "./assets/cake_1.png",
        equal_parts: "./assets/cake_cut_parts.png",
        unit_fraction: "./assets/cake_cut_1.png",
        represent: "./assets/1by6.png"
      },
      
      item_images: {
        ftue_cursor: "./assets/Tap.png"
      },
      
      audio: {
        click: "assets/sfx/click.mp3",
        success: "assets/sfx/correct.mp3"
      }
    },
  },
  
  // Indonesian (Bahasa Indonesia) Translations
  id: {
    appTexts: {
      html_title: "Memahami Pecahan Unit",
      
      title_parts: {
        fractions: "Pecahan",
        help: "membantu kita menunjukkan",
        parts: "bagian dari keseluruhan",
        period: "."
      },
      
      statements: {
        statement1: "Kita bisa memiliki ",
        statement2: "Yang bisa dipotong menjadi ",
        statement3: "Setiap bagian adalah ",
        statement4: "Kita ",
        statement4_end: " pecahan unit dengan cara ini."
      },
      
      button_texts: {
        whole_cake: "kue utuh",
        equal_parts: "bagian yang sama",
        unit_fraction: "pecahan unit",
        represent: "mewakili"
      },
      
      image_texts: {
        initial: "",
        whole_cake: "Kue Utuh",
        equal_parts: "Enam Bagian Sama",
        unit_fraction: "Satu dari enam bagian yang sama",
        represent: "Satu per 6"
      },
      
      images: {
        initial: "./assets/cake.png",
        whole_cake: "./assets/cake_1.png",
        equal_parts: "./assets/cake_cut_parts.png",
        unit_fraction: "./assets/cake_cut_1.png",
        represent: "./assets/1by6.png"
      },
      
      item_images: {
        ftue_cursor: "./assets/Tap.png"
      },
      
      audio: {
        click: "assets/sfx/click.mp3",
        success: "assets/sfx/correct.mp3"
      }
    },
  },
};
// --- DO NOT EDIT BELOW THIS LINE ---
try {
  const selectedLang = ALL_TEXTS[CURRENT_LANGUAGE] || ALL_TEXTS["en"];
  window.APP_TEXTS = selectedLang.appTexts;
} catch (error) {
  console.error("Error setting up language texts.", error);
  // Fallback to English
  window.APP_TEXTS = ALL_TEXTS.en.appTexts;
}