/* ==========================================================================
   ✏️  EDIT THIS FILE TO MAKE THE WEBSITE YOURS
   --------------------------------------------------------------------------
   Everything he will read lives here. Change any text you like.
   Special tokens you can use inside any text:
     {name}       -> his name (boyfriendName below)
     {signature}  -> how you sign off (signature below)
   ========================================================================== */

window.CONFIG = {

  /* ---- The basics ---- */
  boyfriendName: "Niru",           // shows as "For Niru" on the first screen
  yourName: "",                    // optional, e.g. "Priya" → shows in the footer "Made with love by Priya"
  signature: "Your girl",          // how the letter is signed (you can write your name here instead)
  pageTitle: "For {name} ❤️",      // browser tab title

  /* How fast the typing animation goes (milliseconds per letter). Higher = slower. */
  typingSpeed: 34,

  /* ---- Music ----
     Leave `file` empty to use the built-in soft, dreamy piano-pad music
     (generated live in the browser, so nothing can go missing).
     Or put your own song in the project folder, e.g. file: "audio/our-song.mp3" */
  music: {
    file: "",
    volume: 0.7                    // 0 to 1
  },

  /* ---- 1. Opening screen ---- */
  intro: {
    for: "For {name}",
    title: "Hey, my favorite person... ❤️",
    subtitle: "I made something for you. Please take a little moment to open it.",
    button: "Open My Heart ❤️",
    hint: "Soft music will play when you open it. You can mute it anytime."
  },

  /* ---- 2. The apology ---- */
  apology: {
    eyebrow: "from my heart",
    title: "I'm so sorry, {name}",
    paragraphs: [
      "I know my words hurt you, and I wish I could take them back. Sometimes I fail to express myself the way I should, and I end up hurting the person who means the most to me.",
      "You didn't deserve those words. I am truly sorry.",
      "What touches my heart is that even when you were hurt, you still chose to talk to me with kindness. I notice that. I appreciate that. And I never want to take your kindness for granted.",
      "I may not always say things perfectly, but I want to learn to love you better, understand you better, and be more careful with your heart.",
      "You mean so much more to me than my words sometimes manage to show."
    ]
  },

  /* ---- 3. Flip cards ---- */
  cards: {
    eyebrow: "tap each one",
    title: "Things I Wish I Could Tell You",
    subtitle: "Some things are easier to say softly. Open them one by one.",
    items: [
      "You never deserved to be hurt by my words.",
      "Your feelings matter to me.",
      "I appreciate how kind you are, even when you're hurt.",
      "I don't want to win an argument. I want to understand you.",
      "I want to become better at communicating with you.",
      "Thank you for still treating me with kindness."
    ]
  },

  /* ---- 4. The letter ---- */
  letter: {
    eyebrow: "written just for you",
    title: "A Little Love Letter",
    greeting: "My {name},",
    paragraphs: [
      "If I could go back to that moment, I would choose my words more carefully.",
      "I know saying sorry cannot instantly erase the hurt I caused. I don't expect you to forget what happened just because I apologized.",
      "I just want you to know that I care about your feelings deeply.",
      "Thank you for being kind to me even when I gave you a reason to feel hurt.",
      "I love you, and I want my actions to show you that those words are not just promises.",
      "Whenever you're ready, I hope you can forgive me.",
      "Until then, I'll keep trying to become someone who makes your heart feel safe."
    ],
    closing: ["With all my love,", "{signature} ❤️"]
  },

  /* ---- OPTIONAL: Our memories ----
     Add a few real moments and a new section appears automatically.
     Leave the list empty ( [] ) to hide it completely.

     Example (remove the // to use):
       { title: "The first time we met", text: "I was so nervous, and you made me laugh within a minute." },
       { title: "That rainy evening", text: "We shared one umbrella and neither of us cared about getting wet." },
  */
  memories: {
    eyebrow: "us",
    title: "Moments I Treasure",
    subtitle: "A few of the little things I'll always hold close.",
    items: [
      // { title: "The first time we met", text: "Write your memory here." },
    ]
  },

  /* ---- 5. Reasons I love you ---- */
  reasons: {
    eyebrow: "use the hearts",
    title: "Reasons I Love You",
    subtitle: "There are so many more than I can ever put into words.",
    items: [
      { title: "Your kindness", text: "It's gentle and real, and it shows even on the days I don't deserve it." },
      { title: "Your patience with me", text: "You give me room to grow without ever making me feel small." },
      { title: "The way you still talk to me nicely", text: "Even while your heart was hurting, you chose softness. I noticed." },
      { title: "Your beautiful heart", text: "It's the thing I admire most, and the thing I most want to protect." },
      { title: "The comfort I feel with you", text: "With you, even a quiet moment feels like home." },
      { title: "The happiness you bring into my life", text: "Ordinary days feel brighter just because you're in them." },
      { title: "The little things you do", text: "You may not realize it, but they mean everything to me." }
    ]
  },

  /* ---- 6 + 7. Final message and hug ---- */
  finale: {
    lead: "One thing I never want you to doubt...",
    important: "You are important to me.",
    trio: ["Your feelings matter.", "Your happiness matters.", "Your heart matters."],
    sorry: "And I am genuinely sorry for hurting it.",
    love: "I love you, my favorite person. ❤️",
    hugPrompt: "Can I have a little hug when you're ready? 🥺",
    hugButton: "Sending You the Biggest Hug ❤️",
    hugMessage: "One thousand virtual hugs, just for you! 🤗❤️",
    note: "No pressure at all. Take all the time you need."
  },

  footer: "Made with all my heart"
};
