---
title: "React 및 Kotlin/JS로 웹 애플리케이션 빌드 — 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>

이 튜토리얼에서는 Kotlin/JS와 [React](https://reactjs.org/) 프레임워크를 사용하여 브라우저 애플리케이션을 구축하는 방법을 알려드립니다.
다음을 수행합니다.

* 일반적인 React 애플리케이션 구축과 관련된 일반적인 작업을 완료합니다.
* [Kotlin DSL](type-safe-builders)을 사용하여 가독성을 저해하지 않으면서 개념을 간결하고 통일되게 표현하는 방법을 살펴보고, Kotlin으로 완전한 기능을 갖춘 애플리케이션을 작성할 수 있습니다.
* 즉시 사용 가능한 npm 컴포넌트를 사용하고, 외부 라이브러리를 사용하고, 최종 애플리케이션을 게시하는 방법을 알아봅니다.

결과는 컨퍼런스 강연 링크와 함께 [KotlinConf](https://kotlinconf.com/) 이벤트를 위한 _KotlinConf Explorer_ 웹 앱이 됩니다. 사용자는 한 페이지에서 모든 강연을 시청하고 시청 여부를 표시할 수 있습니다.

이 튜토리얼에서는 Kotlin에 대한 사전 지식과 HTML 및 CSS에 대한 기본 지식이 있다고 가정합니다. React의 기본 개념을 이해하면 일부 샘플 코드를 이해하는 데 도움이 될 수 있지만 필수는 아닙니다.

:::note
최종 애플리케이션은 [여기](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)에서 구할 수 있습니다.

:::

## 시작하기 전에

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)를 다운로드하여 설치합니다.
2. [프로젝트 템플릿](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)을 복제하고 IntelliJ IDEA에서 엽니다. 이 템플릿에는 필요한 모든 구성 및 종속성이 포함된 기본 Kotlin Multiplatform Gradle 프로젝트가 포함되어 있습니다.

   * `build.gradle.kts` 파일의 종속성 및 작업:
   
   ```kotlin
   dependencies {
       // React, React DOM + Wrappers
       implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.430"))
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
       implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")
   
       // Kotlin React Emotion (CSS)
       implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
   
       // Video Player
       implementation(npm("react-player", "2.12.0"))
   
       // Share Buttons
       implementation(npm("react-share", "4.4.1"))
   
       // Coroutines & serialization
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
       implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
   }
   ```

   * 이 튜토리얼에서 사용할 JavaScript 코드를 삽입하기 위한 `src/jsMain/resources/index.html`의 HTML 템플릿 페이지:

   ```html
   <!doctype html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Hello, Kotlin/JS!</title>
   </head>
   <body>
       <div id="root"></div>
       <script src="confexplorer.js"></script>
   </body>
   </html>
   ```
   

   Kotlin/JS 프로젝트는 빌드할 때 모든 코드와 해당 종속성을 프로젝트와 동일한 이름인 단일 JavaScript 파일 `confexplorer.js`로 자동 번들링합니다. 일반적인 [JavaScript 규칙](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)에 따라 브라우저가 스크립트 전에 모든 페이지 요소를 로드하도록 본문 내용( `root` div 포함)이 먼저 로드됩니다.

* `src/jsMain/kotlin/Main.kt`의 코드 스니펫:

   ```kotlin
   import kotlinx.browser.document
   
   fun main() {
       document.bgColor = "red"
   }
   ```

### 개발 서버 실행

기본적으로 Kotlin Multiplatform Gradle 플러그인에는 포함된 `webpack-dev-server`에 대한 지원이 함께 제공되어 서버를 수동으로 설정하지 않고도 IDE에서 애플리케이션을 실행할 수 있습니다.

프로그램이 브라우저에서 성공적으로 실행되는지 테스트하려면 IntelliJ IDEA 내의 Gradle 도구 창에서 `run` 또는 `browserDevelopmentRun` 작업( `other` 또는 `kotlin browser` 디렉터리에서 사용 가능)을 호출하여 개발 서버를 시작합니다.

<img src="/img/browser-development-run.png" alt="Gradle tasks list" width="700" style={{verticalAlign: 'middle'}}/>

터미널에서 프로그램을 실행하려면 대신 `./gradlew run`을 사용하십시오.

프로젝트가 컴파일되고 번들링되면 빈 빨간색 페이지가 브라우저 창에 나타납니다.

<img src="/img/red-page.png" alt="Blank red page" width="700" style={{verticalAlign: 'middle'}}/>

### 핫 리로드 / 연속 모드 활성화

변경할 때마다 프로젝트를 수동으로 컴파일하고 실행할 필요가 없도록 _[연속 컴파일](dev-server-continuous-compilation)_ 모드를 구성합니다. 진행하기 전에 실행 중인 모든 개발 서버 인스턴스를 중지하십시오.

1. Gradle `run` 작업을 처음 실행한 후 IntelliJ IDEA가 자동으로 생성하는 실행 구성을 편집합니다.

   <img src="/img/edit-configurations-continuous.png" alt="Edit a run configuration" width="700" style={{verticalAlign: 'middle'}}/>

2. **실행/디버그 구성** 대화 상자에서 실행 구성에 대한 인수에 `--continuous` 옵션을 추가합니다.

   <img src="/img/continuous-mode.png" alt="Enable continuous mode" width="700" style={{verticalAlign: 'middle'}}/>

   변경 사항을 적용한 후 IntelliJ IDEA 내에서 **실행** 버튼을 사용하여 개발 서버를 다시 시작할 수 있습니다. 터미널에서 연속 Gradle 빌드를 실행하려면 대신 `./gradlew run --continuous`를 사용하십시오.

3. 이 기능을 테스트하려면 Gradle 작업이 실행되는 동안 `Main.kt` 파일에서 페이지 색상을 파란색으로 변경합니다.

   ```kotlin
   document.bgColor = "blue"
   ```

   그러면 프로젝트가 다시 컴파일되고 다시 로드한 후 브라우저 페이지가 새 색상이 됩니다.

개발 프로세스 중에 개발 서버를 연속 모드로 실행할 수 있습니다. 변경 사항을 적용하면 자동으로 페이지를 다시 빌드하고 다시 로드합니다.

:::note
프로젝트의 이 상태는 `master` 브랜치 [여기](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)에서 찾을 수 있습니다.

:::

## 웹 앱 초안 만들기

### React로 첫 번째 정적 페이지 추가

앱이 간단한 메시지를 표시하도록 하려면 `Main.kt` 파일의 코드를 다음으로 바꿉니다.

```kotlin
import kotlinx.browser.document
import react.*
import emotion.react.css
import csstype.Position
import csstype.px
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img
import react.dom.client.createRoot
import kotlinx.serialization.Serializable

fun main() {
    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    createRoot(container).render(Fragment.create {
        h1 {
            +"Hello, React+Kotlin/JS!"
        }
    })
}
```

* `render()` 함수는 [kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom)에 [프래그먼트](https://reactjs.org/docs/fragments.html) 내의 첫 번째 HTML 요소를 `root` 요소로 렌더링하도록 지시합니다. 이 요소는 템플릿에 포함된 `src/jsMain/resources/index.html`에 정의된 컨테이너입니다.
* 내용은 `<h1>` 헤더이며 타입 세이프 DSL을 사용하여 HTML을 렌더링합니다.
* `h1`은 람다 매개변수를 사용하는 함수입니다. 문자열 리터럴 앞에 `+` 기호를 추가하면 실제로 [연산자 오버로딩](operator-overloading)을 사용하여 `unaryPlus()` 함수가 호출됩니다. 묶인 HTML 요소에 문자열을 추가합니다.

프로젝트가 다시 컴파일되면 브라우저에 이 HTML 페이지가 표시됩니다.

<img src="/img/hello-react-js.png" alt="An HTML page example" width="700" style={{verticalAlign: 'middle'}}/>

### HTML을 Kotlin의 타입 세이프 HTML DSL로 변환

React용 Kotlin [래퍼](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README)에는 순수 Kotlin 코드로 HTML을 작성할 수 있도록 하는 [도메인 특정 언어(DSL)](type-safe-builders)이 함께 제공됩니다. 이러한 방식으로 JavaScript의 [JSX](https://reactjs.org/docs/introducing-jsx.html)와 유사합니다. 그러나 이 마크업은 Kotlin이므로 자동 완성 또는 유형 검사와 같은 정적으로 입력된 언어의 모든 이점을 얻을 수 있습니다.

미래의 웹 앱에 대한 클래식 HTML 코드와 Kotlin의 타입 세이프 변형을 비교하십시오.

<Tabs>
<TabItem value="HTML" label="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
<h3>Videos to watch</h3>
<p>
   John Doe: Building and breaking things
</p>
<p>
   Jane Smith: The development process
</p>
<p>
   Matt Miller: The Web 7.0
</p>
<h3>Videos watched</h3>
<p>
   Tom Jerry: Mouseless development
</p>
</div>
<div>
<h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"/>
</div>
```

</TabItem>
<TabItem value="Kotlin" label="Kotlin">

```kotlin
h1 {
    +"KotlinConf Explorer"
}
div {
    h3 {
        +"Videos to watch"
    }
    p {
        + "John Doe: Building and breaking things"
    }
    p {
        +"Jane Smith: The development process"
    }
    p {
        +"Matt Miller: The Web 7.0"
    }
    h3 {
        +"Videos watched"
    }
    p {
        +"Tom Jerry: Mouseless development"
    }
}
div {
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
       src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
    }
}
```

</TabItem>
</Tabs>

Kotlin 코드를 복사하고 `main()` 함수 내에서 `Fragment.create()` 함수 호출을 업데이트하여 이전 `h1` 태그를 바꿉니다.

브라우저가 다시 로드될 때까지 기다립니다. 페이지는 다음과 같이 표시되어야 합니다.

<img src="/img/website-draft.png" alt="The web app draft" width="700" style={{verticalAlign: 'middle'}}/>

### 마크업에서 Kotlin 구문을 사용하여 비디오 추가

이 DSL을 사용하여 Kotlin에서 HTML을 작성하는 데에는 몇 가지 장점이 있습니다. 루프, 조건, 컬렉션 및 문자열 보간과 같은 일반적인 Kotlin 구문을 사용하여 앱을 조작할 수 있습니다.

이제 하드 코딩된 비디오 목록을 Kotlin 객체 목록으로 바꿀 수 있습니다.

1. `Main.kt`에서 모든 비디오 속성을 한 곳에 보관하기 위해 `Video` [데이터 클래스](data-classes)를 만듭니다.

   ```kotlin
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

2. 시청하지 않은 비디오와 시청한 비디오에 대해 각각 두 개의 목록을 채웁니다. `Main.kt`에서 파일 수준으로 이러한 선언을 추가합니다.

   ```kotlin
   val unwatchedVideos = listOf(
       Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
       Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
       Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
   )
   
   val watchedVideos = listOf(
       Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
   )
   ```

3. 페이지에서 이러한 비디오를 사용하려면 Kotlin `for` 루프를 작성하여 시청하지 않은 `Video` 객체 컬렉션을 반복합니다. "Videos to watch" 아래의 세 개의 `p` 태그를 다음 스니펫으로 바꿉니다.

   ```kotlin
   for (video in unwatchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```
   
4. 동일한 프로세스를 적용하여 "Videos watched" 다음의 단일 태그에 대한 코드도 수정합니다.

   ```kotlin
   for (video in watchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```

브라우저가 다시 로드될 때까지 기다립니다. 레이아웃은 이전과 동일하게 유지되어야 합니다. 루프가 작동하는지 확인하기 위해 목록에 더 많은 비디오를 추가할 수 있습니다.

### 타입 세이프 CSS로 스타일 추가

[Emotion](https://emotion.sh/docs/introduction) 라이브러리용 [kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) 래퍼를 사용하면 JavaScript로 HTML과 함께 CSS 속성(동적 속성 포함)을 지정할 수 있습니다. 개념적으로 [CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js)와 유사하지만 Kotlin의 경우입니다. DSL을 사용하면 Kotlin 코드 구문을 사용하여 서식 규칙을 표현할 수 있다는 장점이 있습니다.

이 튜토리얼의 템플릿 프로젝트에는 `kotlin-emotion`을 사용하는 데 필요한 종속성이 이미 포함되어 있습니다.

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

`kotlin-emotion`을 사용하면 스타일을 정의할 수 있는 HTML 요소 `div` 및 `h3` 내부에 `css` 블록을 지정할 수 있습니다.

비디오 플레이어를 페이지의 오른쪽 상단 모서리로 이동하려면 CSS를 사용하고 비디오 플레이어(스니펫의 마지막 `div`)에 대한 코드를 조정합니다.

```kotlin
div {
    css {
        position = Position.absolute
        top = 10.px
        right = 10.px
    }
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
    }
}
```

다른 스타일을 자유롭게 실험해 보십시오. 예를 들어 `fontFamily`를 변경하거나 UI에 `color`를 추가할 수 있습니다.

## 앱 컴포넌트 디자인

React의 기본 구성 요소를 _[컴포넌트](https://reactjs.org/docs/components-and-props.html)_라고 합니다. 컴포넌트 자체도 더 작은 컴포넌트로 구성될 수 있습니다. 컴포넌트를 결합하여 애플리케이션을 빌드합니다. 컴포넌트가 일반적이고 재사용 가능하도록 구조화하면 코드 또는 논리를 복제하지 않고도 앱의 여러 부분에서 사용할 수 있습니다.

`render()` 함수의 내용은 일반적으로 기본 컴포넌트를 설명합니다. 애플리케이션의 현재 레이아웃은 다음과 같습니다.

<img src="/img/current-layout.png" alt="Current layout" width="700" style={{verticalAlign: 'middle'}}/>

애플리케이션을 개별 컴포넌트로 분해하면 각 컴포넌트가 책임을 처리하는 보다 구조화된 레이아웃으로 끝납니다.

<img src="/img/structured-layout.png" alt="Structured layout with components" width="700" style={{verticalAlign: 'middle'}}/>

컴포넌트는 특정 기능을 캡슐화합니다. 컴포넌트를 사용하면 소스 코드가 짧아지고 읽고 이해하기 쉬워집니다.

### 기본 컴포넌트 추가

애플리케이션 구조를 만들기 시작하려면 먼저 `root` 요소로 렌더링하기 위한 기본 컴포넌트인 `App`을 명시적으로 지정합니다.

1. `src/jsMain/kotlin` 폴더에 새 `App.kt` 파일을 만듭니다.
2. 이 파일 내부에 다음 스니펫을 추가하고 `Main.kt`에서 타입 세이프 HTML을 스니펫으로 이동합니다.

   ```kotlin
   import kotlinx.coroutines.async
   import react.*
   import react.dom.*
   import kotlinx.browser.window
   import kotlinx.coroutines.*
   import kotlinx.serialization.decodeFromString
   import kotlinx.serialization.json.Json
   import emotion.react.css
   import csstype.Position
   import csstype.px
   import react.dom.html.ReactHTML.h1
   import react.dom.html.ReactHTML.h3
   import react.dom.html.ReactHTML.div
   import react.dom.html.ReactHTML.p
   import react.dom.html.ReactHTML.img
   
   val App = FC<Props> {
       // typesafe HTML goes here, starting with the first h1 tag!
   }
   ```
   
   `FC` 함수는 [함수 컴포넌트](https://reactjs.org/docs/components-and-props.html#function-and-class-components)를 만듭니다.

3. `Main.kt` 파일에서 `main()` 함수를 다음과 같이 업데이트합니다.

   ```kotlin
   fun main() {
       val container = document.getElementById("root") ?: error("Couldn't find root container!")
       createRoot(container).render(App.create())
   }
   ```

   이제 프로그램은 `App` 컴포넌트의 인스턴스를 만들고 지정된 컨테이너로 렌더링합니다.

React 개념에 대한 자세한 내용은 [설명서 및 가이드](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)를 참조하십시오.

### 목록 컴포넌트 추출

`watchedVideos` 및 `unwatchedVideos` 목록에는 각각 비디오 목록이 포함되어 있으므로 단일 재사용 가능한 컴포넌트를 만들고 목록에 표시된 콘텐츠만 조정하는 것이 좋습니다.

`VideoList` 컴포넌트는 `App` 컴포넌트와 동일한 패턴을 따릅니다. `FC` 빌더 함수를 사용하고 `unwatchedVideos` 목록의 코드를 포함합니다.

1. `src/jsMain/kotlin` 폴더에 새 `VideoList.kt` 파일을 만들고 다음 코드를 추가합니다.

   ```kotlin
   import kotlinx.browser.window
   import react.*
   import react.dom.*
   import react.dom.html.ReactHTML.p
   
   val VideoList = FC<Props> {
       for (video in unwatchedVideos) {
           p {
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

2. `App.kt`에서 매개변수 없이 호출하여 `VideoList` 컴포넌트를 사용합니다.

   ```kotlin
   // . . .

   div {
       h3 {
           +"Videos to watch"
       }
       VideoList()
   
       h3 {
           +"Videos watched"
       }
       VideoList()
   }

   // . . .
   ```

   현재 `App` 컴포넌트는 `VideoList` 컴포넌트가 표시하는 콘텐츠를 제어할 수 없습니다. 하드 코딩되어 있으므로 동일한 목록이 두 번 표시됩니다.

### 컴포넌트 간에 데이터를 전달하기 위해 props 추가

`VideoList` 컴포넌트를 재사용할 것이므로 다른 콘텐츠로 채울 수 있어야 합니다. 항목 목록을 컴포넌트에 속성으로 전달하는 기능을 추가할 수 있습니다. React에서 이러한 속성을 _props_라고 합니다. React에서 컴포넌트의 props가 변경되면 프레임워크는 자동으로 컴포넌트를 다시 렌더링합니다.

`VideoList`의 경우 표시할 비디오 목록이 포함된 prop이 필요합니다. `VideoList` 컴포넌트에 전달할 수 있는 모든 props를 보유하는 인터페이스를 정의합니다.

1. `VideoList.kt` 파일에 다음 정의를 추가합니다.

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
   }
   ```
   [외부](js-interop#external-modifier) 수정자는 인터페이스의 구현이 외부에서 제공되므로 선언에서 JavaScript 코드를 생성하려고 하지 않음을 컴파일러에 알립니다.

2. `VideoList`의 클래스 정의를 조정하여 `FC` 블록으로 전달되는 props를 매개변수로 사용합니다.

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
       for (video in props.videos) {
           p {
               key = video.id.toString()
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

   `key` 속성은 React 렌더러가 `props.videos`의 값이 변경될 때 수행할 작업을 파악하는 데 도움이 됩니다. 키를 사용하여 새로 고쳐야 하는 목록의 부분과 동일하게 유지되는 부분을 결정합니다. [React 가이드](https://reactjs.org/docs/lists-and-keys.html)에서 목록 및 키에 대한 자세한 정보를 찾을 수 있습니다.

3. `App` 컴포넌트에서 하위 컴포넌트가 적절한 속성으로 인스턴스화되었는지 확인합니다. `App.kt`에서 `h3` 요소 아래의 두 루프를 `unwatchedVideos` 및 `watchedVideos`에 대한 속성과 함께 `VideoList` 호출로 바꿉니다. Kotlin DSL에서는 `VideoList` 컴포넌트에 속하는 블록 내부에 할당합니다.

   ```kotlin
   h3 {
       +"Videos to watch"
   }
   VideoList {
       videos = unwatchedVideos
   }
   h3 {
       +"Videos watched"
   }
   VideoList {
       videos = watchedVideos
   }
   ```

다시 로드 후 브라우저에 목록이 이제 올바르게 렌더링되는 것으로 표시됩니다.

### 목록을 대화형으로 만들기

먼저 사용자가 목록 항목을 클릭할 때 나타나는 경고 메시지를 추가합니다. `VideoList.kt`에서 현재 비디오로 경고를 트리거하는 `onClick` 핸들러 함수를 추가합니다.

```kotlin
// . . .

p {
    key = video.id.toString()
    onClick = {
        window.alert("Clicked $video!")
    }
    +"${video.speaker}: ${video.title}"
}

// . . .
```

브라우저 창에서 목록 항목 중 하나를 클릭하면 다음과 같은 경고 창에 비디오에 대한 정보가 표시됩니다.

<img src="/img/alert-window.png" alt="Browser alert window" width="700" style={{verticalAlign: 'middle'}}/>
:::note
람다로 `onClick` 함수를 직접 정의하는 것은 간결하고 프로토타입 제작에 매우 유용합니다. 그러나 Kotlin/JS에서 평등이 [현재 작동하는 방식](https://youtrack.jetbrains.com/issue/KT-15101) 때문에 성능면에서 클릭 핸들러를 전달하는 가장 최적화된 방법은 아닙니다. 렌더링 성능을 최적화하려면 변수에 함수를 저장하고 전달하는 것을 고려하십시오.

### 값을 유지하기 위해 상태 추가

사용자에게 경고하는 대신 선택한 비디오를 ▶ 삼각형으로 강조 표시하는 기능을 추가할 수 있습니다. 그렇게 하려면 이 컴포넌트에 특정 _상태_를 도입합니다.

상태는 React의 핵심 개념 중 하나입니다. 최신 React(소위 _Hooks API_를 사용하는 React)에서 상태는 [`useState` 훅](https://reactjs.org/docs/hooks-state.html)을 사용하여 표현됩니다.

1. `VideoList` 선언 맨 위에 다음 코드를 추가합니다.

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
       var selectedVideo: Video? by useState(null)

   // . . .
   ```
   

   * `VideoList` 함수형 컴포넌트는 상태(현재 함수 호출과 독립적인 값)를 유지합니다. 상태는 nullable이고 `Video?` 유형입니다. 기본값은 `null`입니다.
   * React의 `useState()` 함수는 프레임워크에 함수의 여러 호출에서 상태를 추적하도록 지시합니다. 예를 들어 기본값을 지정하더라도 React는 기본값이 처음에만 할당되도록 합니다. 상태가 변경되면 컴포넌트는 새 상태를 기반으로 다시 렌더링됩니다.
   * `by` 키워드는 `useState()`가 [위임된 속성](delegated-properties)으로 작동함을 나타냅니다. 다른 변수와 마찬가지로 값을 읽고 씁니다. `useState()` 배후의 구현은 상태가 작동하도록 하는 데 필요한 장비를 처리합니다.

   State Hook에 대한 자세한 내용은 [React 설명서](https://reactjs.org/docs/hooks-state.html)를 확인하십시오.

2. `VideoList` 컴포넌트에서 `onClick` 핸들러와 텍스트를 다음과 같이 변경합니다.

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
       var selectedVideo: Video? by useState(null)
       for (video in props.videos) {
           p {
               key = video.id.toString()
               onClick = {
                   selectedVideo = video
               }
               if (video == selectedVideo) {
                   +"▶ "
               }
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

   * 사용자가 비디오를 클릭하면 해당 값이 `selectedVideo` 변수에 할당됩니다.
   * 선택한 목록 항목이 렌더링되면 삼각형이 앞에 추가됩니다.

상태 관리에 대한 자세한 내용은 [React FAQ](https://reactjs.org/docs/faq-state.html)를 참조하십시오.

브라우저를 확인하고 목록에서 항목을 클릭하여 모든 것이 올바르게 작동하는지 확인합니다.

## 컴포넌트 구성

현재 두 개의 비디오 목록은 자체적으로 작동합니다. 즉, 각 목록은 선택한 비디오를 추적합니다. 사용자는 플레이어가 하나만 있더라도 시청하지 않은 목록과 시청한 목록에서 각각 하나씩 두 개의 비디오를 선택할 수 있습니다.

<img src="/img/two-videos-select.png" alt="Two videos are selected in both lists simultaneously" width="700" style={{verticalAlign: 'middle'}}/>

목록은 자체 내부와 형제 목록 내부에서 어떤 비디오가 선택되었는지 추적할 수 없습니다. 그 이유는 선택한 비디오가 _목록_ 상태가 아니라 _애플리케이션_ 상태의 일부이기 때문입니다. 즉, 개별 컴포넌트에서 상태를 _리프트_해야 합니다.

### 상태 리프트

React는 props가 부모 컴포넌트에서 해당 자식으로만 전달될 수 있도록 합니다. 이렇게 하면 컴포넌트가 함께 하드 와이어링되는 것을 방지할 수 있습니다.

컴포넌트가 형제 컴포넌트의 상태를 변경하려는 경우 부모를 통해 그렇게 해야 합니다. 그 시점에서 상태는 더 이상 자식 컴포넌트에 속하지 않고 포괄적인 부모 컴포넌트에 속합니다.

컴포넌트에서 해당 부모로 상태를 마이그레이션하는 프로세스를 _상태 리프트_라고 합니다. 앱의 경우 `currentVideo`를 `App` 컴포넌트에 상태로 추가합니다.

1. `App.kt`에서 `App` 컴포넌트 정의의 맨 위에 다음을 추가합니다.

   ```kotlin
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
   
       // . . .
   }
   ```

   `VideoList` 컴포넌트는 더 이상 상태를 추적할 필요가 없습니다. 대신 현재 비디오를 prop으로 받게 됩니다.

2. `VideoList.kt`에서 `useState()` 호출을 제거합니다.
3. 선택한 비디오를 prop으로 받도록 `VideoList` 컴포넌트를 준비합니다. 이렇게 하려면 `selectedVideo`를 포함하도록 `VideoListProps` 인터페이스를 확장합니다.

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

4. 삼각형의 조건이 `상태` 대신 `props`를 사용하도록 변경합니다.

   ```kotlin
   if (video == props.selectedVideo) {
       +"▶ "
   }
   ```

### 핸들러 전달

현재 props에 값을 할당할 방법이 없으므로 `onClick` 함수는 현재 설정된 방식으로 작동하지 않습니다. 부모 컴포넌트의 상태를 변경하려면 상태를 다시 리프트해야 합니다.

React에서 상태는 항상 부모에서 자식으로 흐릅니다. 따라서 자식 컴포넌트 중 하나에서 _애플리케이션_ 상태를 변경하려면 사용자 상호 작용을 처리하기 위한 논리를 부모 컴포넌트로 이동한 다음 논리를 prop으로 전달해야 합니다. Kotlin에서 변수는 [함수 유형](lambdas#function-types)을 가질 수 있음을 기억하십시오.

1. `VideoListProps` 인터페이스를 다시 확장하여 `Video`를 사용하고 `Unit`를 반환하는 함수인 변수 `onSelectVideo`를 포함하도록 합니다.

   ```kotlin
   external interface VideoListProps : Props {
       // ...
       var onSelectVideo: (Video) `->` Unit
   }
   ```

2. `VideoList` 컴포넌트에서 `onClick` 핸들러에 새 prop을 사용합니다.

   ```kotlin
   onClick = {
       props.onSelectVideo(video)
   }
   ```
   
   이제 `VideoList` 컴포넌트에서 `selectedVideo` 변수를 삭제할 수 있습니다.

3. `App` 컴포넌트로 돌아가서 `selectedVideo`와 `onSelectVideo`에 대한 핸들러를 두 개의 비디오 목록 각각에 전달합니다.

   ```kotlin
   VideoList {
       videos = unwatchedVideos // and watchedVideos respectively
       selectedVideo = currentVideo
       onSelectVideo = { video `->`
           currentVideo = video
       }
   }
   ```

4. 시청한 비디오 목록에 대해 이전 단계를 반복합니다.

브라우저로 다시 전환하고 비디오를 선택할 때 선택이 중복 없이 두 목록 사이를 점프하는지 확인합니다.

## 컴포넌트 추가

### 비디오 플레이어 컴포넌트 추출

이제 자체 포함된 다른 컴포넌트인 비디오 플레이어를 만들 수 있습니다. 현재는 자리 표시자 이미지입니다. 비디오 플레이어는 강연 제목, 강연 작성자 및 비디오 링크를 알아야 합니다. 이 정보는 각 `Video` 객체에 이미 포함되어 있으므로 prop으로 전달하고 해당 속성에 액세스할 수 있습니다.

1. 새 `VideoPlayer.kt` 파일을 만들고 `VideoPlayer` 컴포넌트에 대한 다음 구현을 추가합니다.

   ```kotlin
   import csstype.*
   import react.*
   import emotion.react.css
   import react.dom.html.ReactHTML.button
   import react.dom.html.ReactHTML.div
   import react.dom.html.ReactHTML.h3
   import react.dom.html.ReactHTML.img
   
   external interface VideoPlayerProps : Props {
       var video: Video
   }
   
   val VideoPlayer = FC<VideoPlayerProps> { props `->`
       div {
           css {
               position = Position.absolute
               top = 10.px
               right = 10.px
           }
           h3 {
               +"${props.video.speaker}: ${props.video.title}"
           }
           img {
               src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
           }
       }
   }
   ```

2. `VideoPlayerProps` 인터페이스는 `VideoPlayer` 컴포넌트가 nullable이 아닌 `Video`를 사용하도록 지정하므로 `App` 컴포넌트에서 이 작업을 적절하게 처리해야 합니다.

   `App.kt`에서 비디오 플레이어에 대한 이전 `div` 스니펫을 다음으로 바꿉니다.

   ```kotlin
   currentVideo?.let { curr `->`
       VideoPlayer {
           video = curr
       }
   }
   ```

   [`let` 범위 함수](scope-functions#let)는 `VideoPlayer` 컴포넌트가 `state.currentVideo`가 null이 아닐 때만 추가되도록 합니다.

이제 목록에서 항목을 클릭하면 비디오 플레이어가 나타나고 클릭한 항목의 정보로 채워집니다.

### 버튼 추가 및 연결

사용자가 비디오를 시청했거나 시청하지 않은 것으로 표시하고 두 목록 간에 이동할 수 있도록 하려면 `VideoPlayer` 컴포넌트에 버튼을 추가합니다.

이 버튼은 두 개의 다른 목록 간에 비디오를 이동하므로 상태 변경을 처리하는 논리를 `VideoPlayer`에서 _리프트_하고 부모에서 prop으로 전달해야 합니다. 버튼은 비디오를 시청했는지 여부에 따라 다르게 표시되어야 합니다. 이것은 또한 prop으로 전달해야 하는 정보입니다.

1. `VideoPlayerProps` 인터페이스를 `VideoPlayer.kt`에서 확장하여 이러한 두 가지 경우에 대한 속성을 포함합니다.

   ```kotlin
   external interface VideoPlayerProps : Props {
       var video: Video
       var onWatchedButtonPressed: (Video) `->` Unit
       var unwatchedVideo: Boolean
   }
   ```

2. 이제 버튼을 실제 컴포넌트에 추가할 수 있습니다. 다음 스니펫을 `VideoPlayer` 컴포넌트의 본문에 `h3` 및 `img` 태그 사이에 복사합니다.

   ```kotlin
   button {
       css {
           display