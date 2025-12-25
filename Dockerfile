FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

# Copiar archivos necesarios para el build de Vite
COPY ./src ./src
COPY ./public ./public
COPY index.html index.html
COPY vite.config.ts vite.config.ts
COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json

# Build de Vite
ENV NODE_ENV=production
RUN bun run build

# Copiar archivo del servidor
COPY prod.ts prod.ts

# Compilar el servidor
RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --outfile server \
  prod.ts

FROM gcr.io/distroless/base

WORKDIR /app

# Copiar servidor compilado
COPY --from=build /app/server server

# Copiar build de Vite
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 8080
