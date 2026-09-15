---
title: Projection Sorcery
tagline: A JJK-inspired afterimage vision pipeline for a robotics-course robot - real-time pose tracking, segmentation, and compositing.
stack: [Python, OpenCV, NumPy]
mounting: YOLO · on-robot camera
firstLight: 2026-09
designation: Umbra
condition: complete
repoUrl: https://github.com/marumakes/projection-sorcery
order: 3
screenshot: /projects/projection-sorcery/pipeline-demo.gif
screenshotAlt: An animated demo cycling through the vision pipeline's five stages, starting from a raw camera capture of a person walking along a riverbank
---

Inspired by Naoya Zenin, a projection-sorcery user from Jujutsu Kaisen. Captures a person, segments them from the frame, composites a stabilised "afterimage", and feeds this into OpenAI's image generator for an anime-style output, running on a webcam or a robot's camera feed.
