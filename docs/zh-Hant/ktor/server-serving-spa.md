[//]: # (title: 服務單頁應用程式)

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
Ktor 提供服務單頁應用程式的能力，包括 React、Angular、Vue 等。
</link-summary>

Ktor 提供服務單頁應用程式的能力，包括 React、Angular 或 Vue。

## 新增依賴項 {id="add_dependencies"}

為了服務單頁應用程式，您只需要 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 依賴項。
不需要任何特定的依賴項。

## 服務應用程式 {id="configure"}

要服務單頁應用程式，您需要定義內容的服務來源：本地檔案系統或 classpath。
您至少需要指定一個包含單頁應用程式的資料夾/資源包。

### 服務框架專屬應用程式 {id="serve-framework"}

您可以服務使用特定框架（例如 React、Angular、Vue 等）建立的單頁應用程式建構版本。
假設我們在專案根目錄中有一個包含 React 應用程式的 `react-app` 資料夾。
該應用程式具有以下結構，並以 `index.html` 檔案作為主頁：

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

要服務此應用程式，請在 [routing](server-routing.md) 區塊內呼叫 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)，
並將資料夾名稱傳遞給 `react` 函數：

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
要了解如何自訂預設頁面，請參閱 [](#serve-customize)。

> 對於其他框架，請使用對應的函數，例如 `angular`、`vue`、`ember` 等。

### 自訂服務設定 {id="serve-customize"}

為了展示如何從資源服務單頁應用程式，假設我們的應用程式位於 `sample-web-app` 資源包中，其結構如下：

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

要服務此應用程式，使用以下配置：

- `useResources`：啟用從資源包服務應用程式。
- `filesPath`：指定應用程式所在的檔案路徑。
- `defaultPage`：指定 `main.html` 為預設要服務的資源。
- `ignoreFiles`：忽略結尾包含 `.txt` 的路徑。

您可以在此處找到完整的範例：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)。