[//]: # (title: 提供單頁應用程式)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Ktor 提供了供應單頁應用程式（包括 React、Angular、Vue 等）的能力。
</link-summary>

Ktor 提供了供應單頁應用程式的能力，包括 React、Angular 或 Vue。

## 新增依賴項目 {id="add_dependencies"}

若要供應單頁應用程式，您只需要 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 依賴項目。
不需要任何特定的依賴項目。

## 供應應用程式 {id="configure"}

若要供應單頁應用程式，您需要定義內容的來源：本地檔案系統或類別路徑。
您至少需要指定包含單頁應用程式的資料夾/資源套件。

### 供應框架專屬應用程式 {id="serve-framework"}

您可以供應使用特定框架（例如 React、Angular、Vue 等）建立的單頁應用程式建置版本。
假設我們在專案根目錄中有一個名為 `react-app` 的資料夾，其中包含一個 React 應用程式。
該應用程式具有以下結構，並以 `index.html` 檔案作為主要頁面：

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

若要供應此應用程式，請在 [routing](server-routing.md) 區塊內呼叫 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)
並將資料夾名稱傳遞給 `react` 函式：

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

Ktor 會自動查找 `index.html`。
若要了解如何自訂預設頁面，請參閱 [自訂供應設定](#serve-customize)。

> 對於其他框架，請使用對應的函式，例如 `angular`、`vue`、`ember` 等。

### 自訂供應設定 {id="serve-customize"}

為了示範如何從資源供應單頁應用程式，讓我們假設我們的應用程式位於 `sample-web-app` 資源套件中，該套件具有以下結構：

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

若要供應此應用程式，使用以下設定：

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

- `useResources`：啟用從資源套件供應應用程式。
- `filesPath`：指定應用程式所在的路徑。
- `defaultPage`：指定 `main.html` 作為預設供應資源。
- `ignoreFiles`：忽略結尾包含 `.txt` 的路徑。

您可以在此處找到完整範例：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)。