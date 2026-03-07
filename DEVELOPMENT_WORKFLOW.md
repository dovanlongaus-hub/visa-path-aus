# Development Workflow

This document outlines the steps for cloning, modifying, testing, and submitting code back to GitHub.

## Cloning the Repository

To clone the repository to your local machine, use the following command:

```bash
git clone https://github.com/dovanlongaus-hub/visapathaus.git
```

This will create a local copy of the repository.

## Modifying the Code

1. Navigate to the cloned directory:

   ```bash
   cd visapathaus
   ```

2. Open the files you wish to modify in your preferred code editor, and make your changes.

## Testing Changes

It’s essential to test your changes before submitting them. Use the following commands (adjust based on your testing framework):

```bash
# Example command to run tests
npm test
```

Make sure all tests pass!

## Submitting Code

1. Stage your changes:

```bash
git add .
```

2. Commit your changes with a descriptive message:

```bash
git commit -m "Description of the changes made"
```

3. Push your changes to the remote repository:

```bash
git push origin main
```

4. Create a Pull Request (PR) on GitHub by navigating to the 'Pull Requests' tab of the repository and clicking 'New Pull Request'. Follow the instructions to create your PR.

## Conclusion

Follow these steps to maintain a smooth workflow and collaborate effectively with other developers.