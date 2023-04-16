import createImageFromText from "@/hooks/useCreateEntry";

export type CreateRoute = {
  pathname: string;
  title: string;
  description: string;
  nextConfig?: CreateRoute | null;
  backConfig?: CreateRoute | null;
};

export const allCreateRoutes: any[] = [
  // character, storyboard, cover, styles, review.
  {
    pathname: "/create/styles",
    title: "Styles",
    description: "Add styles to your story.",
  },
  {
    pathname: "/create/characters",
    title: "Characters",
    description: "Add characters to your story.",
  },
  {
    pathname: "/create/storyboard",
    title: "Storyboard",
    description: "Add storyboard to your story.",
  },
  {
    pathname: "/create/cover",
    title: "Cover",
    description: "Add cover to your story.",
  },
  {
    pathname: "/create/review",
    title: "Review",
    description: "Review your story.",
  },
];

// create all routes with back config and next config
export const createRoutes: CreateRoute[] = allCreateRoutes.map((route, i) => {
  const nextRoute = allCreateRoutes[i + 1] || null;
  const backRoute = allCreateRoutes[i - 1] || null;
  return {
    ...route,
    nextConfig: nextRoute,
    backConfig: backRoute,
  };
});


export type ComicStyle = {
  id?: string;
  artist: string;
  artwork?: {
    url: string;
  };
};

