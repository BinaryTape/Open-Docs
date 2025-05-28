[//]: # (title: 단일 페이지 애플리케이션 제공)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="single-page-application"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Ktor는 React, Angular, Vue 등을 포함한 단일 페이지 애플리케이션을 제공하는 기능을 제공합니다.
</link-summary>

Ktor는 React, Angular 또는 Vue를 포함한 단일 페이지 애플리케이션을 제공하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

단일 페이지 애플리케이션을 제공하려면 [ktor-server-core](server-dependencies.topic#add-ktor-dependencies) 의존성만 있으면 됩니다.
특정 의존성은 필요하지 않습니다.

## 애플리케이션 제공 {id="configure"}

단일 페이지 애플리케이션을 제공하려면 콘텐츠를 어디에서 제공할지(로컬 파일 시스템 또는 클래스패스) 정의해야 합니다.
최소한 단일 페이지 애플리케이션이 포함된 폴더/리소스 패키지를 지정해야 합니다.

### 프레임워크별 애플리케이션 제공 {id="serve-framework"}

React, Angular, Vue 등과 같은 특정 프레임워크를 사용하여 생성된 단일 페이지 애플리케이션 빌드를 제공할 수 있습니다.
프로젝트 루트에 React 애플리케이션을 포함하는 `react-app` 폴더가 있다고 가정해 봅시다.
애플리케이션은 다음 구조를 가지며 `index.html` 파일을 기본 페이지로 사용합니다:

```text
react-app
├── index.html
├── ...
└── static
    └── ...
```

이 애플리케이션을 제공하려면 [routing](server-routing.md) 블록 내에서 [singlePageApplication](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/single-page-application.html)을 호출하고 `react` 함수에 폴더 이름을 전달합니다:

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

Ktor는 `index.html`을 자동으로 찾습니다.
기본 페이지를 사용자 지정하는 방법을 알아보려면 [](#serve-customize)를 참조하세요.

> 다른 프레임워크의 경우 `angular`, `vue`, `ember` 등과 같은 해당 함수를 사용하세요.

### 제공 설정 사용자 지정 {id="serve-customize"}

리소스에서 단일 페이지 애플리케이션을 제공하는 방법을 시연하기 위해, 우리 애플리케이션이 다음 구조를 가지는 `sample-web-app` 리소스 패키지 내에 있다고 가정해 봅시다:

```text
sample-web-app
├── main.html
├── ktor_logo.png
├── css
│   └──styles.css
└── js
    └── script.js
```

이 애플리케이션을 제공하려면 다음 구성이 사용됩니다:

```kotlin
```
{src="snippets/single-page-application/src/main/kotlin/com/example/Application.kt" include-lines="3-13,15-17"}

- `useResources`: 리소스 패키지에서 애플리케이션을 제공할 수 있도록 합니다.
- `filesPath`: 애플리케이션이 위치한 경로를 지정합니다.
- `defaultPage`: `main.html`을 기본 제공 리소스로 지정합니다.
- `ignoreFiles`: 끝에 `.txt`가 포함된 경로를 무시합니다.

전체 예제는 다음에서 찾을 수 있습니다: [single-page-application](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/single-page-application).