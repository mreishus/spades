# spades ![](https://github.com/mreishus/spades/workflows/CI/badge.svg)

Multiplayer online spades card game written in Elixir, Phoenix, React, and Typescript.

## Getting the project running for the first time

### Prereqs

Elixir should be installed along with mix.

- [Elixir Install Docs](https://elixir-lang.org/install.html)
- `mix local.hex` - Installs mix or updates it to the latest version

NPM and node should be installed.

### Postgres Database

This assumes that you have a postgres database running on `localhost` that can
be connected to with username `postgres`, password `postgres`.

Many devs will already have this. If you want to test the `postgres/postgres`
credentials, try running this at the shell:

```
psql -U postgres -W -d postgres -c 'select * from pg_roles'
```

Type 'postgres' as the password and you should see a table of users if
everything worked.

Please check another guide for instructions for installing postgres if you need
it. However, I just installed it on an Arch Linux machine and can share
commands that worked today (4/19/20).

```
# Arch Linux only
sudo pacman -Syu postgresql
su - postgres -c "initdb --locale en_US.UTF-8 -D '/var/lib/postgres/data'"
systemctl start postgresql.service
systemctl enable postgresql.service
```

Different distributions of Linux, like Ubuntu or Redhat, will have different
commands.

Here, Arch already made the `postgres` user for me, which works with any or no
password. If you still need to set up the postgres user, the [Ecto
Docs](https://hexdocs.pm/phoenix/ecto.html) suggest this:

Type `psql` and then enter the following commands:

```
CREATE USER postgres;
ALTER USER postgres PASSWORD 'postgres';
ALTER USER postgres WITH SUPERUSER;
\q
```

Ensure that you can connect to postgres on `localhost` with username `postgres`,
password `postgres` before continuing.

### Get the backend running

```
git clone https://github.com/mreishus/spades.git
cd backend
mix deps.get
mix ecto.setup
```

- Answer yes to install rebar
- If you get `** (Mix) The database for Spades.Repo couldn't be created: killed`, you need to install postgres locally
- After running setup, you can verify the tables were created if you wish

Here's me verifying the tables are created.

```
mreishus@arch ~/d/spades (master|✔) $ psql -U postgres -W spades_dev
Password:  (here I typed postgres)
psql (12.2)
Type "help" for help.

spades_dev=# \dt
               List of relations
 Schema |       Name        | Type  |  Owner
--------+-------------------+-------+----------
 public | rooms             | table | postgres
 public | schema_migrations | table | postgres
 public | users             | table | postgres
(3 rows)
```

More commands...

```
cd assets && npm install
cd ..
mix phx.server
```

- You should see it check on the rooms succesfully in the console.
  `[debug] QUERY OK source="rooms" db=0.4ms decode=0.9ms queue=0.5ms idle=1045.3ms SELECT r0."id", r0."name", r0."slug", r0."west", r0."east", r0."south", r0."north", r0."inserted_at", r0."updated_at" FROM "rooms" AS r0 []`
- If you visit http://localhost:4000, you should see a grey screen with no text.

### Get the frontend running

More commands in a new terminal window. Let the terminal window running the
backend stay open.

```
cd frontend
npm install
npm start
```

Now visit http://localhost:3000. You should be redirected to `/lobby` and see
the lobby. If you F12 and check the console, there are some react warnings,
but there should be no errors (especially no websocket errors). If there are
errors, the communication with the backend is not working properly.

### Configure the mailer

If you try to create a new user now, it will fail when trying to send them an
email. You'll see this in the backend console.

```
[error] #PID<0.634.0> running SpadesWeb.Endpoint (connection #PID<0.633.0>, stream id 1) terminated
Server: localhost:4000 (http)
Request: POST /api/v1/registration
** (exit) an exception was raised:
    ** (KeyError) key :adapter not found in: [otp_app: :spades]
        (elixir 1.10.1) lib/keyword.ex:399: Keyword.fetch!/2
        (swoosh 0.25.2) lib/swoosh/mailer.ex:122: Swoosh.Mailer.deliver/2
```

### Mailer Option 1: Log to console

Edit `backend/lib/spades_web/pow_mailer.ex`. It should look like this:

```elixir
    # def process(email) do
    #   Logger.info("E-mail sent: #{inspect(email)}")
    # end

    def process(email) do
      email
      |> deliver()
      |> log_warnings()
    end
```

Change to this:

```elixir
    def process(email) do
      Logger.info("E-mail sent: #{inspect(email)}")
    end

    # def process(email) do
    #   email
    #   |> deliver()
    #   |> log_warnings()
    # end
```

Restart the backend server, now emails will be 'delivered' to the backend console.

### Mailer Option 2: Configure

[Swoosh](https://github.com/swoosh/swoosh) is an elixir email library with a
variety of plugins. Here, you can set up the system to use whatever email
delivery service you would like. Check the swoosh documentation for details.

Create a `./backend/config/dev.secret.exs` file. Here's what my Mailgun config
looks like, but you'll need to change the details of this file.

```
use Mix.Config

# Example data only, please configure.

config :spades, Spades.Mailer,
  adapter: Swoosh.Adapters.Mailgun,
  api_key: "12341234123412341234123412341234-13241234-12341234",
  domain: "mg.example.com"

config :spades, SpadesWeb.PowMailer,
  adapter: Swoosh.Adapters.Mailgun,
  api_key: "12341234123412341234123412341234-13241234-12341234",
  domain: "mg.example.com"
```

### Try it out

Now, you should be able to visit http://localhost:3000, sign up for a user,
create a room, sit at a table, invite bots, and play a game. Let me know if
there are any problems or send a pull request to the guide if you had to figure
something out..

### (Optional) Running dev on computers other than localhost

This guide assumes you are running on localhost. If you run it on another
machine and attempt to connect to it over your local network, the app won't work properly
even though both the backend and frontend are bound to `0.0.0.0`.

The browser connects to the backend directly: and it thinks the address is
`localhost`. You can change this by editing the `package.json` in the frontend
directory. For example, I have a script set up to run the frontend, but tell
the browser the backend is running on another machine:

```
"start-elixir": "REACT_APP_WS_URL=ws://172.22.2.174:4000/socket npm-run-all -p start:css start:js",
```

It's unfortunate I have to do this at all. Ideally I would like the frontend
to transparently proxy backend requests to the backend, without the browser
knowing where the backend is. The prod setup does work this way, but I
couldn't get the dev setup to work properly.

CRA does have a
[guide](https://create-react-app.dev/docs/proxying-api-requests-in-development/)
on setting up a proxy in dev, but I couldn't get everything to work properly
for some reason I don't remember.

## Running the project in Prod

Guide to be created.