export const comicStyles: ComicStyle[] = [
  {
    artist: "Quentin Blake",
    artwork: {
      url: "https://i.pinimg.com/564x/2a/dc/57/2adc578f2878df6a5fdf21f7d130aa7a.jpg",
    },
  },
  {
    artist: "Barry Blitt",
    artwork: {
      url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/origin-story-barry-blitt.jpg",
    },
  },
  {
    artist: "Rebecca Sugar",
    artwork: {
      url: "https://d2lzb5v10mb0lj.cloudfront.net/common/salestools/previews/3005077/3005077p2.jpg",
    },
  },
  {
    artist: "Chris Ware",
    artwork: {
      url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/looking-up-chris-ware.jpg",
    },
  },
  {
    artist: "Jon Klassen",
    artwork: {
      url: "https://i.pinimg.com/564x/81/49/57/8149576b7911c6a4d34997d7a8adfaca.jpg",
    },
  },
  {
    artist: "Roz Chast",
    artwork: {
      url: "https://media.newyorker.com/photos/610c6b381c677cbbf716f0d5/master/w_2560%2Cc_limit/210816_CVN_Chast_Beach_Mom_STORY.jpg",
    },
  },
  {
    artist: "Neal Adams",
    artwork: {
      url: "https://m.media-amazon.com/images/I/91QmRn+-PnL.jpg",
    },
  },
  // { artist: "Charles Addams" },
  // { artist: "Artgerm" },
  // { artist: "AssasinMonkey" },
  {
    artist: "Peter Bagge",
    artwork: {
      url: "https://i.pinimg.com/236x/57/1e/9f/571e9f08233b06a85fad7d3f26c94a60--weird-peter-otoole.jpg",
    },
  },
  // { artist: "Ralph Bakshi" },
  {
    artist: "Carl Barks",
    artwork: {
      url: "https://blogs.bellevue.edu/library/wp-content/uploads/2021/11/Carl-Barks-Scrooge-water-color.jpg",
    },
  },
  // { artist: "Jon Bauer" },
  // { artist: "Jasmine Becket-Griffith" },
  // { artist: "Ludwig Bemelmans" },
  {
    artist: "Elsa Beskow",
    artwork: {
      url: "https://gustavienne.com/wp-content/uploads/2020/10/4f919efd3d064956ba487e28ad59cd6a-1.jpg",
    },
  },
  // { artist: "Enki Bilal" },
  {
    artist: "Don Bluth",
    artwork: {
      url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/51w51eBnO4L._AC_UF1000,1000_QL80_.jpg",
    },
  },
  {
    artist: "Mary Blair",
    artwork: {
      url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81GfEBJAz9L._AC_UF1000,1000_QL80_.jpg",
    },
  },
  // { artist: "John Blanche" },
  // { artist: "Brian Bolland" },
  // { artist: "Mark Brooks" },
  // { artist: "Tim Burton" },
  // { artist: "John Buscema" },
  // { artist: "Randolph Caldecott" },
  // { artist: "J. Scott Campbell" },
  {
    artist: "Pascal Campion",
    artwork: {
      url: "https://www.shannonassociates.com/copyrighted/artists/campion131256/fs/2749_052517.jpg",
    },
  },
  {
    artist: "Milton Caniff",
    artwork: {
      url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/5123Sil+N9L.jpg",
    },
  },
  // { artist: "Eric Carle" },
  // { artist: "cgsociety" },
  {
    artist: "Howard Chaykin",
    artwork: {
      url: "https://i.pinimg.com/564x/3d/53/de/3d53de12e6d9f4ac1df99538fd855677.jpg",
    },
  },
  {
    artist: "Frank Cho",
    artwork: {
      url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81xvKjO4OnL.jpg",
    },
  },
  // { artist: "Craola" },
  {
    artist: "Robert Crumb",
    artwork: {
      url: "https://i.etsystatic.com/25146500/r/il/a56d0c/2742645862/il_1080xN.2742645862_jxbt.jpg",
    },
  },
  {
    artist: "Farel Dalrymple",
    artwork: {
      url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/91-fB-UzR1L._AC_UF1000,1000_QL80_.jpg",
    },
  },
  {
    artist: "Geof Darrow",
    artwork: {
      url: "https://d2lzb5v10mb0lj.cloudfront.net/darkhorse/blog/-2022/scctbkcov.jpg",
    },
  },
  // { artist: "Alan Davis" },
  // { artist: "Steve Dillon" },
  // { artist: "Tony DiTerlizzi" },
  // { artist: "Steve Ditko" },
  {
    artist: "Kevin Eastman",
    artwork: {
      url: "https://www.supanova.com.au/wp-content/uploads/2020/02/Teenage-Mutant-Ninja-Turtles-666x1024.jpg",
    },
  },
  // { artist: "Will Eisner" },
  {
    artist: "Hal Foster",
    artwork: {
      url: "https://i.pinimg.com/564x/e6/62/f8/e662f83670a53a479293112e28847a2c.jpg",
    },
  },
  // { artist: "Dave Gibbons" },
  {
    artist: "Matt Groening",
    artwork: {
      url: "https://m.media-amazon.com/images/M/MV5BYjFkMTlkYWUtZWFhNy00M2FmLThiOTYtYTRiYjVlZWYxNmJkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX1000_.jpg",
    },
  },
  // { artist: "William Gropper" },
  // { artist: "George Grosz" },
  {
    artist: "Butch Hartman",
    artwork: {
      url: "https://i.pinimg.com/originals/44/86/fc/4486fcde41371393070c2ab6bacef206.jpg",
    },
  },
  {
    artist: "Hergé",
    artwork: {
      url: "https://upload.wikimedia.org/wikipedia/en/0/03/TintinandtheWorldofHerge-BookCover.gif",
    },
  },
  // { artist: "Jamie Hewlett" },
  {
    artist: "Stephen Hillenburg",
    artwork: {
      url: "https://i.pinimg.com/564x/7f/fa/7c/7ffa7c15262df637209caa7a94bd6104.jpg",
    },
  },
  // { artist: "Adam Hughes" },
  // { artist: "Alexander Jansson" },
  {
    artist: "Mike Judge",
    artwork: {
      url: "https://images.squarespace-cdn.com/content/v1/540fcbffe4b0335e669ce909/1590608557134-DYLA7JVMHDFNHA630SXI/_MASTER_ViceMagCover190.jpg?format=1500w",
    },
  },
  {
    artist: "Jean Jullien",
    artwork: {
      url: "https://cdn.sanity.io/images/0wi4u8fy/production/79a6782ac3d2b229354eb50a41e7fb2d2bcad9b7-1091x1500.jpg",
    },
  },
  // { artist: "M.W. Kaluta" },
  // { artist: "Brian Kesinger" },
  // { artist: "Bryan Konietzko" },
  // { artist: "Andy Kubert" },
  // { artist: "Abigail Larson" },
  {
    artist: "Gary Larson",
    artwork: {
      url: "https://i.pinimg.com/564x/eb/76/9b/eb769b08f367407a42a0ecf41df8a7a8.jpg",
    },
  },
  {
    artist: "Jeff Lemire",
    artwork: {
      url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1639384586i/59709164.jpg",
    },
  },
  {
    artist: "Roy Lichtenstein",
    artwork: {
      url: "https://i.pinimg.com/564x/62/87/47/6287478d2ffc85c28d9a91be54812e3e.jpg",
    },
  },
  // { artist: "Michal Lisowski" },
  // { artist: "Cory Loftis" },
  // { artist: "Kevin Maguire" },
  // { artist: "Bill Mantlo" },
  {
    artist: "Craig McCracken",
    artwork: {
      url: "https://assets-prd.ignimgs.com/2021/01/30/kid-cosmic-button-1611967638541.jpg?width=300&dpr=2",
    },
  },
  // { artist: "Todd McFarlane" },
  {
    artist: "Aaron McGruder",
    artwork: {
      url: "https://flxt.tmsimg.com/assets/p9766190_b_v10_aa.jpg",
    },
  },
  // { artist: "Mike Mignola" },
  // { artist: "Frank Miller" },
  // { artist: "Jean-Baptiste Monge" },
  // { artist: "Dustin Nguyen" },
  // { artist: "Paul Pope" },
  {
    artist: "Beatrix Potter",
    artwork: {
      url: "https://i.pinimg.com/564x/c1/7b/57/c17b57b0a4a4cfbb325fc44e21faa400.jpg",
    },
  },
  // { artist: "John Romita Jr." },
  // { artist: "Tony Sart" },
  {
    artist: "Marjane Satrapi",
    artwork: {
      url: "https://www.artinterview.com/wp-content/uploads/2020/10/M.Satrapi-Annonciation-2020-120x100cm-copie-843x1024.jpg",
    },
  },
  {
    artist: "Richard Scarry",
    artwork: {
      url: "https://prodimage.images-bn.com/pimages/0683904542496_p0_v2_s600x595.jpg",
    },
  },
  {
    artist: "Charles M. Schulz",
    artwork: {
      url: "https://ichef.bbci.co.uk/images/ic/1920x1080/p06pr61v.jpg",
    },
  },
  {
    artist: "Dr. Seuss",
    artwork: {
      url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1408924330i/275313.jpg",
    },
  },
  // { artist: "Walt Simonson" },
  // { artist: "Art Spiegelman" },
  // { artist: "Jim Starlin" },
  {
    artist: "William Steig",
    artwork: {
      url: "https://societyillustrators.org/wp-content/uploads/2020/09/lifetime-steig.jpg",
    },
  },
  // { artist: "Ralph Steadman" },
  {
    artist: "Saul Steinberg",
    artwork: {
      url: "https://media.mutualart.com/Images/2018_03/29/09/091836863/effaa041-ac49-4c1c-914b-5caed5187775_570.Jpeg",
    },
  },
  // { artist: "Jim Steranko" },
  // { artist: "Jillian Tamaki" },
  {
    artist: "Shaun Tan",
    artwork: {
      url: "https://cdn.shopify.com/s/files/1/0654/5757/products/TFOS_reading_group_1000x.jpg?v=1615561682",
    },
  },
  {
    artist: "Jacques Tardi",
    artwork: {
      url: "https://i.pinimg.com/originals/b8/94/e1/b894e1d1bed4d9774a7e802d705d044b.jpg",
    },
  },
  {
    artist: "Genndy Tartakovsky",
    artwork: {
      url: "https://31.media.tumblr.com/06bdbca08d80bc4211356ab59d17497d/tumblr_inline_n6tvje9pyV1ruw146.jpg",
    },
  },
  {
    artist: "Piper Thibodeau",
    artwork: {
      url: "https://i.pinimg.com/564x/e4/3e/4d/e43e4d47e8ec4ad71ae8f777828564dd.jpg",
    },
  },
  // { artist: "Frank Thorne" },
  // { artist: "Bruce Timm" },
  // { artist: "Sergio Toppi" },
  {
    artist: "Garry Trudeau",
    artwork: {
      url: "https://www.askart.com/photos2/2016/HER20160218_94666/LG_92249_1.jpg",
    },
  },
  {
    artist: "Albert Uderzo",
    artwork: {
      url: "https://pbs.twimg.com/media/ET3cia8XkAEDIL-?format=jpg&name=900x900",
    },
  },
  {
    artist: "Tomi Ungerer",
    artwork: {
      url: "https://media.newyorker.com/photos/5cc75fd784305f1e3d7cf436//w_2055,h_2400,c_limit/150119_r26021-2055.jpg",
    },
  },
  {
    artist: "Jhonen Vasquez",
    artwork: {
      url: "https://pbs.twimg.com/media/D0ss_GRUcAADvLB?format=jpg&name=large",
    },
  },
  {
    artist: "Charles Vess",
    artwork: {
      url: "https://static.wikia.nocookie.net/marvel_dc/images/9/93/Neil_Gaiman_and_Charles_Vess%27_Stardust_Vol_1_3.jpg/revision/latest?cb=20111229000128",
    },
  },
  {
    artist: "Pendleton Ward",
    artwork: {
      url: "https://resizing.flixster.com/p4bNRltTA96oMxss5CJVBj0YvSU=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvUlRUVjIwNDEwMy53ZWJw",
    },
  },
  {
    artist: "Bill Watterson",
    artwork: {
      url: "https://dyn1.heritagestatic.com/lf?set=path%5B2%2F0%2F2%2F4%2F5%2F20245269%5D%2Csizedata%5B850x600%5D&call=url%5Bfile%3Aproduct.chain%5D",
    },
  },
  {
    artist: "Al Williamson",
    artwork: {
      url: "https://images.squarespace-cdn.com/content/v1/5a3f16b1edaed8ba03b28ab4/1611113656141-XOE75ED4VFOKLN0215QR/AW-cover-HC-WEB.jpg?format=1000w",
    },
  },
  // { artist: "Bill Willingham" },
  // { artist: "Basil Wolverton" },
  {
    artist: "Ashley Wood",
    artwork: {
      url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1239579996i/6395084.jpg",
    },
  },
  // { artist: "Wally Wood" },
  // { artist: "Bernie Wrightson" },
];

