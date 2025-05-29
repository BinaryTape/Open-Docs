[//]: # (title: 브라우저 및 DOM API)

Kotlin/JS 표준 라이브러리는 `kotlinx.browser` 패키지를 사용하여 브라우저별 기능에 접근할 수 있도록 해줍니다. 이 패키지에는 `document` 및 `window`와 같은 일반적인 최상위 객체가 포함되어 있습니다. 표준 라이브러리는 가능한 경우 이 객체들이 노출하는 기능에 대한 타입 안정성 래퍼를 제공합니다. 대안으로, Kotlin 타입 시스템에 잘 매핑되지 않는 함수와의 상호작용을 제공하기 위해 `dynamic` 타입이 사용됩니다.

## DOM과의 상호작용

Document Object Model (DOM)과의 상호작용을 위해 `document` 변수를 사용할 수 있습니다. 예를 들어, 이 객체를 통해 웹사이트의 배경색을 설정할 수 있습니다:

```kotlin
document.bgColor = "FFAA12" 
```

`document` 객체는 또한 ID, 이름, 클래스 이름, 태그 이름 등으로 특정 요소를 검색하는 방법을 제공합니다. 반환되는 모든 요소는 `Element?` 타입입니다. 이들의 속성에 접근하려면 적절한 타입으로 캐스팅해야 합니다. 예를 들어, 이메일 `<input>` 필드를 포함하는 HTML 페이지가 있다고 가정해 봅시다:

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

스크립트가 `<body>` 태그 하단에 포함되어 있음에 유의하십시오. 이는 스크립트가 로드되기 전에 DOM이 완전히 준비되도록 보장합니다.

이러한 설정을 통해 DOM의 요소에 접근할 수 있습니다. `input` 필드의 속성에 접근하려면 `getElementById`를 호출하고 `HTMLInputElement`로 캐스팅합니다. 그런 다음 `value`와 같은 속성에 안전하게 접근할 수 있습니다:

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

이 `input` 요소를 참조하는 것과 마찬가지로, 페이지의 다른 요소에도 접근하여 적절한 타입으로 캐스팅할 수 있습니다.

DOM에서 요소를 간결하게 생성하고 구성하는 방법을 확인하려면 [타입 안정성 HTML DSL](typesafe-html-dsl.md)을 참조하십시오.