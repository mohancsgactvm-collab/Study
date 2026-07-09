import { SubjectSystem } from "./types";

export const prepopulatedSubject: SubjectSystem = {
  id: "prepopulated-ds",
  course: "B.E. Computer Science & Engineering",
  subjectName: "Data Structures (தரவு அமைப்புகள்)",
  syllabusRaw: "Linear data structures - Arrays, Linked Lists, Stack, Queue. Non-linear structures - Trees, Graphs. Sorting and searching algorithms.",
  examDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 10 days from now
  studyTime: "2 hours per day",
  createdAt: new Date().toISOString(),
  analysis: {
    units: [
      {
        name: "Unit 1: Linear Data Structures (அலகு 1: நேரியல் தரவு அமைப்புகள்)",
        topics: [
          {
            name: "Arrays & Linked Lists (அணிகள் மற்றும் இணைக்கப்பட்ட பட்டியல்கள்)",
            importance: "High",
            difficulty: "Medium",
            weightagePercent: 15,
            description: "அணிகள் (Arrays) தொடர்ச்சியான நினைவகத்தைப் பயன்படுத்துகின்றன, ஆனால் இணைக்கப்பட்ட பட்டியல்கள் (Linked Lists) பாயிண்டர்களைப் பயன்படுத்துகின்றன. இது தேர்வுக்கான மிக முக்கியமான அடிப்படைக் கேள்வி."
          },
          {
            name: "Stacks & Queues (அடுக்குகள் மற்றும் வரிசைகள்)",
            importance: "High",
            difficulty: "Easy",
            weightagePercent: 15,
            description: "Stack LIFO (Last In First Out) முறையிலும், Queue FIFO (First In First Out) முறையிலும் செயல்படுகின்றன. இவற்றின் செயல்பாடுகள் மற்றும் பயன்பாடுகள் அடிக்கடி கேட்கப்படும்."
          }
        ]
      },
      {
        name: "Unit 2: Non-Linear Data Structures (அலகு 2: நேரியல் அல்லாத தரவு அமைப்புகள்)",
        topics: [
          {
            name: "Binary Trees & BST (இருபடி மரங்கள் மற்றும் தேடல் மரங்கள்)",
            importance: "High",
            difficulty: "Hard",
            weightagePercent: 20,
            description: "Binary Search Tree (BST) இல் தேடுதல் வேகம் அதிகம். மரங்களின் கடப்பு முறைகள் (Inorder, Preorder, Postorder Traversals) 5 அல்லது 10 மதிப்பெண்களில் கேட்கப்படும்."
          },
          {
            name: "Graphs & Traversals (வரைபடங்கள் மற்றும் கடப்புகள்)",
            importance: "Medium",
            difficulty: "Hard",
            weightagePercent: 15,
            description: "BFS (Breadth First Search) மற்றும் DFS (Depth First Search) அல்காரிதம்களின் வரைபடக் கடப்பு முறைகள் தேர்வில் அதிக மதிப்பெண்களுக்கு வரும்."
          }
        ]
      },
      {
        name: "Unit 3: Sorting & Searching (அலகு 3: வரிசைப்படுத்துதல் மற்றும் தேடுதல்)",
        topics: [
          {
            name: "Bubble Sort & Merge Sort (குமிழி மற்றும் இணைப்பு வரிசையாக்கம்)",
            importance: "High",
            difficulty: "Medium",
            weightagePercent: 15,
            description: "Merge Sort-இன் Divide and Conquer உத்தி மிகவும் முக்கியமானது. அல்காரிதம்களின் நேரக் சிக்கல்தன்மை (Time Complexity) பகுப்பாய்வு தேர்வு நோக்கில் அவசியம்."
          },
          {
            name: "Binary Search (இருபடி தேடல்)",
            importance: "Medium",
            difficulty: "Medium",
            weightagePercent: 20,
            description: "Binary Search வரிசைப்படுத்தப்பட்ட தரவுகளில் மட்டுமே செயல்படும். இதன் நேரக் சிக்கல்தன்மை O(log n) ஆகும்."
          }
        ]
      }
    ]
  },
  notes: [
    {
      topicName: "Arrays & Linked Lists (அணிகள் மற்றும் இணைக்கப்பட்ட பட்டியல்கள்)",
      tamilExplanation: "அணிகள் (Arrays) என்பது தொடர்ச்சியான நினைவக இடங்களில் (Contiguous Memory Locations) ஒரே வகையான தரவு கூறுகளைச் சேமிக்கும் ஒரு நேரியல் தரவு அமைப்பாகும். இதற்கு மாறாக, இணைக்கப்பட்ட பட்டியல்கள் (Linked Lists) என்பது தரவுக் கூறுகளைக் கொண்ட நோட்களின் (Nodes) தொகுப்பாகும், அங்கு ஒவ்வொரு நோடும் அடுத்த நோட்டின் நினைவக முகவரியை (Pointer/Address) சுட்டிக்காட்டும்.",
      shortNotes: [
        "Array நிலையான அளவு (Static Size) கொண்டது, Linked List மாறும் அளவு (Dynamic Size) கொண்டது.",
        "Array-இல் கூறுகளை அணுகும் நேரம் O(1), ஆனால் Linked List-இல் குறிப்பிட்ட கூறை அணுக O(n) ஆகும்.",
        "Linked List-இல் தரவைச் செருகுவது (Insertion) மற்றும் நீக்குவது (Deletion) எளிது - O(1) மட்டுமே."
      ],
      importantPoints: [
        "Array Index எப்போதும் 0 இல் தொடங்குகிறது.",
        "Linked List-இன் கடைசி நோட்டின் பாயிண்டர் Null ஆக இருக்கும்.",
        "Singly Linked List ஒரு திசையில் மட்டுமே செல்ல முடியும், Doubly Linked List இரு திசைகளிலும் செல்லலாம்."
      ],
      memoryTricks: "அணிகள் (Arrays) என்பது ஒரு தொடருந்து வண்டிப் பெட்டிகள் போன்றது, அங்கு பெட்டிகள் வரிசையாக இணைக்கப்பட்டு எண்கள் இடப்பட்டிருக்கும். இணைக்கப்பட்ட பட்டியல்கள் (Linked Lists) என்பது ஒரு 'Treasure Hunt' விளையாட்டு போன்றது, அங்கு ஒவ்வொரு துப்புச் சீட்டும் (Node) அடுத்த துப்பு இருக்கும் இடத்தை (Pointer) மட்டுமே சுட்டிக்காட்டும்!"
    },
    {
      topicName: "Stacks & Queues (அடுக்குகள் மற்றும் வரிசைகள்)",
      tamilExplanation: "அடுக்கு (Stack) என்பது கடைசியாகச் செருகப்பட்ட உறுப்பு முதலில் வெளியேறும் (LIFO - Last In First Out) என்ற முறையில் செயல்படும் ஒரு நேரியல் தரவு அமைப்பாகும். வரிசை (Queue) என்பது முதலில் செருகப்பட்ட உறுப்பு முதலில் வெளியேறும் (FIFO - First In First Out) என்ற முறையில் செயல்படும் அமைப்பாகும்.",
      shortNotes: [
        "Stack-இன் முக்கிய செயல்பாடுகள்: Push (தரவைச் சேர்த்தல்), Pop (தரவை நீக்குதல்) மற்றும் Peek (மேல் தரவைக் காட்டுதல்).",
        "Queue-இன் முக்கிய செயல்பாடுகள்: Enqueue (பின்புறம் சேர்த்தல்) மற்றும் Dequeue (முன்புறம் நீக்குதல்).",
        "Stack ஒரே ஒரு திறந்த முனையை (Top) மட்டுமே கொண்டுள்ளது. Queue இரு முனைகளைக் கொண்டுள்ளது (Front & Rear)."
      ],
      importantPoints: [
        "Stack Overflow: Stack கொள்ளளவை விட அதிகமாகத் தரவைச் சேர்க்க முயலும் போது ஏற்படும் பிழை.",
        "Stack Underflow: காலியாக உள்ள Stack-லிருந்து தரவை நீக்க முயலும் போது ஏற்படும் பிழை.",
        "Queue முக்கியமாக இயக்க முறைமைகளில் (Operating Systems) பணி அட்டவணைப்படுத்தலுக்கு (Job Scheduling) பயன்படுகிறது."
      ],
      memoryTricks: "அடுக்கு (Stack) என்பது திருமண விருந்தில் ஒன்றன் மேல் ஒன்றாக அடுக்கி வைக்கப்பட்டுள்ள உணவுக் தட்டுகள் போன்றது (கடைசியாக வைத்த தட்டைத்தான் முதலில் எடுப்போம்). வரிசை (Queue) என்பது பேருந்து நிலையக் கட்டண கவுண்டரில் மக்கள் நிற்கும் வரிசை போன்றது (முதலில் வந்தவர் முதலில் டிக்கெட் பெறுவார்)."
    },
    {
      topicName: "Binary Trees & BST (இருபடி மரங்கள் மற்றும் தேடல் மரங்கள்)",
      tamilExplanation: "மரம் (Tree) என்பது ஒரு படிநிலை தரவு அமைப்பாகும் (Hierarchical Data Structure). இருபடி மரம் (Binary Tree) என்பது ஒவ்வொரு நோடும் அதிகபட்சமாக இரண்டு குழந்தைகளைக் (Left Child and Right Child) கொண்டிருக்கக்கூடிய மரமாகும். இருபடி தேடல் மரம் (Binary Search Tree - BST) என்பது ஒரு சிறப்பு வகை இருபடி மரமாகும், இங்கு ஒரு நோடின் இடதுபுறக் குழந்தையின் மதிப்பு அந்த நோடின் மதிப்பை விடக் குறைவாகவும், வலதுபுறக் குழந்தையின் மதிப்பு அதிகமாகவும் இருக்கும்.",
      shortNotes: [
        "மரம் படிநிலைத் தரவைக் குறிக்கப் பயன்படுகிறது (கோப்பு முறைமைகள் போன்றவை).",
        "BST-இல் தேடுதல், செருகுதல், நீக்குதல் ஆகியவற்றின் சராசரி நேரச் சிக்கல்தன்மை O(log n) ஆகும்.",
        "மரக் கடப்பு முறைகள் (Traversals) மூன்று வகைப்படும்: Inorder (இடது, வேர், வலது), Preorder (வேர், இடது, வலது), Postorder (இடது, வலது, வேர்)."
      ],
      importantPoints: [
        "BST-இல் Inorder கடப்பைச் செய்யும் போது எண்கள் ஏறுவரிசையில் (Sorted Order) கிடைக்கும்.",
        "மரத்தின் மிக உயர்ந்த நோடு 'Root' (வேர் நோடு) எனப்படும்.",
        "குழந்தைகள் இல்லாத நோடுகள் 'Leaves' (இலை நோடுகள்) எனப்படும்."
      ],
      memoryTricks: "ஒரு நிறுவனத்தின் மேலாண்மைப் படிநிலையை (Organizational Hierarchy) நினைவில் கொள்ளுங்கள்: CEO (Root) மேலே இருக்கிறார், அவருக்குக் கீழ் இரண்டு மேலாளர்கள் (Left & Right Children), அவர்களுக்குக் கீழ் பணியாளர்கள் (Leaves) இருக்கிறார்கள்!"
    }
  ],
  questions: {
    twoMarks: [
      {
        question: "What is Time Complexity? (நேரச் சிக்கல்தன்மை என்றால் என்ன?)",
        answerTamil: "நேரச் சிக்கல்தன்மை (Time Complexity) என்பது ஒரு அல்காரிதம் அதன் உள்ளீட்டு அளவைப் (Input Size - n) பொறுத்து இயங்குவதற்கு எடுத்துக்கொள்ளும் நேரத்தைக் குறிக்கும் கணக்கீட்டு அளவீடாகும். இது பொதுவாக பிக்-ஓ குறியீட்டில் (Big-O Notation) குறிக்கப்படுகிறது."
      },
      {
        question: "Differentiate between LIFO and FIFO. (LIFO மற்றும் FIFO வேறுபடுத்துக.)",
        answerTamil: "LIFO (Last In First Out) என்பது கடைசியாகச் சேர்க்கப்படும் உறுப்பு முதலில் நீக்கப்படும் முறையாகும்; இது Stack-ல் பயன்படுகிறது. FIFO (First In First Out) என்பது முதலில் சேர்க்கப்படும் உறுப்பு முதலில் நீக்கப்படும் முறையாகும்; இது Queue-ல் பயன்படுகிறது."
      }
    ],
    fiveMarks: [
      {
        question: "Explain the operations of Stack with neat diagrams. (அடுக்கின் (Stack) செயல்பாடுகளைப் படங்களுடன் விளக்குக.)",
        answerTamil: "Stack-ல் இரண்டு முக்கிய செயல்பாடுகள் உள்ளன:\n\n1. **Push Operation (தரவைச் சேர்த்தல்)**: Stack-ன் மேல் பகுதியில் (Top) ஒரு புதிய உறுப்பைச் சேர்ப்பதாகும். இதைப் படம் மூலம் விளக்கும்போது, அடுக்குத் தட்டுகளின் மேல் தட்டு வைப்பது போல் வரைய வேண்டும்.\n\n2. **Pop Operation (தரவை நீக்குதல்)**: Stack-ன் மேல் பகுதியில் இருக்கும் உறுப்பை வெளியே எடுப்பதாகும். படம் மூலம் மேல் தட்டை நீக்குவதைக் காட்ட வேண்டும்.\n\n3. **Peek/Top Operation**: Stack-லிருந்து உறுப்பை நீக்காமல், மேல் உள்ள உறுப்பின் மதிப்பை மட்டும் பார்ப்பதாகும்.\n\nStack-ன் செயல்பாடு LIFO (Last In First Out) முறையைப் பின்பற்றுகிறது. இதன் அனைத்துச் செயல்பாடுகளும் O(1) நேரச் சிக்கல்தன்மையைக் கொண்டுள்ளன."
      },
      {
        question: "Explain Binary Search Tree (BST) insertion with an example. (இருபடி தேடல் மரத்தில் (BST) உறுப்பைச் செருகுவதை உதாரணத்துடன் விளக்குக.)",
        answerTamil: "BST-இல் ஒரு உறுப்பைச் செருகும்போது பின்வரும் விதிகள் பின்பற்றப்படுகின்றன:\n\n1. மரம் காலியாக இருந்தால், புதிய உறுப்பை Root நோடாக மாற்றவும்.\n2. புதிய உறுப்பு Root-ஐ விடக் குறைவாக இருந்தால், இடது புறத் துணை மரத்திற்குச் (Left Subtree) செல்லவும்.\n3. புதிய உறுப்பு Root-ஐ விட அதிகமாக இருந்தால், வலது புறத் துணை மரத்திற்குச் (Right Subtree) செல்லவும்.\n\n**உதாரணம்**: 50, 30, 70, 20, 40 ஆகிய எண்களைச் செருகும் முறை:\n- முதலில் 50 தான் Root.\n- 30 என்பது 50-ஐ விடக் குறைவு என்பதால் 50-க்கு இடதுபுறம் செல்லும்.\n- 70 என்பது 50-ஐ விட அதிகம் என்பதால் 50-க்கு வலதுபுறம் செல்லும்.\n- 20 என்பது 50 மற்றும் 30-ஐ விடக் குறைவு என்பதால் 30-க்கு இடதுபுறம் செல்லும்."
      }
    ],
    tenMarks: [
      {
        question: "Detail the differences between Sequential Access and Random Access data structures. (வரிசைமுறை அணுகல் மற்றும் சீரற்ற அணுகல் தரவு அமைப்புகளை விரிவாக வேறுபடுத்துக.)",
        answerTamil: "இந்த இரண்டு அணுகல் முறைகளுக்கும் இடையிலான முக்கிய வேறுபாடுகள்:\n\n1. **நினைவக ஒதுக்கீடு (Memory Allocation)**:\n   - **Sequential (Linked List)**: நினைவகம் சிதறி இருக்கும் (Non-contiguous memory allocation). நோடுகள் பாயிண்டர்கள் மூலம் இணைக்கப்படுகின்றன.\n   - **Random (Array)**: நினைவகம் தொடர்ச்சியாக ஒதுக்கப்படுகிறது (Contiguous memory allocation).\n\n2. **தரவு அணுகல் வேகம் (Data Access Speed)**:\n   - **Sequential**: ஒரு குறிப்பிட்ட உறுப்பை அணுக வேண்டுமெனில், ஆரம்ப நோடிலிருந்து வரிசையாகக் கடந்துதான் செல்ல முடியும். நேரக் சிக்கல்தன்மை O(n) ஆகும்.\n   - **Random**: குறியீட்டு எண் (Index) மூலம் எந்தவொரு உறுப்பையும் நேரடியாக அணுகலாம். நேரக் சிக்கல்தன்மை O(1) ஆகும்.\n\n3. **நினைவக விரயம் (Memory Overhead)**:\n   - **Sequential**: ஒவ்வொரு நோடும் தரவோடு சேர்த்து முகவரியைச் சேமிக்க பாயிண்டரைக் கொண்டிருப்பதால் கூடுதல் நினைவகம் தேவைப்படும்.\n   - **Random**: பாயிண்டர்கள் இல்லாததால் கூடுதல் நினைவகம் தேவையில்லை, ஆனால் நிலையான அளவு என்பதால் பயன்படுத்தாத இடங்கள் வீணாகும்.\n\n4. **செருகுதல் மற்றும் நீக்குதல் செயல்பாடு (Insertion and Deletion)**:\n   - **Sequential**: பாயிண்டர்களை மாற்றுவதன் மூலம் மிக எளிதாகவும் வேகமாகவும் செய்யலாம் - O(1).\n   - **Random**: உறுப்புகளை நகர்த்த (Shifting) வேண்டியிருப்பதால் மெதுவாக நடக்கும் - O(n)."
      }
    ],
    mcqs: [
      {
        question: "Which data structure is based on LIFO principle? (எந்த தரவு அமைப்பு LIFO கொள்கையின் அடிப்படையில் செயல்படுகிறது?)",
        options: [
          "Queue (வரிசை)",
          "Stack (அடுக்கு)",
          "Linked List (இணைக்கப்பட்ட பட்டியல்)",
          "Binary Tree (இருபடி மரம்)"
        ],
        correctAnswerIndex: 1,
        explanation: "Stack (அடுக்கு) மட்டுமே LIFO (Last In First Out - கடைசியாக வந்தது முதலில் வெளியேறும்) கொள்கையைப் பின்பற்றுகிறது."
      },
      {
        question: "What is the worst-case time complexity of Binary Search? (இருபடி தேடலின் மோசமான நேரச் சிக்கல்தன்மை என்ன?)",
        options: [
          "O(1)",
          "O(n)",
          "O(log n)",
          "O(n log n)"
        ],
        correctAnswerIndex: 2,
        explanation: "இருபடி தேடல் (Binary Search) ஒவ்வொரு முறையும் தேடல் பகுதியை பாதியாகக் குறைக்கிறது, எனவே மோசமான நேரச் சிக்கல்தன்மை O(log n) ஆகும்."
      },
      {
        question: "In which tree traversal is the root node visited first? (எந்த மரக் கடப்பு முறையில் வேர் நோடு முதலில் பார்வையிடப்படுகிறது?)",
        options: [
          "Inorder Traversal (உள்வரிசை கடப்பு)",
          "Postorder Traversal (பின்வரிசை கடப்பு)",
          "Preorder Traversal (முன்வரிசை கடப்பு)",
          "Levelorder Traversal (நிலைவரிசை கடப்பு)"
        ],
        correctAnswerIndex: 2,
        explanation: "Preorder (முன்வரிசை) கடப்பு முறையில் முதலில் வேர் (Root), பின்னர் இடது (Left), இறுதியாக வலது (Right) துணை மரங்கள் கடக்கப்படுகின்றன."
      }
    ]
  },
  studyPlan: {
    dailySchedule: [
      {
        dayNumber: 1,
        dateString: "Day 1",
        topicsToCover: ["Arrays & Linked Lists (அணிகள் மற்றும் இணைக்கப்பட்ட பட்டியல்கள்)"],
        studyDurationHours: 2,
        focusTips: "அணிகள் மற்றும் இணைக்கப்பட்ட பட்டியல்களின் நினைவக வேறுபாடுகளைப் புரிந்து படியுங்கள். ஒரு Singly Linked List நோடின் அமைப்பை வரைந்து பழகுங்கள்."
      },
      {
        dayNumber: 2,
        dateString: "Day 2",
        topicsToCover: ["Stacks & Queues (அடுக்குகள் மற்றும் வரிசைகள்)"],
        studyDurationHours: 2,
        focusTips: "Stack-ன் Push/Pop மற்றும் Queue-ன் Enqueue/Dequeue செயல்பாடுகளுக்குப் படங்களை வரைந்து பாருங்கள். நிஜ வாழ்க்கை உதாரணங்களை நினைவில் கொள்ளுங்கள்."
      },
      {
        dayNumber: 3,
        dateString: "Day 3",
        topicsToCover: ["Binary Trees & BST (இருபடி மரங்கள் மற்றும் தேடல் மரங்கள்)"],
        studyDurationHours: 2.5,
        focusTips: "மரங்களின் Traversals (Inorder, Preorder, Postorder) கணக்குகளைச் செய்து பாருங்கள். BST-இல் உறுப்புகளைச் செருகும் முறையைப் பயிற்சி செய்யுங்கள்."
      },
      {
        dayNumber: 4,
        dateString: "Day 4",
        topicsToCover: ["Graphs & Traversals (வரைபடங்கள் மற்றும் கடப்புகள்)"],
        studyDurationHours: 2,
        focusTips: "BFS மற்றும் DFS அல்காரிதம்களின் செயல்பாட்டு வரிசையை ஒரு வரைபடம் வரைந்து சரிபார்க்கவும்."
      }
    ],
    revisionSchedule: [
      {
        dateString: "Day 5 (Mid-Way Revision)",
        topics: ["Linear Data Structures (Arrays, Lists, Stack, Queue)"],
        method: "Active Recall: மறைத்து வைத்து அடுக்கின் செயல்பாடுகளை ஒரு வெள்ளைத் தாளில் எழுதிப் பாருங்கள். தவறுகளைத் திருத்துங்கள்."
      },
      {
        dateString: "Day 6 (Final Revision)",
        topics: ["Trees, Graphs, Sorting, Searching"],
        method: "Mock Exam Quiz: 10 MCQ கேள்விகளுக்குப் பதிலளித்து உங்கள் புரிதலைச் சோதியுங்கள்."
      }
    ],
    weakAreaImprovementTips: [
      "மரக் கடப்பு முறையில் குழப்பம் இருந்தால், இடது-வேர்-வலது (Inorder) போன்ற விதிகளைத் தனியாக எழுதி வைத்து கணக்குகளைச் செய்யுங்கள்.",
      "அல்காரிதம்களை மனப்பாடம் செய்யாமல், அவற்றின் பின்னணியில் உள்ள தர்க்கத்தை (Logic) நிஜ உலகப் பயன்பாடுகளுடன் ஒப்பிடுங்கள்.",
      "ஒவ்வொரு தரவு அமைப்பின் நேரக் சிக்கல்தன்மை (Time Complexity) அட்டவணையை வரைந்து உங்கள் படிக்கும் அறையில் ஒட்டி வையுங்கள்."
    ]
  },
  completedTopics: [],
  mockExamHistory: []
};
