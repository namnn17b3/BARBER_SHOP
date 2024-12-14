FROM openjdk:17-jdk-alpine
EXPOSE 8880
EXPOSE 28880
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh
ARG JAR_FILE=target/*.jar
COPY ./target/user-service-0.0.1-SNAPSHOT.jar user-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/user-service-0.0.1-SNAPSHOT.jar"]
