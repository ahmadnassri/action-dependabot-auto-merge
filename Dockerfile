FROM node:alpine

LABEL com.github.actions.name="Dependabot Auto Merge" \
      com.github.actions.description="Automatically merge Dependabot PRs when version comparison is within range" \
      com.github.actions.icon="git-merge" \
      com.github.actions.color="blue" \
      maintainer="Ahmad Nassri <ahmad@ahmadnassri.com>"

RUN mkdir /action
WORKDIR /action

COPY package*.json index.js ./
COPY lib ./lib

RUN npm ci --only=prod

ENTRYPOINT ["node", "/action/index.js"]
