[//]: # (title: 提供單頁應用程式服務)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor 具備提供單頁應用程式服務的能力，包含 React、Angular、Vue 等。
</link-summary>

Ktor 具備提供單頁應用程式服務的能力，包含 React、Angular 或 Vue。

## 新增相依性 {id="add_dependencies"}

若要提供單頁應用程式服務，您只需要 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 相依性。
不需要任何特定的相依性。

## 提供應用程式服務 {id="configure"}

若要提供單頁應用程式服務，您需要定義要從何處提供內容：本機檔案系統或 classpath。
您至少需要指定一個包含單頁應用程式的資料夾或資源套件。

### 提供特定架構的應用程式服務 {id="serve-framework"}

您可以提供使用特定架構（例如 React、Angular、Vue 等）建立的單頁應用程式組建。
假設我們在專案根目錄中有一個名為 `react-app` 的資料夾，其中包含一個 React 應用程式。
該應用程式具有以下結構，並以 `index.html` 檔案為主頁面：

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

若要提供此應用程式服務，請在 [routing](server-routing.md) 區塊內呼叫 [singlePageApplication](https://api.ktor.io/ktor-server-core/io.ktor.server.http.content/single-page-application.html)，並將資料夾名稱傳遞給 `react` 函式：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        singlePageApplication {
            react("react-app")
        }
    }
}
```

Ktor 會自動尋找 `index.html`。
若要了解如何自訂預設頁面，請參閱[自訂服務設定](#serve-customize)。

> 對於其他架構，請使用相對應的函式，例如 `angular`、`vue`、`ember` 等。

### 自訂服務設定 {id="serve-customize"}

為了示範如何從資源提供單頁應用程式服務，假設我們的應用程式位於 `sample-web-app` 資源套件中，其結構如下：

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

若要提供此應用程式服務，請使用以下配置：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*

fun Application.module() {
    routing {
        singlePageApplication {
            useResources = true
            filesPath = "sample-web-app"
            defaultPage = "main.html"
            ignoreFiles { it.endsWith(".txt") }
        }
    }
}
```

- `useResources`：啟用從資源套件提供應用程式服務。
- `filesPath`：指定應用程式所在的路徑。
- `defaultPage`：指定將 `main.html` 作為預設提供的資源。
- `ignoreFiles`：忽略結尾為 `.txt` 的路徑。

您可以在此處找到完整範例：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/single-page-application)。