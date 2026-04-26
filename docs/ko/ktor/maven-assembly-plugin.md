[//]: # (title: Maven Assembly 플러그인을 사용하여 fat JAR 생성하기)

<tldr>
<p>
<control>샘플 프로젝트</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 플러그인](http://maven.apache.org/plugins/maven-assembly-plugin/)은 프로젝트 출력물을 의존성, 모듈, 사이트 문서 및 기타 파일이 포함된 배포 가능한 단일 아카이브로 결합하는 기능을 제공합니다.

## Assembly 플러그인 설정 {id="configure-plugin"}

어셈블리를 빌드하려면 먼저 Assembly 플러그인을 설정해야 합니다.

1. **pom.xml** 파일로 이동하여 [메인 애플리케이션 클래스](server-dependencies.topic#create-entry-point)가 지정되어 있는지 확인합니다.
   ```xml
   <properties>
       <main.class>io.ktor.server.netty.EngineMain</main.class>
   </properties>
   ```

    이 예제에서는 서버를 생성하기 위해 `EngineMain`이 사용되었으므로, 애플리케이션의 메인 클래스는 사용하는 엔진에 따라 달라집니다. 만약 [embeddedServer](server-create-and-configure.topic#embedded-server)를 사용한다면 애플리케이션의 메인 클래스는 `com.example.ApplicationKt`가 됩니다.

2. `plugins` 블록에 `maven-assembly-plugin`을 추가합니다.
   ```xml
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-assembly-plugin</artifactId>
       <version>3.7.1</version>
       <configuration>
           <descriptorRefs>
               <descriptorRef>jar-with-dependencies</descriptorRef>
           </descriptorRefs>
           <archive>
               <manifest>
                   <addClasspath>true</addClasspath>
                   <mainClass>${main.class}</mainClass>
               </manifest>
           </archive>
       </configuration>
       <executions>
           <execution>
               <id>assemble-all</id>
               <phase>package</phase>
               <goals>
                   <goal>single</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

## 어셈블리 빌드 {id="build"}

애플리케이션용 어셈블리를 빌드하려면 터미널을 열고 다음 명령어를 실행하세요.

```Bash
mvn package
```

이 명령은 **.jar** 파일을 포함하여 어셈블리를 위한 새로운 **target** 디렉토리를 생성합니다.

> 생성된 패키지를 사용하여 Docker로 애플리케이션을 배포하는 방법을 알아보려면 [Docker](docker.md) 도움말 항목을 참고하세요.

## 애플리케이션 실행 {id="run"}

빌드된 애플리케이션을 실행하려면 아래 단계를 따르세요.

1. 새 터미널 창에서 `java -jar` 명령어를 사용하여 애플리케이션을 실행합니다. 샘플 프로젝트의 경우 다음과 같습니다.
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 앱이 실행되면 다음과 같은 확인 메시지가 표시됩니다.
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. URL 링크를 클릭하여 기본 브라우저에서 애플리케이션을 엽니다.

   <img src="server_get_started_ktor_sample_app_output.png" alt="생성된 ktor 프로젝트의 출력 결과"
                     border-effect="rounded" width="706"/>