FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dev-dependencies
WORKDIR /app
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM dev-dependencies AS build-web
WORKDIR /app
RUN pnpm run build --filter=web
RUN pnpm deploy --filter=web --prod /app/web

FROM dev-dependencies AS build-server
WORKDIR /app
RUN pnpm run build --filter=server
RUN pnpm deploy --filter=server --prod /app/server

FROM base AS web
WORKDIR /app
COPY --from=build-web /app/web/package.json /app/package.json
COPY --from=build-web /app/web/node_modules /app/node_modules
COPY --from=build-web /app/web/dist /app/dist
EXPOSE 8080
CMD [ "pnpm", "start:spa" ]

FROM base AS server
WORKDIR /app
COPY --from=build-server /app/server/package.json /app/package.json
COPY --from=build-server /app/server/node_modules /app/node_modules
COPY --from=build-server /app/apps/server/dist /app/dist
EXPOSE 3333
CMD [ "pnpm", "start:prod" ]