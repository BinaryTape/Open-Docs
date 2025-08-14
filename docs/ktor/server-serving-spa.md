[//]: # (title: 服务单页应用)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
Ktor 提供了服务单页应用的能力，包括 React、Angular、Vue 等。
</link-summary>

Ktor 提供了服务单页应用的能力，包括 React、Angular 或 Vue。

## 添加依赖项 {id="add_dependencies"}

要服务单页应用，你只需要 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 依赖项。不需要任何特定的依赖项。

## 服务应用程序 {id="configure"}

要服务单页应用，你需要定义内容的提供来源：本地文件系统或类路径。你至少需要指定一个包含单页应用的文件夹/资源包。

### 服务框架特有的应用程序 {id="serve-framework"}

你可以服务使用特定框架（例如 React、Angular、Vue 等）创建的单页应用构建版本。假设我们的项目根目录中有一个名为 `react-app` 的文件夹，其中包含一个 React 应用程序。该应用程序具有以下结构，并以 `index.html` 文件作为主页：

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

要服务此应用程序，请在 [routing](server-routing.md) 代码块内调用 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)，并将文件夹名称传递给 `react` 函数：

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

Ktor 会自动查找 `index.html`。要了解如何自定义默认页面，请参见 [](#serve-customize)。

> 对于其他框架，请使用相应的函数，例如 `angular`、`vue`、`ember` 等。

### 自定义服务设置 {id="serve-customize"}

为了演示如何从资源中服务单页应用，假设我们的应用程序位于 `sample-web-app` 资源包内，其结构如下：

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

要服务此应用程序，使用以下配置：

[object Promise]

- `useResources`: 启用从资源包服务应用程序。
- `filesPath`: 指定应用程序所在的路径。
- `defaultPage`: 指定 `main.html` 作为默认要服务的资源。
- `ignoreFiles`: 忽略以 `.txt` 结尾的路径。

你可以在这里找到完整示例：[single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application)。