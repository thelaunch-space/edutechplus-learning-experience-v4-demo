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
      html_title: "Understanding Fractions",
      
      title_parts: {
        fractions: "Fractions",
        represent: "represent part of the",
        whole: "whole",
        interested: "we are interested in!"
      },
      
      button_texts: {
        half: "One Half",
        quarter: "One Quarter", 
        sixth: "One Sixth"
      },
      
      images: {
        initial: "./assets/Paper.png",
        half: "./assets/1by2.png",
        quarter: "./assets/1by4.png",
        sixth: "./assets/1by6.png"
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
      html_title: "Memahami Pecahan",
      
      title_parts: {
        fractions: "Pecahan",
        represent: "mewakili bagian dari",
        whole: "keseluruhan",
        interested: "yang kita minati!"
      },
      
      button_texts: {
        half: "Setengah",
        quarter: "Seperempat",
        sixth: "Seperenam"
      },
      
      images: {
        initial: "./assets/Paper.png",
        half: "./assets/1by2.png",
        quarter: "./assets/1by4.png",
        sixth: "./assets/1by6.png"
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