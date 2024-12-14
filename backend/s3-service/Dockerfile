FROM openjdk:17-jdk-alpine
EXPOSE 8888
EXPOSE 28888
RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh
ARG JAR_FILE=target/*.jar
COPY ./target/s3-service-0.0.1-SNAPSHOT.jar s3-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/s3-service-0.0.1-SNAPSHOT.jar"]
