FROM openjdk:17-jdk-alpine
EXPOSE 8887
EXPOSE 28887
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh
ARG JAR_FILE=target/*.jar
COPY ./target/block-time-service-0.0.1-SNAPSHOT.jar block-time-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/block-time-service-0.0.1-SNAPSHOT.jar"]
