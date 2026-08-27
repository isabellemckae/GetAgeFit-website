// Trainer profiles — PROMPT §13.
//
// Names, roles, and credentials below are sourced from the current live
// getagefit.com team roster (docs/CONTENT-STATUS.md → "Legacy Site
// Baseline"), captured August 2026 — this is real, audited content, not
// invented.
//
// `story` is now populated for every trainer with the detailed biography
// text from the live getagefit.com "Meet the Team" page (Demo #4
// follow-up), copied verbatim — not rewritten, summarized, or expanded.
// `philosophy` stays a bracketed placeholder: the source bios read as a
// single combined biography rather than a distinct "in their own words"
// coaching-philosophy statement, and per that follow-up's instructions we
// are not manufacturing a new "trainer philosophy" section that wasn't
// actually provided.
//
// ⚠️ CONFIRM before launch: this roster may have changed since capture
// (new hires, departures). Cross-check against the current team page.

export type Trainer = {
  slug: string;
  name: string;
  role: string;
  credentials: string[];
  specialties: string[];
  philosophy: string;
  story: string;
  photoLabel: string;
};

const needsPhilosophy =
  "[INSERT COACHING PHILOSOPHY, IN THIS TRAINER'S OWN WORDS]";

export const trainers: Trainer[] = [
  {
    slug: "james-petersen",
    name: "James Petersen",
    role: "Certified Personal Trainer",
    credentials: ["NASM CPT", "NASM Nutrition Coach", "NASM Senior Fitness Specialist"],
    specialties: ["Balance & core training", "200-hr community yoga training"],
    philosophy: needsPhilosophy,
    story: `James brings a unique approach to his coaching at Get Age Fit, which makes him a coveted trainer among elite clients. By using circuit training, high intensity interval training, and supersetting, along with time under tension training, his clients achieve results they can be proud of.

James lifted his first weight when he began swimming competitively at the age of 15. He continued to swim competitively at the collegiate level at Texas A&M University. It was then that he developed a passion for staying fit. He has a strong belief in functional movement improving quality of life to increase longevity through exercise and nutrition. His hobbies include daily yoga and meditation practice, running, swimming, biking, and hiking.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "maria-arellano",
    name: "Maria Arellano",
    role: "Certified Personal Trainer",
    credentials: ["CPT", "First Aid/CPR"],
    specialties: ["BS Biology & Spanish", "M.Ed. Education Administration"],
    philosophy: needsPhilosophy,
    story: `Maria uses her experience with her own 12-Week Transformation to coach clients to lasting results, including proper techniques for training and why that's important. But it's also important to Maria that her clients are instilled with a love of working out. Her workouts are the perfect balance of intense and fun.

Fitness, in some form, has always been a part of Maria's life. She began dancing at the age of 5 and began teaching at a dance studio at the age of 14. She taught dance of many forms from 1986-2012. Part of those years were spent as the assistant director of the Georgetown High School Georgettes where she began her teaching career in 1996. She has since stepped away from her teaching career to focus on personal training, which she absolutely loves. Her favorite part is watching her clients become more fit, get stronger and healthier, and enjoy a better quality of life. Maria has been married for 26 years and has three children 23, 20 and 9. Maria loves to be outdoors. She loves to fish, hike, swim, walk, and eat.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "robert-dolan",
    name: "Robert Dolan, MD",
    role: "Personal Trainer & Physician",
    credentials: ["MD, NYU School of Medicine", "NASM CPT", "NASM Nutrition Coach"],
    specialties: [
      "Strength & cardiovascular health",
      "Clients returning from deconditioning, injury, or illness",
    ],
    philosophy: needsPhilosophy,
    story: `Robert brings a unique blend of medical training and hands-on coaching to his work at Get Age Fit. With a strong foundation in human physiology and movement, he focuses on helping clients build strength, improve cardiovascular fitness, and move with confidence as they age.

Robert began strength training as a teenager and later trained as a physician, serving as a medical officer in the U.S. Navy. These experiences shaped his disciplined, practical approach to health, performance, and long-term resilience.

His coaching style is especially well-suited for clients who are deconditioned, returning from injury or illness, or who value clear instruction and proper technique. Robert believes that well-designed strength and cardio training are among the most effective tools for improving health and quality of life over time.

After meeting Theo Thurston, Robert was drawn to the mission and culture of Get Age Fit. He is passionate about helping clients feel stronger, more capable, and more confident in their bodies, while creating a supportive environment where steady, sustainable progress can thrive.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "paula-jones",
    name: "Paula Jones",
    role: "Certified Personal Trainer",
    credentials: ["NASM CPT"],
    specialties: ["NFF Figure Competitor", "British Horse Society Instructor"],
    philosophy: needsPhilosophy,
    story: `Paula's belief in and approach to strong, healthy living has deep roots. She worked as a trainer with Get Age Fit in 2021 and 2022. After spending time in Portugal, she returned to Texas following the passing of her husband. His battle with cancer deepened her belief in the importance of maintaining health through strength training, regular exercise, and a balanced lifestyle—especially as we age. With an even greater commitment to health and fitness, Paula joined the Get Age Fit team again. Outside the gym, Paula enjoys time with her horse, Topaz, along with thrifting, reading, dancing, traveling, and spending time with family and friends. Most weekends are dedicated to church and relaxing. Paula is passionate about helping clients achieve their goals, and would love to have you on her schedule!`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "chip-collerain",
    name: "Chip Collerain",
    role: "Certified Personal Trainer",
    credentials: ["CPT", "BS Mechanical Engineering"],
    specialties: ["Sustainable, doable lifestyle change"],
    philosophy: needsPhilosophy,
    story: `Chip's philosophy regarding health and fitness makes him a valuable asset to the Get Age Fit team. Chip's goal is to coach clients into changing their lifestyles in a way that is doable and fun. His clients learn to adopt a "want to" attitude over a "have to" attitude, which makes their health and fitness journeys long-lasting and sustainable. When not at the gym, Chip enjoys woodworking and scuba diving, two passions that give him fascinating stories to share with his clients and team.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "isa-lozano",
    name: "Isa Lozano",
    role: "Certified Personal Trainer",
    credentials: ["CPT", "Certified Behavior Change Specialist"],
    specialties: [
      "Sustainable body recomposition",
      "Healthy relationship with fitness & nutrition",
    ],
    philosophy: needsPhilosophy,
    story: `Isa has shown herself to be master at helping clients achieve sustainable body recomposition and improved confidence. Her ability to help clients build strength while fostering a healthy relationship with fitness and nutrition ensures the results they achieve will be sustainable and long-lasting. Her experience with her own incredible 12-Week Transformation makes her an ideal trainer for those looking for similar results. As a bodybuilding enthusiast currently training for competition, her commitment to continued growth in the health and fitness field makes her atop-notch trainer at Get Age Fit`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "tish-strandboge",
    name: "Tish Strandboge",
    role: "Certified Personal Trainer",
    credentials: ["BA English", "CPT", "Certified Nutrition Coach", "GGS Menopause Coaching Specialist"],
    specialties: ["Menopause & midlife coaching"],
    philosophy: needsPhilosophy,
    story: `Empowering active adults to be strong and live life to the fullest is Tish's passion and purpose, and she has the client results to prove it. If she's not in the gym empowering clients or fine-tuning her own fitness, she can be found on the tennis courts, at a concert, traveling, surfing, or hanging out with family and friends.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "robin-winkles",
    name: "Robin Winkles",
    role: "Certified Personal Trainer",
    credentials: ["BA Health Education", "Athletic Training (minor)", "CPT", "Nutrition Coach"],
    specialties: ["Physical-therapy background"],
    philosophy: needsPhilosophy,
    story: `Though Robin didn't begin her personal training career right away, health and fitness has been her passion since high school. She traveled with her university's volleyball team as their athletic trainer, and spent years working in the physical therapy field. She is passionate about strength, cardio fitness, and nutrition, and how those fit into a long-term, sustainable, healthy lifestyle. Robin's strengths lie in the personal care and attention she gives to each and every client she trains. Her positive attitude is contagious, and her ability to meet you where you are with coaching tools that are customized for you is what makes any training experience with Robin unique, effective, and valuable.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "christy-wall",
    name: "Christy Wall",
    role: "Certified Personal Trainer",
    credentials: ["NASM CPT"],
    specialties: ["Older-adult training", "Cardiovascular health", "Nutrition"],
    philosophy: needsPhilosophy,
    story: `Christy is an NASM Certified Personal Trainer with a passion for helping others achieve their health and fitness goals. She has always prioritized fitness in her own life, training with personal trainers and using circuit and endurance training to stay active and healthy. Christy has completed three half marathons, experiences that instilled in her the value of discipline and perseverance.

After joining Get Age Fit, Christy completed the 12-Week Transformation Program and experienced its incredible results firsthand. This success inspired her to guide others through the program, helping them unlock their potential and transformtheir lives.

Christy's mission is to support clients—particularly older adults—in building strength, improving cardiovascular health, and embracing better nutrition. She sees every client as more than just a participant—they become a friend whose success she genuinely cares about. At Get Age Fit, Christy is dedicated to empowering people to live stronger, healthier, and more fulfilling lives at any age.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "neon-luong",
    name: "Neon Luong",
    role: "Certified Personal Trainer",
    credentials: ["BS Kinesiology", "CPT"],
    specialties: ["Body recomposition", "Hypertrophy & performance"],
    philosophy: needsPhilosophy,
    story: `As a first-generation immigrant, Neon struggled to find his identity in his early 20s. Fitness and physical activities provide a haven for him to express himself. Dabbling into calisthenics, bodybuilding, weightlifting, and powerlifting, Neon realized the positive impact of physical movements on the human body. His first client was actually his mother, who was undergoing menopause in her 60s. Helping his mom regain fitness and independence, he discovered he can meddle his passion for fitness and helping others. After his realization, he decided to major in Kinesiology. Going through his personal training journey in various settings such as commercial gyms, private corporate fitness centers, in-home training, etc., he has acquired much experience in empowering others through fitness. Priding himself on being evidence-based, he specializes in helping clients with both body recomposition goals (muscle gain, fat loss) and performance-oriented goals (faster, bigger, more powerful).`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "jeff-venditte",
    name: "Jeff Venditte",
    role: "Certified Personal Trainer",
    credentials: ["CPT", "CPR/AED", "NASM Corrective Exercise Specialization"],
    specialties: ["Corrective exercise"],
    philosophy: needsPhilosophy,
    story: `Throughout my life, I have participated in a range of sports and physical activities. Upon beginning my professional career in engineering and sales, I encountered significant workplace pressures and found it increasingly difficult to allocate time for both family and personal wellness. Years of inconsistent exercise and suboptimal dietary choices eventually led to health concerns that necessitated a shift in my lifestyle. This realization prompted my retirement and a renewed commitment to regular exercise; however, sustaining consistency initially remained a challenge.

At my wife's suggestion, we enrolled in a 12-week transformative program at GAF. The measurable improvements and genuine enjoyment from this experience encouraged us to continue beyond the initial session. During this period, I discovered a passion for supporting others on their own paths to wellness. As a result, I pursued further training in fitness and achieved certification as a NASM Certified Personal Trainer (CPT).

I am dedicated to assisting individuals who aim to enhance muscle mass, strength, balance, and overall well-being. Outside the gym, I remain current with advancements in fitness research, actively participate in our daughters' lives, and enjoy activities such as golfing, camping, hiking, walking our dogs, and maintaining our yard (not really much fun, but good exercise).`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "will-roberts",
    name: "Will Roberts",
    role: "Fitness Coach",
    credentials: ["18+ years coaching experience"],
    specialties: ["Athletes through older adults", "Post-physical-therapy training"],
    philosophy: needsPhilosophy,
    story: `With over 18 years of coaching experience, Will has worked with everyone from high level athletes to weekend warriors, young people to the elderly (4-87 years), extreme weight loss, "post-physical therapy" training…and everything in between.

Will has a passion for removing the limitations (aches, pains, weakness) that hold people back so they can go and have epic adventures!

In his own sports career, Will played several years of minor pro hockey before switching over and competing in American Ninja Warrior for three seasons, even making it to the finals in Las Vegas!

Will's life mission statement is to impart "strength and courage"!`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "keith-stolle",
    name: "Keith Stolle",
    role: "Certified Personal Trainer",
    credentials: ["BA Healthcare Administration", "CPT"],
    specialties: ["GetAgeFit transformation graduate turned trainer"],
    philosophy: needsPhilosophy,
    story: `Keith started his transformation on his own, wanting to get healthier. He was finding it hard to keep motivated and wasn't making the gains he desired. That's when he found Get Age Fit and started his 12-week transformation. In working with a trainer, Keith was able to exceed his goals within those 12 weeks. He continued working with his trainer for another few months before deciding to become a certified personal trainer himself. Keith is dedicated to helping others achieve their fitness goals and to live a healthier lifestyle.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "ali-tabei",
    name: "Ali Tabei",
    role: "Certified Personal Trainer",
    credentials: ["Fitness Specialist", "Senior Fitness Specialist", "TRX Trainer", "Strength & Conditioning Coach"],
    specialties: ["Bodybuilding & fitness background"],
    philosophy: needsPhilosophy,
    story: `Ali is a Body Transformation Specialist, an IFBB athlete, a Mr. Wisconsin Bodybuilding Champion, and Bodybuilding Specialist. In addition to the certifications listed above, he also has specializations in Weight Loss Management and Nutrition Specialist. Ali has over 20 years of experience and a strong passion for helping people achieve sustainable results. He works with clients at all levels, from complete beginners to elite athletes and competitive bodybuilders.

Whether your goal is to lose body fat, improve overall health, manage weight long-term, prevent disease, train for an athletic or bodybuilding career, or gain a solid understanding of fitness and nutrition, Ali has the expertise to guide you safely and effectively.

Ali believes fitness is a way of life, not a temporary fix. He specializes in helping clients overcome physical limitations, build confidence, and achieve long-term success through structured training, smart programming, and sustainable nutrition strategies.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "tracie-stolle",
    name: "Tracie Stolle",
    role: "Certified Personal Trainer",
    credentials: ["CPT"],
    specialties: ["Flexible training", "Time under tension", "Clients 19–85+"],
    philosophy: needsPhilosophy,
    story: `Tracie has been a dedicated personal trainer at Get Age Fit since early 2024, combining her passion for fitness with firsthand experience in the gym's 12-week transformation program. She brings empathy and insight to every client, shaped in part by her family's journey with type 1 and type 2 diabetes and her belief in the power of strength training and nutrition.

Working with clients ages 19 to 85+, Tracie creates personalized, flexible training plans inspired by a Body for Life approach, emphasizing time under tension for maximum results. Whether you're just starting or ready to level up, she's committed to helping you build strength, confidence, and lasting health.`,
    photoLabel: "Trainer photo needed",
  },
  {
    slug: "travis-strawser",
    name: "Travis Strawser",
    role: "Certified Personal Trainer",
    credentials: ["BS Business Administration (Marketing)", "NASM CPT", "Certified Massage Therapist", "Certified Stretch Coach"],
    specialties: ["Massage & stretch-assisted recovery"],
    philosophy: needsPhilosophy,
    story: `Travis brings a hands-on, results-driven approach to his coaching at Get Age Fit, combining deep knowledge of human anatomy with years of military discipline and professional bodywork experience. His background allows him to guide clients through strength training, functional mobility, and recovery techniques that elevate both performance and overall well-being. Travis specializes in educating clients on the why behind the movement — the form, the strategy, and the science — making him a go-to expert for those serious about long-term results.

Travis discovered his passion for physical training during his time in the military and has since evolved into a true human body guru. His love for helping others unlock their full potential fuels his work every day. Outside the gym, Travis is a devoted gamer, food enthusiast, and die-hard sports fan. He believes that fitness isn't just a routine — it's a lifestyle that should be understood, enjoyed, and sustained.`,
    photoLabel: "Trainer photo needed",
  },
];

// Homepage preview shows a handful of trainers, not the full roster.
export const featuredTrainerSlugs = ["james-petersen", "robert-dolan", "isa-lozano"];
