[//]: # (title: 使用 Maven Assembly 外掛程式建立胖 JARs)

<tldr>
<p>
<control>範例專案</control>: <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-get-started-maven">tutorial-server-get-started-maven</a>
</p>
</tldr>

[Maven Assembly 外掛程式](http://maven.apache.org/plugins/maven-assembly-plugin/) 提供了將專案輸出組合成單一可發佈歸檔的能力，該歸檔包含依賴項、模組、網站文件及其他檔案。

## 配置 Assembly 外掛程式 {id="configure-plugin"}

若要建立組件，您需要先配置 Assembly 外掛程式：

1. 導航到 **pom.xml** 檔案並確保指定了主要應用程式類別：

   > 如果您使用 [EngineMain](server-create-and-configure.topic#engine-main) 而沒有明確的 `main()` 函數，應用程式的主要類別取決於所使用的引擎，並且可能如下所示： `io.ktor.server.netty.EngineMain`。
   {style="tip"}

2. 將 `maven-assembly-plugin` 加入 `plugins` 區塊，如下所示：

## 建立組件 {id="build"}

若要為應用程式建立組件，請開啟終端機並執行以下命令：

```Bash
mvn package
```

這將為組件建立一個新的 **target** 目錄，其中包含 **.jar** 檔案。

> 若要了解如何使用產生的套件來透過 Docker 部署您的應用程式，請參閱 [](docker.md) 說明主題。

## 執行應用程式 {id="run"}

若要執行建置好的應用程式，請依照以下步驟：

1. 在新的終端機視窗中，使用 `java -jar` 命令來執行應用程式。對於範例專案，它看起來像這樣：
   ```Bash
   java -jar target/tutorial-server-get-started-maven-0.0.1-jar-with-dependencies.jar
   ```
2. 一旦您的應用程式正在執行，您將會看到確認訊息：
   ```Bash
   [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```
3. 點擊 URL 連結以在您的預設瀏覽器中開啟應用程式：

   <img src="server_get_started_ktor_sample_app_output.png" alt="Output of generated ktor project"
                     border-effect="rounded" width="706"/>