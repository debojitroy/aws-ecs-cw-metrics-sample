FROM oven/bun:alpine
LABEL authors="debojitr"

COPY package.json ./
COPY bun.lockb ./
COPY src ./

RUN bun install
RUN bun run build:bun:docker

EXPOSE 3000
ENTRYPOINT ["bun", "run", "dist/index.js"]