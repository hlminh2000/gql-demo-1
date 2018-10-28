# Graphql Demo

This is a demo of what a graphql application looks like. Check out `slides.pdf` for some overview of graphql

There are two components to this repo: API and UI

### API
- This is the graphql API, built with Apollo Server and Express
- Running the api: from the root of this repo, run `cd ./api && npm i && npm start`
- The API should be running at `http://localhost:3000`, check out `http://localhost:3000/graphql` in your browser

### UI
- This is the UI, built with React and Apollo Client
- Running the ui: from the root of this repo, run `cd ./ui && npm i && npm start`
- The UI should be accessible through your browser at `http://localhost:3000`

### Challenge exercise:
- Make the remove buttons work
- Steps:
    1. Create new Mutation in schema typedefs in `api/typeDefs.js`
    2. Write resolver for the new mutation in `api/resolvers.js`
    3. Create a new component that triggers the mutation in `ui/src/components/UserEntry.js`
