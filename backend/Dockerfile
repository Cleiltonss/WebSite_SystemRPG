# Compile for Linux 
FROM gcc:latest AS builder

WORKDIR /app

COPY main.cpp .
COPY httplib.h .

RUN g++ -std=c++17 -static-libstdc++ -static-libgcc -o dice_server main.cpp

# Light running image
FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /app/dice_server ./

EXPOSE 8080

CMD ["./dice_server"]
