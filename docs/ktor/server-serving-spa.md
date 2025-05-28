[//]: # (title: 服务单页面应用程序)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor 提供了服务单页面应用程序的能力，包括 React、Angular、Vue 等。
</link-summary>

Ktor 提供了服务单页面应用程序的能力，包括 React、Angular 或 Vue。

## 添加依赖 {id="add_dependencies"}

要服务单页面应用程序，你只需要 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 依赖。
不需要任何特定的依赖。

## 服务应用程序 {id="configure"}

要服务单页面应用程序，你需要定义内容将从何处提供：本地文件系统或类路径。
你至少需要指定一个包含单页面应用程序的文件夹或资源包。

### 服务特定框架的应用程序 {id="serve-framework"}

你可以服务使用特定框架（例如 React、Angular、Vue 等）创建的单页面应用程序构建版本。
假设我们的项目根目录中有一个包含 React 应用程序的 `react-app` 文件夹。
该应用程序具有以下结构，并且 `index.html` 文件是其主页：

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

要服务此应用程序，请在 [routing](server-routing.md) 块内调用 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)，并将文件夹名称传递给 `react` 函数：

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

Ktor 会自动查找 `index.html`。
要了解如何自定义默认页面，请参阅 [](#serve-customize)。

> 对于其他框架，请使用相应的函数，例如 `angular`、`vue`、`ember` 等。

### 自定义服务设置 {id="serve-customize"}

为了演示如何从资源服务单页面应用程序，我们假设应用程序位于 `sample-web-app` 资源包中，该包具有以下结构：

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

要服务此应用程序，请使用以下配置：

```kotlin
```
{src="snippets/single-page-application/src/main/kotlin/com/example/Application.kt" include-lines="3-13,15-17"}

- `useResources`：启用从资源包服务应用程序。
- `filesPath`：指定应用程序所在的路径。
- `defaultPage`：指定 `main.html` 作为默认服务资源。
- `ignoreFiles`：忽略以 `.txt` 结尾的路径。

你可以在此处找到完整的示例：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)。