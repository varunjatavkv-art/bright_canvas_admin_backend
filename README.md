# Simple Node.js Project

This is a minimal Node.js project placed inside the `backend` folder. It includes a tiny module and a test script.

Files:

- `index.js` - exports `sayHello(name)` and prints when run directly.
- `test.js` - small assertion-based test runner.
- `package.json` - scripts for `start` and `test`.

How to run:

```bash
# From the workspace root or from the backend folder
node backend/index.js        # prints Hello, world!
node backend/index.js Name   # prints Hello, Name!

# Run tests
node backend/test.js
# or using npm if you prefer
cd backend && npm test
```
