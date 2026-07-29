mkdir -p public/frames
ffmpeg -i src/assets/videos/hero-bg.mp4 -r 24 -q:v 2 public/frames/frame_%04d.jpg