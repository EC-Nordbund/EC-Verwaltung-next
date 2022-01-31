FROM denoland/deno:alpine-1.18.1 as builder
WORKDIR /app

COPY . .

RUN deno run ./createRoutes.ts
RUN deno compile --no-check="remote" --importmap="./importmap.json" --unstable -A ./mod.ts

FROM alpine:latest  
USER deno

COPY --from=builder /app/mod ./

CMD ["./mod"]  
