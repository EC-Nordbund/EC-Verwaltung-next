# FROM denoland/deno:alpine-1.18.1 as builder
FROM denoland/deno:alpine-1.18.1
WORKDIR /app

COPY . .

RUN deno run -A ./createRoutes.ts
# RUN deno compile --no-check="remote" --importmap="./importmap.json" --unstable -A ./mod.ts

# FROM alpine:latest  
USER deno

# COPY --from=builder /app/mod ./

# CMD ["./mod"]  
CMD [
  # Execute Deno
  "deno", "run",
  # With all rights 
  "-A",
  # With unstable API (startTLS)
  "--unstable",
  # Use a importmap
  "--importmap=./importmap.json",
  # Dont check TS just transpile it!
  "--no-check"
]