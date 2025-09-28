import axios from "axios";

const YT_API_KEY = "AIzaSyCl_PwelxQiCZ6JWM4j-nIuo5GkBTfrPp8";

const playYouTubeVideo = async (query) => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 1,
          q: query,
          type: "video",
          key: YT_API_KEY,
        },
      }
    );

    const videoId = res.data.items[0]?.id?.videoId;
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    }
  } catch (err) {
    console.error(err, "Error fetching YouTube video");
  }
};

export default playYouTubeVideo;
