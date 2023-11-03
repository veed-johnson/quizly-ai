import { IQuizSchema, addMultipleQuiz } from "./db/Quiz";

export type QuizWithoutDateStatus = Omit<IQuizSchema, "date" | "status">;

//expected response format from chatgpt
const RESPONSE_FORMAT = [
  {
    categories:
      "should be an array of the 3 categories that have been selected. e.g. [sports, history, music]",
    questionsList: [
      {
        category: "category1",
        questions: [
          {
            question: "...",
            clue: "...",
            answer: "...",
          },
        ],
      },
      {
        category: "category2",
        questions: [
          {
            question: "...",
            clue: "...",
            answer: "...",
          },
        ],
      },
      {
        category: "category3",
        questions: [
          {
            question: "...",
            clue: "...",
            answer: "...",
          },
        ],
      },
    ],
  },
];

export const DUMMY_QUESTIONS = [
  {
    categories: ["music", "geography", "sports"],
    questionsList: [
      {
        category: "music",
        questions: [
          {
            question:
              "Which iconic British rock band released the album 'The Wall' in 1979?",
            clue: "Hint: The album features classics like 'Comfortably Numb.'",
            answer: "Pink Floyd",
          },
          {
            question:
              "Who is known for the hit song 'Like a Rolling Stone' and was a key figure in the folk rock movement?",
            clue: "Hint: He went electric at the Newport Folk Festival.",
            answer: "Bob Dylan",
          },
          {
            question:
              "In what decade did the disco music genre rise to prominence?",
            clue: "Hint: It was a time of funky dance music and disco balls.",
            answer: "1970s",
          },
        ],
      },
      {
        category: "geography",
        questions: [
          {
            question: "What is the largest country by land area in the world?",
            clue: "Hint: It spans two continents and has diverse landscapes.",
            answer: "Russia",
          },
          {
            question:
              "Which African country is known as the 'Pearl of Africa'?",
            clue: "Hint: It's famous for its wildlife and natural beauty.",
            answer: "Uganda",
          },
          {
            question: "What is the capital city of Japan?",
            clue: "Hint: It's a bustling metropolis with a mix of tradition and modernity.",
            answer: "Tokyo",
          },
        ],
      },
      {
        category: "sports",
        questions: [
          {
            question:
              "Which tennis player holds the record for the most Grand Slam titles in history?",
            clue: "Hint: He's a Swiss player known for his versatility.",
            answer: "Roger Federer",
          },
          {
            question: "In which sport would you perform a slam dunk?",
            clue: "Hint: It's a high-flying move in a popular team sport.",
            answer: "Basketball",
          },
          {
            question: "Which country hosted the 2016 Summer Olympics?",
            clue: "Hint: It's known for its samba and Carnival.",
            answer: "Brazil",
          },
        ],
      },
    ],
  },
  {
    categories: ["geography", "movies", "history"],
    questionsList: [
      {
        category: "geography",
        questions: [
          {
            question:
              "Which desert is known as the 'Atacama Desert' and is located in South America?",
            clue: "Hint: It's one of the driest places on Earth.",
            answer: "Atacama Desert",
          },
          {
            question: "What is the longest river in Europe?",
            clue: "Hint: It flows through multiple European countries.",
            answer: "Danube River",
          },
          {
            question: "Which African country is known as the 'Rainbow Nation'?",
            clue: "Hint: It overcame apartheid and embraced diversity.",
            answer: "South Africa",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question:
              "Who played the iconic role of Jack in the film 'Titanic'?",
            clue: "Hint: He's known for his 'king of the world' line.",
            answer: "Leonardo DiCaprio",
          },
          {
            question:
              "In 'Star Wars,' what is the name of Han Solo's Wookiee co-pilot and loyal friend?",
            clue: "Hint: He's known for his strength and loyalty.",
            answer: "Chewbacca",
          },
          {
            question:
              "Which film tells the story of a young lion named Simba and his journey to become king?",
            clue: "Hint: It's an animated Disney classic.",
            answer: "The Lion King",
          },
        ],
      },
      {
        category: "history",
        questions: [
          {
            question:
              "Who was the first woman to fly solo across the Atlantic Ocean?",
            clue: "Hint: She mysteriously disappeared during a later flight.",
            answer: "Amelia Earhart",
          },
          {
            question:
              "In what year did the Berlin Wall fall, leading to the reunification of Germany?",
            clue: "Hint: A significant event in the late 20th century.",
            answer: "1989",
          },
          {
            question:
              "Who served as the first President of the United States under the Articles of Confederation?",
            clue: "Hint: He was a Revolutionary War hero.",
            answer: "John Hanson",
          },
        ],
      },
    ],
  },
  {
    categories: ["movies", "music", "sports"],
    questionsList: [
      {
        category: "movies",
        questions: [
          {
            question:
              "Which film features a character named Forrest Gump and his iconic box of chocolates?",
            clue: "Hint: 'Life is like a box of chocolates.'",
            answer: "Forrest Gump",
          },
          {
            question:
              "Who directed the epic fantasy film 'The Lord of the Rings: The Fellowship of the Ring'?",
            clue: "Hint: He's known for bringing Middle-earth to life.",
            answer: "Peter Jackson",
          },
          {
            question:
              "In the movie 'Jurassic Park,' what type of creatures are brought back to life through genetic engineering?",
            clue: "Hint: They're known for their prehistoric origins.",
            answer: "Dinosaurs",
          },
        ],
      },
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known for the hit song 'Like a Rolling Stone' and was a key figure in the folk rock movement?",
            clue: "Hint: He went electric at the Newport Folk Festival.",
            answer: "Bob Dylan",
          },
          {
            question:
              "Which British rock band is known for their hit song 'Bohemian Rhapsody'?",
            clue: "Hint: The lead vocalist was Freddie Mercury.",
            answer: "Queen",
          },
          {
            question: "What is the national musical instrument of Scotland?",
            clue: "Hint: It's often associated with kilts and bagpipes.",
            answer: "Bagpipes",
          },
        ],
      },
      {
        category: "sports",
        questions: [
          {
            question:
              "Who holds the record for the most goals scored in a single NHL season?",
            clue: "Hint: He's known as 'The Great One.'",
            answer: "Wayne Gretzky",
          },
          {
            question: "In which sport would you use a shuttlecock?",
            clue: "Hint: It's a fast-paced racquet sport.",
            answer: "Badminton",
          },
          {
            question:
              "What is the diameter of a standard basketball hoop in inches?",
            clue: "Hint: It's also the number of NBA teams in a full league.",
            answer: "18 inches",
          },
        ],
      },
    ],
  },
  {
    categories: ["history", "geography", "science"],
    questionsList: [
      {
        category: "history",
        questions: [
          {
            question:
              "Who was the first woman to fly solo nonstop across the Atlantic Ocean?",
            clue: "Hint: She mysteriously disappeared during a later flight.",
            answer: "Amelia Earhart",
          },
          {
            question:
              "In what year did the Battle of Gettysburg take place during the American Civil War?",
            clue: "Hint: A significant battle on U.S. soil.",
            answer: "1863",
          },
          {
            question:
              "Who was the 16th President of the United States and known for his role in abolishing slavery?",
            clue: "Hint: He delivered the Gettysburg Address.",
            answer: "Abraham Lincoln",
          },
        ],
      },
      {
        category: "geography",
        questions: [
          {
            question:
              "Which European country is known as the 'Land of a Thousand Lakes'?",
            clue: "Hint: It's located in Northern Europe.",
            answer: "Finland",
          },
          {
            question:
              "What is the longest river in Asia and third longest in the world?",
            clue: "Hint: It flows through China and multiple other countries.",
            answer: "Yangtze River",
          },
          {
            question:
              "What African river is known for its annual flooding and fertile soil deposits?",
            clue: "Hint: It's often called the 'Gift of the Nile.'",
            answer: "Nile River",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question:
              "What is the chemical symbol for silver on the periodic table?",
            clue: "Hint: It's a valuable and shiny metal.",
            answer: "Ag",
          },
          {
            question:
              "Who is known for formulating the theory of general relativity?",
            clue: "Hint: He's famous for the equation E=mc².",
            answer: "Albert Einstein",
          },
          {
            question:
              "What is the Earth's outermost layer, consisting of solid rock?",
            clue: "Hint: It's where we live and build.",
            answer: "Lithosphere",
          },
        ],
      },
    ],
  },
  {
    categories: ["sports", "movies", "music"],
    questionsList: [
      {
        category: "sports",
        questions: [
          {
            question:
              "Which country won the most gold medals in the 2016 Summer Olympics in Rio de Janeiro?",
            clue: "Hint: They dominated in gymnastics and swimming.",
            answer: "United States",
          },
          {
            question: "In which sport would you perform a slam dunk?",
            clue: "Hint: It's all about shooting hoops.",
            answer: "Basketball",
          },
          {
            question:
              "Who is known for breaking the 'Four-Minute Mile' barrier in track and field?",
            clue: "Hint: He's a legendary British athlete.",
            answer: "Roger Bannister",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question:
              "What 1982 science fiction film directed by Steven Spielberg features an alien named E.T.?",
            clue: "Hint: 'E.T. phone home.'",
            answer: "E.T. the Extra-Terrestrial",
          },
          {
            question:
              "Who played the character of Katniss Everdeen in 'The Hunger Games' film series?",
            clue: "Hint: She's an Academy Award-winning actress.",
            answer: "Jennifer Lawrence",
          },
          {
            question:
              "In 'The Wizard of Oz,' what is the color of the magical slippers worn by Dorothy?",
            clue: "Hint: They are associated with a famous phrase.",
            answer: "Ruby Red",
          },
        ],
      },
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known for the song 'Shape of You' and the album '÷'?",
            clue: "Hint: He's a popular British singer-songwriter.",
            answer: "Ed Sheeran",
          },
          {
            question:
              "Which legendary guitarist was known for 'The Star-Spangled Banner' at Woodstock?",
            clue: "Hint: He was famous for his electric guitar skills.",
            answer: "Jimi Hendrix",
          },
          {
            question:
              "What musical genre is characterized by its origins in African American communities and a strong rhythm section?",
            clue: "Hint: It's the basis for many contemporary music styles.",
            answer: "Rhythm and Blues (R&B)",
          },
        ],
      },
    ],
  },
  {
    categories: ["geography", "science", "history"],
    questionsList: [
      {
        category: "geography",
        questions: [
          {
            question: "Which U.S. state is known as the 'Sunshine State'?",
            clue: "Hint: It's famous for its citrus fruits and beaches.",
            answer: "Florida",
          },
          {
            question: "What is the largest planet in our solar system?",
            clue: "Hint: It's a gas giant with a famous great red spot.",
            answer: "Jupiter",
          },
          {
            question:
              "Which Asian river is known as the 'Yellow River' due to the color of its sediment?",
            clue: "Hint: It's historically significant in China.",
            answer: "Huang He (Yellow River)",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question:
              "What is the chemical symbol for oxygen on the periodic table?",
            clue: "Hint: It's essential for respiration.",
            answer: "O",
          },
          {
            question:
              "Who is known for his laws of motion and universal gravitation?",
            clue: "Hint: An apple's fall led to a revelation.",
            answer: "Isaac Newton",
          },
          {
            question: "What is the densest planet in our solar system?",
            clue: "Hint: It's known for its ring system.",
            answer: "Saturn",
          },
        ],
      },
      {
        category: "history",
        questions: [
          {
            question:
              "Which ancient civilization built the Great Wall of China?",
            clue: "Hint: It's a monumental architectural achievement.",
            answer: "Ancient China",
          },
          {
            question:
              "In what year did the United States declare its independence from Britain?",
            clue: "Hint: The Fourth of July is celebrated as Independence Day.",
            answer: "1776",
          },
          {
            question:
              "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
            clue: "Hint: He had a tense standoff with the United States.",
            answer: "Nikita Khrushchev",
          },
        ],
      },
    ],
  },
  {
    categories: ["music", "movies", "geography"],
    questionsList: [
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known for the hit songs 'Billie Jean' and 'Thriller'?",
            clue: "Hint: He's the 'King of Pop.'",
            answer: "Michael Jackson",
          },
          {
            question:
              "Which British rock band released the album 'Dark Side of the Moon'?",
            clue: "Hint: It's one of the best-selling albums of all time.",
            answer: "Pink Floyd",
          },
          {
            question: "What is the national musical instrument of Japan?",
            clue: "Hint: It's a stringed instrument known for its soothing sound.",
            answer: "Koto",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question:
              "In the film 'The Silence of the Lambs,' who plays the character Hannibal Lecter?",
            clue: "Hint: He's an Oscar-winning actor known for his iconic portrayal.",
            answer: "Anthony Hopkins",
          },
          {
            question:
              "Which animated movie features a young lion named Simba and his journey to become king?",
            clue: "Hint: It's a Disney classic with memorable songs.",
            answer: "The Lion King",
          },
          {
            question: "Who directed the fantasy film 'Pan's Labyrinth'?",
            clue: "Hint: He's known for his visually stunning and dark storytelling.",
            answer: "Guillermo del Toro",
          },
        ],
      },
      {
        category: "geography",
        questions: [
          {
            question:
              "Which African country is known as the 'Land of a Thousand Hills'?",
            clue: "Hint: It's famous for its lush and hilly terrain.",
            answer: "Rwanda",
          },
          {
            question: "What is the world's largest ocean?",
            clue: "Hint: It covers about one-third of the Earth's surface.",
            answer: "Pacific Ocean",
          },
          {
            question: "Which European city is known as the 'City of Bridges'?",
            clue: "Hint: It's famous for its picturesque waterways and architecture.",
            answer: "Venice",
          },
        ],
      },
    ],
  },
  {
    categories: ["music", "movies", "science"],
    questionsList: [
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known for the hit song 'Bohemian Rhapsody' and was the lead vocalist of Queen?",
            clue: "Hint: He had an unforgettable Live Aid performance.",
            answer: "Freddie Mercury",
          },
          {
            question:
              "Which American singer-songwriter is known for the album 'Born to Die' and the song 'Video Games'?",
            clue: "Hint: She's known for her unique style and lyrics.",
            answer: "Lana Del Rey",
          },
          {
            question:
              "What musical instrument has black and white keys and is commonly associated with classical music?",
            clue: "Hint: It's also known as the 'piano.'",
            answer: "Keyboard",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question:
              "Who directed the science fiction film 'Inception' and is known for mind-bending storytelling?",
            clue: "Hint: He's the master of dreams within dreams.",
            answer: "Christopher Nolan",
          },
          {
            question:
              "What is the name of the fictional African country in the Marvel Cinematic Universe's 'Black Panther'?",
            clue: "Hint: It's a technologically advanced and hidden nation.",
            answer: "Wakanda",
          },
          {
            question:
              "In the film 'The Shawshank Redemption,' what is the name of the prison where the story takes place?",
            clue: "Hint: It's a place of hope and redemption.",
            answer: "Shawshank State Penitentiary",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question:
              "What is the largest planet in our solar system and known for its colorful bands of clouds?",
            clue: "Hint: It's a gas giant with a Great Red Spot.",
            answer: "Jupiter",
          },
          {
            question:
              "Who is known for his theory of relativity and the equation E=mc²?",
            clue: "Hint: He's synonymous with genius.",
            answer: "Albert Einstein",
          },
          {
            question:
              "What gas do plants absorb from the atmosphere during photosynthesis?",
            clue: "Hint: It's essential for plant growth and is released as oxygen.",
            answer: "Carbon Dioxide (CO2)",
          },
        ],
      },
    ],
  },
  {
    categories: ["history", "movies", "sports"],
    questionsList: [
      {
        category: "history",
        questions: [
          {
            question:
              "Who was the first President of the United States and a Founding Father?",
            clue: "Hint: He's often called the 'Father of His Country.'",
            answer: "George Washington",
          },
          {
            question: "In what year did the Titanic sink on its maiden voyage?",
            clue: "Hint: It was a tragic maritime disaster.",
            answer: "1912",
          },
          {
            question:
              "What ancient empire was ruled by Julius Caesar and Augustus?",
            clue: "Hint: The Ides of March is associated with its downfall.",
            answer: "Roman Empire",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question: "What is the highest-grossing film of all time?",
            clue: "Hint: It features superheroes from the Marvel Cinematic Universe.",
            answer: "Avengers: Endgame",
          },
          {
            question:
              "Who directed the 'Pirates of the Caribbean' film series?",
            clue: "Hint: He's known for his swashbuckling adventures.",
            answer: "Gore Verbinski",
          },
          {
            question:
              "In 'The Matrix,' what color pill does Neo take to learn the truth about the matrix?",
            clue: "Hint: 'You take the blue pill, the story ends.'",
            answer: "Red",
          },
        ],
      },
      {
        category: "sports",
        questions: [
          {
            question:
              "Which country has won the most gold medals in the history of the Summer Olympics?",
            clue: "Hint: They have a strong tradition in gymnastics and swimming.",
            answer: "United States",
          },
          {
            question: "In which sport would you find a puck and a penalty box?",
            clue: "Hint: It's known for its rough and fast-paced gameplay.",
            answer: "Ice Hockey",
          },
          {
            question:
              "Who is the only boxer to win the World Heavyweight Championship three times?",
            clue: "Hint: He 'floated like a butterfly, stung like a bee.'",
            answer: "Muhammad Ali",
          },
        ],
      },
    ],
  },
  {
    categories: ["movies", "geography", "science"],
    questionsList: [
      {
        category: "movies",
        questions: [
          {
            question:
              "Which film features a character named Jack Dawson and is set aboard the RMS Titanic?",
            clue: "Hint: It's a romantic drama from 1997.",
            answer: "Titanic",
          },
          {
            question: "Who directed the science fiction film 'Inception'?",
            clue: "Hint: He's known for his mind-bending storytelling.",
            answer: "Christopher Nolan",
          },
          {
            question:
              "In the movie 'Jurassic Park,' what type of creatures do the characters encounter on the island?",
            clue: "Hint: These creatures are brought back to life through genetic engineering.",
            answer: "Dinosaurs",
          },
        ],
      },
      {
        category: "geography",
        questions: [
          {
            question: "Which continent is home to the Sahara Desert?",
            clue: "Hint: It's the largest hot desert in the world.",
            answer: "Africa",
          },
          {
            question: "What is the longest river in South America?",
            clue: "Hint: It flows through Brazil and Peru.",
            answer: "Amazon River",
          },
          {
            question: "Which city is the capital of Australia?",
            clue: "Hint: It's known for its iconic opera house and harbor bridge.",
            answer: "Sydney",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question: "What is the chemical symbol for gold?",
            clue: "Hint: It's a highly valued precious metal.",
            answer: "Au",
          },
          {
            question:
              "Who is known for formulating the theory of relativity (E=mc^2)?",
            clue: "Hint: He was a renowned physicist from Germany.",
            answer: "Albert Einstein",
          },
          {
            question:
              "What gas do plants absorb from the atmosphere during photosynthesis?",
            clue: "Hint: It's essential for plant growth and is released as oxygen.",
            answer: "Carbon Dioxide (CO2)",
          },
        ],
      },
    ],
  },
  {
    categories: ["history", "sports", "music"],
    questionsList: [
      {
        category: "history",
        questions: [
          {
            question: "What ancient civilization built the pyramids of Giza?",
            clue: "Hint: It thrived along the Nile River in North Africa.",
            answer: "Ancient Egypt",
          },
          {
            question: "Who was the first President of the United States?",
            clue: "Hint: He led the American Revolution and appears on the one-dollar bill.",
            answer: "George Washington",
          },
          {
            question:
              "In what year did Christopher Columbus first arrive in the Americas?",
            clue: "Hint: It marked the beginning of European exploration in the Americas.",
            answer: "1492",
          },
        ],
      },
      {
        category: "sports",
        questions: [
          {
            question:
              "Which country has won the most FIFA World Cup titles in men's soccer?",
            clue: "Hint: They have five championships.",
            answer: "Brazil",
          },
          {
            question: "In which sport would you find a shuttlecock?",
            clue: "Hint: It's a racquet sport played over a net.",
            answer: "Badminton",
          },
          {
            question:
              "Who holds the record for the most home runs in a single MLB season?",
            clue: "Hint: He set this record in 2001.",
            answer: "Barry Bonds",
          },
        ],
      },
      {
        category: "music",
        questions: [
          {
            question:
              "Which British rock band is known for their hit song 'Bohemian Rhapsody'?",
            clue: "Hint: The lead vocalist was Freddie Mercury.",
            answer: "Queen",
          },
          {
            question: "Who is often called the 'King of Pop'?",
            clue: "Hint: He had a Thriller album that became the best-selling of all time.",
            answer: "Michael Jackson",
          },
          {
            question:
              "Which musical instrument has black and white keys and is commonly associated with classical music?",
            clue: "Hint: It's also known as the 'piano.'",
            answer: "Keyboard",
          },
        ],
      },
    ],
  },
  {
    categories: ["geography", "movies", "science"],
    questionsList: [
      {
        category: "geography",
        questions: [
          {
            question: "Which country is both a continent and an island?",
            clue: "Hint: It's known for unique wildlife like kangaroos and koalas.",
            answer: "Australia",
          },
          {
            question: "What is the longest river in the world?",
            clue: "Hint: It flows through multiple countries in Africa.",
            answer: "Nile River",
          },
          {
            question: "Which European city is known as the 'City of Canals'?",
            clue: "Hint: It's famous for its romantic waterways.",
            answer: "Venice",
          },
        ],
      },
      {
        category: "movies",
        questions: [
          {
            question:
              "What 1994 film features a talking toy cowboy named Woody?",
            clue: "Hint: It's an animated movie by Pixar.",
            answer: "Toy Story",
          },
          {
            question: "Who directed the 'Lord of the Rings' film trilogy?",
            clue: "Hint: He's known for his epic fantasy filmmaking.",
            answer: "Peter Jackson",
          },
          {
            question:
              "What is the name of the fictional African country in 'Black Panther'?",
            clue: "Hint: It's a technologically advanced nation in the Marvel Cinematic Universe.",
            answer: "Wakanda",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question:
              "What gas do plants release into the atmosphere during photosynthesis?",
            clue: "Hint: It's essential for respiration in animals.",
            answer: "Oxygen (O2)",
          },
          {
            question:
              "Who is known for the theory of evolution by natural selection?",
            clue: "Hint: He wrote 'On the Origin of Species.'",
            answer: "Charles Darwin",
          },
          {
            question: "What is the smallest planet in our solar system?",
            clue: "Hint: It's closest to the Sun.",
            answer: "Mercury",
          },
        ],
      },
    ],
  },
  {
    categories: ["sports", "music", "history"],
    questionsList: [
      {
        category: "sports",
        questions: [
          {
            question:
              "Which country won the most gold medals in the 2020 Summer Olympics in Tokyo?",
            clue: "Hosted in 2020, this Olympic Games saw a nation dominate the medal count.",
            answer: "United States",
          },
          {
            question: "Who is the all-time leading scorer in NBA history?",
            clue: "He played for the Los Angeles Lakers and is known for his scoring prowess.",
            answer: "Kareem Abdul-Jabbar",
          },
          {
            question: "Which sport involves hitting a shuttlecock over a net?",
            clue: "This indoor sport is popular in Asia and often played with a racquet and a shuttlecock.",
            answer: "Badminton",
          },
        ],
      },
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known as the 'Queen of Pop' and has hits like 'Like a Prayer' and 'Vogue'?",
            clue: "This iconic singer has been a pop music sensation for decades.",
            answer: "Madonna",
          },
          {
            question:
              "What is the national musical instrument of India, often associated with meditation and spirituality?",
            clue: "This stringed instrument is popular in classical Indian music.",
            answer: "Sitar",
          },
          {
            question:
              "Which rock band released the album 'Abbey Road' in 1969?",
            clue: "This legendary British band is known for their iconic albums and songs.",
            answer: "The Beatles",
          },
        ],
      },
      {
        category: "history",
        questions: [
          {
            question: "Who was the first President of the United States?",
            clue: "He is often referred to as the 'Father of His Country.'",
            answer: "George Washington",
          },
          {
            question:
              "In what year did the Renaissance period begin in Europe?",
            clue: "This era marked a revival of art, culture, and learning in Europe.",
            answer: "14th century (specifically 1300s)",
          },
          {
            question:
              "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
            clue: "This Soviet leader had a tense standoff with the United States during the Cold War.",
            answer: "Nikita Khrushchev",
          },
        ],
      },
    ],
  },
  {
    categories: ["history", "music", "sports"],
    questionsList: [
      {
        category: "history",
        questions: [
          {
            question:
              "Who was the 16th President of the United States and known for his role in abolishing slavery?",
            clue: "He delivered the Gettysburg Address and led the nation during the Civil War.",
            answer: "Abraham Lincoln",
          },
          {
            question:
              "In what year did the United States declare its independence from Britain?",
            clue: "This year marks the birth of the United States as an independent nation.",
            answer: "1776",
          },
          {
            question:
              "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
            clue: "This Soviet leader had a tense standoff with the United States during the Cold War.",
            answer: "Nikita Khrushchev",
          },
        ],
      },
      {
        category: "music",
        questions: [
          {
            question:
              "Who is known for the hit song 'Like a Rolling Stone' and was a key figure in the folk rock movement?",
            clue: "This singer-songwriter's lyrics are known for their poetic depth.",
            answer: "Bob Dylan",
          },
          {
            question:
              "What British rock band is known for their hit song 'Bohemian Rhapsody'?",
            clue: "This iconic band was fronted by Freddie Mercury.",
            answer: "Queen",
          },
          {
            question: "What is the national musical instrument of Japan?",
            clue: "This traditional instrument is often used in Japanese classical music.",
            answer: "Koto",
          },
        ],
      },
      {
        category: "sports",
        questions: [
          {
            question:
              "Who is known for breaking the 'Four-Minute Mile' barrier in track and field?",
            clue: "This athlete's accomplishment was a historic milestone in sports.",
            answer: "Roger Bannister",
          },
          {
            question: "In which sport would you use a shuttlecock?",
            clue: "This indoor sport is often played with a racquet and a shuttlecock.",
            answer: "Badminton",
          },
          {
            question:
              "What is the diameter of a standard basketball hoop in inches?",
            clue: "Scoring in basketball involves getting the ball through this round target.",
            answer: "18 inches",
          },
        ],
      },
    ],
  },
  {
    categories: ["movies", "geography", "science"],
    questionsList: [
      {
        category: "movies",
        questions: [
          {
            question:
              "Who played the character of Katniss Everdeen in 'The Hunger Games' film series?",
            clue: "She portrayed the strong and resourceful heroine in the dystopian films.",
            answer: "Jennifer Lawrence",
          },
          {
            question:
              "In 'Star Wars,' what is the name of Han Solo's Wookiee co-pilot and loyal friend?",
            clue: "This character is known for his loyalty and distinctive vocalizations.",
            answer: "Chewbacca",
          },
          {
            question:
              "Which film tells the story of a young lion named Simba and his journey to become king?",
            clue: "This animated classic is set in the African savanna.",
            answer: "The Lion King",
          },
        ],
      },
      {
        category: "geography",
        questions: [
          {
            question: "What is the largest country by land area in the world?",
            clue: "This vast nation spans across Europe and Asia.",
            answer: "Russia",
          },
          {
            question:
              "What African river is known for its annual flooding and fertile soil deposits?",
            clue: "This river's floods have historically supported agriculture in the region.",
            answer: "Nile River",
          },
          {
            question:
              "Which Asian river is known as the 'Yellow River' due to the color of its sediment?",
            clue: "This river plays a crucial role in Chinese history and culture.",
            answer: "Huang He",
          },
        ],
      },
      {
        category: "science",
        questions: [
          {
            question:
              "What is the chemical symbol for silver on the periodic table?",
            clue: "This shiny metal is often used for coins, jewelry, and tableware.",
            answer: "Ag",
          },
          {
            question:
              "What is the Earth's outermost layer, consisting of solid rock?",
            clue: "It's the layer we live on and where most geological processes occur.",
            answer: "Lithosphere",
          },
          {
            question:
              "Who is known for formulating the theory of general relativity?",
            clue: "This physicist's groundbreaking theory changed our understanding of gravity.",
            answer: "Albert Einstein",
          },
        ],
      },
    ],
  },
];

export const generateQuestionsString = function (
  data: QuizWithoutDateStatus[]
): string {
  const allQuestions: string[] = [];

  data.forEach((item) => {
    item.categories.forEach((category) => {
      const questions = item.questionsList.find((q) => q.category === category);

      if (questions) {
        questions.questions.forEach((question) => {
          allQuestions.push(question.question);
        });
      }
    });
  });

  return allQuestions.join("\n");
};

const questionsToExclude = generateQuestionsString(DUMMY_QUESTIONS);

//sample prompt message
const promptMessage = `Randomly pick 3 categories out of these 6 categories: sports, music, history, geography, movies, and science. Generate 3 very engaging trivia questions each on the picked categories. Do this for 3 sets of questions. Do not include questions related to these questions here "${questionsToExclude}", Format the response as json array in the shape of ${JSON.stringify(
  RESPONSE_FORMAT
)}.
This means your JSON array will contain the 3 sets of questions`;
