import { connectDB } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import { NextResponse } from "next/server";

const events = [
  {
    "name": "Scavenger Hunt",
    "description": "You can steal snatch or borrow . Solve tech puzzles and find hidden clues.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461903/scavengerhunt_z0zrqd.jpg",
    "prizepool": 5000,
    "regFees": 89,
    "more": "<section>\n  <h2>SCAVENGERS HUNT</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <ul>\n        <li>Event Name: SCAVENGERS HUNT</li>\n        <li>Date: 20th April 2025</li>\n        <li>Time: 3 PM</li>\n        <li>Location: DJLHC</li>\n        <li>Team size: 5 members max</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Eligibility and Team Formation</h3>\n      <ul>\n        <li>Participants: Open to all currently enrolled students of NIT Jamshedpur.</li>\n        <li>Registration: All teams must register by the deadline.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Event Format and Rounds</h3>\n      <p>The scavenger hunt will consist of three rounds. Teams must qualify from one round to proceed to the next.</p>\n      <ul>\n        <li>\n          <strong>Round 1: Memes Challenge</strong>\n          <ul>\n            <li>Teams need to correctly guess the memes shown on the screen within a specified time.</li>\n          </ul>\n        </li>\n        <li>\n          <strong>Round 2: Task and Time-Based Round</strong>\n          <ul>\n            <li>Objective: Teams will complete 3 different tasks within a specified time. Their overall time will be recorded.</li>\n            <li>There will be a time limit for each task.</li>\n            <li>Each task allows up to 3 attempts. If not completed within attempts, the team moves to the next with a time penalty.</li>\n            <li>Scoring:</li>\n            <ul>\n              <li>The team with the shortest total time (across all 3 tasks) ranks highest.</li>\n              <li>Penalties: Teams failing to complete all tasks will receive a penalty per uncompleted task.</li>\n            </ul>\n            <li>Qualification: Top [specified number] of teams with the fastest adjusted time will proceed to Round 3.</li>\n          </ul>\n        </li>\n        <li>\n          <strong>Round 3: Item-Finding Task (Riddles)</strong>\n          <ul>\n            <li>Objective: Teams solve riddles that point to hidden items.</li>\n            <li>Teams must find and bring each item to a volunteer for verification.</li>\n            <li>Participants may beg, borrow, or steal items from anywhere on campus and return to the original location.</li>\n            <li>A time duration will be given for this round.</li>\n            <li>The team that finds all items in the shortest time wins.</li>\n            <li>Collaboration between teams is prohibited.</li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Safety and Conduct</h3>\n      <ul>\n        <li>All participants must treat others and campus property with respect.</li>\n        <li>Harassment, vandalism, or disruptive behavior will not be tolerated.</li>\n        <li>In case of emergency, contact the event heads immediately.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Scoring and Winning</h3>\n      <p>The team that completes all tasks in Round 3 in the shortest time will be declared the overall winner.</p>\n    </div>\n\n    <div>\n      <h3>Disqualification and Penalties</h3>\n      <ul>\n        <li>Teams or individuals may be disqualified for rule violations, unsafe behavior, or failure to follow organizer instructions.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Liability and Insurance</h3>\n      <p>Participants acknowledge they are participating at their own risk. The college and organizers are not liable for any injuries, losses, or damages.</p>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Heads: Khushbu: 7250347857 | Leeza: 9508810423 | Subham: 8125263711</li>\n        <li>President (Harshit): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Teams of 2-5. No external help allowed.",
    "minPart": 2,
    "maxPart": 5
  },
  {
    "name": "Paper Dance",
    "description": "Dance with your fav person.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461871/paperdance_qghdva.jpg",
    "prizepool": 3000,
    "regFees": 49,
    "more": "<section>\n  <h2>PAPER DANCE</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        Paper Dance is a fun elimination-based game where teams must dance on a shrinking piece of paper without stepping outside its boundary. The last team standing wins.\n      </p>\n    </div>\n\n    <div>\n      <h3>Team Size and Eligibility</h3>\n      <ul>\n        <li>Each team must consist of exactly 2 members.</li>\n        <li>Teams may be formed as: two boys, two girls, or one boy and one girl.</li>\n        <li>Open to all currently enrolled students of NIT Jamshedpur.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules</h3>\n      <ul>\n        <li>Each team dances on a piece of paper placed on the floor.</li>\n        <li>When the music stops, the paper is folded to half its size.</li>\n        <li>Participants must continue dancing while staying entirely on the paper.</li>\n        <li>If any part of the body touches the floor outside the paper, the team is eliminated.</li>\n        <li>The paper keeps getting smaller after every round, increasing difficulty.</li>\n        <li>The last team standing on the paper wins the game.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li>Strict adherence to paper boundaries throughout the game.</li>\n        <li>Following music cues and instructions.</li>\n        <li>Maintaining balance and coordination as the paper size reduces.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Disqualification</h3>\n      <ul>\n        <li>Touching the floor outside the paper.</li>\n        <li>Ignoring organizer instructions or music cues.</li>\n        <li>Unsafe or inappropriate behavior.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Safety Guidelines</h3>\n      <ul>\n        <li>Wear comfortable, non-slippery footwear (avoid heels).</li>\n        <li>Be mindful of your partner and other teams while dancing.</li>\n        <li>Report any injury or concern to organizers immediately.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Khushbu– +91 7250347857</li>\n        <li> Leeza– +919508810423</li>\n        <li>President (Harshit): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Teams of 2. Come and enjoy.",
    "minPart": 2,
    "maxPart": 2
  },
  {
    "name": "AI-ML Challenge",
    "description": "Build an AI/ML model for a given problem statement.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461667/aiml_e3wc6u.avif",
    "prizepool": 8000,
    "regFees": 248,
    "more": "<section>\n  <h2>AI – ML Challenge</h2>\n  <div>\n    <div>\n      <h3>Objective</h3>\n      <p>\n        To encourage innovation and problem-solving using Machine Learning and Deep Learning techniques. Participants will receive real-world problem statements and must build models with a focus on performance, complexity, and interpretability.\n      </p>\n    </div>\n\n    <div>\n      <h3>Timeline</h3>\n      <ul>\n        <li>April 18: Problem Statement Release</li>\n        <li>April 18–25: Model Development & Documentation</li>\n        <li>April 26: Final Presentation & Evaluation</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Online + Offline (for presentation)</li>\n        <li>Team Size: 1–3 members</li>\n        <li>Resources Allowed: Any tools, libraries, frameworks, or online resources</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ol>\n        <li>Problem statements will be released on April 18.</li>\n        <li>Participants must build complete ML/DL solutions.</li>\n        <li>All steps (data preprocessing, modeling, tuning, training, evaluation) must be shown and explained.</li>\n        <li>Focus on both performance, computational complexity, and presentation.</li>\n        <li>Participants may use any tools, frameworks, or resources.</li>\n        <li>Final submission must include:\n          <ul>\n            <li>Source code</li>\n            <li>Presentation slides</li>\n          </ul>\n        </li>\n        <li>Presentations will be held on April 26 in front of a panel of judges.<br>\n            <strong>Presentation Duration:</strong> 7 minutes (presentation) + 5 minutes (Q&A)</li>\n        <li>The decision of judges will be final.</li>\n      </ol>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Pratap Kumar – 7061400771</li>\n        <li>Event Head: Pronajit Sarkar – 8617406246</li>\n        <li>President (Harshit Shrivastav): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Teams of up to 3. No pre-trained models allowed.",
    "minPart": 1,
    "maxPart": 3
  },
  {
    "name": "Robotics Competition",
    "description": "Compete in a robotics showdown.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461888/robotics_cpxsri.jpg",
    "prizepool": 3000,
    "regFees": 88,
    "more": "Design, build, and program robots to complete challenges.",
    "rules": "Teams of 3-5. Only self-built robots allowed.",
    "minPart": 3,
    "maxPart": 5
  },
  {
    "name": "Blind Coding",
    "description": "Code with your screen turned off.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461678/blindcoding_y20agp.jpg",
    "prizepool": 3000,
    "regFees": 48,
    "more": "<section>\n  <h2>Blind Coding</h2>\n  <div>\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Team Size: Individual</li>\n        <li>Date: April 20</li>\n        <li>Programming Language: Any of your choice</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ul>\n        <li>All participants will be given one common programming problem.</li>\n        <li>Participants will have 2 minutes to view the problem on their screen.</li>\n        <li>They must memorize all key information including inputs, output format, constraints, and logic requirements.</li>\n        <li>Each participant will open a blank Notepad window to write their code.</li>\n        <li>After the 2-minute viewing time, the screen display will be disabled.</li>\n        <li>Participants must code blindly and should save their work regularly using Ctrl+S/Cmd+S.</li>\n        <li>Maximum time limit for the challenge is 30 minutes.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Winner Judgment Criteria</h3>\n      <ul>\n        <li>The winner is the participant whose program compiles and runs successfully according to the given test cases.</li>\n        <li>In case of a tie, the participant who submits first will be declared the winner.</li>\n        <li>If the program compiles but has incorrect output, judging will be based on the number of runtime and logical errors.</li>\n        <li>If there is still a tie, submission time will be the deciding factor.</li>\n        <li>If the program fails to compile, the number of syntax errors will be considered.</li>\n        <li>In all tie situations, the earlier submission time will determine the winner.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Shivam Kumar – 7488542587</li>\n        <li>President (Harshit Shrivastava): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Solo event. No debugging after submission.",
    "minPart": 1,
    "maxPart": 1
  },
  {
    "name": "Ideathon",
    "description": "Pitch innovative tech ideas.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461814/ideathon_l9kggx.jpg",
    "prizepool": 3000,
    "regFees": 45,
    "more": "<section>\n  <h2>Startup Ideathon</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        The Startup Ideathon is a premier platform for innovators and entrepreneurs to showcase their startup ideas and compete for seed funding.\n      </p>\n    </div>\n\n    <div>\n      <h3>Important Rules and Regulations</h3>\n      <ol>\n        <li>Team size: 1–4 members</li>\n        <li>Originality: All ideas must be original and not plagiarized</li>\n        <li>Submission: Submit your pitch deck (PDF or PPTX) along with the registration form</li>\n        <li>Registration deadline: April 15, 2025, 11:59 PM</li>\n        <li>Shortlisting and notifications will be sent after registration closure</li>\n      </ol>\n    </div>\n\n    <div>\n      <h3>Pitch Deck Guidelines</h3>\n      <ul>\n        <li>Include: team name, problem statement, solution, business model canvas, revenue projection, and marketing strategy</li>\n        <li>Ensure the pitch deck is concise and follows the required format</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contact</h3>\n      <ul>\n        <li>Event Head: Sulochan Khadka – +91 7480-831743</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Teams of 1-4. No plagiarism allowed.",
    "minPart": 1,
    "maxPart": 4
  },
  {
    "name": "Movie Mania",
    "description": "A tech-themed movie screening and trivia night.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461828/moviemania_c6mkqb.jpg",
    "prizepool": 2000,
    "regFees": 31,
    "more": "<section>\n  <h2>Movie Mania</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        Movie Mania is a fun and engaging quiz event where participants will watch movie clips or segments and answer questions based on what they’ve seen. Get ready to test your observation and memory!\n      </p>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Team Size: Individual or team of 2 members</li>\n        <li>Genre: Questions may be based on Bollywood, Hollywood, or animated films</li>\n        <li>Round Structure: Multiple short clips followed by question sets</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ul>\n        <li>Clips will be shown only once — full focus required.</li>\n        <li>Each clip will be followed by a timed set of questions.</li>\n        <li>No use of mobile phones or external help is allowed during the event.</li>\n        <li>Each correct answer carries points; some may have negative marking.</li>\n        <li>In case of a tie, a rapid-fire movie trivia round will be conducted.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li>Total score across all rounds.</li>\n        <li>Accuracy and observation skills.</li>\n        <li>Speed in answering during the rapid-fire round (if applicable).</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Disqualification</h3>\n      <ul>\n        <li>Use of phones or any form of cheating.</li>\n        <li>Disruptive behavior or non-cooperation with organizers.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head:Devender: +91 6302385671</li>\n        <li>Event Head:Pronajit: +91 8617406246</li>\n        <li>President (Harshit Shrivastava): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Solo or team event. No internet use allowed.",
    "minPart": 1,
    "maxPart": 2
  },
  {
    "name": "Competitive Programming",
    "description": "A programming event where you can show you problem solving skill",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461691/cp_jlnafm.avif",
    "prizepool": 8000,
    "regFees": 238,
    "more": "<section>\n  <h2>Programming Contest</h2>\n  <div>\n    <div>\n      <h3>Objective</h3>\n      <p>\n        To challenge participants’ problem-solving and programming abilities through a set of curated algorithmic and logical problems.\n      </p>\n      <p>\n        Participants will be expected to solve:\n      </p>\n      <ul>\n        <li>8 to 10 questions</li>\n        <li>In 2 hours</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Timeline</h3>\n      <ul>\n        <li>April 27: Contest Day</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Venue: LHC</li>\n        <li>Team Size: 1–3 members</li>\n        <li>Duration: 2 hours</li>\n        <li>Tools: Each participant can use their own laptop</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ol>\n        <li>The contest will be held on April 27 at the designated venue.</li>\n        <li>All team members must be present during the entire duration of the contest.</li>\n        <li>Code plagiarism and malpractice will lead to disqualification.</li>\n        <li>The decisions of the organizing committee and judges will be final and binding.</li>\n        <li>Teams must submit their final code before the time ends.</li>\n      </ol>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Hitanshu Gavri – 8601103675</li>\n        <li>Event Head: Abhishek Patel – 7753075152</li>\n        <li>President (Harshit Shrivastav): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Team participation event",
    "minPart": 1,
    "maxPart": 3
  },
  {
    "name": "Hackathon",
    "description": "A 24-hour coding competition to develop innovative solutions.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461772/hackathon_joxhp8.jpg",
    "prizepool": 15000,
    "regFees": 298,
    "more": "<section>\n  <h2>Hackathon</h2>\n  <div>\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Team Size: 2–4 members</li>\n        <li>Date: April 26th – 27th</li>\n        <li>Technology Stack: Open – Use any tools, languages, or frameworks</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ul>\n        <li>The problem statement will be revealed at the start of the hackathon.</li>\n        <li>Teams must build a working prototype within the given time limit.</li>\n        <li>Bring your own laptops and necessary tools.</li>\n        <li>Focus on creativity, innovation, and practicality.</li>\n        <li>Final submission must include source code and README/documentation.</li>\n        <li>Each team must present their project to the judges (10–15 minutes).</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Duration</h3>\n      <ul>\n        <li>Total Coding Time: 24 hours</li>\n        <li>Finals: Submission & Presentations</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li>Innovation & Creativity</li>\n        <li>Functionality & Usability</li>\n        <li>Code Quality & Structure</li>\n        <li>Relevance to Problem Statement</li>\n        <li>Presentation Skills</li>\n        <li>Submission Time (used as a tie-breaker)</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Sulochan – 7480831743</li>\n        <li>Event Head: Akash – 7643050429</li>\n        <li>Event Head: Pratap – 7061400771</li>\n        <li>President (Harshit Shrivastav): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Teams of 2-4. No plagiarism allowed.",
    "minPart": 2,
    "maxPart": 4
  },
  {
    "name": "Computer Fundamentals Quiz",
    "description": "A quiz focusing on core computer science concepts.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461854/quiz_ctpyhk.jpg",
    "prizepool": 8000,
    "regFees": 228,
    "more": "<section>\n  <h2>Computer Fundamentals Quiz</h2>\n  <div>\n    <div>\n      <h3>Objective</h3>\n      <p>\n        To assess and strengthen participants' foundational knowledge in core computer science subjects. The quiz will cover topics such as:\n      </p>\n      <ul>\n        <li>Database Management Systems (DBMS)</li>\n        <li>Object-Oriented Programming (OOPs)</li>\n        <li>Operating Systems (OS)</li>\n        <li>Computer Networks (CN)</li>\n        <li>Standard Template Library (STL)</li>\n        <li>Basic C/C++ Programming</li>\n        <li>Basic Web Technologies (HTML, CSS, JavaScript)</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Timeline</h3>\n      <ul>\n        <li>April 20: Quiz Event</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Venue: LHC</li>\n        <li>Team Size: 1–2 members</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules & Guidelines</h3>\n      <ol>\n        <li>The quiz will be conducted on April 20.</li>\n        <li>All team members must be present during the quiz.</li>\n        <li>Fair participation is expected.</li>\n        <li>Final results will be announced after evaluation.</li>\n        <li>The decision of judges will be final.</li>\n      </ol>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Pratap Kumar – 7061400771</li>\n        <li>President (Harshit Shrivastav): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Team event. No external help allowed.",
    "minPart": 1,
    "maxPart": 2
  },
  {
    "name": "Typing Speed Challenge",
    "description": "A test of speed and accuracy in typing.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461938/typingspeed_eb28pd.webp",
    "prizepool": 3000,
    "regFees": 41,
    "more": "<section>\n  <h2>TYPING EVENT RULES</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        Compete to achieve the highest typing speed (WPM) and accuracy across three elimination rounds.\n      </p>\n    </div>\n    <div>\n      <h3>Eligibility</h3>\n      <ul>\n        <li>Open to registered participants</li>\n        <li>Devices: Laptop/desktop only (no mobile/tablet)</li>\n        <li>Stable internet + power backup required</li>\n      </ul>\n    </div>\n    <div>\n      <h3>Event Structure</h3>\n      <ul>\n        <li>\n          <strong>Round 1: Speed Test</strong>\n          <ul>\n            <li>Duration: 5 minutes</li>\n            <li>Content: Plain English text (no symbols/numbers)</li>\n            <li>Scoring: WPM × Accuracy</li>\n          </ul>\n        </li>\n        <li>\n          <strong>Round 2: Elimination</strong>\n          <ul>\n            <li>Duration: 2-3 minutes</li>\n            <li>Content: Text with numbers/symbols (e.g., @, #, 25%)</li>\n            <li>Scoring: Real-time leaderboard</li>\n          </ul>\n        </li>\n        <li>\n          <strong>Final Round: Advanced Challenge</strong>\n          <ul>\n            <li>Content: Advanced-level vocabulary and complex terms + code snippets</li>\n            <li>Winner: Highest composite score (Speed × Accuracy)</li>\n          </ul>\n        </li>\n      </ul>\n    </div>\n    <div>\n      <h3>Scoring System</h3>\n      <ol>\n        <li>Words Per Minute (WPM) = (Total characters ÷ 5) ÷ Time (minutes)</li>\n        <li>Accuracy = (Correct characters ÷ Total typed characters) × 100</li>\n        <li>Final Score = WPM × Accuracy (e.g., 70 WPM × 90% = 63)</li>\n      </ol>\n    </div>\n    <div>\n      <h3>Disqualification</h3>\n      <ul>\n        <li>Copy-pasting</li>\n        <li>Switching windows/tabs</li>\n        <li>Auto-typing tools × Misconduct</li>\n      </ul>\n    </div>\n    <div>\n      <h3>Logistics</h3>\n      <p>\n        Date: 26 April 2025 | Time: 1:00 PM IST | Venue: (Will be shared post-registration)\n      </p>\n    </div>\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Heads: Prateek Pandey: 9838387750 | Shubham: 8125263711</li>\n        <li>President (Harshit): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Solo event. No autocorrect or external tools allowed.",
    "minPart": 1,
    "maxPart": 1
  },
  {
    "name": "Tech Reel",
    "description": "Create a short tech-related video reel.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774462110/techreel_gwp4c0.jpg",
    "prizepool": 2000,
    "regFees": 40,
    "more": "<section>\n  <h2>Tech Reel </h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        Tech Reel is a creative and educational video-based event where participants are invited to make a short reel on any tech-related topic. Whether it’s a trending concept, a quick tutorial, myth-busting, or highlighting an innovation—educate and excite with your reel!\n      </p>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Dates: 18th April – 26th April</li>\n        <li>Task: Create and upload a short tech reel</li>\n        <li>Platform: Any social media (Instagram, YouTube Shorts, etc.)</li>\n        <li>Hashtag: Use <strong>#TechReel2025</strong> and tag the event page </li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Guidelines</h3>\n      <ul>\n        <li>Reels must be uploaded between 18th–26th April.</li>\n        <li>Content must be original and related to technology.</li>\n        <li>Use of AI tools is allowed but should be disclosed if used.</li>\n        <li>Plagiarism or reuse of existing content will lead to disqualification.</li>\n        <li>Reel format: MP4 preferred (1080x1920 if possible).</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li><strong>Engagement:</strong> Likes, shares, and comments on a single reel during the event window.</li>\n        <li><strong>Content Quality:</strong> Creativity, clarity, and informational value.</li>\n        <li><strong>Tech Relevance:</strong> Accuracy and relevance to current tech topics.</li>\n        <li><strong>Ethical Conduct:</strong> No fake engagement or misleading content.</li>\n      </ul>\n      <p><em>Note: While engagement is a key factor, final judgment will be made by the judging panel, and their decision will be final and binding.</em></p>\n    </div>\n\n    <div>\n      <h3>Contact</h3>\n      <ul>\n        <li>Event Head: Abhijeet Kr Trivedi</li>\n        <li>Contact: 6202076965</li>\n      </ul>\n      <ul>\n        <li>Event Head:Devender</li>\n        <li>Contact:6302385671</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Solo or team event. Must be original content.",
    "minPart": 1,
    "maxPart": 2
  },
  {
    "name": "PUBG, Valorant and FreeFire Tournament",
    "description": "Competitive gaming showdown in PUBG and Valorant.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461979/valorant_a1lvas.avif",
    "prizepool": 3000,
    "regFees": 61,
    "more": "<section>\n  <h2>PUBG, Valorant, and Free Fire Tournament</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <p>\n        Competitive gaming showdown featuring PUBG, Valorant, and Free Fire in a knockout-style tournament. Cash prizes await the top players.\n      </p>\n    </div>\n\n    <div>\n      <h3>Event Details</h3>\n      <ul>\n        <li>Mode: Offline</li>\n        <li>Games: PUBG, Valorant & Free Fire</li>\n        <li>Team Size: 4–5 members per team</li>\n        <li>Prize Pool: ₹3000</li>\n        <li>Registration Fee: ₹61 per team</li>\n        <li>Format: Knockout-style tournament</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules</h3>\n      <ul>\n        <li>Follow the standard rules of PUBG, Valorant, and Free Fire as applicable.</li>\n        <li>No cheating, use of hacks, or third-party tools is permitted.</li>\n        <li>Failure to adhere to rules will result in immediate disqualification.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Additional Info</h3>\n      <p>\n        Knockout-style tournament with cash prizes for winners. Ensure fair play and team coordination to advance through rounds.\n      </p>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Aryan Patole: +91 9221616761</li>\n        <li>Event Head: Hamad: +91 7462885920</li>\n        <li>President (Harshit Shrivastav): 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>",
    "rules": "Follow standard game rules. No cheating allowed.",
    "minPart": 4,
    "maxPart": 5
  },
  {
    "name": "Frontend Design Contest",
    "description": "Design and build a stunning frontend UI.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461716/frontend_tfpi8a.jpg",
    "prizepool": 4000,
    "regFees": 109,
    "more": "<section>\n  <h2>Frontend Design Challenge</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <ul>\n        <li>Date: 19th April</li>\n        <li>Time Limit: 3 Hours</li>\n        <li>Venue: LHC</li>\n        <li>Team Size: 1–3 members</li>\n      </ul>\n      <p>\n        Unleash your creativity and frontend skills to build a visually appealing and responsive web interface based on a surprise theme or problem statement revealed at the start of the challenge.\n      </p>\n    </div>\n\n    <div>\n      <h3>Development Rules</h3>\n      <ol>\n        <li>\n          <strong>Time-Bound Challenge:</strong> All designing and coding must be completed within 3 hours. Late submissions will not be considered.\n        </li>\n        <li>\n          <strong>Team Composition:</strong> Teams may consist of 1 to 3 members. No external help or collaboration is allowed.\n        </li>\n        <li>\n          <strong>No Pre-Built Templates:</strong> Submissions must be made from scratch. Use of templates from platforms like ThemeForest, GitHub, etc., is prohibited.\n        </li>\n        <li>\n          <strong>Use of Styling Frameworks:</strong> Participants may use any styling frameworks such as Tailwind CSS, Bootstrap, or Material UI.\n        </li>\n        <li>\n          <strong>No Plagiarism:</strong> All designs must be original. Copying existing websites or code is strictly forbidden and will result in disqualification.\n        </li>\n      </ol>\n    </div>\n\n    <div>\n      <h3>Hosting Bonus</h3>\n      <p>\n        Participants who host their final project on platforms like Vercel, Netlify, GitHub Pages, etc., and provide a live link along with the code repository will earn bonus points.\n      </p>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li>Creativity & Innovation – Uniqueness of the idea and presentation</li>\n        <li>UI/UX Design – Interface cleanliness, intuitiveness, and usability</li>\n        <li>Responsiveness – Compatibility across various devices</li>\n        <li>Code Quality – Clean, readable, and well-structured code</li>\n        <li>Hosting – Bonus points for deployed and working live project</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Disqualification Triggers</h3>\n      <ul>\n        <li>Submissions made after the deadline</li>\n        <li>Using pre-built templates or copied designs</li>\n        <li>Using AI tools without modification or understanding</li>\n        <li>Violating team-size limits or engaging in unfair practices</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Abhijeet Kr Trivedi – 6202076965</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "No templates allowed. Must be coded from scratch.",
    "minPart": 1,
    "maxPart": 3
  },
  {
    "name": "Ethical Hacking Challenge",
    "description": "Test your penetration testing and cybersecurity skills.",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461705/ethicalhacking_enp2rk.jpg",
    "prizepool": 5000,
    "regFees": 150,
    "more": "<section>\n  <h2>Hack IT</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <ul>\n        <li>Date: 27th April</li>\n        <li>Time Duration: 2 Hours</li>\n        <li>Venue: LHC</li>\n        <li>Team Size: 1–3 members</li>\n      </ul>\n      <p>\n        Welcome to Hack IT, a cybersecurity event designed to simulate real-world scenarios in web penetration testing. Participants will work with a given vulnerable website and perform tasks to uncover vulnerabilities. The goal is to think like a hacker—ethically—and identify potential threats before real attackers can.\n      </p>\n    </div>\n\n    <div>\n      <h3>Challenge Structure</h3>\n      <ul>\n        <li><strong>Target Website:</strong> A specially crafted website containing common web vulnerabilities will be provided.</li>\n        <li><strong>Primary Tasks:</strong> Participants are expected to identify vulnerabilities such as:\n          <ul>\n            <li>SQL Injection (SQLi)</li>\n            <li>Cross-Site Scripting (XSS)</li>\n            <li>Cross-Site Request Forgery (CSRF)</li>\n            <li>Authentication & Authorization Bypasses</li>\n          </ul>\n        </li>\n        <li><strong>Note:</strong> Focus will be on web-based attack vectors only — no network-level attacks or brute-forcing allowed.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules</h3>\n      <ul>\n        <li><strong>✔ Ethical Hacking Only:</strong> Use only techniques within ethical hacking scope. No destructive actions.</li>\n        <li><strong>✔ Stay Within Scope:</strong> Do not access or modify files/systems outside the target website.</li>\n        <li><strong>✔ Original Effort:</strong> All discoveries must be made during the event. No prior walkthroughs or online solutions.</li>\n        <li><strong>✔ Judges’ Decision is Final:</strong> All scoring decisions are final and non-negotiable.</li>\n        <li><strong>✔ Unfair Means = Disqualification:</strong> Malicious behavior, sharing answers, or misusing tools will lead to disqualification.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li><strong>Vulnerability Coverage:</strong> Number and variety of valid vulnerabilities identified</li>\n        <li><strong>Technical Understanding:</strong> Accuracy in explaining how each flaw works</li>\n        <li><strong>Reporting Clarity:</strong> Clear vulnerability report with potential impact and fix suggestions</li>\n        <li><strong>Ethical Conduct:</strong> Professional and responsible behavior throughout the event</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        <li>Event Head: Abhijeet Kr Trivedi – 6202076965</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "No illegal activities. Only provided targets allowed.",
    "minPart": 1,
    "maxPart": 3
  },
  {
    "name": "Golgappa Eating Challange",
    "description": "The golgappa eating challange for Girls only. Eat as much golgappa as you can",
    "logo": "https://res.cloudinary.com/dzewgmuty/image/upload/v1774461733/golgappa_dm8zw0.jpg",
    "maxPart": 1,
    "minPart": 1,
    "regFees": 30,
    "prizepool": 1000,
    "more": "<section>\n  <h2>Golgappa Challenge</h2>\n  <div>\n    <div>\n      <h3>Event Overview</h3>\n      <ul>\n        <li>Date: 26th April</li>\n        <li>Time Duration: 2 Hours</li>\n        <li>Venue: LHC</li>\n        <li>Team Size: Individual Participation</li>\n      </ul>\n      <p>\n        Welcome to the Golgappa Challenge — an exciting blend of fun, food, and friendly competition! The event will begin with a thrilling round of Musical Chairs to shortlist participants. Those who survive the first round will face off in the ultimate Golgappa eating contest. Show your reflexes, then your appetite!\n      </p>\n    </div>\n\n    <div>\n      <h3>Challenge Structure</h3>\n      <ul>\n        <li><strong>Round 1 – Musical Chair:</strong> All participants will play musical chairs. Those eliminated won’t proceed to the next round.</li>\n        <li><strong>Round 2 – Golgappa Eating:</strong> Finalists will compete to eat the maximum number of golgappas within a time limit. Water will be provided. No wastage allowed.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Rules</h3>\n      <ul>\n        <li><strong>✔ Fair Play:</strong> No pushing, pulling, or unfair tactics during Musical Chair.</li>\n        <li><strong>✔ Eat Responsibly:</strong> Golgappas must be properly consumed — no spitting, wasting, or throwing food.</li>\n        <li><strong>✔ Health First:</strong> If any participant feels unwell, they must immediately inform the coordinators.</li>\n        <li><strong>✔ Judges’ Decision is Final:</strong> All decisions made by judges will be final and binding.</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Judging Criteria</h3>\n      <ul>\n        <li><strong>Musical Chair:</strong> Participants must survive Round 1 to qualify for Round 2.</li>\n        <li><strong>Golgappa Count:</strong> Number of golgappas eaten within the time limit</li>\n        <li><strong>Clean Eating:</strong> Eating without wastage or spillage</li>\n        <li><strong>Sportsmanship:</strong> Maintaining fun spirit and positive energy throughout the event</li>\n      </ul>\n    </div>\n\n    <div>\n      <h3>Contacts</h3>\n      <ul>\n        \n        <li>Khushbu– +91 7250347857</li>\n        <li> Leeza– +919508810423</li>\n        <li>Harshit – 8957144430</li>\n      </ul>\n    </div>\n  </div>\n</section>\n",
    "rules": "Just come and enjoy."
  }
]

export async function POST() {
  try {
    await connectDB();
    const inserted = await Event.insertMany(events);

    return NextResponse.json({
      success: true,
      message: "Events inserted successfully",
      count: inserted.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}