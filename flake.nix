{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11-small";
    utilities.url = "github:master-software-gmbh/nixos-utilities";
    utilities.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, utilities }: utilities.lib.allSystems (system: let
    pkgs = import nixpkgs { inherit system; };
    biome = utilities.lib.biome pkgs;
  in {
    devShells.default = pkgs.mkShell {
      buildInputs = [
        pkgs.bun
        biome.check
        biome.update
      ];
    };
  });
}
