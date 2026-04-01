const { createApp } = Vue;

createApp({
  data() {
    return {
      currentView: 'home',
      currentGameMode: '',
      currentLevel: 1,
      currentWordIndex: 0,
      words: [],
      gameWords: [],
      currentWord: null,
      currentGameWord: null,
      gameState: {},
      fillWord: '',
      blankIndex: 0,
      userInput: '',
      choices: [],
      matchCards: [],
      selectedCards: [],
      userProgress: {
        current_level: 1,
        total_words: 0,
        mastered_words: 0,
        partially_mastered_words: 0
      },
      levelInfo: {
        totalLevels: 300,
        totalWords: 4500,
        wordsPerLevel: 15
      },
      wordStatus: {
        total: 0,
        mastered: 0,
        partiallyMastered: 0,
        notStarted: 0
      },
      settings: {
        sound: true,
        pronunciation: true,
        dailyGoal: 15,
        theme: 'light'
      },
      showDetails: false,
      isFlipping: false
    };
  },
  mounted() {
    this.loadSavedProgress();
    this.loadProgress();
  },
  watch: {
    currentLevel() {
      this.saveProgress();
    },
    userProgress: {
      handler() {
        this.saveProgress();
      },
      deep: true
    },
    wordStatus: {
      handler() {
        this.saveProgress();
      },
      deep: true
    }
  },
  methods: {
    getGameTitle() {
      switch (this.currentGameMode) {
        case 'fill':
          return '填空游戏';
        case 'choice':
          return '选择游戏';
        case 'match':
          return '配对游戏';
        case 'spell':
          return '拼写游戏';
        case 'shoot':
          return '射击游戏';
        default:
          return '游戏';
      }
    },
    showHome() {
      this.currentView = 'home';
    },
    showStudy() {
      this.currentView = 'study';
      this.loadWords();
    },
    showGames() {
      this.currentView = 'games';
    },
    showProgress() {
      this.currentView = 'progress';
      this.loadProgress();
    },
    showSettings() {
      this.currentView = 'settings';
      this.loadSettings();
    },
    startStudy() {
      this.showStudy();
    },
    importWordListBtn() {
      document.getElementById('wordListFile').click();
    },
    loadSettings() {
      const savedSettings = localStorage.getItem('wordmaster_settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
        this.applyTheme();
      }
    },
    saveSettings() {
      localStorage.setItem('wordmaster_settings', JSON.stringify(this.settings));
      this.applyTheme();
      alert('设置保存成功！');
    },
    changeTheme(theme) {
      this.settings.theme = theme;
      this.applyTheme();
    },
    applyTheme() {
      if (this.settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    },
    async loadWords() {
      try {
        const response = await fetch(`/api/words?level=${this.currentLevel}`);
        this.words = await response.json();
        if (this.words.length > 0) {
          this.currentWordIndex = 0;
          this.currentWord = this.words[this.currentWordIndex];
        }
      } catch (error) {
        console.error('Error loading words:', error);
        // 模拟数据
        this.words = [
          {
            id: 1,
            word: 'abandon',
            phonetic: '/əˈbændən/',
            definition: 'v. 放弃，遗弃；n. 放任，狂热',
            part_of_speech: 'v./n.',
            rootParts: [
              { morpheme: 'a-', meaning: '去，向' },
              { morpheme: 'ban', meaning: '禁止' },
              { morpheme: '-don', meaning: '名词后缀' }
            ],
            root: '来自古法语 abandoner，意为"放弃、交出"。a- 表示"去"，ban 表示"禁令、控制"，字面意思是"置于他人的控制之下"，引申为"放弃"。',
            rootExamples: ['abandoned (被遗弃的)', 'abandonment (放弃，遗弃)'],
            example: 'The captain gave the order to abandon ship.',
            example_translation: '船长下令弃船。',
            example_context: '航海场景，紧急情况下船长做出的决定',
            moreExamples: [
              { sentence: 'They had to abandon their car in the snow.', translation: '他们不得不把汽车弃置在雪中。' },
              { sentence: 'The project was abandoned due to lack of funding.', translation: '由于缺乏资金，该项目被放弃了。' },
              { sentence: 'She danced with wild abandon.', translation: '她尽情地跳舞。' }
            ],
            synonyms: 'desert, leave, give up, forsake',
            antonyms: 'keep, retain, continue',
            memoryTip: '联想记忆：a(一个) + band(乐队) + on(在...上) → 一个乐队在台上表演不好，被观众要求放弃',
            tags: ['高频词汇', '动词', '消极含义'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 2,
            word: 'ability',
            phonetic: '/əˈbɪləti/',
            definition: 'n. 能力，才能；本领',
            part_of_speech: 'n.',
            rootParts: [
              { morpheme: 'abil', meaning: '能够' },
              { morpheme: '-ity', meaning: '名词后缀，表性质' }
            ],
            root: '来自拉丁语 habilitas，意为"适合、能力"。able 表示"能够的"，-ity 是名词后缀，表示"性质、状态"。',
            rootExamples: ['able (能够的)', 'disable (使无能)', 'capability (能力)'],
            example: 'She has the ability to solve complex problems.',
            example_translation: '她有解决复杂问题的能力。',
            example_context: '工作面试或能力评估场景',
            moreExamples: [
              { sentence: 'Musical ability often runs in families.', translation: '音乐才能常有遗传性。' },
              { sentence: 'The test measures your mathematical ability.', translation: '这项测试衡量你的数学能力。' },
              { sentence: 'He has the ability to make people laugh.', translation: '他有逗人发笑的本事。' }
            ],
            synonyms: 'capability, skill, talent, competence',
            antonyms: 'inability, disability, incompetence',
            memoryTip: '词根记忆：able(能够) + ity(名词后缀) = 能够做某事的性质 = 能力',
            tags: ['高频词汇', '抽象名词', '积极含义'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 3,
            word: 'abnormal',
            phonetic: '/æbˈnɔːrml/',
            definition: 'adj. 反常的，异常的；变态的',
            part_of_speech: 'adj.',
            rootParts: [
              { morpheme: 'ab-', meaning: '离开，偏离' },
              { morpheme: 'norm', meaning: '标准，规范' },
              { morpheme: '-al', meaning: '形容词后缀' }
            ],
            root: '来自拉丁语 abnormalis。ab- 表示"离开、偏离"，norm 表示"标准、规范"，-al 是形容词后缀。字面意思是"偏离标准的"。',
            rootExamples: ['normal (正常的)', 'abnormality (异常)', 'normalize (使正常化)'],
            example: 'The weather has been abnormal this summer.',
            example_translation: '今年夏天的天气反常。',
            example_context: '描述气候或自然现象的异常情况',
            moreExamples: [
              { sentence: 'Tests revealed an abnormal level of cholesterol in his blood.', translation: '检测显示他血液中的胆固醇含量异常。' },
              { sentence: 'It is abnormal for a child to be so quiet.', translation: '孩子这么安静是不正常的。' },
              { sentence: 'The doctor found an abnormal growth.', translation: '医生发现了一个异常的生长物。' }
            ],
            synonyms: 'unusual, irregular, strange, anomalous',
            antonyms: 'normal, regular, usual, typical',
            memoryTip: '词根记忆：ab(离开) + normal(正常的) = 离开正常的 = 反常的',
            tags: ['高频词汇', '形容词', '描述性'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 4,
            word: 'aboard',
            phonetic: '/əˈbɔːrd/',
            definition: 'prep./adv. 在(船、车、飞机)上；上(船、车、飞机)',
            part_of_speech: 'prep./adv.',
            rootParts: [
              { morpheme: 'a-', meaning: '在...上' },
              { morpheme: 'board', meaning: '木板，甲板' }
            ],
            root: '来自中古英语 abord。a- 表示"在...上"，board 原指船的甲板。最初指"在船的甲板上"，后扩展到各种交通工具。',
            rootExamples: ['board (木板，甲板)', 'onboard (在船上)', 'boarding (登机，上船)'],
            example: 'Welcome aboard the flight to London.',
            example_translation: '欢迎乘坐飞往伦敦的航班。',
            example_context: '航空服务场景，空乘人员欢迎乘客',
            moreExamples: [
              { sentence: 'All passengers are now aboard the ship.', translation: '所有乘客都已登船。' },
              { sentence: 'The plane crashed, killing all 200 people aboard.', translation: '飞机坠毁，机上200人全部遇难。' },
              { sentence: 'Come aboard! We\'re about to leave.', translation: '上船吧！我们要出发了。' }
            ],
            synonyms: 'on board, on the ship/plane',
            antonyms: 'ashore, off',
            memoryTip: '联想记忆：a(一个) + board(板子) → 在一个板子上 → 在船上(船就是个大板子)',
            tags: ['介词', '副词', '交通场景'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 5,
            word: 'absence',
            phonetic: '/ˈæbsəns/',
            definition: 'n. 缺席，不在；缺乏，不存在',
            part_of_speech: 'n.',
            rootParts: [
              { morpheme: 'ab-', meaning: '离开，远离' },
              { morpheme: 'sence', meaning: '存在(being)' },
              { morpheme: '-ce', meaning: '名词后缀' }
            ],
            root: '来自拉丁语 absentia。ab- 表示"离开、远离"，ess/esse 表示"存在"。字面意思是"不在、缺席"。',
            rootExamples: ['absent (缺席的)', 'absentee (缺席者)', 'absent-minded (心不在焉的)'],
            example: 'His absence from the meeting was noticed.',
            example_translation: '他缺席会议被注意到了。',
            example_context: '商务会议或正式场合',
            moreExamples: [
              { sentence: 'In the absence of any evidence, the police had to release him.', translation: '由于缺乏任何证据，警方不得不释放他。' },
              { sentence: 'The absence of color in the painting is striking.', translation: '这幅画中色彩的缺失令人瞩目。' },
              { sentence: 'She returned to work after a long absence.', translation: '长期缺勤后她回来上班了。' }
            ],
            synonyms: 'lack, missing, nonattendance, unavailability',
            antonyms: 'presence, attendance, existence',
            memoryTip: '词根记忆：ab(离开) + sence(存在) = 离开存在的状态 = 缺席',
            tags: ['高频词汇', '抽象名词', '正式用语'],
            review_count: 0,
            mastered: false,
            rating: 0
          }
        ];
        this.currentWordIndex = 0;
        this.currentWord = this.words[this.currentWordIndex];
      }
    },
    async loadProgress() {
      try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        this.userProgress = data;
        this.currentLevel = data.current_level;
        this.loadLevelInfo();
        this.loadWordStatus();
      } catch (error) {
        console.error('Error loading progress:', error);
        // 模拟数据
        this.userProgress = {
          current_level: 1,
          total_words: 5,
          mastered_words: 0,
          partially_mastered_words: 0
        };
        this.levelInfo = {
          totalLevels: 300,
          totalWords: 4500,
          wordsPerLevel: 15
        };
        this.wordStatus = {
          total: 5,
          mastered: 0,
          partiallyMastered: 0,
          notStarted: 5
        };
      }
    },
    async loadLevelInfo() {
      try {
        const response = await fetch('/api/levels');
        this.levelInfo = await response.json();
      } catch (error) {
        console.error('Error loading level info:', error);
        // 模拟数据
        this.levelInfo = {
          totalLevels: 300,
          totalWords: 4500,
          wordsPerLevel: 15
        };
      }
    },
    async loadWordStatus() {
      try {
        const response = await fetch('/api/words/status');
        this.wordStatus = await response.json();
      } catch (error) {
        console.error('Error loading word status:', error);
        // 模拟数据
        this.wordStatus = {
          total: 5,
          mastered: 0,
          partiallyMastered: 0,
          notStarted: 5
        };
      }
    },
    async markMastered() {
      try {
        await fetch('/api/words/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            wordId: this.currentWord.id, 
            mastered: true, 
            reviewCount: this.currentWord.review_count || 0 
          })
        });
        this.nextWord();
      } catch (error) {
        console.error('Error marking word as mastered:', error);
        this.nextWord();
      }
    },
    async markNotMastered() {
      try {
        await fetch('/api/words/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            wordId: this.currentWord.id, 
            mastered: false, 
            reviewCount: this.currentWord.review_count || 0 
          })
        });
        this.nextWord();
      } catch (error) {
        console.error('Error marking word as not mastered:', error);
        this.nextWord();
      }
    },
    async markPartiallyMastered() {
      try {
        await fetch('/api/words/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            wordId: this.currentWord.id, 
            mastered: false, 
            reviewCount: this.currentWord.review_count || 0 
          })
        });
        this.nextWord();
      } catch (error) {
        console.error('Error marking word as partially mastered:', error);
        this.nextWord();
      }
    },
    setWordRating(rating) {
      if (this.currentWord) {
        this.currentWord.rating = rating;
        // 这里可以添加保存评分到服务器的逻辑
        console.log('Word rating set to:', rating);
      }
    },
    toggleDetails() {
      this.isFlipping = true;
      setTimeout(() => {
        this.showDetails = !this.showDetails;
        setTimeout(() => {
          this.isFlipping = false;
        }, 400);
      }, 200);
    },
    async loadReviewWords() {
      try {
        const response = await fetch('/api/words/review');
        this.words = await response.json();
        if (this.words.length > 0) {
          this.currentWordIndex = 0;
          this.currentWord = this.words[this.currentWordIndex];
        }
      } catch (error) {
        console.error('Error loading review words:', error);
      }
    },
    nextWord() {
      this.currentWordIndex++;
      this.showDetails = false;
      if (this.currentWordIndex < this.words.length) {
        this.currentWord = this.words[this.currentWordIndex];
      } else {
        this.currentLevel++;
        this.loadWords();
      }
    },
    playPronunciation() {
      // 使用Web Speech API实现单词发音
      if (!this.settings.pronunciation) return;
      const word = this.currentGameWord ? this.currentGameWord.word : this.currentWord.word;
      const speech = new SpeechSynthesisUtterance(word);
      speech.lang = 'en-US';
      speech.rate = 1;
      speech.pitch = 1;
      speech.volume = 1;
      window.speechSynthesis.speak(speech);
    },
    playSound(type) {
      // 播放游戏音效
      if (!this.settings.sound) return;
      const audio = new Audio();
      switch (type) {
        case 'correct':
          // 正确音效
          audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA';
          break;
        case 'wrong':
          // 错误音效
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA';
          break;
        case 'complete':
          // 完成音效
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA';
          break;
        default:
          return;
      }
      audio.play();
    },
    startGame(mode) {
      console.log('Starting game mode:', mode);
      this.currentView = 'game';
      this.currentGameMode = mode;
      this.loadGameWords();
    },
    async loadGameWords() {
      try {
        const response = await fetch(`/api/words?level=${this.currentLevel}`);
        this.gameWords = await response.json();
        if (this.gameWords.length === 0) {
          // 模拟数据
          this.gameWords = [
            {
              id: 1,
              word: 'abandon',
              phonetic: '/əˈbændən/',
              definition: 'v. 放弃，遗弃；n. 放任，狂热',
              part_of_speech: 'v./n.',
              rootParts: [
                { morpheme: 'a-', meaning: '去，向' },
                { morpheme: 'ban', meaning: '禁止' },
                { morpheme: '-don', meaning: '名词后缀' }
              ],
              root: '来自古法语 abandoner，意为"放弃、交出"。a- 表示"去"，ban 表示"禁令、控制"，字面意思是"置于他人的控制之下"，引申为"放弃"。',
              rootExamples: ['abandoned (被遗弃的)', 'abandonment (放弃，遗弃)'],
              example: 'The captain gave order to abandon ship.',
              example_translation: '船长下令弃船。',
              example_context: '航海场景，紧急情况下船长做出的决定',
              moreExamples: [
                { sentence: 'They had to abandon their car in the snow.', translation: '他们不得不把汽车弃置在雪中。' },
                { sentence: 'The project was abandoned due to lack of funding.', translation: '由于缺乏资金，该项目被放弃了。' }
              ],
              synonyms: 'desert, leave, give up, forsake',
              antonyms: 'keep, retain, continue',
              memoryTip: '联想记忆：a(一个) + band(乐队) + on(在...上) → 一个乐队在台上表演不好，被观众要求放弃',
              tags: ['高频词汇', '动词', '消极含义'],
              review_count: 0,
              mastered: false,
              rating: 0
            },
            {
              id: 2,
              word: 'ability',
              phonetic: '/əˈbɪləti/',
              definition: 'n. 能力，才能；本领',
              part_of_speech: 'n.',
              rootParts: [
                { morpheme: 'abil', meaning: '能够' },
                { morpheme: '-ity', meaning: '名词后缀，表性质' }
              ],
              root: '来自拉丁语 habilitas，意为"适合、能力"。able 表示"能够的"，-ity 是名词后缀，表示"性质、状态"。',
              rootExamples: ['able (能够的)', 'disable (使无能)', 'capability (能力)'],
              example: 'She has the ability to solve complex problems.',
              example_translation: '她有解决复杂问题的能力。',
              example_context: '工作面试或能力评估场景',
              moreExamples: [
                { sentence: 'Musical ability often runs in families.', translation: '音乐才能常有遗传性。' },
                { sentence: 'The test measures your mathematical ability.', translation: '这项测试衡量你的数学能力。' }
              ],
              synonyms: 'capability, skill, talent, competence',
              antonyms: 'inability, disability, incompetence',
              memoryTip: '词根记忆：able(能够) + ity(名词后缀) = 能够做某事的性质 = 能力',
              tags: ['高频词汇', '抽象名词', '积极含义'],
              review_count: 0,
              mastered: false,
              rating: 0
            },
            {
              id: 3,
              word: 'abnormal',
              phonetic: '/æbˈnɔːrml/',
              definition: 'adj. 反常的，异常的；变态的',
              part_of_speech: 'adj.',
              rootParts: [
                { morpheme: 'ab-', meaning: '离开，偏离' },
                { morpheme: 'norm', meaning: '标准，规范' },
                { morpheme: '-al', meaning: '形容词后缀' }
              ],
              root: '来自拉丁语 abnormalis。ab- 表示"离开、偏离"，norm 表示"标准、规范"，-al 是形容词后缀。字面意思是"偏离标准的"。',
              rootExamples: ['normal (正常的)', 'abnormality (异常)', 'normalize (使正常化)'],
              example: 'The weather has been abnormal this summer.',
              example_translation: '今年夏天的天气反常。',
              example_context: '描述气候或自然现象的异常情况',
              moreExamples: [
                { sentence: 'Tests revealed an abnormal level of cholesterol in his blood.', translation: '检测显示他血液中的胆固醇含量异常。' },
                { sentence: 'It is abnormal for a child to be so quiet.', translation: '孩子这么安静是不正常的。' }
              ],
              synonyms: 'unusual, irregular, strange, anomalous',
              antonyms: 'normal, regular, usual, typical',
              memoryTip: '词根记忆：ab(离开) + normal(正常的) = 离开正常的 = 反常的',
              tags: ['高频词汇', '形容词', '描述性'],
              review_count: 0,
              mastered: false,
              rating: 0
            },
            {
              id: 4,
              word: 'aboard',
              phonetic: '/əˈbɔːrd/',
              definition: 'prep./adv. 在(船、车、飞机)上；上(船、车、飞机)',
              part_of_speech: 'prep./adv.',
              rootParts: [
                { morpheme: 'a-', meaning: '在...上' },
                { morpheme: 'board', meaning: '木板，甲板' }
              ],
              root: '来自中古英语 abord。a- 表示"在...上"，board 原指船的甲板。最初指"在船的甲板上"，后扩展到各种交通工具。',
              rootExamples: ['board (木板，甲板)', 'onboard (在船上)', 'boarding (登机，上船)'],
              example: 'Welcome aboard the flight to London.',
              example_translation: '欢迎乘坐飞往伦敦的航班。',
              example_context: '航空服务场景，空乘人员欢迎乘客',
              moreExamples: [
                { sentence: 'All passengers are now aboard the ship.', translation: '所有乘客都已登船。' },
                { sentence: 'The plane crashed, killing all 200 people aboard.', translation: '飞机坠毁，机上200人全部遇难。' }
              ],
              synonyms: 'on board, on the ship/plane',
              antonyms: 'ashore, off',
              memoryTip: '联想记忆：a(一个) + board(板子) → 在一个板子上 → 在船上(船就是个大板子)',
              tags: ['介词', '副词', '交通场景'],
              review_count: 0,
              mastered: false,
              rating: 0
            },
            {
              id: 5,
              word: 'absence',
              phonetic: '/ˈæbsəns/',
              definition: 'n. 缺席，不在；缺乏，不存在',
              part_of_speech: 'n.',
              rootParts: [
                { morpheme: 'ab-', meaning: '离开，远离' },
                { morpheme: 'sence', meaning: '存在(being)' },
                { morpheme: '-ce', meaning: '名词后缀' }
              ],
              root: '来自拉丁语 absentia。ab- 表示"离开、远离"，ess/esse 表示"存在"。字面意思是"不在、缺席"。',
              rootExamples: ['absent (缺席的)', 'absentee (缺席者)', 'absent-minded (心不在焉的)'],
              example: 'His absence from the meeting was noticed.',
              example_translation: '他缺席会议被注意到了。',
              example_context: '商务会议或正式场合',
              moreExamples: [
                { sentence: 'In the absence of any evidence, the police had to release him.', translation: '由于缺乏任何证据，警方不得不释放他。' },
                { sentence: 'The absence of color in the painting is striking.', translation: '这幅画中色彩的缺失令人瞩目。' }
              ],
              synonyms: 'lack, missing, nonattendance, unavailability',
              antonyms: 'presence, attendance, existence',
              memoryTip: '词根记忆：ab(离开) + sence(存在) = 离开存在的状态 = 缺席',
              tags: ['高频词汇', '抽象名词', '正式用语'],
              review_count: 0,
              mastered: false,
              rating: 0
            }
          ];
        }
        this.initGame();
      } catch (error) {
        console.error('Error loading game words:', error);
        // 模拟数据
        this.gameWords = [
          {
            id: 1,
            word: 'abandon',
            phonetic: '/əˈbændən/',
            definition: 'v. 放弃，遗弃；n. 放任，狂热',
            part_of_speech: 'v./n.',
            rootParts: [
              { morpheme: 'a-', meaning: '去，向' },
              { morpheme: 'ban', meaning: '禁止' },
              { morpheme: '-don', meaning: '名词后缀' }
            ],
            root: '来自古法语 abandoner，意为"放弃、交出"。a- 表示"去"，ban 表示"禁令、控制"，字面意思是"置于他人的控制之下"，引申为"放弃"。',
            rootExamples: ['abandoned (被遗弃的)', 'abandonment (放弃，遗弃)'],
            example: 'The captain gave order to abandon ship.',
            example_translation: '船长下令弃船。',
            example_context: '航海场景，紧急情况下船长做出的决定',
            moreExamples: [
              { sentence: 'They had to abandon their car in the snow.', translation: '他们不得不把汽车弃置在雪中。' },
              { sentence: 'The project was abandoned due to lack of funding.', translation: '由于缺乏资金，该项目被放弃了。' }
            ],
            synonyms: 'desert, leave, give up, forsake',
            antonyms: 'keep, retain, continue',
            memoryTip: '联想记忆：a(一个) + band(乐队) + on(在...上) → 一个乐队在台上表演不好，被观众要求放弃',
            tags: ['高频词汇', '动词', '消极含义'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 2,
            word: 'ability',
            phonetic: '/əˈbɪləti/',
            definition: 'n. 能力，才能；本领',
            part_of_speech: 'n.',
            rootParts: [
              { morpheme: 'abil', meaning: '能够' },
              { morpheme: '-ity', meaning: '名词后缀，表性质' }
            ],
            root: '来自拉丁语 habilitas，意为"适合、能力"。able 表示"能够的"，-ity 是名词后缀，表示"性质、状态"。',
            rootExamples: ['able (能够的)', 'disable (使无能)', 'capability (能力)'],
            example: 'She has the ability to solve complex problems.',
            example_translation: '她有解决复杂问题的能力。',
            example_context: '工作面试或能力评估场景',
            moreExamples: [
              { sentence: 'Musical ability often runs in families.', translation: '音乐才能常有遗传性。' },
              { sentence: 'The test measures your mathematical ability.', translation: '这项测试衡量你的数学能力。' }
            ],
            synonyms: 'capability, skill, talent, competence',
            antonyms: 'inability, disability, incompetence',
            memoryTip: '词根记忆：able(能够) + ity(名词后缀) = 能够做某事的性质 = 能力',
            tags: ['高频词汇', '抽象名词', '积极含义'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 3,
            word: 'abnormal',
            phonetic: '/æbˈnɔːrml/',
            definition: 'adj. 反常的，异常的；变态的',
            part_of_speech: 'adj.',
            rootParts: [
              { morpheme: 'ab-', meaning: '离开，偏离' },
              { morpheme: 'norm', meaning: '标准，规范' },
              { morpheme: '-al', meaning: '形容词后缀' }
            ],
            root: '来自拉丁语 abnormalis。ab- 表示"离开、偏离"，norm 表示"标准、规范"，-al 是形容词后缀。字面意思是"偏离标准的"。',
            rootExamples: ['normal (正常的)', 'abnormality (异常)', 'normalize (使正常化)'],
            example: 'The weather has been abnormal this summer.',
            example_translation: '今年夏天的天气反常。',
            example_context: '描述气候或自然现象的异常情况',
            moreExamples: [
              { sentence: 'Tests revealed an abnormal level of cholesterol in his blood.', translation: '检测显示他血液中的胆固醇含量异常。' },
              { sentence: 'It is abnormal for a child to be so quiet.', translation: '孩子这么安静是不正常的。' }
            ],
            synonyms: 'unusual, irregular, strange, anomalous',
            antonyms: 'normal, regular, usual, typical',
            memoryTip: '词根记忆：ab(离开) + normal(正常的) = 离开正常的 = 反常的',
            tags: ['高频词汇', '形容词', '描述性'],
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 4,
            word: 'aboard',
            phonetic: '/əˈbɔːrd/',
            definition: 'prep. 在船(车、飞机)上',
            part_of_speech: 'prep.',
            root: 'a-(在) + board(板) = 在板子上 = 在船上',
            example: 'Welcome aboard the flight to London.',
            example_translation: '欢迎乘坐飞往伦敦的航班。',
            synonyms: 'on board, on ship',
            review_count: 0,
            mastered: false,
            rating: 0
          },
          {
            id: 5,
            word: 'absence',
            phonetic: '/ˈæbsəns/',
            definition: 'n. 缺席，不在',
            part_of_speech: 'n.',
            root: 'ab-(离开) + sence(存在) = 离开存在 = 缺席',
            example: 'His absence from the meeting was noticed.',
            example_translation: '他缺席会议被注意到了。',
            synonyms: 'lack, missing, nonattendance',
            review_count: 0,
            mastered: false,
            rating: 0
          }
        ];
        this.initGame();
      }
    },
    initGame() {
      switch (this.currentGameMode) {
        case 'fill':
          this.initFillGame();
          break;
        case 'choice':
          this.initChoiceGame();
          break;
        case 'match':
          this.initMatchGame();
          break;
        case 'spell':
          this.initSpellGame();
          break;
        case 'shoot':
          this.initShootGame();
          break;
      }
    },
    initFillGame() {
      // 填空游戏初始化
      this.gameState = {
        currentIndex: 0,
        score: 0,
        maxScore: this.gameWords.length
      };
      this.currentGameWord = this.gameWords[0];
      // 生成填空
      const word = this.currentGameWord.word;
      const blankIndex = Math.floor(Math.random() * word.length);
      this.fillWord = word.split('');
      this.blankIndex = blankIndex;
      this.fillWord[blankIndex] = '_';
      this.fillWord = this.fillWord.join('');
      this.userInput = '';
    },
    initChoiceGame() {
      // 选择游戏初始化
      this.gameState = {
        currentIndex: 0,
        score: 0,
        maxScore: this.gameWords.length
      };
      this.currentGameWord = this.gameWords[0];
      // 生成选项
      this.choices = [this.currentGameWord.definition];
      // 添加干扰选项
      for (let i = 0; i < 3; i++) {
        const randomWord = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
        if (!this.choices.includes(randomWord.definition)) {
          this.choices.push(randomWord.definition);
        }
      }
      // 打乱选项
      this.choices.sort(() => Math.random() - 0.5);
    },
    initMatchGame() {
      // 配对游戏初始化
      this.gameState = {
        score: 0,
        maxScore: this.gameWords.length,
        matchedPairs: 0
      };
      // 创建配对卡片
      this.matchCards = [];
      this.gameWords.forEach(word => {
        this.matchCards.push({ id: word.id, content: word.word, type: 'word', matched: false });
        this.matchCards.push({ id: word.id + 1000, content: word.definition, type: 'definition', matched: false });
      });
      // 打乱卡片
      this.matchCards.sort(() => Math.random() - 0.5);
      this.selectedCards = [];
    },
    initSpellGame() {
      // 拼写游戏初始化
      this.gameState = {
        currentIndex: 0,
        score: 0,
        maxScore: this.gameWords.length
      };
      this.currentGameWord = this.gameWords[0];
      this.userInput = '';
    },
    initShootGame() {
      // 射击游戏初始化
      this.gameState = {
        score: 0,
        timeLeft: 60,
        targets: []
      };
      this.spawnTargets();
      this.shootGameInterval = setInterval(() => {
        this.gameState.timeLeft--;
        if (this.gameState.timeLeft <= 0) {
          clearInterval(this.shootGameInterval);
          this.endShootGame();
        }
        this.moveTargets();
      }, 1000);
    },
    spawnTargets() {
      // 生成目标
      this.gameState.targets = [];
      for (let i = 0; i < 5; i++) {
        const randomWord = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
        this.gameState.targets.push({
          id: i,
          word: randomWord.word,
          definition: randomWord.definition,
          x: Math.random() * 80 + 10,
          y: 0,
          speed: Math.random() * 2 + 1
        });
      }
    },
    moveTargets() {
      // 移动目标
      this.gameState.targets = this.gameState.targets.map(target => ({
        ...target,
        y: target.y + target.speed
      })).filter(target => target.y < 100);
      // 生成新目标
      if (this.gameState.targets.length < 5) {
        const randomWord = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
        this.gameState.targets.push({
          id: Date.now(),
          word: randomWord.word,
          definition: randomWord.definition,
          x: Math.random() * 80 + 10,
          y: 0,
          speed: Math.random() * 2 + 1
        });
      }
    },
    endShootGame() {
      // 结束射击游戏
      console.log('Shoot game ended with score:', this.gameState.score);
    },
    checkFillAnswer() {
      // 检查填空答案
      if (this.userInput.toLowerCase() === this.currentGameWord.word[this.blankIndex].toLowerCase()) {
        this.playSound('correct');
        this.gameState.score++;
        this.gameState.currentIndex++;
        if (this.gameState.currentIndex < this.gameWords.length) {
          this.currentGameWord = this.gameWords[this.gameState.currentIndex];
          const word = this.currentGameWord.word;
          const blankIndex = Math.floor(Math.random() * word.length);
          this.fillWord = word.split('');
          this.blankIndex = blankIndex;
          this.fillWord[blankIndex] = '_';
          this.fillWord = this.fillWord.join('');
          this.userInput = '';
        } else {
          this.playSound('complete');
          this.endGame();
        }
      } else {
        this.playSound('wrong');
        alert('答案错误，请重试！');
      }
    },
    checkChoiceAnswer(choice) {
      // 检查选择答案
      if (choice === this.currentGameWord.definition) {
        this.playSound('correct');
        this.gameState.score++;
      } else {
        this.playSound('wrong');
      }
      this.gameState.currentIndex++;
      if (this.gameState.currentIndex < this.gameWords.length) {
        this.currentGameWord = this.gameWords[this.gameState.currentIndex];
        this.choices = [this.currentGameWord.definition];
        for (let i = 0; i < 3; i++) {
          const randomWord = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];
          if (!this.choices.includes(randomWord.definition)) {
            this.choices.push(randomWord.definition);
          }
        }
        this.choices.sort(() => Math.random() - 0.5);
      } else {
        this.playSound('complete');
        this.endGame();
      }
    },
    selectMatchCard(card) {
      // 选择配对卡片
      if (card.matched || this.selectedCards.length >= 2) return;
      this.selectedCards.push(card);
      if (this.selectedCards.length === 2) {
        const [card1, card2] = this.selectedCards;
        if (card1.type !== card2.type && Math.abs(card1.id - card2.id) === 1000) {
          // 配对成功
          this.playSound('correct');
          card1.matched = true;
          card2.matched = true;
          this.gameState.score++;
          this.gameState.matchedPairs++;
          if (this.gameState.matchedPairs === this.gameWords.length) {
            this.playSound('complete');
            this.endGame();
          }
        } else {
          this.playSound('wrong');
        }
        // 重置选择
        setTimeout(() => {
          this.selectedCards = [];
        }, 1000);
      }
    },
    checkSpellAnswer() {
      // 检查拼写答案
      if (this.userInput.toLowerCase() === this.currentGameWord.word.toLowerCase()) {
        this.playSound('correct');
        this.gameState.score++;
      } else {
        this.playSound('wrong');
      }
      this.gameState.currentIndex++;
      if (this.gameState.currentIndex < this.gameWords.length) {
        this.currentGameWord = this.gameWords[this.gameState.currentIndex];
        this.userInput = '';
      } else {
        this.playSound('complete');
        this.endGame();
      }
    },
    shootTarget(target) {
      // 射击目标
      this.playSound('correct');
      this.gameState.score++;
      this.gameState.targets = this.gameState.targets.filter(t => t.id !== target.id);
    },
    endGame() {
      // 结束游戏
      alert(`游戏结束！得分：${this.gameState.score}/${this.gameState.maxScore}`);
      this.currentView = 'games';
    },
    // 本地存储功能
    saveProgress() {
      // 保存学习进度到localStorage
      const progressData = {
        currentLevel: this.currentLevel,
        userProgress: this.userProgress,
        wordStatus: this.wordStatus,
        levelInfo: this.levelInfo
      };
      localStorage.setItem('wordmaster_progress', JSON.stringify(progressData));
      console.log('Progress saved to localStorage');
    },
    loadSavedProgress() {
      // 从localStorage加载学习进度
      const savedData = localStorage.getItem('wordmaster_progress');
      if (savedData) {
        const progressData = JSON.parse(savedData);
        this.currentLevel = progressData.currentLevel;
        this.userProgress = progressData.userProgress;
        this.wordStatus = progressData.wordStatus;
        this.levelInfo = progressData.levelInfo;
        console.log('Progress loaded from localStorage');
      }
    },
    // 学习报告导出功能
    exportReport() {
      // 准备导出数据
      const reportData = {
        userProgress: this.userProgress,
        wordStatus: this.wordStatus,
        levelInfo: this.levelInfo,
        exportDate: new Date().toISOString()
      };
      
      // 导出为JSON文件
      this.exportAsJSON(reportData);
      
      // 导出为CSV文件
      this.exportAsCSV(reportData);
    },
    exportAsJSON(data) {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordmaster-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    exportAsCSV(data) {
      // 构建CSV内容
      let csvContent = '数据类型,值\n';
      
      // 添加用户进度数据
      csvContent += '当前关卡,' + data.userProgress.current_level + '\n';
      csvContent += '已掌握单词,' + data.userProgress.mastered_words + '\n';
      csvContent += '部分掌握单词,' + data.userProgress.partially_mastered_words + '\n';
      csvContent += '总单词数,' + data.userProgress.total_words + '\n';
      
      // 添加单词状态数据
      csvContent += '已掌握单词（详细）,' + data.wordStatus.mastered + '\n';
      csvContent += '部分掌握单词（详细）,' + data.wordStatus.partiallyMastered + '\n';
      csvContent += '未开始单词,' + data.wordStatus.notStarted + '\n';
      csvContent += '总单词数（详细）,' + data.wordStatus.total + '\n';
      
      // 添加关卡信息
      csvContent += '总关卡数,' + data.levelInfo.totalLevels + '\n';
      csvContent += '每关单词数,' + data.levelInfo.wordsPerLevel + '\n';
      csvContent += '总单词数（关卡）,' + data.levelInfo.totalWords + '\n';
      
      // 添加导出日期
      csvContent += '导出日期,' + data.exportDate + '\n';
      
      // 创建并下载CSV文件
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wordmaster-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    // 自定义单词库导入功能
    importWordList(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wordList = JSON.parse(e.target.result);
          // 这里可以添加导入单词库的逻辑
          console.log('Word list imported:', wordList);
          alert('单词库导入成功！');
        } catch (error) {
          console.error('Error importing word list:', error);
          alert('单词库导入失败，请检查文件格式！');
        }
      };
      reader.readAsText(file);
    },
    resetProgress() {
      if (confirm('确定要重置所有学习进度吗？这将清除所有已掌握的单词记录。')) {
        // 重置关卡和进度数据
        this.currentLevel = 1;
        this.currentWordIndex = 0;
        this.showDetails = false;
        
        // 重置用户进度
        this.userProgress = {
          current_level: 1,
          mastered_words: 0,
          partially_mastered_words: 0,
          total_words: 4500
        };
        
        // 重置单词状态
        this.wordStatus = {
          total: 4500,
          mastered: 0,
          partiallyMastered: 0,
          notStarted: 4500
        };
        
        // 清除localStorage中的数据
        localStorage.removeItem('wordmaster_progress');
        
        // 重新加载单词
        this.loadWords();
        this.loadProgress();
        
        alert('进度已重置！');
      }
    }
  }
}).mount('#app');