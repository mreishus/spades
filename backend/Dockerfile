FROM elixir:1.9.4-alpine as build

# install build dependencies
RUN apk add --update git build-base nodejs yarn python npm

# prepare build dir
RUN mkdir /app
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get
RUN mix deps.compile

# build assets
COPY assets assets
COPY priv priv
COPY lib lib
RUN cd assets && yarn install && yarn run deploy
RUN mix phx.digest

# build project
RUN mix compile

# build release
RUN mix release

# prepare release image
FROM alpine:3.10 AS app
RUN apk add --update bash openssl

RUN mkdir /app
WORKDIR /app

COPY --from=build /app/_build/prod/rel/spades ./
RUN chown -R nobody: /app
USER nobody

ENV HOME=/app

## These environment variables, probably set while running container
# ENV SECRET_KEY_BASE ..secret here...
# ENV DATABASE_URL ..secret here..

ADD start.sh /
CMD ["/start.sh"]
