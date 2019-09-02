# ractive-editor

> Editor for making ractives. Intended to be used with [`ractive-player`](https://github.com/ysulyma/ractive-player/).

This module provides an interface for authoring _ractives_, to be played with [`ractive-player`](https://github.com/ysulyma/ractive-player/).

This was originally made just for my own personal use, and it's still in the process of being turned into something generally usable. Right now the documentation is this README and "read the source". In a couple places you will need to modify the source yourself.

Putting `{...draggable}` on an element makes a thing draggable, see [`object-map.tsx`](https://github.com/ysulyma/ractive-editor/blob/master/src/object-map.tsx) and [`draggable.ts`](https://github.com/ysulyma/ractive-editor/blob/master/src/draggable.ts)

## Usage
```JSX
import {Player} from "ractive-player";
import Editor from "ractive-editor";

// ...

return (
  <Player plugins={[Editor]}>
  </Player>
);
```

## Authoring tips

1. To achieve fast and responsive animation, React is often too slow and it is necessary to work directly with Refs. I would love to be wrong about this but it's been my experience. Or maybe there's some nifty Fiber thing that can be done. This applies even more so with MathJax; MathJax renders are expensive, so it is often better to render the MathJax once, and subsequently directly modify the textContent of the spans it outputs. Sometimes it is necessary to do evil in order to achieve good.

2. There is no built-in functionality for adding small graphics like arrows, speech bubbles, whatever, or editing images in general. However, by using a tool like LiveReload, any changes you make in a graphics editor like Inkscape or GIMP will immediately be reflected in the document. You could also paste a screenshot of the document into your graphics editor in order to help you position things. In this sense, up to saving very frequently, any media editor can be embedded into `ractive-player`.

## ObjectMap

This is for use with IdMap. You will need to rewrite this a little bit, either to post to your own save endpoint or to just display the data for copying. Connecting to it is also hacky.

## Thumbnails

This is typically done once the ractive has been fully recorded. You must first install the Chrome extension. Eventually this will support other browsers. Then, get the ID of your Chrome extension; you can get this from chrome://extensions. You will need to go into `thumb-recorder.tsx` and in `recordThumbs()`, change `extensionID` to the ID of your Chrome extension.

In the editor, first click on the Chrome extension; this is necessary to be able to communicate with it. Now click Record. The ractive will do its own thing for a couple minutes, and then offer you a bunch of image sheets to download.

## Recording

Arguably the editor should have some kind of way for plugins to add recorders, and then a bunch of these would be moved into separate modules.

### Cues

Press `w` to go back a slide, `e` to advance a slide. You should probably only advance a slide when recording. You will usually want this on.

### Audio

**It is necessary to access the page over HTTPS in order to record audio.**
This is a good guide for setting up SSL for local development: https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec

This will record audio files, to be used with the Audio element.

### Cursor

Should maybe be moved to a separate module.

### Keys

This is for a CodeMirror plugin. Should be moved to a separate module.

### Input

This records changing values of an input. For example if you want to indicate to your viewers to interact with something, record yourself manipulating the input, and use this to play that back.

### Play

This doesn't record anything, it just makes the video start playing when you start recording. Useful for synchronizing voiceover with animation.

### State

This records changing state of a React component
