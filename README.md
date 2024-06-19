
# App Scaffolder

App Scaffolder is a command-line tool that scaffolds front-end applications with different frameworks and style libraries offline. It supports creating projects using React, and Vue, with styling options including Bootstrap, Tailwind CSS, and Material UI.

## Features

- Supports multiple front-end frameworks: React, and Vue
- Offers styling libraries: Bootstrap, Tailwind CSS, and Material UI
- Installs dependencies from local packages
- Customizes project templates based on user input

## Installation

To install App Scaffolder globally, use npm:

```sh
npm install -g app-scaffolder
```

## Usage

Run the CLI tool by typing:

```sh
app-scaffolder
```

You will be prompted to choose a framework and a style library for your new project. Additionally, you can specify the name of your application.

### Example

```sh
app-scaffolder
```

### Prompts

- **App Name**: Enter the name of your application.
- **Framework**: Choose one of the following frameworks: React, Vue, Angular, or Svelte.
- **Style Library**: Choose one of the following style libraries: Bootstrap, Tailwind CSS, Material UI, or None.
- **Package Manager**: Choose your preferred package manager: npm or yarn.

## Project Structure

The scaffolded project will have a structure similar to this:

```
my-app
├── node_modules
├── public
│   └── index.html
├── src
│   ├── App.jsx (or App.vue, App.ts, etc.)
│   ├── index.js
│   └── ...
├── package.json
├── .gitignore
└── README.md
```

## Local Installation of Style Libraries

App Scaffolder can install style libraries from a local source. Make sure you have the local packages available before running the CLI.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Maintainers

- Sibabale Joja - [sibabalejoja@gmail.com](mailto:sibabalejoja@gmail.com)

## Acknowledgements

Thanks to all contributors and open source projects that made this possible.