export type StoryboardSample = {
  artwork: {
    url: string;
  };
  description?: string;
};

export const storyboardSamples: StoryboardSample[] = [
  {
    artwork: {
      url: "https://mymodernmet.com/wp/wp-content/uploads/2017/03/puuung-love-is-1.jpg",
    },
    description:
      "I lay here in bed.",
  },
  {
    artwork: {
      url: "https://images.squarespace-cdn.com/content/v1/54fc8146e4b02a22841f4df7/1624708748070-A25VMWA19RLIW3MUQ94L/cover2.jpeg",
    },
    description:
      "We sit here by the window",
  },
  {
    artwork: {
      url: "https://i.pinimg.com/736x/40/b5/ff/40b5ff11e9226543c9287ffde1bba69f.jpg",
    },
    description:
      "I sit here in my room, FaceTiming with my boyfriend, I can't help but feel a sense of connection and warmth. Even though we may be miles apart, technology has allowed us to bridge the distance and share in each other's lives. As we talk, sharing stories and laughter, I feel his presence with me, even though he's not physically here. It's moments like these that make me appreciate the power of love and human connection, and how even the simplest interactions can bring so much joy and happiness. Looking at his smiling face on the screen, I am reminded of the beauty and depth of our relationship, and how lucky I am to have him in my life. Even though we may be apart for now, I know that our love will only grow stronger with time and distance, and that no matter where life may take us, we'll always have each other to lean on. As we say our goodbyes, promising to talk again soon, I feel a sense of warmth and contentment wash over me, grateful for the technology that brings us closer together and the love that binds us forever.",
  },
  {
    artwork: {
      url: "https://i.ytimg.com/vi/d5VBJhlbtnk/maxresdefault.jpg",
    },
    description:
      "I walk through the library, scanning the shelves for a book to read, I catch a glimpse of my boyfriend on the other side of the bookshelf. Our eyes meet through the gaps in the books, and a smile spreads across our faces. It feels like we're the only ones in the library, lost in our own little world. I walk around the bookshelf, and we embrace each other tightly, our arms wrapping around each other's waist. The quiet hush of the library surrounds us, but it's as if the world has disappeared, leaving only us behind. In his arms, I feel safe and loved, and I know that no matter what life may throw our way, we'll always have each other to lean on. As we break apart, our eyes still locked in a deep gaze, I feel grateful for this simple yet meaningful moment of connection and love.",
  },
  {
    artwork: {
      url: "https://static.boredpanda.com/blog/wp-content/uploads/2016/06/love-is-illustrations-korea-puuung-98-574fed60683c4__880.jpg",
    },
    description:
      "The rain comes down hard, but we take off running, hand in hand, laughing and splashing through puddles. We're soaked to the bone, but we don't care. As we reach our doorstep, we share a deep kiss, knowing that this is where we belong - together, in the safety and comfort of our love.",
  },
  {
    artwork: {
      url: "https://e1.pxfuel.com/desktop-wallpaper/522/148/desktop-wallpaper-puuung-on-instagram-coffee-time-1%EF%B8%8F%E2%83%A3-an-art-print-greeting-card-and-post-card-are-available-on-redbubble-puuung1-redbub%E2%80%A6-puuung.jpg",
    },
    description:
      "We sit across from each other at the coffee shop, our eyes locked in a deep gaze. The bustling world around us fades away, leaving only the warmth of our connection. His smile, his eyes, his touch - everything about him fills me with joy. As we finish our coffee and say our goodbyes, I feel grateful for this moment of love and connection.",
  },
  {
    artwork: {
      url: "https://ninisencoree.files.wordpress.com/2020/04/kakaotalk_20200411_174604120.jpg",
    },
    description:
      "We sit on the couch, huddled under a warm blanket, gazing up at the starry sky. A shooting star streaks across the sky, leaving a trail of light in its wake. We gasp in awe, our eyes locked on the fading light. In this moment, it feels like the whole universe has come alive. We hold each other tightly, grateful for this moment of love and connection under the starry night sky.",
  },
  {
    artwork: { url: "https://i.ytimg.com/vi/3MGC6olB1F4/maxresdefault.jpg" },
    description:
      "We sit together in the cozy room, lost in our books, with the beautiful beach scene outside. Our cat sits between us, captivated by the view. As we turn the pages, I'm reminded of how much I love being with him. Even in silence, there's an unspoken connection between us. As we finish our books, we turn to each other, our eyes locking in a deep gaze. The beauty of the beach pales in comparison to the beauty of our love, and I know that as long as we're together, everything will fall into place.",
  },
  {
    artwork: { url: "https://i.ytimg.com/vi/HBWC9wTk4tQ/maxresdefault.jpg" },
    description:
      "She looks stunning on the phone, and I'm speechless. Even after all this time, her beauty still leaves me in awe. I'm grateful for technology that keeps us connected, and seeing her face fills me with a sense of comfort and belonging. Our love is strong enough to endure the distance between us. As she finishes her call and looks up at me, I'm reminded of how much I love her. In this moment, I feel grateful for her presence in my life, and I know that our love will always endure.",
  },
  {
    artwork: { url: "https://i.ytimg.com/vi/FrjPOH8EHyk/maxresdefault.jpg" },
    description:
      "Walking along, we spot something small and curious on the ground. We don't know what it is, but its intricate design leaves us fascinated. As we examine it, I'm struck by the depth of our connection. Even in moments of uncertainty, our love and shared sense of wonder bring us closer together. We take it home as a keepsake, its mystery only adding to its allure. I'm grateful for the small moments of discovery and adventure that we share, and I know that no matter what happens, our love will always lead us on new and exciting journeys.",
  },
];
