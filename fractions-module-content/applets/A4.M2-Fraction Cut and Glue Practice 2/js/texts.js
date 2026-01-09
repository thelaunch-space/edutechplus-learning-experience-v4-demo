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
      html_title: "Exploring Fractions",
      main_title_text: "Exploring Fractions",
      subtitle_text: "Let's learn about numerators!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        scissor_2: "./assets/Scissor2.png",
        scissor_3: "./assets/Scissor3.png",
        scissor_5: "./assets/Scissor5.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        paint: "assets/sfx/paint.mp3",
        buzzer: "assets/sfx/buzzer.mp3",
      },
      button_texts: {
        next: "Next",
        start_over: "Start Over",
        start: "Start",
        reset: "Reset",
        recolor: "Recolor",
        check: "Check",
      },
      instructions: {
        step_0_intro: {
          title: "Hello!",
          text: "You have already explored unit fractions.<br><br>Let’s now explore fractions where the numerator is not 1.",
        },
        // Challenge 1: 2/5
        step_1_cut_5: {
          title: "Let's learn more fractions",
          text: "Split the square into 5 equal parts. Use the correct Scissor.",
        },
        step_2_color_2: {
          title: "Time to Color!",
          text: (params) => {
            const words = { 2: "two", 3: "three", 4: "four" };
            return `Color any <b>${
              words[params.numerator] || params.numerator
            }</b> parts you like. Then click 'Check'.`;
          },
        },
        step_2_color_wrong: {
          title: "Oops!",
          text: "Please use just one color to show the parts belong to the same fraction. Click 'Recolor' to try again.",
        },
        step_3_confirm_2_5: {
          title: "Awesome!",
          text: "You colored 2 out of 5 equal parts.",
        },
        step_4_final_2_5: {
          title: "Fraction Time!",
          text: "You have just created the fraction <span class='vertical-fraction' data-numerator='2' data-denominator='5'></span>. Let’s represent it now:",
        },
        // Transition
        step_5_transition: {
          title: "Great Job!",
          text: "Now it’s your turn to explore other fractions with numerators greater than 1!",
        },
        // Challenge 2: 2/3
        step_6_cut_3: {
          title: "Let's learn some more fractions",
          text: "What does the fraction <span class='vertical-fraction' data-numerator='2' data-denominator='3'></span> look like? Choose the correct denominator. Make the right choice!",
        },
        step_7_color_2_from_3: {
          title: "Numerator Time",
          text: (params) => {
            const words = { 2: "two", 3: "three", 4: "four" };
            return `Color any <b>${
              words[params.numerator] || params.numerator
            }</b> parts you like. Then click 'Check'.`;
          },
        },
        step_8_confirm_2_3: {
          title: "Good going!",
          text: "That’s exactly how <span class='vertical-fraction' data-numerator='2' data-denominator='3'></span> looks.",
        },
        // Challenge 3: 2/4
        step_9_cut_4: {
          title: "Awesome! Try to build the next fraction",
          text: "Choose the scissors and colors to represent <span class='vertical-fraction' data-numerator='2' data-denominator='4'></span>!",
        },
        step_9_cut_4_again: {
          title: "One More Cut",
          text: "Great! That's 2 pieces. To get 4, you need to cut it again with the same scissors.",
        },
        step_10_color_2_from_4: {
          title: "Color the Parts",
          text: (params) => {
            const words = { 2: "two", 3: "three", 4: "four" };
            return `Now, color any <b>${
              words[params.numerator] || params.numerator
            }</b> parts you like. Then click 'Check'.`;
          },
        },
        step_11_confirm_2_4: {
          title: "Awesome Work!",
          text: "You represented <span class='vertical-fraction' data-numerator='2' data-denominator='4'></span>.",
        },
        // Challenge 4: 3/5
        step_12_cut_5_again: {
          title: "Great! Let's see another fraction",
          text: "You're on a roll! Let's build <span class='vertical-fraction' data-numerator='3' data-denominator='5'></span>.",
        },
        step_13_color_3_from_5: {
          title: "Color the Numerator",
          text: (params) => {
            const words = { 2: "two", 3: "three", 4: "four" };
            return `You know what to do! Color any <b>${
              words[params.numerator] || params.numerator
            }</b> parts you like. Then click 'Check'.`;
          },
        },
        step_14_confirm_3_5: {
          title: "Fantastic!",
          text: "That's a perfect <span class='vertical-fraction' data-numerator='3' data-denominator='5'></span>!",
        },
        // Challenge 5: 4/6
        step_15_cut_6: {
          title: "Superb! Try this next fraction",
          text: "Let's make <span class='vertical-fraction' data-numerator='4' data-denominator='6'></span>. This needs two different cuts!",
        },
        step_15_cut_6_again: {
          title: "Another Cut Needed",
          text: (params) =>
            `Great, that's ${params.count} pieces. Now use the other required scissor to make 6 pieces.`,
        },
        step_16_color_4_from_6: {
          title: "Last Coloring Step",
          text: (params) => {
            const words = { 2: "two", 3: "three", 4: "four" };
            return `Almost there! Color any <b>${
              words[params.numerator] || params.numerator
            }</b> parts you like. Then click 'Check'.`;
          },
        },
        step_17_confirm_4_6: {
          title: "You Did It!",
          text: "You've correctly built <span class='vertical-fraction' data-numerator='4' data-denominator='6'></span>!",
        },
        // Final Screen
        step_18_final: {
          title: "Awesome work!",
          text: "Now you know how to represent a fraction where the numerator is greater than 1.",
        },
        // Generic feedback
        feedback_cut_wrong: {
          title: "Try Again!",
          text: (params) =>
            `That scissor made ${params.count} parts. That's not what we need for this fraction. Please Reset and try again.`,
        },
        feedback_color_wrong_count: {
          title: "Not Quite",
          text: (params) =>
            `You colored ${params.count} parts, but the numerator is ${params.numerator}. Please click 'Recolor' and try again.`,
        },
        labels: {
          numerator: "Number of parts we colored",
          denominator: "Total number of parts of the whole",
        },
      },
      gameConfig: {
        colors: [
          { name: "Yellow", value: "#ece13bff" },
          { name: "Red", value: "#ff684dff" },
          { name: "Pink", value: "#ff76d6ff" },
          { name: "Purple", value: "#9064f6ff" },
        ],
        paperColor: "#35a7ff",
        paperStroke: "#eb910bff",
      },
    },
  },
  // Indonesian (Bahasa Indonesia) Translations
  id: {
    appTexts: {
      html_title: "Menjelajahi Pecahan",
      main_title_text: "Menjelajahi Pecahan",
      subtitle_text: "Ayo belajar tentang pembilang!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
        speaking_head: "./assets/CavyHead.png",
      },
      item_images: {
        scissor_2: "./assets/Scissor2.png",
        scissor_3: "./assets/Scissor3.png",
        scissor_5: "./assets/Scissor5.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        paint: "assets/sfx/paint.mp3",
        buzzer: "assets/sfx/buzzer.mp3",
      },
      button_texts: {
        next: "Lanjut",
        start_over: "Mulai Lagi",
        start: "Mulai",
        reset: "Atur Ulang",
        recolor: "Warnai Ulang",
        check: "Periksa",
      },
      instructions: {
        step_0_intro: {
          title: "Halo!",
          text: "Kamu sudah menjelajahi pecahan satuan.<br><br>Sekarang mari kita jelajahi pecahan dengan pembilang bukan 1.",
        },
        step_1_cut_5: {
          title: "Mari pelajari lebih banyak pecahan",
          text: "Bagi persegi menjadi 5 bagian yang sama. Gunakan Gunting yang benar.",
        },
        step_2_color_2: {
          title: "Waktunya Mewarnai!",
          text: (params) => {
            const words = { 2: "dua", 3: "tiga", 4: "empat" };
            return `Warnai <b>${
              words[params.numerator] || params.numerator
            }</b> bagian sesukamu. Lalu klik 'Periksa'.`;
          },
        },
        step_2_color_wrong: {
          title: "Ups!",
          text: "Harap gunakan satu warna saja untuk menunjukkan bagian-bagian tersebut milik pecahan yang sama. Klik 'Warnai Ulang' untuk mencoba lagi.",
        },
        step_3_confirm_2_5: {
          title: "Luar Biasa!",
          text: "Kamu mewarnai 2 dari 5 bagian yang sama.",
        },
        step_4_final_2_5: {
          title: "Waktunya Pecahan!",
          text: "Kamu baru saja membuat pecahan <span class='vertical-fraction' data-numerator='2' data-denominator='5'></span>. Ayo kita wakilkan sekarang:",
        },
        step_5_transition: {
          title: "Kerja Bagus!",
          text: "Sekarang giliranmu untuk menjelajahi pecahan lain dengan pembilang lebih besar dari 1!",
        },
        step_6_cut_3: {
          title: "Mari pelajari lebih banyak pecahan",
          text: "Seperti apa bentuk pecahan <span class='vertical-fraction' data-numerator='2' data-denominator='3'></span>? Pilih penyebut yang benar. Buatlah pilihan yang tepat!",
        },
        step_7_color_2_from_3: {
          title: "Waktunya Pembilang",
          text: (params) => {
            const words = { 2: "dua", 3: "tiga", 4: "empat" };
            return `Warnai <b>${
              words[params.numerator] || params.numerator
            }</b> bagian sesukamu. Lalu klik 'Periksa'.`;
          },
        },
        step_8_confirm_2_3: {
          title: "Bagus sekali!",
          text: "Tepat seperti itulah bentuk <span class='vertical-fraction' data-numerator='2' data-denominator='3'></span>.",
        },
        step_9_cut_4: {
          title: "Luar Biasa! Coba bangun pecahan berikutnya",
          text: "Pilih gunting dan warna untuk mewakili <span class='vertical-fraction' data-numerator='2' data-denominator='4'></span>!",
        },
        step_9_cut_4_again: {
          title: "Satu Potongan Lagi",
          text: "Bagus! Itu 2 bagian. Untuk mendapatkan 4, kamu perlu memotongnya lagi dengan gunting yang sama.",
        },
        step_10_color_2_from_4: {
          title: "Warnai Bagiannya",
          text: (params) => {
            const words = { 2: "dua", 3: "tiga", 4: "empat" };
            return `Sekarang, warnai <b>${
              words[params.numerator] || params.numerator
            }</b> bagian sesukamu. Lalu klik 'Periksa'.`;
          },
        },
        step_11_confirm_2_4: {
          title: "Kerja Luar Biasa!",
          text: "Kamu telah mewakili <span class='vertical-fraction' data-numerator='2' data-denominator='4'></span>.",
        },
        step_12_cut_5_again: {
          title: "Bagus! Ayo lihat pecahan lain",
          text: "Kamu hebat! Ayo kita buat <span class='vertical-fraction' data-numerator='3' data-denominator='5'></span>.",
        },
        step_13_color_3_from_5: {
          title: "Warnai Pembilang",
          text: (params) => {
            const words = { 2: "dua", 3: "tiga", 4: "empat" };
            return `Kamu tahu apa yang harus dilakukan! Warnai <b>${
              words[params.numerator] || params.numerator
            }</b> bagian sesukamu. Lalu klik 'Periksa'.`;
          },
        },
        step_14_confirm_3_5: {
          title: "Fantastis!",
          text: "Itu <span class='vertical-fraction' data-numerator='3' data-denominator='5'></span> yang sempurna!",
        },
        step_15_cut_6: {
          title: "Hebat! Coba pecahan berikutnya ini",
          text: "Ayo buat <span class='vertical-fraction' data-numerator='4' data-denominator='6'></span>. Ini membutuhkan dua potongan berbeda!",
        },
        step_15_cut_6_again: {
          title: "Perlu Potongan Lain",
          text: (params) =>
            `Bagus, itu ${params.count} bagian. Sekarang gunakan gunting lain yang diperlukan untuk membuat 6 bagian.`,
        },
        step_16_color_4_from_6: {
          title: "Langkah Mewarnai Terakhir",
          text: (params) => {
            const words = { 2: "dua", 3: "tiga", 4: "empat" };
            return `Hampir sampai! Warnai <b>${
              words[params.numerator] || params.numerator
            }</b> bagian sesukamu. Lalu klik 'Periksa'.`;
          },
        },
        step_17_confirm_4_6: {
          title: "Kamu Berhasil!",
          text: "Kamu telah membuat <span class='vertical-fraction' data-numerator='4' data-denominator='6'></span> dengan benar!",
        },
        step_18_final: {
          title: "Kerja Luar Biasa!",
          text: "Sekarang kamu tahu cara mewakili pecahan dengan pembilang lebih besar dari 1.",
        },
        feedback_cut_wrong: {
          title: "Coba Lagi!",
          text: (params) =>
            `Gunting itu menghasilkan ${params.count} bagian. Bukan itu yang kita butuhkan untuk pecahan ini. Silakan 'Atur Ulang' dan coba lagi.`,
        },
        feedback_color_wrong_count: {
          title: "Belum Tepat",
          text: (params) =>
            `Kamu mewarnai ${params.count} bagian, tapi pembilangnya adalah ${params.numerator}. Silakan klik 'Warnai Ulang' dan coba lagi.`,
        },
        labels: {
          numerator: "Jumlah bagian yang kita warnai",
          denominator: "Jumlah total bagian dari keseluruhan",
        },
      },
      gameConfig: {
        colors: [
          { name: "Kuning", value: "#ece13bff" },
          { name: "Merah", value: "#ff684dff" },
          { name: "Merah Jambu", value: "#ff76d6ff" },
          { name: "Ungu", value: "#9064f6ff" },
        ],
        paperColor: "#35a7ff",
        paperStroke: "#eb910bff",
      },
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