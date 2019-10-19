# rp-recording

> Recording functionality for [`ractive-player`](https://github.com/ysulyma/ractive-player/).

Take a look at [`rp-cursor`](https://github.com/ysulyma/rp-cursor) for how to make a third-party recorder.

More documentation forthcoming.

## Usage
```JSX
import {Player} from "ractive-player";
import Recording from "rp-recording";

// ...

return (
  <Player plugins={[Recording]}>
  </Player>
);
```

### Cues

Press `w` to go back a slide, `e` to advance a slide. When recording, you should probably only advance a slide. You will usually want this on.

### Audio

**It is necessary to access the page over HTTPS in order to record audio.**
This is a good guide for setting up SSL for local development: https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec

This will record audio files, to be used with the Audio element.
