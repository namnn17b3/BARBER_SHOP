FROM openjdk:17-jdk-alpine
EXPOSE 8883
EXPOSE 28883
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh
ARG JAR_FILE=target/*.jar
COPY ./target/hair-color-service-0.0.1-SNAPSHOT.jar hair-color-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/hair-color-service-0.0.1-SNAPSHOT.jar"]
