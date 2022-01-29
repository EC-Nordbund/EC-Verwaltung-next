FROM denoland/deno:alpine-1.18.1 as builder
WORKDIR /app
EXPOSE 8080

COPY .

RUN deno compile --no-check="remote" --importmap="./api/importmap.json" --unstable --allow-net ./mod.ts

FROM alpine:latest  
WORKDIR /app
USER deno

COPY --from=builder /app/mod ./

CMD ["./mod"]  
