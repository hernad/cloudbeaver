#https://ianthehenry.com/posts/how-to-learn-nix/flakes/

{
#  # Executed by `nix flake check`
#  checks."<system>"."<name>" = derivation;
#  # Executed by `nix build .#<name>`

#  packages."<system>"."<name>" = derivation;
#  # Executed by `nix build .`
#  packages."<system>".default = derivation;

description = "odoo nixos cloudbeaver environment";



inputs = {
    #nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
};

outputs = { self, nixpkgs, ... }@inputs:
let
    inherit (self) outputs;


    myConfig = {
        allowBroken = true;
        permittedInsecurePackages = [
            #"openssl-1.1.1w"
        ];
    
        packageOverrides = pkgs: {
          #python311 = (import ./python311.nix {inherit pkgs lib ft;});
        };
    };

    # https://nixos.org/manual/nixpkgs/unstable/#how-to-override-a-python-package-for-all-python-versions-using-extensions
        

    system = "x86_64-linux";

    pkgs = (import nixpkgs {
        inherit system;
        config = myConfig;   
    });
    stdenv = pkgs.stdenv;

    forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
    ];


     nixpkgsFor = forAllSystems (system: import nixpkgs 
       {
         inherit system;
         config = myConfig;
         #overlays = [ self.overlays.default ];

       }
    );

in
{

     # https://git.sbruder.de/simon/nixpkgs-overlay/src/branch/master/flake.nix

     #overlays.default = import ./overlayPython.nix;

     packages = forAllSystems (system:
     let 
        pkgs = nixpkgsFor.${system};
     in 
     {

       
      
     });


     devShells.${system}.default = pkgs.mkShell {
         
      buildInputs = [

        openjdk17 
        maven 
        yarn 
        nodejs_20

      ];

      shellHook = ''

        echo "shell hook"

        
      '';

     };

};



}

