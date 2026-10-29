# DevTrack — Developer Productivity Dashboard

DevTrack is a responsive, browser-based dashboard for tracking development tasks, personal projects, coding consistency, and public GitHub repository insights.

**Live hosting:** GitHub Pages  
**Stack:** HTML5, CSS3, vanilla JavaScript, GitHub REST API, LocalStorage  
**Backend required:** No  
**Build tools required:** No

## Features implemented

- Responsive desktop and mobile layout.
- Task creation, editing, completion, priority, due date, notes, and optional project association.
- Project tracker with description, technology tags, and optional GitHub/live-demo URL.
- Manually logged daily coding sessions and a 12-week activity calendar.
- Coding streak based on activity manually logged in this browser.
- Weekly task-completion chart and dashboard statistics.
- Public GitHub profile integration using `api.github.com` without requesting a password or token.
- Public repository list with language, stars, forks, and last-updated time.
- LocalStorage persistence for profile, tasks, projects, and coding activity.
- Export data to a JSON backup and import an existing backup from the browser file picker.
- Input escaping for user-entered content and URL validation for project links.
- Mobile navigation, dialogs, empty states, and user feedback for common API errors.

## Important limitations

- GitHub data is **public profile and repository data**, not private repository data.
- GitHub's unauthenticated API has rate limits. If the limit is reached, wait and retry.
- The activity calendar is based on **sessions logged in DevTrack**, not GitHub's official contribution graph.
- Data is stored in the current browser's LocalStorage. It does not automatically sync across devices or browsers.
- This static site has no account system, server-side database, or cloud synchronization.
- The weekly chart measures tasks completed in DevTrack, not hours spent coding.
- The browser's LocalStorage can be removed when site data is cleared. Export backups regularly.

## Run locally

You can open `index.html` directly in a modern browser. For a local web server, use any static server, for example the VS Code Live Server extension.

GitHub API requests require an internet connection. Some browsers may restrict certain features when a file is opened directly; hosting through GitHub Pages is recommended.

## Publish using GitHub Pages (mobile-friendly)

1. Sign in at [GitHub](https://github.com/).
2. Tap **+** → **New repository**.
3. Name it `devtrack`, choose **Public**, then create the repository.
4. Open the repository and select **Add file** → **Create new file**.
5. Create `index.html`, paste the contents of `index.html` from this project, and commit it.
6. Repeat **Add file** → **Create new file** for `styles.css`, `app.js`, and `README.md`. Keep all three files in the repository root, next to `index.html`.
7. Open the repository's **Settings** → **Pages**.
8. Under **Build and deployment**, choose **Deploy from a branch**.
9. Set branch to `main` and folder to `/(root)`, then save.
10. Wait a few minutes. Your site should be available at:

   `https://YOUR-USERNAME.github.io/devtrack/`

Replace `YOUR-USERNAME` with your GitHub username. If the repository has a different name, use that name in the URL.

### Recommended mobile workflow

Editing large source files in GitHub's mobile interface can be awkward. You can use GitHub's **Add file → Upload files** option to upload `index.html`, `styles.css`, and `app.js` together from your phone, then commit the upload. Upload `README.md` as well.

## How to use DevTrack

1. Open the deployed site.
2. Add a task using **New task**.
3. Add projects and their technologies.
4. Mark tasks complete when done.
5. Select **Log coding** to record a coding session.
6. Enter your GitHub username in **GitHub insights** to load public data.
7. Use the download icon to export a JSON backup. Open Workspace settings using the gear icon, then choose **Import JSON backup** to restore a previously exported file.

## Suggested manual test checklist

- [ ] Create a task with a title, priority, and due date.
- [ ] Complete and reopen a task.
- [ ] Edit and delete a task.
- [ ] Add a project, edit it, and attach it to a task.
- [ ] Refresh the page and confirm local data persists.
- [ ] Log activity and confirm the heatmap/streak updates.
- [ ] Connect a valid public GitHub username.
- [ ] Try a nonexistent username and confirm a helpful error appears.
- [ ] Export a backup, clear data, and import the backup.
- [ ] Test the layout at mobile width and desktop width.

## Resume description (use after testing)

**DevTrack — Developer Productivity Dashboard**  
Built a responsive developer productivity dashboard using HTML, CSS, and vanilla JavaScript. Implemented task and project management, LocalStorage persistence, a coding activity calendar, weekly progress visualization, JSON backup/restore, and GitHub REST API integration for public repository insights. Deployed the static application using GitHub Pages.

Only claim features you have tested yourself.
