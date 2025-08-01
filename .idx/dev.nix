# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    # Since you use npm, ensure nodejs is available
    pkgs.nodejs_20 # Specify Node.js version 20 (or another version if needed)
    pkgs.nodePackages.npm # Explicitly add npm if not included with nodejs
  ];

                                                                                                                  

  idx = {
    # ... other configurations ...
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "shd101wyy.markdown-preview-enhanced"
      "ritwickdey.liveserver"
      "eamodio.gitlens"
      # Add other extension IDs here
      "Anthropic.claude-code"
      "mgmcdermott.vscode-language-babel"
      "ms-vscode.js-debug"
      "robole.javascript-snippets"
      "saoudrizwan.claude-dev"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          # Command to run your server.
          # Ensure your package.json has a "serve" script that starts the server.
          command = ["npm" "run" "serve"];
          manager = "web";
          env = {
            # Set the PORT environment variable for your server
            PORT = "$PORT";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Install JS dependencies from NPM
        npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Run the manifest script to generate manifest.json
        generate-manifest = "npm run manifest";
        # Run the content audit script
        run-audit = "npm run audit";
      };
    };
  }; # The idx block ends here
} # The main attribute set ends here