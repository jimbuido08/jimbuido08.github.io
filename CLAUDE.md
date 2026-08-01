# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a static personal portfolio website. It consists of a single HTML page, supporting CSS stylesheets for layout and responsiveness, and a JavaScript file for client-side interactivity.

## Architecture
- `index.html`: The main entry point and structure of the site.
- `style.css`: Primary styling and layout.
- `mediaqueries.css`: Responsive design adjustments for different screen sizes.
- `script.js`: Handles dynamic behavior and interactivity.
- `assets/`: Contains images, icons, and PDF documents (CV and project information sheets).

## Development Commands
As this is a static site without a build process or test suite, no specialized build or test commands are required.

To preview the site locally, use Python's built-in HTTP server:
- Command: `python3 -m http.server`
- Access the site at: `http://localhost:8000`
