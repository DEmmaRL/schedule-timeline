# Development App

This is a development application for testing and visualizing the Schedule Timeline component interactively.

## Usage

From the project root directory:

```bash
# 1. Build the library
npm run build

# 2. Install dev-app dependencies (only first time)
cd dev-app && npm install

# 3. Run the development application
npm run dev
```

## Features

- **4 Interactive Examples**: Basic, Conference, Custom Theme, and Custom Renderer
- **Interactive Events**: Click and hover on activities
- **Responsive Design**: Works on desktop and mobile
- **Hot Reload**: Changes are reflected automatically

## Included Examples

1. **Basic Example**: Simple schedule with TCMX activities
2. **Conference**: More complex schedule with multiple activity types
3. **Custom Theme**: Custom colors for different types
4. **Custom Renderer**: Completely custom design with icons

## Development

To make changes to the library:

1. Modify files in `../src/`
2. Run `npm run build` from the root directory
3. The dev-app will update automatically
