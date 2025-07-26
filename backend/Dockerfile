FROM ubuntu:22.04

RUN apt-get update && apt-get install -y g++ make

WORKDIR /app

COPY main.cpp .
COPY httplib.h .

RUN g++ -std=c++17 -o dice_server main.cpp

EXPOSE 8080

CMD ["./dice_server"]
