export const mockGraphData = {
  nodes: [
    // Central Root Node
    { id: 'root', name: 'Courses', type: 'root', color: '#ffffff', val: 50 },

    // ========== COURSES (10 courses with bold colors) ==========
    { id: 'math18', name: 'MATH 18', type: 'course', color: '#ef4444', val: 24 }, // Red
    { id: 'cse101', name: 'CSE 101', type: 'course', color: '#3b82f6', val: 24 }, // Blue
    { id: 'cogs10', name: 'COGS 10', type: 'course', color: '#10b981', val: 24 }, // Emerald
    { id: 'phys2a', name: 'PHYS 2A', type: 'course', color: '#f59e0b', val: 24 }, // Amber
    { id: 'cse12', name: 'CSE 12', type: 'course', color: '#8b5cf6', val: 24 }, // Violet
    { id: 'cse15l', name: 'CSE 15L', type: 'course', color: '#ec4899', val: 24 }, // Pink
    { id: 'math20c', name: 'MATH 20C', type: 'course', color: '#14b8a6', val: 24 }, // Teal
    { id: 'cse100', name: 'CSE 100', type: 'course', color: '#f43f5e', val: 24 }, // Rose
    { id: 'cse105', name: 'CSE 105', type: 'course', color: '#06b6d4', val: 24 }, // Cyan
    { id: 'cse110', name: 'CSE 110', type: 'course', color: '#84cc16', val: 24 }, // Lime

    // ========== MATH 18 MODULES ==========
    { id: 'm18_mod1', name: 'Linear Equations', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod2', name: 'Matrix Algebra', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod3', name: 'Vector Spaces', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod4', name: 'Eigenvalues', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod5', name: 'Orthogonality', type: 'module', color: '#fca5a5', val: 12 },
    { id: 'm18_mod6', name: 'Applications', type: 'module', color: '#fca5a5', val: 12 },

    // ========== CSE 101 MODULES ==========
    { id: 'cse101_mod1', name: 'Graph Algorithms', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod2', name: 'Dynamic Programming', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod3', name: 'Greedy Algorithms', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod4', name: 'Divide & Conquer', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod5', name: 'NP-Completeness', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod6', name: 'Approximation', type: 'module', color: '#93c5fd', val: 12 },
    { id: 'cse101_mod7', name: 'Network Flow', type: 'module', color: '#93c5fd', val: 12 },

    // ========== COGS 10 MODULES ==========
    { id: 'cogs10_mod1', name: 'Intro to Cognition', type: 'module', color: '#6ee7b7', val: 12 },
    { id: 'cogs10_mod2', name: 'Perception', type: 'module', color: '#6ee7b7', val: 12 },
    { id: 'cogs10_mod3', name: 'Memory Systems', type: 'module', color: '#6ee7b7', val: 12 },
    { id: 'cogs10_mod4', name: 'Learning Theory', type: 'module', color: '#6ee7b7', val: 12 },
    { id: 'cogs10_mod5', name: 'Language', type: 'module', color: '#6ee7b7', val: 12 },
    { id: 'cogs10_mod6', name: 'Decision Making', type: 'module', color: '#6ee7b7', val: 12 },

    // ========== PHYS 2A MODULES ==========
    { id: 'phys2a_mod1', name: 'Kinematics', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod2', name: 'Dynamics', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod3', name: 'Energy & Work', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod4', name: 'Momentum', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod5', name: 'Rotation', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod6', name: 'Gravitation', type: 'module', color: '#fcd34d', val: 12 },
    { id: 'phys2a_mod7', name: 'Oscillations', type: 'module', color: '#fcd34d', val: 12 },

    // ========== CSE 12 MODULES ==========
    { id: 'cse12_mod1', name: 'OOP Basics', type: 'module', color: '#c4b5fd', val: 12 },
    { id: 'cse12_mod2', name: 'Lists & Stacks', type: 'module', color: '#c4b5fd', val: 12 },
    { id: 'cse12_mod3', name: 'Queues & Deques', type: 'module', color: '#c4b5fd', val: 12 },
    { id: 'cse12_mod4', name: 'Trees', type: 'module', color: '#c4b5fd', val: 12 },
    { id: 'cse12_mod5', name: 'Hash Tables', type: 'module', color: '#c4b5fd', val: 12 },
    { id: 'cse12_mod6', name: 'Heaps & Priority Queues', type: 'module', color: '#c4b5fd', val: 12 },

    // ========== CSE 15L MODULES ==========
    { id: 'cse15l_mod1', name: 'Unix Basics', type: 'module', color: '#f9a8d4', val: 12 },
    { id: 'cse15l_mod2', name: 'Git & Version Control', type: 'module', color: '#f9a8d4', val: 12 },
    { id: 'cse15l_mod3', name: 'Shell Scripting', type: 'module', color: '#f9a8d4', val: 12 },
    { id: 'cse15l_mod4', name: 'Testing & Debugging', type: 'module', color: '#f9a8d4', val: 12 },
    { id: 'cse15l_mod5', name: 'Build Tools', type: 'module', color: '#f9a8d4', val: 12 },
    { id: 'cse15l_mod6', name: 'CI/CD Pipelines', type: 'module', color: '#f9a8d4', val: 12 },

    // ========== MATH 20C MODULES ==========
    { id: 'm20c_mod1', name: 'Parametric Curves', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod2', name: 'Partial Derivatives', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod3', name: 'Multiple Integrals', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod4', name: 'Vector Fields', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod5', name: 'Line Integrals', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod6', name: 'Surface Integrals', type: 'module', color: '#5eead4', val: 12 },
    { id: 'm20c_mod7', name: 'Green\'s Theorem', type: 'module', color: '#5eead4', val: 12 },

    // ========== CSE 100 MODULES ==========
    { id: 'cse100_mod1', name: 'BSTs & AVL Trees', type: 'module', color: '#fda4af', val: 12 },
    { id: 'cse100_mod2', name: 'Tries', type: 'module', color: '#fda4af', val: 12 },
    { id: 'cse100_mod3', name: 'Heaps', type: 'module', color: '#fda4af', val: 12 },
    { id: 'cse100_mod4', name: 'Graphs', type: 'module', color: '#fda4af', val: 12 },
    { id: 'cse100_mod5', name: 'Huffman Coding', type: 'module', color: '#fda4af', val: 12 },
    { id: 'cse100_mod6', name: 'Bloom Filters', type: 'module', color: '#fda4af', val: 12 },

    // ========== CSE 105 MODULES ==========
    { id: 'cse105_mod1', name: 'DFA & NFA', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod2', name: 'Regular Expressions', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod3', name: 'Context-Free Grammars', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod4', name: 'Pushdown Automata', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod5', name: 'Turing Machines', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod6', name: 'Decidability', type: 'module', color: '#67e8f9', val: 12 },
    { id: 'cse105_mod7', name: 'Complexity Theory', type: 'module', color: '#67e8f9', val: 12 },

    // ========== CSE 110 MODULES ==========
    { id: 'cse110_mod1', name: 'Agile Development', type: 'module', color: '#bef264', val: 12 },
    { id: 'cse110_mod2', name: 'Requirements', type: 'module', color: '#bef264', val: 12 },
    { id: 'cse110_mod3', name: 'Design Patterns', type: 'module', color: '#bef264', val: 12 },
    { id: 'cse110_mod4', name: 'Testing', type: 'module', color: '#bef264', val: 12 },
    { id: 'cse110_mod5', name: 'Code Review', type: 'module', color: '#bef264', val: 12 },
    { id: 'cse110_mod6', name: 'Deployment', type: 'module', color: '#bef264', val: 12 },

    // ========== MATH 18 ASSIGNMENTS ==========
    { id: 'm18_hw1', name: 'HW1: Systems of Equations', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw2', name: 'HW2: Matrix Operations', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw3', name: 'HW3: Determinants', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw4', name: 'HW4: Vector Spaces', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_midterm', name: 'Midterm Exam', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_proj', name: 'Final Project', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw5', name: 'HW5: Eigenvalues', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw6', name: 'HW6: Diagonalization', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw7', name: 'HW7: Orthogonal Sets', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw8', name: 'HW8: Gram-Schmidt', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw9', name: 'HW9: Least Squares', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm18_hw10', name: 'HW10: Applications', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 101 ASSIGNMENTS ==========
    { id: 'cse101_pa1', name: 'PA1: BFS/DFS', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_pa2', name: 'PA2: Shortest Paths', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_pa3', name: 'PA3: MST', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_pa4', name: 'PA4: DP Problems', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_pa5', name: 'PA5: Greedy Algorithms', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_pa6', name: 'PA6: Divide & Conquer', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw1', name: 'HW1: Graph Theory', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw2', name: 'HW2: DP Practice', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw3', name: 'HW3: Greedy', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw4', name: 'HW4: NP Problems', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw5', name: 'HW5: Reductions', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw6', name: 'HW6: Approximation', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse101_hw7', name: 'HW7: Network Flow', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== COGS 10 ASSIGNMENTS ==========
    { id: 'cogs10_essay1', name: 'Essay 1: Perception', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_essay2', name: 'Essay 2: Memory', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_quiz3', name: 'Quiz 3', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_reading1', name: 'Reading Response 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_reading2', name: 'Reading Response 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_reading3', name: 'Reading Response 3', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_reading4', name: 'Reading Response 4', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cogs10_reading5', name: 'Reading Response 5', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== PHYS 2A ASSIGNMENTS ==========
    { id: 'phys2a_hw1', name: 'HW1: Kinematics', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw2', name: 'HW2: Forces', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw3', name: 'HW3: Energy', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw4', name: 'HW4: Momentum', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw5', name: 'HW5: Rotation', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw6', name: 'HW6: Gravitation', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_hw7', name: 'HW7: Oscillations', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_lab1', name: 'Lab 1: Motion', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_lab2', name: 'Lab 2: Forces', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_lab3', name: 'Lab 3: Energy', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_lab4', name: 'Lab 4: Collisions', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'phys2a_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 12 ASSIGNMENTS ==========
    { id: 'cse12_pa1', name: 'PA1: ArrayList', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa2', name: 'PA2: LinkedList', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa3', name: 'PA3: Stacks', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa4', name: 'PA4: Queues', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa5', name: 'PA5: BST', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa6', name: 'PA6: HashTable', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_pa7', name: 'PA7: Heap', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse12_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 15L ASSIGNMENTS ==========
    { id: 'cse15l_lab1', name: 'Lab 1: Unix Basics', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_lab2', name: 'Lab 2: Git', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_lab3', name: 'Lab 3: Scripting', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_lab4', name: 'Lab 4: Testing', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_lab5', name: 'Lab 5: Build Tools', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_lab6', name: 'Lab 6: CI/CD', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_quiz3', name: 'Quiz 3', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse15l_final_proj', name: 'Final Project', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== MATH 20C ASSIGNMENTS ==========
    { id: 'm20c_hw1', name: 'HW1: Parametric Curves', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw2', name: 'HW2: Partial Derivatives', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw3', name: 'HW3: Chain Rule', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw4', name: 'HW4: Double Integrals', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw5', name: 'HW5: Triple Integrals', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw6', name: 'HW6: Vector Fields', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw7', name: 'HW7: Line Integrals', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_hw8', name: 'HW8: Green\'s Theorem', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'm20c_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 100 ASSIGNMENTS ==========
    { id: 'cse100_pa1', name: 'PA1: BST', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_pa2', name: 'PA2: AVL Trees', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_pa3', name: 'PA3: Tries', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_pa4', name: 'PA4: Heaps', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_pa5', name: 'PA5: Graphs', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_pa6', name: 'PA6: Huffman', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse100_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 105 ASSIGNMENTS ==========
    { id: 'cse105_hw1', name: 'HW1: DFA/NFA', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw2', name: 'HW2: Regular Expressions', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw3', name: 'HW3: CFG', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw4', name: 'HW4: PDA', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw5', name: 'HW5: Turing Machines', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw6', name: 'HW6: Decidability', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_hw7', name: 'HW7: Complexity', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_quiz1', name: 'Quiz 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_quiz2', name: 'Quiz 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_midterm', name: 'Midterm', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse105_final', name: 'Final Exam', type: 'assignment', color: '#e2e8f0', val: 8 },

    // ========== CSE 110 ASSIGNMENTS ==========
    { id: 'cse110_sprint1', name: 'Sprint 1', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_sprint2', name: 'Sprint 2', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_sprint3', name: 'Sprint 3', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_sprint4', name: 'Sprint 4', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_design_doc', name: 'Design Document', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_testing_doc', name: 'Testing Document', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_final_video', name: 'Final Video', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_final_pres', name: 'Final Presentation', type: 'assignment', color: '#e2e8f0', val: 8 },
    { id: 'cse110_retro', name: 'Retrospective', type: 'assignment', color: '#e2e8f0', val: 8 },
  ],
  links: [
    // ========== ROOT -> COURSES ==========
    { source: 'root', target: 'math18' },
    { source: 'root', target: 'cse101' },
    { source: 'root', target: 'cogs10' },
    { source: 'root', target: 'phys2a' },
    { source: 'root', target: 'cse12' },
    { source: 'root', target: 'cse15l' },
    { source: 'root', target: 'math20c' },
    { source: 'root', target: 'cse100' },
    { source: 'root', target: 'cse105' },
    { source: 'root', target: 'cse110' },

    // ========== MATH 18 COURSE -> MODULES ==========
    { source: 'math18', target: 'm18_mod1' },
    { source: 'math18', target: 'm18_mod2' },
    { source: 'math18', target: 'm18_mod3' },
    { source: 'math18', target: 'm18_mod4' },
    { source: 'math18', target: 'm18_mod5' },
    { source: 'math18', target: 'm18_mod6' },

    // ========== CSE 101 COURSE -> MODULES ==========
    { source: 'cse101', target: 'cse101_mod1' },
    { source: 'cse101', target: 'cse101_mod2' },
    { source: 'cse101', target: 'cse101_mod3' },
    { source: 'cse101', target: 'cse101_mod4' },
    { source: 'cse101', target: 'cse101_mod5' },
    { source: 'cse101', target: 'cse101_mod6' },
    { source: 'cse101', target: 'cse101_mod7' },

    // ========== COGS 10 COURSE -> MODULES ==========
    { source: 'cogs10', target: 'cogs10_mod1' },
    { source: 'cogs10', target: 'cogs10_mod2' },
    { source: 'cogs10', target: 'cogs10_mod3' },
    { source: 'cogs10', target: 'cogs10_mod4' },
    { source: 'cogs10', target: 'cogs10_mod5' },
    { source: 'cogs10', target: 'cogs10_mod6' },

    // ========== PHYS 2A COURSE -> MODULES ==========
    { source: 'phys2a', target: 'phys2a_mod1' },
    { source: 'phys2a', target: 'phys2a_mod2' },
    { source: 'phys2a', target: 'phys2a_mod3' },
    { source: 'phys2a', target: 'phys2a_mod4' },
    { source: 'phys2a', target: 'phys2a_mod5' },
    { source: 'phys2a', target: 'phys2a_mod6' },
    { source: 'phys2a', target: 'phys2a_mod7' },

    // ========== CSE 12 COURSE -> MODULES ==========
    { source: 'cse12', target: 'cse12_mod1' },
    { source: 'cse12', target: 'cse12_mod2' },
    { source: 'cse12', target: 'cse12_mod3' },
    { source: 'cse12', target: 'cse12_mod4' },
    { source: 'cse12', target: 'cse12_mod5' },
    { source: 'cse12', target: 'cse12_mod6' },

    // ========== CSE 15L COURSE -> MODULES ==========
    { source: 'cse15l', target: 'cse15l_mod1' },
    { source: 'cse15l', target: 'cse15l_mod2' },
    { source: 'cse15l', target: 'cse15l_mod3' },
    { source: 'cse15l', target: 'cse15l_mod4' },
    { source: 'cse15l', target: 'cse15l_mod5' },
    { source: 'cse15l', target: 'cse15l_mod6' },

    // ========== MATH 20C COURSE -> MODULES ==========
    { source: 'math20c', target: 'm20c_mod1' },
    { source: 'math20c', target: 'm20c_mod2' },
    { source: 'math20c', target: 'm20c_mod3' },
    { source: 'math20c', target: 'm20c_mod4' },
    { source: 'math20c', target: 'm20c_mod5' },
    { source: 'math20c', target: 'm20c_mod6' },
    { source: 'math20c', target: 'm20c_mod7' },

    // ========== CSE 100 COURSE -> MODULES ==========
    { source: 'cse100', target: 'cse100_mod1' },
    { source: 'cse100', target: 'cse100_mod2' },
    { source: 'cse100', target: 'cse100_mod3' },
    { source: 'cse100', target: 'cse100_mod4' },
    { source: 'cse100', target: 'cse100_mod5' },
    { source: 'cse100', target: 'cse100_mod6' },

    // ========== CSE 105 COURSE -> MODULES ==========
    { source: 'cse105', target: 'cse105_mod1' },
    { source: 'cse105', target: 'cse105_mod2' },
    { source: 'cse105', target: 'cse105_mod3' },
    { source: 'cse105', target: 'cse105_mod4' },
    { source: 'cse105', target: 'cse105_mod5' },
    { source: 'cse105', target: 'cse105_mod6' },
    { source: 'cse105', target: 'cse105_mod7' },

    // ========== CSE 110 COURSE -> MODULES ==========
    { source: 'cse110', target: 'cse110_mod1' },
    { source: 'cse110', target: 'cse110_mod2' },
    { source: 'cse110', target: 'cse110_mod3' },
    { source: 'cse110', target: 'cse110_mod4' },
    { source: 'cse110', target: 'cse110_mod5' },
    { source: 'cse110', target: 'cse110_mod6' },

    // ========== MATH 18 MODULES -> ASSIGNMENTS ==========
    { source: 'm18_mod1', target: 'm18_hw1' },
    { source: 'm18_mod1', target: 'm18_hw2' },
    { source: 'm18_mod1', target: 'm18_quiz1' },
    { source: 'm18_mod2', target: 'm18_hw3' },
    { source: 'm18_mod2', target: 'm18_quiz2' },
    { source: 'm18_mod3', target: 'm18_hw4' },
    { source: 'm18_mod3', target: 'm18_midterm' },
    { source: 'm18_mod4', target: 'm18_hw5' },
    { source: 'm18_mod4', target: 'm18_hw6' },
    { source: 'm18_mod5', target: 'm18_hw7' },
    { source: 'm18_mod5', target: 'm18_hw8' },
    { source: 'm18_mod6', target: 'm18_hw9' },
    { source: 'm18_mod6', target: 'm18_hw10' },
    { source: 'm18_mod6', target: 'm18_proj' },
    { source: 'm18_mod6', target: 'm18_final' },

    // ========== CSE 101 MODULES -> ASSIGNMENTS ==========
    { source: 'cse101_mod1', target: 'cse101_pa1' },
    { source: 'cse101_mod1', target: 'cse101_hw1' },
    { source: 'cse101_mod1', target: 'cse101_pa2' },
    { source: 'cse101_mod2', target: 'cse101_pa3' },
    { source: 'cse101_mod2', target: 'cse101_pa4' },
    { source: 'cse101_mod2', target: 'cse101_hw2' },
    { source: 'cse101_mod3', target: 'cse101_pa5' },
    { source: 'cse101_mod3', target: 'cse101_hw3' },
    { source: 'cse101_mod4', target: 'cse101_pa6' },
    { source: 'cse101_mod4', target: 'cse101_midterm' },
    { source: 'cse101_mod5', target: 'cse101_hw4' },
    { source: 'cse101_mod5', target: 'cse101_hw5' },
    { source: 'cse101_mod6', target: 'cse101_hw6' },
    { source: 'cse101_mod7', target: 'cse101_hw7' },
    { source: 'cse101_mod7', target: 'cse101_final' },

    // ========== COGS 10 MODULES -> ASSIGNMENTS ==========
    { source: 'cogs10_mod1', target: 'cogs10_reading1' },
    { source: 'cogs10_mod1', target: 'cogs10_quiz1' },
    { source: 'cogs10_mod2', target: 'cogs10_essay1' },
    { source: 'cogs10_mod2', target: 'cogs10_reading2' },
    { source: 'cogs10_mod3', target: 'cogs10_essay2' },
    { source: 'cogs10_mod3', target: 'cogs10_quiz2' },
    { source: 'cogs10_mod4', target: 'cogs10_reading3' },
    { source: 'cogs10_mod4', target: 'cogs10_midterm' },
    { source: 'cogs10_mod5', target: 'cogs10_reading4' },
    { source: 'cogs10_mod5', target: 'cogs10_quiz3' },
    { source: 'cogs10_mod6', target: 'cogs10_reading5' },
    { source: 'cogs10_mod6', target: 'cogs10_final' },

    // ========== PHYS 2A MODULES -> ASSIGNMENTS ==========
    { source: 'phys2a_mod1', target: 'phys2a_hw1' },
    { source: 'phys2a_mod1', target: 'phys2a_lab1' },
    { source: 'phys2a_mod2', target: 'phys2a_hw2' },
    { source: 'phys2a_mod2', target: 'phys2a_lab2' },
    { source: 'phys2a_mod3', target: 'phys2a_hw3' },
    { source: 'phys2a_mod3', target: 'phys2a_lab3' },
    { source: 'phys2a_mod4', target: 'phys2a_hw4' },
    { source: 'phys2a_mod4', target: 'phys2a_lab4' },
    { source: 'phys2a_mod4', target: 'phys2a_midterm' },
    { source: 'phys2a_mod5', target: 'phys2a_hw5' },
    { source: 'phys2a_mod6', target: 'phys2a_hw6' },
    { source: 'phys2a_mod7', target: 'phys2a_hw7' },
    { source: 'phys2a_mod7', target: 'phys2a_final' },

    // ========== CSE 12 MODULES -> ASSIGNMENTS ==========
    { source: 'cse12_mod1', target: 'cse12_pa1' },
    { source: 'cse12_mod1', target: 'cse12_quiz1' },
    { source: 'cse12_mod2', target: 'cse12_pa2' },
    { source: 'cse12_mod2', target: 'cse12_pa3' },
    { source: 'cse12_mod3', target: 'cse12_pa4' },
    { source: 'cse12_mod3', target: 'cse12_quiz2' },
    { source: 'cse12_mod4', target: 'cse12_pa5' },
    { source: 'cse12_mod4', target: 'cse12_midterm' },
    { source: 'cse12_mod5', target: 'cse12_pa6' },
    { source: 'cse12_mod6', target: 'cse12_pa7' },
    { source: 'cse12_mod6', target: 'cse12_final' },

    // ========== CSE 15L MODULES -> ASSIGNMENTS ==========
    { source: 'cse15l_mod1', target: 'cse15l_lab1' },
    { source: 'cse15l_mod1', target: 'cse15l_quiz1' },
    { source: 'cse15l_mod2', target: 'cse15l_lab2' },
    { source: 'cse15l_mod3', target: 'cse15l_lab3' },
    { source: 'cse15l_mod3', target: 'cse15l_quiz2' },
    { source: 'cse15l_mod4', target: 'cse15l_lab4' },
    { source: 'cse15l_mod5', target: 'cse15l_lab5' },
    { source: 'cse15l_mod5', target: 'cse15l_quiz3' },
    { source: 'cse15l_mod6', target: 'cse15l_lab6' },
    { source: 'cse15l_mod6', target: 'cse15l_final_proj' },

    // ========== MATH 20C MODULES -> ASSIGNMENTS ==========
    { source: 'm20c_mod1', target: 'm20c_hw1' },
    { source: 'm20c_mod1', target: 'm20c_quiz1' },
    { source: 'm20c_mod2', target: 'm20c_hw2' },
    { source: 'm20c_mod2', target: 'm20c_hw3' },
    { source: 'm20c_mod3', target: 'm20c_hw4' },
    { source: 'm20c_mod3', target: 'm20c_hw5' },
    { source: 'm20c_mod3', target: 'm20c_quiz2' },
    { source: 'm20c_mod4', target: 'm20c_hw6' },
    { source: 'm20c_mod4', target: 'm20c_midterm' },
    { source: 'm20c_mod5', target: 'm20c_hw7' },
    { source: 'm20c_mod6', target: 'm20c_hw8' },
    { source: 'm20c_mod7', target: 'm20c_final' },

    // ========== CSE 100 MODULES -> ASSIGNMENTS ==========
    { source: 'cse100_mod1', target: 'cse100_pa1' },
    { source: 'cse100_mod1', target: 'cse100_pa2' },
    { source: 'cse100_mod1', target: 'cse100_quiz1' },
    { source: 'cse100_mod2', target: 'cse100_pa3' },
    { source: 'cse100_mod3', target: 'cse100_pa4' },
    { source: 'cse100_mod3', target: 'cse100_midterm' },
    { source: 'cse100_mod4', target: 'cse100_pa5' },
    { source: 'cse100_mod4', target: 'cse100_quiz2' },
    { source: 'cse100_mod5', target: 'cse100_pa6' },
    { source: 'cse100_mod6', target: 'cse100_final' },

    // ========== CSE 105 MODULES -> ASSIGNMENTS ==========
    { source: 'cse105_mod1', target: 'cse105_hw1' },
    { source: 'cse105_mod1', target: 'cse105_quiz1' },
    { source: 'cse105_mod2', target: 'cse105_hw2' },
    { source: 'cse105_mod3', target: 'cse105_hw3' },
    { source: 'cse105_mod3', target: 'cse105_quiz2' },
    { source: 'cse105_mod4', target: 'cse105_hw4' },
    { source: 'cse105_mod4', target: 'cse105_midterm' },
    { source: 'cse105_mod5', target: 'cse105_hw5' },
    { source: 'cse105_mod6', target: 'cse105_hw6' },
    { source: 'cse105_mod7', target: 'cse105_hw7' },
    { source: 'cse105_mod7', target: 'cse105_final' },

    // ========== CSE 110 MODULES -> ASSIGNMENTS ==========
    { source: 'cse110_mod1', target: 'cse110_sprint1' },
    { source: 'cse110_mod1', target: 'cse110_design_doc' },
    { source: 'cse110_mod2', target: 'cse110_sprint2' },
    { source: 'cse110_mod3', target: 'cse110_sprint3' },
    { source: 'cse110_mod4', target: 'cse110_testing_doc' },
    { source: 'cse110_mod5', target: 'cse110_sprint4' },
    { source: 'cse110_mod6', target: 'cse110_final_video' },
    { source: 'cse110_mod6', target: 'cse110_final_pres' },
    { source: 'cse110_mod6', target: 'cse110_retro' },

    // ========== CROSS-COURSE CONNECTIONS (Related Topics) ==========
    // Math courses connected
    { source: 'math18', target: 'math20c' },

    // CSE progression path
    { source: 'cse12', target: 'cse100' },
    { source: 'cse100', target: 'cse101' },
    { source: 'cse12', target: 'cse15l' },

    // Theory courses
    { source: 'cse101', target: 'cse105' },

    // Project-based connection
    { source: 'cse15l', target: 'cse110' },

    // Math-CS connections
    { source: 'math18', target: 'cse12' },
    { source: 'math20c', target: 'phys2a' },

    // Cognitive science connection
    { source: 'cogs10', target: 'cse110' },
  ]
};
