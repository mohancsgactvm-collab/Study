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
      tamilExplanation: "English Explanation:\nAn Array is a linear data structure that stores elements of the same type in contiguous memory locations, allowing fast index-based access. In contrast, a Linked List consists of separate nodes containing data and pointers/references that point to the next node in memory, allowing dynamic resizing and efficient insertions/deletions.\n\nதமிழ் விளக்கம்:\nஅணிகள் (Arrays) என்பது தொடர்ச்சியான நினைவக இடங்களில் (Contiguous Memory Locations) ஒரே வகையான தரவு கூறுகளைச் சேமிக்கும் ஒரு நேரியல் தரவு அமைப்பாகும். இது குறியீட்டு எண் (Index) மூலம் உறுப்புகளை வேகமாக அணுக அனுமதிக்கிறது. இதற்கு மாறாக, இணைக்கப்பட்ட பட்டியல்கள் (Linked Lists) என்பது தரவுக் கூறுகளைக் கொண்ட தனித்தனி நோட்களின் (Nodes) தொகுப்பாகும், அங்கு ஒவ்வொரு நோடும் அடுத்த நோட்டின் நினைவக முகவரியை (Pointer/Address) சுட்டிக்காட்டும். இது எளிதான அளவு மாற்றம் மற்றும் செருகுதல்/நீக்குதலை அனுமதிக்கிறது.",
      shortNotes: [
        "Array is static size (நிலையான அளவு), Linked List is dynamic size (மாறும் அளவு).",
        "Array access is fast O(1) (வேகமான அணுகல்), Linked List access is linear O(n) (வரிசைமுறை அணுகல்).",
        "Linked List insertion/deletion is highly efficient O(1) without shifting."
      ],
      importantPoints: [
        "Arrays use contiguous block of memory (தொடர்ச்சியான நினைவகம்).",
        "Linked List nodes contain Data and Next pointer (தரவு மற்றும் அடுத்த பாயிண்டர்).",
        "The last node of a Linked List points to Null (பூஜ்ஜியம்) to signal the end."
      ],
      memoryTricks: "Arrays are like a train with fixed numbered compartments (இருக்கை எண்களுடன் கூடிய இரயில் பெட்டி). Linked Lists are like a Treasure Hunt game (புதையல் தேடுதல் வேட்டை) where each clue (Node) tells you where the next clue is located (Pointer)!",
      visualDiagram: {
        type: "compare",
        title: "Array vs Linked List Architecture (அணி மற்றும் இணைக்கப்பட்ட பட்டியலின் கட்டமைப்பு)",
        nodes: [
          { id: "arr1", labelEnglish: "Contiguous Array Block", labelTamil: "தொடர்ச்சியான நினைவக அடுக்கு", description: "[Value 10 | idx 0] -> [Value 20 | idx 1] -> [Value 30 | idx 2]" },
          { id: "lnk1", labelEnglish: "Linked Node 1", labelTamil: "முதல் நோடு (Node 1)", description: "Data: 10 | Next: Node 2" },
          { id: "lnk2", labelEnglish: "Linked Node 2", labelTamil: "இரண்டாம் நோடு (Node 2)", description: "Data: 20 | Next: Node 3" },
          { id: "lnk3", labelEnglish: "Linked Node 3", labelTamil: "மூன்றாம் நோடு (Node 3)", description: "Data: 30 | Next: NULL" }
        ],
        edges: [
          { from: "lnk1", to: "lnk2", label: "Pointer (சுட்டி)" },
          { from: "lnk2", to: "lnk3", label: "Pointer (சுட்டி)" }
        ]
      }
    },
    {
      topicName: "Stacks & Queues (அடுக்குகள் மற்றும் வரிசைகள்)",
      tamilExplanation: "English Explanation:\nA Stack is a linear data structure that follows the LIFO (Last In First Out) principle, where the last element inserted is the first one to be removed (e.g. push/pop operations at a single end called Top). A Queue is a linear structure following the FIFO (First In First Out) principle, where the first element inserted is the first to be removed (enqueue at Rear, dequeue at Front).\n\nதமிழ் விளக்கம்:\nஅடுக்கு (Stack) என்பது கடைசியாகச் செருகப்பட்ட உறுப்பு முதலில் வெளியேறும் (LIFO - Last In First Out) என்ற முறையில் செயல்படும் ஒரு நேரியல் தரவு அமைப்பாகும். இதன் செயல்பாடுகள் Push மற்றும் Pop ஒரு முனையில் (Top) மட்டுமே நிகழும். வரிசை (Queue) என்பது முதலில் செருகப்பட்ட உறுப்பு முதலில் வெளியேறும் (FIFO - First In First Out) என்ற முறையில் செயல்படும் அமைப்பாகும். இதில் தரவு பின்புறம் (Rear) சேர்க்கப்பட்டு முன்புறம் (Front) நீக்கப்படும்.",
      shortNotes: [
        "Stack works on LIFO (Last In First Out), Queue works on FIFO (First In First Out).",
        "Stack operations: Push (add) & Pop (remove) at Top.",
        "Queue operations: Enqueue (add at Rear) & Dequeue (remove from Front)."
      ],
      importantPoints: [
        "Stack has one open end (Top), Queue has two open ends (Front, Rear).",
        "Stack Overflow: inserting into a full stack. Stack Underflow: removing from an empty stack.",
        "Queues are used in Operating Systems for job scheduling and buffer management."
      ],
      memoryTricks: "Stack is like a pile of dinner plates (உணவுத் தட்டுகளின் அடுக்கு) - you always take the top plate first. Queue is like people waiting in line at a bus stop (பேருந்து வரிசை) - the first person in line gets on the bus first.",
      visualDiagram: {
        type: "flowchart",
        title: "Stack (LIFO) and Queue (FIFO) Operations (அடுக்கு மற்றும் வரிசைச் செயல்பாடுகள்)",
        nodes: [
          { id: "stk_in", labelEnglish: "Push element", labelTamil: "உறுப்பைச் சேர்த்தல்" },
          { id: "stk_top", labelEnglish: "Stack Top (LIFO)", labelTamil: "அடுக்கின் உச்சி" },
          { id: "stk_out", labelEnglish: "Pop element", labelTamil: "உறுப்பை நீக்குதல்" },
          { id: "q_rear", labelEnglish: "Queue Rear (Enqueue)", labelTamil: "வரிசையின் பின்புறம்" },
          { id: "q_front", labelEnglish: "Queue Front (Dequeue)", labelTamil: "வரிசையின் முன்புறம்" }
        ],
        edges: [
          { from: "stk_in", to: "stk_top", label: "Push (சேர்க்க)" },
          { from: "stk_top", to: "stk_out", label: "Pop (நீக்க)" },
          { from: "q_rear", to: "q_front", label: "FIFO Flow" }
        ]
      }
    },
    {
      topicName: "Binary Trees & BST (இருபடி மரங்கள் மற்றும் தேடல் மரங்கள்)",
      tamilExplanation: "English Explanation:\nA Tree is a hierarchical non-linear data structure consisting of nodes connected by edges. A Binary Tree restricts each node to have at most two children (Left and Right). A Binary Search Tree (BST) is a sorted binary tree where the left child of a node contains a value less than the node, and the right child contains a value greater, enabling O(log n) search, insertion, and deletion speeds.\n\nதமிழ் விளக்கம்:\nமரம் (Tree) என்பது ஒரு படிநிலை தரவு அமைப்பாகும் (Hierarchical Data Structure). இருபடி மரம் (Binary Tree) என்பது ஒவ்வொரு நோடும் அதிகபட்சமாக இரண்டு குழந்தைகளைக் (Left Child and Right Child) கொண்டிருக்கக்கூடிய மரமாகும். இருபடி தேடல் மரம் (Binary Search Tree - BST) என்பது ஒரு சிறப்பு வகை இருபடி மரமாகும், இங்கு ஒரு நோடின் இடதுபுறக் குழந்தையின் மதிப்பு அந்த நோடின் மதிப்பை விடக் குறைவாகவும், வலதுபுறக் குழந்தையின் மதிப்பு அதிகமாகவும் இருக்கும். இது O(log n) தேடுதல் வேகத்தை வழங்குகிறது.",
      shortNotes: [
        "Tree is non-linear (நேரியல் அல்லாதது) representing hierarchical relations.",
        "BST ensures: Left Child < Root < Right Child for quick search.",
        "Tree Traversals: Inorder (L-Root-R), Preorder (Root-L-R), Postorder (L-R-Root)."
      ],
      importantPoints: [
        "Inorder traversal of BST always produces elements in sorted ascending order (ஏறுவரிசை).",
        "The topmost node of a tree is called the Root (வேர் நோடு).",
        "Nodes with no children are called Leaf Nodes (இலை நோடுகள்)."
      ],
      memoryTricks: "A Tree is like a company's organizational chart (நிறுவன படிநிலை): CEO (Root) sits at the top, Directors (Children) are in the middle, and Individual Contributors (Leaves) are at the bottom!",
      visualDiagram: {
        type: "tree",
        title: "Binary Search Tree (BST) Hierarchy (இருபடி தேடல் மரத்தின் படிநிலை)",
        nodes: [
          { id: "root", labelEnglish: "Root: 50", labelTamil: "வேர்: 50", description: "All left values < 50, all right values > 50" },
          { id: "left", labelEnglish: "Left: 30", labelTamil: "இடது: 30", description: "Less than 50" },
          { id: "right", labelEnglish: "Right: 70", labelTamil: "வலது: 70", description: "Greater than 50" },
          { id: "left_left", labelEnglish: "Leaf: 20", labelTamil: "இலை: 20", description: "Less than 30" },
          { id: "left_right", labelEnglish: "Leaf: 40", labelTamil: "இலை: 40", description: "Greater than 30" }
        ],
        edges: [
          { from: "root", to: "left", label: "Left Child" },
          { from: "root", to: "right", label: "Right Child" },
          { from: "left", to: "left_left", label: "Left" },
          { from: "left", to: "left_right", label: "Right" }
        ]
      }
    }
  ],
  questions: {
    twoMarks: [
      {
        question: "What is Time Complexity? (நேரச் சிக்கல்தன்மை என்றால் என்ன?)",
        answerTamil: "English Key Answer:\nTime Complexity is a computational measure that describes the amount of time an algorithm takes to run as a function of its input size (n), commonly represented in Big-O notation.\n\nதமிழ் விடை:\nநேரச் சிக்கல்தன்மை (Time Complexity) என்பது ஒரு அல்காரிதம் அதன் உள்ளீட்டு அளவைப் (Input Size - n) பொறுத்து இயங்குவதற்கு எடுத்துக்கொள்ளும் நேரத்தைக் குறிக்கும் கணக்கீட்டு அளவீடாகும். இது பொதுவாக பிக்-ஓ குறியீட்டில் (Big-O Notation) குறிக்கப்படுகிறது.",
        answerEnglish: "Time Complexity is a computational measure that describes the amount of time an algorithm takes to run as a function of its input size (n), commonly represented in Big-O notation."
      },
      {
        question: "Differentiate between LIFO and FIFO. (LIFO மற்றும் FIFO வேறுபடுத்துக.)",
        answerTamil: "English Key Answer:\nLIFO (Last In First Out) means the last inserted element is removed first, used in Stacks. FIFO (First In First Out) means the first inserted element is removed first, used in Queues.\n\nதமிழ் விடை:\nLIFO (Last In First Out) என்பது கடைசியாகச் சேர்க்கப்படும் உறுப்பு முதலில் நீக்கப்படும் முறையாகும்; இது Stack-ல் பயன்படுகிறது. FIFO (First In First Out) என்பது முதலில் சேர்க்கப்படும் உறுப்பு முதலில் நீக்கப்படும் முறையாகும்; இது Queue-ல் பயன்படுகிறது.",
        answerEnglish: "LIFO (Last In First Out) means the last inserted element is removed first, used in Stacks. FIFO (First In First Out) means the first inserted element is removed first, used in Queues."
      }
    ],
    fiveMarks: [
      {
        question: "Explain the operations of Stack with neat diagrams. (அடுக்கின் (Stack) செயல்பாடுகளைப் படங்களுடன் விளக்குக.)",
        answerTamil: "English Explanation:\n1. Push Operation: Adds an element to the top of the stack. If the stack is full, it causes a Stack Overflow.\n2. Pop Operation: Removes the topmost element. If the stack is empty, it causes a Stack Underflow.\n3. Peek Operation: Retrieves the top element value without removing it.\nThis follows LIFO (Last In First Out) and all operations take O(1) constant time.\n\nதமிழ் விளக்கம்:\nStack-ல் மூன்று முக்கிய செயல்பாடுகள் உள்ளன:\n1. **Push Operation (தரவைச் சேர்த்தல்)**: Stack-ன் மேல் பகுதியில் (Top) ஒரு புதிய உறுப்பைச் சேர்ப்பதாகும். இது அடுக்கின் கொள்ளளவை தாண்டினால் Stack Overflow எனப்படும்.\n2. **Pop Operation (தரவை நீக்குதல்)**: Stack-ன் மேல் பகுதியில் இருக்கும் உறுப்பை வெளியே எடுப்பதாகும். காலியாக இருந்தால் Stack Underflow எனப்படும்.\n3. **Peek/Top Operation**: Stack-லிருந்து உறுப்பை நீக்காமல், மேல் உள்ள உறுப்பின் மதிப்பை மட்டும் பார்ப்பதாகும்.",
        answerEnglish: "1. Push Operation: Adds an element to the top of the stack. If the stack is full, it causes a Stack Overflow.\n2. Pop Operation: Removes the topmost element. If the stack is empty, it causes a Stack Underflow.\n3. Peek Operation: Retrieves the top element value without removing it.\nThis follows LIFO (Last In First Out) and all operations take O(1) constant time."
      },
      {
        question: "Explain Binary Search Tree (BST) insertion with an example. (இருபடி தேடல் மரத்தில் (BST) உறுப்பைச் செருகுவதை உதாரணத்துடன் விளக்குக.)",
        answerTamil: "English Explanation:\n1. If the tree is empty, make the new element the Root node.\n2. If the new value is less than root, move recursively to the Left Subtree.\n3. If the new value is greater than root, move recursively to the Right Subtree.\nFor example, inserting [50, 30, 70, 20]: 50 becomes root. 30 goes Left of 50. 70 goes Right of 50. 20 goes Left of 30.\n\nதமிழ் விளக்கம்:\nBST-இல் ஒரு உறுப்பைச் செருகும்போது பின்வரும் விதிகள் பின்பற்றப்படுகின்றன:\n1. மரம் காலியாக இருந்தால், புதிய உறுப்பை Root நோடாக மாற்றவும்.\n2. புதிய உறுப்பு Root-ஐ விடக் குறைவாக இருந்தால், இடது புறத் துணை மரத்திற்குச் (Left Subtree) செல்லவும்.\n3. புதிய உறுப்பு Root-ஐ விட அதிகமாக இருந்தால், வலது புறத் துணை மரத்திற்குச் (Right Subtree) செல்லவும்.\n\n**உதாரணம்**: 50, 30, 70, 20 ஆகிய எண்களைச் செருகும் முறை:\n- முதலில் 50 தான் Root.\n- 30 என்பது 50-ஐ விடக் குறைவு என்பதால் 50-க்கு இடதுபுறம் செல்லும்.\n- 70 என்பது 50-ஐ விட அதிகம் என்பதால் 50-க்கு வலதுபுறம் செல்லும்.\n- 20 என்பது 30-ஐ விடக் குறைவு என்பதால் 30-க்கு இடதுபுறம் செல்லும்.",
        answerEnglish: "1. If the tree is empty, make the new element the Root node.\n2. If the new value is less than root, move recursively to the Left Subtree.\n3. If the new value is greater than root, move recursively to the Right Subtree.\nFor example, inserting [50, 30, 70, 20]: 50 becomes root. 30 goes Left of 50. 70 goes Right of 50. 20 goes Left of 30."
      }
    ],
    tenMarks: [
      {
        question: "Detail the differences between Sequential Access and Random Access data structures. (வரிசைமுறை அணுகல் மற்றும் சீரற்ற அணுகல் தரவு அமைப்புகளை விரிவாக வேறுபடுத்துக.)",
        answerTamil: "English Explanation:\n1. Memory Allocation: Sequential (Linked List) uses non-contiguous scattered nodes with pointers. Random (Array) uses a solid contiguous block of memory.\n2. Access Speed: Sequential requires traversing elements from the head O(n). Random allows direct element access using index O(1).\n3. Overhead: Sequential has extra memory overhead for pointers. Random has no pointer overhead but has potential memory wastage due to fixed static size.\n4. Editing: Sequential offers fast O(1) insertions/deletions. Random requires heavy O(n) element shifting.\n\nதமிழ் விளக்கம்:\nஇந்த இரண்டு அணுகல் முறைகளுக்கும் இடையிலான முக்கிய வேறுபாடுகள்:\n1. **நினைவக ஒதுக்கீடு (Memory Allocation)**:\n   - **Sequential (Linked List)**: நினைவகம் சிதறி இருக்கும் (Non-contiguous). நோடுகள் பாயிண்டர்கள் மூலம் இணைக்கப்படுகின்றன.\n   - **Random (Array)**: நினைவகம் தொடர்ச்சியாக ஒதுக்கப்படுகிறது (Contiguous memory allocation).\n2. **தரவு அணுகல் வேகம் (Data Access Speed)**:\n   - **Sequential**: ஒரு குறிப்பிட்ட உறுப்பை அணுக, ஆரம்ப நோடிலிருந்து வரிசையாகக் கடந்துதான் செல்ல வேண்டும் - O(n).\n   - **Random**: குறியீட்டு எண் (Index) மூலம் எந்தவொரு உறுப்பையும் நேரடியாக அணுகலாம் - O(1).\n3. **நினைவக விரயம் (Memory Overhead)**:\n   - **Sequential**: ஒவ்வொரு நோடும் பாயிண்டரைக் கொண்டிருப்பதால் கூடுதல் நினைவகம் தேவைப்படும்.\n   - **Random**: பாயிண்டர்கள் இல்லாததால் கூடுதல் நினைவகம் தேவையில்லை, ஆனால் பயன்படுத்தாத இடங்கள் வீணாகும்.\n4. **செருகுதல் மற்றும் நீக்குதல் செயல்பாடு (Insertion and Deletion)**:\n   - **Sequential**: பாயிண்டர்களை மாற்றுவதன் மூலம் மிக எளிதாகவும் வேகமாகவும் செய்யலாம் - O(1).\n   - **Random**: உறுப்புகளை நகர்த்த (Shifting) வேண்டியிருப்பதால் மெதுவாக நடக்கும் - O(n).",
        answerEnglish: "1. Memory Allocation: Sequential (Linked List) uses non-contiguous scattered nodes with pointers. Random (Array) uses a solid contiguous block of memory.\n2. Access Speed: Sequential requires traversing elements from the head O(n). Random allows direct element access using index O(1).\n3. Overhead: Sequential has extra memory overhead for pointers. Random has no pointer overhead but has potential memory wastage due to fixed static size.\n4. Editing: Sequential offers fast O(1) insertions/deletions. Random requires heavy O(n) element shifting."
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
