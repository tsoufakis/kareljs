FROM node:12.13.1

# RUN apk add make
# RUN apk add python
# RUN apk add g++

WORKDIR /usr/src/app
COPY . .
RUN rm -rf ./node_modules

# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# RUN chown --recursive appuser:appgroup .
# USER appuser

RUN make
CMD ["make", "start"]
