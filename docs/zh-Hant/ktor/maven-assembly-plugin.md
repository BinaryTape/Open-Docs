[//]: # (title: 使用 Maven Assembly 外掛程式建立 fat JARs)

<tldr>
<p>
<control>範例專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly plugin](http://maven.apache.org/plugins/maven-assembly-plugin/) 提供了將專案輸出組合成單一可分發歸檔的能力，該歸檔包含依賴項、模組、網站文件及其他檔案。

## 設定 Assembly 外掛程式 {id="configure-plugin"}

要建置組件，您需要先設定 Assembly 外掛程式：

1. 導覽至 **pom.xml** 檔案並確保已指定[主應用程式類別](server-dependencies.topic#create-entry-point)：
   ```xml
   <properties>
       <main.class>io.ktor.server.netty.EngineMain</main.class>
   </properties>
   ```

    在此範例中，使用 `EngineMain` 來建立伺服器，因此應用程式的主類別取決於所使用的引擎。如果您使用 [embeddedServer](server-create-and-configure.topic#embedded-server)，應用程式的主類別是：`com.example.ApplicationKt`。

2. 如下所示將 `maven-assembly-plugin` 加入到 `plugins` 區塊：
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

## 建置組件 {id="build"}

要為應用程式建置組件，請開啟終端機並執行以下指令：

```Bash
mvn package
```

這將為組件建立一個新的 **target** 目錄，包括 **.jar** 檔案。

> 要了解如何使用結果套件透過 Docker 部署您的應用程式，請參閱 [Docker](docker.md) 說明主題。

## 執行應用程式 {id="run"}

要執行建置好的應用程式，請依照以下步驟：

1. 在新的終端機視窗中，使用 `java -jar` 指令執行應用程式。對於範例專案，它看起來如下：
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 一旦您的應用程式正在執行，您將看到一條確認訊息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. 點擊 URL 連結以在您的預設瀏覽器中開啟應用程式：

   <img src="server_get_started_ktor_sample_app_output.png" alt="產生之 Ktor 專案的輸出"
                     border-effect="rounded" width="706"/>