# Email Recipients Search
_An applet that allows users to search for and add email IDs to a text area_

This applet is built with **React**, **TypeScript**, and **CSS Modules**
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Demo
www.google.com

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Features
### Per spec:
- Search for emails using the searchable text field
- Click on an email from the search results to add it to the list of recipients
- Remove already added emails from the search box

### Newly added / modified:
- Remove already added emails from the search results
- Ability to scroll the text box when the list grows too tall
- Ability to view the number of already added emails when the list grows too long
- Already added emails are visually distinct
- Search results are limited to 8 since the users are searching by email ID, and would generally have more clarity on which email they wish to add

### Others:
1. **Users aren't allowed to enter invalid emails, or emails not in their contact list**
This avoids adding the extra logic to block the 'Send' button in the email. If a user interaction is eventually going to be invalid, then lets block the users from doing it.
2. **Any email that's not in the list is also an invalid email**
Since an email sent from this app will come from the app's own servers, it's better to block the users from sending emails to people outside of their contacts list. This way, we can keep a check on any spam.

### Some Tech Specs:
1. I have developed my own component to perfrom search inside textboxes instead of using `react-select`
2. I have used the BEM methodology for class names, for more readability
3. I have used CSS modules with SASS for locally-scoped class names and CSS variables
4. I converted the CSV to a list of strings using a small Python script before using it in the applet

### More features I'd have loved to implement:
1. Instead of showing just emails in the search results, we could show first name, last name, email, and a profile picture. It could significantly help the users understand who they were adding, in case they don't know the recipient's email beforehand
