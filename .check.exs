[
  ## all available options with default values (see `mix check` docs for description)
  # parallel: true,
  # skipped: true,

  ## list of tools (see `mix check` docs for defaults)
  tools: [
    ## Tell it to run sobelow with my config
    {:sobelow, "mix sobelow --config"}

    ## Add eslint
    # {:eslint, command: "npm run eslint", cd: "assets"},

    ## Typescript
    # {:typescript, command: "npm run tsc", cd: "assets"}

    ## curated tools may be disabled (e.g. the check for compilation warnings)
    # {:compiler, false},

    ## ...or adjusted (e.g. use one-line formatter for more compact credo output)
    # {:credo, "mix credo --format oneline"},

    ## ...or reordered (e.g. to see output from ex_unit before others)
    # {:ex_unit, order: -1},

    ## custom new tools may be added (mix tasks or arbitrary commands)
    # {:my_mix_task, command: "mix release", env: %{"MIX_ENV" => "prod"}},
    # {:my_arbitrary_script, command: ["my_script", "argument with spaces"], cd: "scripts"}
  ]
]
