import React from "react";
import { FiChevronRight, FiHeart, FiMessageCircle } from "react-icons/fi";

type Props = {};

const testImages = [
  "https://scontent.fbkk3-6.fna.fbcdn.net/v/t39.30808-6/353818920_10159807046743163_8737942603971987796_n.jpg?_nc_cat=106&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeG8-BwkW8RUkYyAcLm6CatKnmam6WSO0KueZqbpZI7Qq_RfgsOA8U7Q821uDFh55lXmZTPD0mTzmlq8dlBPhs0U&_nc_ohc=6a7e0FBsRGoAX_3OZow&_nc_zt=23&_nc_ht=scontent.fbkk3-6.fna&oh=00_AfB6bE9_dJJ7XGH1_Hwi5aUohuIEpiNk7bfAfHBFbjtEkg&oe=64ABB905",
  "https://scontent.fbkk4-1.fna.fbcdn.net/v/t39.30808-6/354439898_10159807047133163_6768855538649437727_n.jpg?_nc_cat=107&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeE7YJQMQEn9TYEiYsLiryNQOb-zbH13fp45v7NsfXd-nseHieO5Xsg-GLVF5wg78WPIXusJxhWEU3cPqzQHw-BA&_nc_ohc=VpXElHu18lkAX83Yexw&_nc_zt=23&_nc_ht=scontent.fbkk4-1.fna&oh=00_AfAvgqYpFcXTFIFshiMNqcoJ-vVrCowYXJhxf34ir-EYQg&oe=64AC2628",
  "https://scontent.fbkk4-4.fna.fbcdn.net/v/t39.30808-6/354083186_10159807047453163_998887638336039546_n.jpg?_nc_cat=109&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeHiXCb6DUMUkfN7k1TpVzEHck2npsRt_5pyTaemxG3_muvxcnJg1Dy26R6OcM2yBIdvhXAD1PGCQE6LI1jhUBxY&_nc_ohc=ANCGXZvtjuAAX-Fc9n9&_nc_zt=23&_nc_ht=scontent.fbkk4-4.fna&oh=00_AfCdv199b755XaOXPBvLqi7QjoU03RKw-IGYSEI4PDDXeg&oe=64ABF3D6",
  "https://scontent.fbkk4-3.fna.fbcdn.net/v/t39.30808-6/353822257_10159807048373163_5888567837950915034_n.jpg?_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeHcAgKC9edWRF3H0QZ7qU_DFzAslogm-PwXMCyWiCb4_BI9zY4Rbd_CUKQrPLsY_F3cVXAnqTwufqtiqcKRD-k0&_nc_ohc=8kXr6SOrSTIAX9qHqsc&_nc_zt=23&_nc_ht=scontent.fbkk4-3.fna&oh=00_AfA9KO_qMzrguTMICDKxK_n9mW7L2SXQOgynpv7iLBbrWw&oe=64ACA682",
  "https://scontent.fbkk4-4.fna.fbcdn.net/v/t39.30808-6/354234197_10159807048833163_1308584622823905678_n.jpg?_nc_cat=109&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeEMCozGwTQ8VvU7bcJ0kr5a3e4ijlIoY3Td7iKOUihjdGCrAKYyn6nZDNx-z1z9bqqDyk4MjbIeNUFW558h00Zp&_nc_ohc=c9R8CXJmqqkAX_d5WzX&_nc_zt=23&_nc_ht=scontent.fbkk4-4.fna&oh=00_AfC_AoXL4_JkmLjXAYRKQ9AbwMSkOF8Q4j8Ieo1IEQATfQ&oe=64ABFBA2",
  "https://scontent.fbkk4-2.fna.fbcdn.net/v/t39.30808-6/353838091_10159807048848163_7150401306764542428_n.jpg?_nc_cat=102&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeGieI0X7c8mTVEvnG1qpAJFmmnf2PoE5rGaad_Y-gTmsSDk37zclc16qeH1AFlk39ZiVY1pzMIaVVsCMVeH2Tuv&_nc_ohc=74tJc4W9dk0AX-Y2f3R&_nc_zt=23&_nc_ht=scontent.fbkk4-2.fna&oh=00_AfBdzUu_M9vaI57HYA1yK0b7Lo_e0DKTSw34BzEdOGVzzQ&oe=64AB3C20",
  "https://scontent.fbkk3-4.fna.fbcdn.net/v/t39.30808-6/354047370_10159807048853163_8838710006469397902_n.jpg?_nc_cat=108&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeFIXKWMbP7DTfidoEXLiHP76YIjh-J7NDzpgiOH4ns0PEbUw0h6x-IyTug3ul_Q58Ri6z_dcWY8LpjKH_ixz0Eq&_nc_ohc=NGyJXR1c--MAX_pTj3-&_nc_oc=AQlBN1GlZ2E3GfczOrdIxbaNuQlfQzul7Q2neYlZChCkV0XaEAByOUpUuPuou1Wy32o&_nc_zt=23&_nc_ht=scontent.fbkk3-4.fna&oh=00_AfCeFVIl_h3GOUXQH62sqrRfo-qmO5WcSEtgJ41yXoGkOw&oe=64AC2F5D",
  "https://scontent.fbkk4-2.fna.fbcdn.net/v/t39.30808-6/354056671_10159807048998163_6463859779391754864_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeHFQNdvR8dqvNLwXekQVSkoNFWfKB8DJtc0VZ8oHwMm1_HC3SEyR2yaRnkR-irda6r5ZrMbfIrvJtMex0mRkmlm&_nc_ohc=dXxp8YgJJjwAX95gfOX&_nc_zt=23&_nc_ht=scontent.fbkk4-2.fna&oh=00_AfAhLPDBiiRUQtvsmX2p9cnNI7zfkJnSEP8XwdmpLutuFQ&oe=64AAFF9D",
  "https://scontent.fbkk3-3.fna.fbcdn.net/v/t39.30808-6/354041352_10159807049208163_1469141622081631524_n.jpg?_nc_cat=103&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeGOLTi7zsC6OeXlA-SuFHKSUyQ9QZceMZJTJD1Blx4xkgXFRmf4qWD60qQ7Xq_kG0Ht1I0J-1ZGikIUorq--ipd&_nc_ohc=oxkUM6-Oqe8AX8L48AJ&_nc_zt=23&_nc_ht=scontent.fbkk3-3.fna&oh=00_AfCmjVKRJDDUQl0pPI0evnvptO_qwjpGNvGCbXBTiePvQQ&oe=64ABDC81",
  "https://scontent.fbkk4-4.fna.fbcdn.net/v/t39.30808-6/354229405_10159807049018163_156664407838307626_n.jpg?_nc_cat=109&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeFu-_sx6RlGzBc4I6kJTZYoUMBi6sl1y0RQwGLqyXXLRD0GnoKK5fjE7o9WBoAp2MmvzMmSjtzdEA1jH-IaZjQ4&_nc_ohc=Y1qn-XNLQToAX8dAZWh&_nc_zt=23&_nc_ht=scontent.fbkk4-4.fna&oh=00_AfCdFh5sE4Tj7WumW4qXhS8tKk1LTqEFlNvAVZtQg9uO5Q&oe=64AC30D4",
  "https://scontent.fbkk3-2.fna.fbcdn.net/v/t39.30808-6/354026303_10159807049368163_7670566124623912684_n.jpg?_nc_cat=104&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeGLyuIKszf1HM1EWJHfebFqwV-R4k1rkuzBX5HiTWuS7Nuiyzpbdl85do7ZPA0GJZBShVeURAAyPVwKxuEQ4pGG&_nc_ohc=rQqIh2nnzDAAX_bh6UA&_nc_zt=23&_nc_ht=scontent.fbkk3-2.fna&oh=00_AfAMWGueirHLaJShiKVC9rtvSN7y1fP8MIwc9xWEyalkUQ&oe=64ABB640",
  "https://scontent.fbkk4-2.fna.fbcdn.net/v/t39.30808-6/354056141_10159807048913163_8098018975763440381_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeGcVbZU68Te_JG9rkzH8feYhWTGQDLcF7CFZMZAMtwXsPAPgaspSLs9frGGglEuVh6YLFxViSfbYaCyz2mup2Ao&_nc_ohc=921prCZz3sEAX_2BK91&_nc_zt=23&_nc_ht=scontent.fbkk4-2.fna&oh=00_AfBS71y9D-5Q3wE6_DsddX5bptWk_AsLf-J5H-WDKP-mXg&oe=64ACBC6F",
  "https://scontent.fbkk4-3.fna.fbcdn.net/v/t39.30808-6/354038012_10159807049143163_5805163108994394131_n.jpg?_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeHDgeUnI0WOS5zFW-k2Kb1sK7eyD0uQ4gsrt7IPS5DiCzbYjb0A-KpeL7I7UOcBh7pGpbz_4CoXrUhKx6ai5bmQ&_nc_ohc=cIAKyamdWywAX_4IkGR&_nc_zt=23&_nc_ht=scontent.fbkk4-3.fna&oh=00_AfCf7CBsQEp3HFutXi11UosEEgdTeYKJRRLwuaLZM7ojYg&oe=64AB97FC",
  "https://scontent.fbkk4-3.fna.fbcdn.net/v/t39.30808-6/354237334_10159807049533163_4518734925427971046_n.jpg?_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeEk5_mC7VmObiALUV96vtNiZLfvxiU31Uhkt-_GJTfVSAGNG9EoICn-2IL7ec4L2-K2g896ZEJhc16c1GnmjCNf&_nc_ohc=i-M9NJ1nG68AX-scw7z&_nc_oc=AQlDbMX1k7T_3duWDjfJEwFUQoMROh79o-Gfdlc7kCHqE_UFuMy4uvmVrjKww64UniU&_nc_zt=23&_nc_ht=scontent.fbkk4-3.fna&oh=00_AfAEP649p9uRb7EJbo-XhYXl8DW0gQbbNEFf-N4eKOJeVg&oe=64ABB658",
];
const EpisodePage = (props: Props) => {
  return (
    <div className="flex flex-col w-full items-center overflow-auto">

      {/* navigation bar */}
      <div className="flex sticky top-0 flex-row items-center justify-between w-full p-3 bg-light-background-primary dark:bg-dark-background-primary backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90 border-y border-light-divider dark:border-dark-divider px-6">
        <div className=" flex flex-row items-center gap-3">
          <button>
            <span className="font-semibold">Episode Title</span>
          </button>
          <FiChevronRight className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary"/>

          <button>
            <span className="font-medium text-light-text-secondary dark:text-dark-text-secondary">Episode #12345</span>
          </button>
        </div>

        <div className=" flex flex-row items-center gap-3">
          <div className=" flex flex-row items-center gap-2">
            <FiHeart className="w-[18px] h-[18px] text-light-text-secondary dark:text-dark-text-secondary"/>
            <span className="">1.2k</span>
          </div>

          <div className=" flex flex-row items-center gap-2">
            <FiMessageCircle className="w-[18px] h-[18px] text-light-text-secondary dark:text-dark-text-secondary"/>
            <span className="">1.2k</span>
          </div>
        </div>

      </div>

      <div className="flex flex-col w-full max-w-3xl h-[300vh]">
      {testImages.map((image, index) => (
          <img
            src={image}
            key={index}
            className="w-full h-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default EpisodePage;
