[//]: # (title: 브라우저 및 DOM API)

[`kotlinx-browser`](https://github.com/Kotlin/kotlinx-browser) 라이브러리를 사용하면 브라우저 고유의 기능에 접근할 수 있습니다.
이 라이브러리는 `document` 및 `window`와 같은 일반적인 최상위 객체를 포함하며, 가능한 경우 이들이 제공하는 기능에 대해 타입 안전(typesafe) 래퍼를 제공합니다.

대체 수단으로, Kotlin 타입 시스템에 잘 매핑되지 않는 함수와의 상호작용을 제공하기 위해 `dynamic` 타입이 사용됩니다.

브라우저 및 DOM API를 사용하려면 프로젝트의 `build.gradle(.kts)` 파일에 `kotlinx-browser` 라이브러리를 의존성으로 추가하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}

kotlin {
    js {
        browser()
    }

    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-browser:%kotlinxBrowserVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## DOM과의 상호작용 {id="interaction-with-the-dom"}

문서 객체 모델(DOM)과 상호작용하려면 `document` 변수를 사용할 수 있습니다. 예를 들어, 이 객체를 통해 웹사이트의 배경색을 설정할 수 있습니다.

```kotlin
document.bgColor = "FFAA12" 
```

`document` 객체는 ID, 이름, 클래스 이름, 태그 이름 등으로 특정 요소를 검색하는 방법도 제공합니다.
반환되는 모든 요소는 `Element?` 타입입니다. 이들의 속성에 접근하려면 적절한 타입으로 캐스팅해야 합니다.
예를 들어, 이메일 `<input>` 필드가 있는 HTML 페이지가 있다고 가정해 보겠습니다.

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

스크립트가 `body` 태그의 하단에 포함되어 있음에 유의하세요. 이는 스크립트가 로드되기 전에 DOM을 완전히 사용할 수 있도록 보장합니다.

이러한 설정을 통해 DOM 요소에 접근할 수 있습니다. `input` 필드의 속성에 접근하려면 `getElementById`를 호출하고 `HTMLInputElement`로 캐스팅하세요. 그러면 `value`와 같은 속성에 안전하게 접근할 수 있습니다.

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

이 `input` 요소를 참조하는 것과 마찬가지로, 페이지의 다른 요소에 접근하여 적절한 타입으로 캐스팅할 수 있습니다.

## 다음 단계는 무엇인가요? {id="what-s-next"}

DOM 요소를 간결하게 생성하고 구조화하는 방법을 알아보려면 [타입 안전 HTML DSL](typesafe-html-dsl.md)을 확인해 보세요.