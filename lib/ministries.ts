export type Ministry = {
  slug: string;
  name: string;
  blurb: string;
  image?: string;
  sections: { heading: string; body: string | string[] }[];
};

export const ministries: Ministry[] = [
  {
    slug: "children",
    name: "Children's Department",
    blurb: "Nurturing the spiritual growth of children from infancy to adolescence.",
    sections: [
      {
        heading: "Our Mission",
        body: "The Children's Department is a loving and vibrant unit in the church dedicated to nurturing the spiritual growth of children from infancy to adolescence, in a safe, encouraging, Bible-based environment. Through age-specific classes and events, our experienced teachers and volunteers guide children in their spiritual journey, helping them grow into confident, compassionate young people who go on to support families in raising a generation of faithful leaders.",
      },
      {
        heading: "We Help Children",
        body: [
          "Develop a personal relationship with God",
          "Grow in understanding of Christian values and principles",
          "Build lasting friendships with peers and mentors",
          "Discover their unique gifts and talents",
          "Serve others and share God's love",
        ],
      },
      {
        heading: "For Children",
        body: [
          "Respect and obey teachers and elders",
          "Listen attentively to lessons and activities",
          "Share materials and take turns",
          "Follow church rules and guidelines",
          "Be kind and considerate towards others",
        ],
      },
      {
        heading: "For Teachers",
        body: [
          "Attend training and meetings",
          "Prepare lessons and materials in advance",
          "Maintain confidentiality and discretion",
          "Model Christian values and behavior",
          "Encourage participation and inclusivity",
        ],
      },
    ],
  },
  {
    slug: "youth",
    name: "Youth Department",
    blurb: "A vibrant community of young people pursuing worship, connection, and growth.",
    sections: [
      {
        heading: "About",
        body: "The Youth Department of Covenant Baptist Church is a vibrant community of young people passionate about worship, connection, and growth. Our mission is to create an atmosphere where youths can deepen their relationship with God, foster meaningful relationships with one another, and engage in productive interactions that inspire spiritual and personal development.",
      },
      {
        heading: "Our Gatherings",
        body: "We meet on the first Sunday of every month for an exciting time of fellowship, prayer, and exploration of God's Word. Our gatherings are designed to be engaging, interactive, and relevant to the lives of young people.",
      },
    ],
  },
  {
    slug: "evangelism",
    name: "Evangelism & Missions",
    blurb: "Equipping members to live as ready, willing soul-winners.",
    sections: [
      {
        heading: "Our Calling",
        body: "Every member is called to the work of evangelism (Matthew 28:19\u201320). This department exists to equip and mobilize the church for that calling, at home and beyond.",
      },
      {
        heading: "Guidelines",
        body: [
          "We are all called to do evangelism \u2014 Matthew 28:19\u201320",
          "Members must be born again",
          "Members should be mission-minded and soul winners",
          "Always ready to go out for mission, any time and any day",
          "Every mission coordinator in each department is a member of the Evangelism & Missions Department",
        ],
      },
    ],
  },
  {
    slug: "house-fellowship",
    name: "House Fellowship",
    blurb: "Small groups (cell groups) building discipleship and community between Sundays.",
    sections: [
      {
        heading: "Overview",
        body: "House Fellowship, also known as Cell Groups or Small Groups, plays a vital role in church growth and community building \u2014 fostering discipleship, meaningful relationships, and care for members in a more intimate setting than a Sunday service allows.",
      },
      {
        heading: "Key Functions",
        body: [
          "Foster spiritual growth and discipleship",
          "Build meaningful relationships and community",
          "Provide support and care for members",
          "Encourage evangelism and outreach",
          "Develop leaders and promote ownership",
        ],
      },
      {
        heading: "Benefits",
        body: [
          "Intimacy and accountability",
          "Personalized attention and care",
          "Opportunities for leadership development",
          "Enhanced spiritual growth",
          "Community outreach and service",
          "Prayer support and intercession",
          "Social connections and friendships",
        ],
      },
    ],
  },
  {
    slug: "bsf",
    name: "BSF / Teenagers",
    blurb: "Empowering secondary school and university students to integrate faith with academic life.",
    sections: [
      {
        heading: "About",
        body: "Welcome to the Teenagers/Baptist Students' Fellowship (BSF) of Covenant Baptist Church Byazhin \u2014 a vibrant community dedicated to empowering students from secondary school to higher institutions. Our mission is to inspire teenagers to integrate their faith into their academic pursuits, guiding them to discover their purpose amidst life's challenges. Through uplifting teachings, prayer, and mentorship, we aim to foster a generation rooted in faith, grounded in God's Word, and equipped for academic excellence, leadership, and service. We value faith, integrity, compassion, excellence, and service.",
      },
    ],
  },
  {
    slug: "choir",
    name: "Choir (CBSC)",
    blurb: "Leading the church into God's presence through Spirit-inspired worship music.",
    image: "/choir.jpg",
    sections: [
      {
        heading: "About",
        body: "God, in His infinite mercy and grace, has always been helping the Choir Department of Covenant Baptist Church, Kubwa, to play a significant role in leading the church into the presence of God through soul-lifting, Holy Spirit-inspired music, creating a spiritually saturated atmosphere for worship. Our responsibility is to minister in song and to ensure worship services start promptly at the set time.",
      },
      {
        heading: "Vision",
        body: "To become a globally recognized Spirit-filled choir, leveraging the grace and mercies of God to pull down strongholds and take the world for Jesus through the sound of our music.",
      },
      {
        heading: "Objectives",
        body: [
          "To be a spiritually sensitive department",
          "To write and minister Spirit-filled, soul-enriching music that propagates the gospel of Jesus",
          "To train choir members toward musical excellence",
        ],
      },
      {
        heading: "Membership",
        body: [
          "Understands Baptist core values and has completed the church's membership orientation",
          "Ready to attend worship service regularly and punctually",
          "Led by the Holy Spirit or gifted in music, for God's glory (1 Peter 4:10\u201311)",
          "Ready to observe a four-week probation period, including rehearsals and an audition",
          "Willing to comply with CBSC's rules and leadership",
          "Age 16 and above",
          "Willing to attend rehearsals at least twice a week",
        ],
      },
    ],
  },
  {
    slug: "media",
    name: "Media Department",
    blurb: "Running the cameras, sound, and livestream so every service reaches further.",
    sections: [
      {
        heading: "About",
        body: "The Media Department manages every aspect of the church's information, communication, and technology \u2014 from cameras, lights, and screens on-site, to the church's online presence, ensuring those who can't attend in person still engage meaningfully through live streams and online content. No prior technical experience is required, just a heart to serve.",
      },
      {
        heading: "Vision",
        body: "To become a global and exemplary media department, using technology to enhance the experiential presence of Jesus Christ for members and non-members, on-site and online.",
      },
      {
        heading: "Objectives",
        body: [
          "To be a spiritually sensitive department",
          "To create godly content that propagates Jesus and the vision of the church",
          "To develop youths who are both vibrant for Jesus and ICT-proficient",
        ],
      },
      {
        heading: "Core Values",
        body: [
          "Spirituality \u2014 the physical is controlled by the spiritual, so prayer and word study come first",
          "Support \u2014 encouraging and supporting one another and everyone we serve",
          "Professional \u2014 committed to excellent service, growing our skills to serve God's people well",
          "Submission \u2014 to one another and to church leadership, out of mutual respect",
          "Joint Responsibility \u2014 accountable individually and as a team",
        ],
      },
      {
        heading: "What the Team Does",
        body: [
          "Recording \u2014 high-quality audio/video of messages and music, shared on the church's channels",
          "Visual \u2014 clear, readable on-screen lyrics and information",
          "Photography \u2014 capturing memorable moments from services and events",
          "Online Streaming \u2014 broadcasting services live to an online audience",
          "Continuous Training \u2014 keeping the team current with modern technology",
        ],
      },
    ],
  },
];
