[//]: # (title: 使用 Maven Assembly 外掛程式建立巨型 JAR)

<tldr>
<p>
<control>範例專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 外掛程式](http://maven.apache.org/plugins/maven-assembly-plugin/) 提供了將專案輸出組合成一個單一的可分發歸檔的能力，該歸檔包含依賴、模組、網站文件及其他檔案。

## 設定 Assembly 外掛程式 {id="configure-plugin"}

為了建置組件，您需要先設定 Assembly 外掛程式：

1. 導覽至 **pom.xml** 檔案並確保已指定[主要應用程式類別](server-dependencies.topic#create-entry-point)：
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="10,18-19"}

   > 如果您使用[EngineMain](server-create-and-configure.topic#engine-main) 而沒有明確的 `main()` 函式，應用程式的主要類別取決於所使用的引擎，並且可能如下所示：`io.ktor.server.netty.EngineMain`。
   {style="tip"}

2. 將 `maven-assembly-plugin` 加入 `plugins` 區塊，如下所示：
   ```xml
   ```
   {src="snippets/tutorial-server-get-started-maven/pom.xml" include-lines="111-135"}

## 建置組件 {id="build"}

若要為應用程式建置組件，請開啟終端機並執行以下命令：

```Bash
mvn package
```

這將為組件建立一個新的 **target** 目錄，其中包含 **.jar** 檔案。

> 要了解如何使用產生的套件透過 Docker 部署您的應用程式，請參閱 [](docker.md) 幫助主題。

## 執行應用程式 {id="run"}

若要執行建置好的應用程式，請依照以下步驟操作：

1. 在新的終端機視窗中，使用 `java -jar` 命令來執行應用程式。對於範例專案，它看起來如下：
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 一旦您的應用程式開始運行，您將會看到確認訊息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. 點擊 URL 連結以在您的預設瀏覽器中開啟應用程式：

   <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                     border-effect="rounded" width="706"/>