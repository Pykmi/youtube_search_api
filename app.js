(function($) {
  // setup the developer api key and initial state
  const API_KEY = "";
  let state = { keywords: "", videos: false };

  // shorthand to console.log
  const log = console.log;

  // shorthands to UI elements
  const keywords = $("#searchKeywords");
  const results = $("#searchResults");
  const button = $("#searchAction");
  const screen = $("#screen");

  // loggable actions
  const ACTION_SEARCH = "ACTION_SEARCH";
  const ACTION_LOAD_VIDEO = "ACTION_LOAD_VIDEO";

  async function apiCall() {
    const options = {
      type: "GET",
      url: "https://www.googleapis.com/youtube/v3/search",
      data: {
        key: API_KEY,
        q: state.keywords,
        maxResults: 5,
        part: "snippet",
        type: "video",
        videoEmbeddable: true
      }
    };

    log(`${ACTION_SEARCH}: with keywords -> ${state.keywords}`);

    //const results = await jQuery.ajax(options).catch(err => logError(err));
    const results = mockApiCall();
    setState({ videos: results.items });
    refresh();
  }

  function setState(newState) {
    state = Object.assign({}, state, newState);
  }

  function logError(error) {
    log(`StatusCode: ${error.status}.`);
    log(`${error.responseJSON.error.message}.`);
  }

  function load(videoId) {
    log(ACTION_LOAD_VIDEO);
    screen.attr("src", `https://www.youtube.com/embed/${videoId}`);
    screen.show();
  }

  function refresh() {
    log(state.videos);
    results.empty();
    $.each(state.videos, (_, video) => buildVideoInfo(video));
  }

  function buildVideoInfo(video) {
    const info = $(`<div>`)
      .attr("class", "video_info")
      .attr("data-id", video.id.videoId)
      .append(buildVideoTitle(video.snippet.title))
      .append(buildVideoDescription(video.snippet.description));

    results.append(info);
  }

  function buildVideoTitle(title) {
    return $(`<div>${title}</div>`);
  }

  function buildVideoDescription(description) {
    return $(`<div>${description}</div>`);
  }

  function getVideoIdFromEvent(e) {
    return e.currentTarget.dataset.id;
  }

  button.click(() => apiCall());
  keywords.bind("input", () => setState({ keywords: keywords.val() }));

  $(document).on("click", ".video_info", e => load(getVideoIdFromEvent(e)));
})(jQuery, mockApiCall);
