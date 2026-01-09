// ==================================================================
// === LANGUAGE SELECTOR - ONLY EDIT THE VALUE IN THIS LINE ===
// ==================================================================
const CURRENT_LANGUAGE = "en"; // Can be changed to "id" to use Indonesian
// ==================================================================

const ALL_TEXTS = {
  // English Text (Default)
  en: {
    appTexts: {
      html_title: "Fractions with Scissors",
      main_title_text: "Fractions with Scissors",
      subtitle_text: "Let's learn by cutting and coloring!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
      },
      item_images: {
        scissor: "./assets/Scissor2.png",
        scissor_3: "./assets/Scissor3.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        count: "assets/sfx/click.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        next: "Next",
        start_over: "Start Over",
        reset: "Reset",
      },
      instructions: {
        step_0_intro: {
          title: "Hello!",
          text: "We know that one cut with the scissors-2 gave us <span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>.<br><br> But what happens if we use the scissors-2 a second time?<br><br> Click next to find out!",
        },
        step_1_setup: {
          title: "Let's Cut",
          text: "We are going to use the same scissors-2 again — this time to cut any of the two parts.",
        },
        step_1_fail: {
          title: "Not That One!",
          text: "Oops! The scissors-3 cuts into 3 parts. We need to use the scissors-2 for this step. Please click Reset and try again.",
        },
        step_2_second_cut: {
          title: "Another Cut!",
          text: "Let’s do another cut! First, click the scissors, then click on one of the halves to divide it further into 2 smaller equal parts.",
        },
        step_3_color: {
          title: "Time to Color",
          text: "Let’s add some color! Pick a color and click on the part you just split.",
        },
        step_4_mcq_how_many: {
          title: "Awesome!",
          text: (params) => `You are doing awesome! Now can you tell me, how many of the <b style="color:${params.paperStroke};">equal</b> parts form the whole?`,
          options: [
            { display: "3", value: "3" },
            { display: "4", value: "4" },
            { display: "5", value: "5" }
          ],
          correctAnswer: "4",
        },
        step_5_observe: {
          title: "You Are Right!",
          text: "Let’s observe why that is true.",
        },
        step_6_fraction_intro: {
          title: "A New Fraction!",
          text: "One out of four equal parts is colored — that represents the fraction <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>.",
        },
        step_7_transition: {
          title: "That Was Spot On!",
          text: "You discovered <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>!<br><br> Now, let’s create a new fraction, <span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>, by using the scissors-2 and scissors-3.",
        },
        step_8_setup_1_6: {
          title: "Two Kinds of Scissors",
          text: "We can start with the scissors-2 and then use the scissors-3 — both are right here and ready to go!",
        },
        step_9_cut_for_1_6: {
          title: "First Cut",
          text: "Time to grab the scissors-2! Click them, and then click the square to split it into two equal pieces.",
        },
        step_10_cut_for_1_6_p2: {
          title: "Second Cut",
          text: "Let the scissors-3 do the work! Click them, then click each half to split it into 3 equal parts.",
        },
        step_10_fail_2: {
            title: "Wrong Tool!",
            text: "That's the scissors-2 again. We need the scissors-3 this time to make 3 parts in each half. Please click Reset to try again.",
        },
        step_11_color_1_6: {
          title: "Great Going!",
          text: "Ready to paint now? Click a color, then click any part to color it in!",
        },
        step_12_mcq_1_6: {
          title: "Fantastic Job!",
          text: "You filled in one part out of 6 equal parts — What fraction is that?",
          options: [
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>", value: "1/4" },
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>", value: "1/6" },
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>", value: "1/2" }
          ],
          correctAnswer: "1/6",
        },
        step_13_conclusion: {
          title: "Yay!",
          text: "You understood that one part out of six is <span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>. You also saw how four parts make <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>.",
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
  // Indonesian (Bahasa Indonesia) Text
  id: {
    appTexts: {
      html_title: "Pecahan dengan Gunting",
      main_title_text: "Pecahan dengan Gunting",
      subtitle_text: "Ayo belajar dengan menggunting dan mewarnai!",
      character_images: {
        normal: "./assets/Cavy.png",
        thinking: "./assets/CavyThink.png",
        wrong: "./assets/CavySad.png",
        correct: "./assets/CavyHappy.png",
      },
      item_images: {
        scissor: "./assets/Scissor2.png",
        scissor_3: "./assets/Scissor3.png",
        glue_gun: "./assets/GlueGun.png",
        ftue_cursor: "./assets/Tap.png",
      },
      audio: {
        correct: "assets/sfx/correct.mp3",
        wrong: "assets/sfx/wrong.mp3",
        click: "assets/sfx/click.mp3",
        cut: "assets/sfx/cut.mp3",
        count: "assets/sfx/click.mp3",
        paint: "assets/sfx/paint.mp3",
      },
      button_texts: {
        next: "Lanjut",
        start_over: "Mulai Lagi",
        reset: "Atur Ulang",
      },
      instructions: {
        step_0_intro: {
          title: "Halo!",
          text: "Kita tahu bahwa satu potongan dengan gunting-2 memberi kita <span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>. Tapi apa yang terjadi jika kita menggunakan gunting-2 untuk kedua kalinya?<br><br> Klik lanjut untuk mencari tahu!",
        },
        step_1_setup: {
          title: "Ayo Menggunting",
          text: "Kita akan menggunakan gunting-2 yang sama lagi — kali ini untuk memotong salah satu dari dua bagian.",
        },
        step_1_fail: {
          title: "Bukan yang Itu!",
          text: "Ups! Gunting-3 memotong menjadi 3 bagian. Kita perlu menggunakan gunting-2 untuk langkah ini. Silakan klik Atur Ulang dan coba lagi.",
        },
        step_2_second_cut: {
          title: "Potong Lagi!",
          text: "Ayo lakukan potongan lagi! Pertama, klik gunting, lalu klik salah satu bagian untuk membaginya lagi menjadi 2 bagian kecil yang sama besar.",
        },
        step_3_color: {
          title: "Waktunya Mewarnai",
          text: "Ayo tambahkan warna! Pilih warna dan klik pada bagian yang baru saja kamu potong.",
        },
        step_4_mcq_how_many: {
          title: "Luar Biasa!",
          text: (params) => `Kamu hebat sekali! Sekarang, bisakah kamu beri tahu aku, berapa banyak bagian yang <b style="color:${params.paperStroke};">sama besar</b> yang membentuk keseluruhan?`,
          options: [
            { display: "3", value: "3" },
            { display: "4", value: "4" },
            { display: "5", value: "5" }
          ],
          correctAnswer: "4",
        },
        step_5_observe: {
          title: "Kamu Benar!",
          text: "Ayo kita amati mengapa itu benar.",
        },
        step_6_fraction_intro: {
          title: "Pecahan Baru!",
          text: "Satu dari empat bagian yang sama besar diwarnai — itu mewakili pecahan <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>.",
        },
        step_7_transition: {
          title: "Tepat Sekali!",
          text: "Kamu menemukan <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>!<br><br> Sekarang, ayo kita buat pecahan baru, <span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>, dengan menggunakan gunting-2 dan gunting-3.",
        },
        step_8_setup_1_6: {
          title: "Dua Jenis Gunting",
          text: "Kita bisa mulai dengan gunting-2 lalu menggunakan gunting-3 — keduanya ada di sini dan siap digunakan!",
        },
        step_9_cut_for_1_6: {
          title: "Potongan Pertama",
          text: "Waktunya mengambil gunting-2! Klik guntingnya, lalu klik kotak untuk membaginya menjadi dua bagian yang sama besar.",
        },
        step_10_cut_for_1_6_p2: {
          title: "Potongan Kedua",
          text: "Biarkan gunting-3 yang bekerja! Klik guntingnya, lalu klik setiap bagian untuk membaginya menjadi 3 bagian yang sama besar.",
        },
        step_10_fail_2: {
            title: "Alat yang Salah!",
            text: "Itu gunting-2 lagi. Kita perlu gunting-3 kali ini untuk membuat 3 bagian di setiap setengahnya. Silakan klik Atur Ulang untuk mencoba lagi.",
        },
        step_11_color_1_6: {
          title: "Bagus Sekali!",
          text: "Siap untuk mewarnai sekarang? Klik sebuah warna, lalu klik bagian mana saja untuk mewarnainya!",
        },
        step_12_mcq_1_6: {
          title: "Kerja Bagus!",
          text: "Kamu mengisi satu bagian dari 6 bagian yang sama besar — Pecahan berapakah itu?",
          options: [
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>", value: "1/4" },
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>", value: "1/6" },
            { display: "<span class='vertical-fraction' data-numerator='1' data-denominator='2'></span>", value: "1/2" }
          ],
          correctAnswer: "1/6",
        },
        step_13_conclusion: {
          title: "Hore!",
          text: "Kamu mengerti bahwa satu bagian dari enam adalah <span class='vertical-fraction' data-numerator='1' data-denominator='6'></span>. Kamu juga melihat bagaimana empat bagian membuat <span class='vertical-fraction' data-numerator='1' data-denominator='4'></span>.",
        },
      },
      gameConfig: {
        colors: [
            { name: "Kuning", value: "#ece13bff" },
            { name: "Merah", value: "#ff684dff" },
            { name: "Merah Muda", value: "#ff76d6ff" },
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